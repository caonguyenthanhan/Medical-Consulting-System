# Báo cáo Kỹ thuật & Đặc tả Hệ thống – Ứng dụng Llama cho Tư vấn Y tế

## Meta
- Đề tài: Ứng dụng mô hình Llama (Large Language Model Meta AI) vào xây dựng hệ thống tư vấn y tế
- Mục tiêu: Xây dựng Chatbot Y tế hỗ trợ người Việt, giảm quá tải nhân lực y tế và hỗ trợ tâm lý
- Sinh viên: Cao Nguyễn Thành An, Cao Thọ Phú Thịnh, Trịnh Ngọc Anh Tuyên
- GVHD: Ts. Phan Thị Huyền Trang
- Kiến trúc: Hybrid GPU-first với fallback CPU (`llama.cpp` GGUF), Frontend Next.js + Tailwind CSS, Backend FastAPI (Python), RAG với ChromaDB
- Mô hình: Llama-3.1-8B-Instruct (tư vấn sâu), Llama-3.2-1B-Instruct (sàng lọc/tâm lý)
- Huấn luyện: Fine-tuning bằng Unsloth tăng tốc 2x, QLoRA 4-bit (r=16, alpha=16), thư viện `transformers`, `peft`, `trl` (SFTTrainer), `bitsandbytes`

---

## PHẦN 1: BÁO CÁO KỸ THUẬT & KIẾN TRÚC HỆ THỐNG

### Data Flow
```
User → Next.js UI → API Gateway (/api/llm-chat) → đọc runtime-mode.json
  → nếu cần RAG: Query → Embed → Index (ChromaDB) → Retrieve → Rerank → Context
  → Model (GPU-first: Llama 8B | fallback CPU: llama.cpp GGUF)
  → Response JSON + metadata { mode, tier, fallback, model_init, rag }
  → UI hiển thị + đồng bộ ComputeToggle
```
- Gateway: `medical-consultation-app/app/api/llm-chat/route.ts:41-68`
- Metadata phản hồi: `medical-consultation-app/app/api/llm-chat/route.ts:187-205`
- Đồng bộ trạng thái UI: `medical-consultation-app/components/compute-toggle.tsx:30-54`
- Backend tra cứu y tế GPU-first + fallback: `server.py:1068-1323`

### GPU-first Fallback Logic
```pseudo
function handle_chat(request):
  target = read('medical-consultation-app/data/runtime-mode.json').target
  try:
    if target == 'gpu':
      resp = call_gpu_chat(request)
      mode = 'gpu'
    else:
      raise PreferCPU()
  except AnyError:
    resp = call_cpu_llama_cpp(request)  # GGUF text inference
    mode = 'cpu'
    log_event('runtime-events.jsonl', { type: 'fallback', to: 'cpu' })
  return { ...resp, metadata: { mode, model_init: resp.model_init, rag: resp.rag } }
```
- Quy định đồng bộ: `systemPatterns.md:267-272`

### RAG Pipeline (ChromaDB)
```pseudo
function rag_answer(question):
  q_embedding = embed(question)                     # sentence-transformers
  candidates = chroma.query(q_embedding, top_k=10)  # chunk 512, overlap 50
  reranked = rerank_gte_multilingual(candidates)    # nếu khả dụng
  context = select_best(reranked, k=3)
  prompt = build_medical_prompt(context, question)
  return llm.generate(prompt), { rag: { used: true, retrieved: len(candidates), selected: len(context) } }
```
- Lý do chọn ChromaDB:
  - Nhẹ, phù hợp RAG nội bộ; tích hợp tốt `llama-index` và `langchain-community`
  - Hỗ trợ metadata/citations giúp giảm ảo giác và gắn nguồn trích dẫn
  - Tối ưu cho pipeline embed → index → retrieve → rerank đơn giản

### Lý do chọn công nghệ
- Unsloth: tăng tốc fine-tuning ~2x, tối ưu memory; phù hợp chạy 8B với tài nguyên hạn chế
- QLoRA 4-bit (r=16, alpha=16): giảm VRAM, giữ chất lượng qua low-rank adapters
- `bitsandbytes`: cung cấp quantization hiệu quả cho inference/training
- `transformers` + `peft` + `trl/SFTTrainer`: hệ sinh thái ổn định, dễ tái lập; SFT phù hợp instruction tuning y tế
- `llama.cpp` GGUF: chạy CPU, bảo đảm offline/fallback và tính khả dụng cao
- Next.js + Tailwind CSS: tốc độ phát triển UI, SSR tốt, tối ưu hiệu suất
- FastAPI: nhẹ, async tốt, dễ tích hợp mô hình và cung cấp API thống nhất

### Prompt Design (System Prompts)

1) Tư vấn Y khoa (flash/pro)
- Mục tiêu: Giải thích dễ hiểu, có trích dẫn nguồn từ RAG khi sẵn có
- Ngôn ngữ: Tiếng Việt chuẩn, thân thiện
- Giới hạn: Không chẩn đoán, không kê đơn; luôn khuyến nghị gặp bác sĩ khi cần
- Cấu trúc:
  - Bối cảnh hệ thống: vai trò trợ lý y tế
  - Hướng dẫn an toàn: disclaimer rõ ràng
  - Định dạng kết quả: mục lục, gạch đầu dòng, bảng nếu cần
  - Trích dẫn: cuối câu hoặc cuối phần, ghi nguồn (Long Châu, BV Tâm Anh)

2) Tra cứu RAG (pro)
- Ưu tiên trả lời dựa trên context RAG, chỉ bổ sung ngôn ngữ nếu thiếu
- Bắt buộc hiển thị trích dẫn nguồn (URL/tên bài)
- Khi không liên quan y tế: trả `redirect_url='/tu-van'` (`server.py:1122-1141`)

3) Sàng lọc Tâm lý (PHQ-9, GAD-7)
- Phản hồi thân thiện, không phán xét
- Nhận diện tín hiệu trầm cảm/lo âu ngầm trong hội thoại
- Hỏi lại theo checklist chuẩn, tính điểm và diễn giải

4) Bạn Tâm Giao (Companion AI)
- Persona: Funny Empathetic Companion – “bạn tâm giao hài hước”
- Nguyên tắc: Anti-advice, lắng nghe và chọc cười, ngôn ngữ Gen Z vừa đủ
- Tuyệt đối không tư vấn y khoa; chỉ hỗ trợ cảm xúc và khích lệ tích cực

---

## PHẦN 2: QUY TRÌNH XỬ LÝ DỮ LIỆU & HUẤN LUYỆN

### Data Strategy
- Knowledge Base (RAG):
  - Nguồn: Long Châu (1.808 bài bệnh, 5.476 bài thuốc), BV Tâm Anh (7.359 bài)
  - Chunking: 512 tokens, overlap 50 tokens
- Instruction Tuning:
  - Dataset: QAdoctor (~37.128 cặp hỏi-đáp), tổng hợp từ ViHealthQA, v.v.
- Synthetic cho Companion:
  - Pipeline Gemini-to-Llama trên 50 kịch bản stress, phong cách sitcom, Gen Z
  - Nguyên tắc Anti-advice: tránh khuyên sáo rỗng, ưu tiên đồng cảm và dí dỏm

### Data Cleaning Pipeline
```pseudo
function clean_corpus(docs):
  docs = normalize_unicode(docs)
  docs = strip_html_and_js(docs)
  docs = remove_duplicates(docs, fingerprint=SimHash)
  docs = filter_language(docs, lang='vi')
  docs = remove_boilerplate(docs, rules=[cookie, ads, footer])
  chunks = chunk(docs, size=512, overlap=50)
  return chunks
```
- Mục tiêu: sạch, nhất quán, giảm nhiễu cho RAG và huấn luyện

### Fine-tuning Pipeline (Unsloth + QLoRA)
```pseudo
load_base_model("Llama-3.1-8B-Instruct")
apply_qlora_config(bits=4, r=16, alpha=16)
prepare_dataset(QAdoctor)
trainer = SFTTrainer(
  model,
  dataset,
  peft=LoRAConfig(...),
  optim=AdamW,
  scheduler=cosine_with_warmup,
  gradient_accumulation=enabled
)
trainer.train()  # tăng tốc với Unsloth
save_adapters()
```
- Hyperparameters:
  - Learning rate, Epochs, Batch size: được điều chỉnh theo tài nguyên và chất lượng hội tụ, áp dụng warmup và scheduler phù hợp
  - Theo dõi loss và early stopping để tránh overfitting

### Đánh giá & Kết quả Thực nghiệm
- So sánh 3 model (1B, 3B, 8B)
- Kết quả:
  - Llama-3.1-8B: BLEU 0.0447, ROUGE-1 0.5033, BERTScore F1 0.7258
  - Llama-3.2-1B: thấp nhất, phù hợp hội thoại xã giao/nhẹ
  - Loss training: giảm từ ~2.6 → ~1.0; 8B hội tụ nhanh nhất

| Model | BLEU | ROUGE-1 | BERTScore F1 | Ghi chú |
|------|------|---------|--------------|---------|
| Llama-3.1-8B-Instruct | 0.0447 | 0.5033 | 0.7258 | Tốt nhất cho tư vấn sâu |
| Llama-3.2-1B-Instruct | — | — | — | Nhanh, nhẹ; đủ cho xã giao |
| Llama-3.x-3B-Instruct | — | — | — | Trung bình; đánh đổi tốc độ/độ chính xác |

---

## PHẦN 3: ĐẶC TẢ TÍNH NĂNG "BẠN TÂM GIAO" (COMPANION AI)

### Persona & Hành vi
- Empathetic + Funny: đồng cảm, hài hước duyên, không mỉa mai
- Ngôn ngữ Gen Z ở mức vừa đủ, tránh phản cảm
- Tránh tư vấn y khoa; tập trung cảm xúc, động viên tinh tế
- Gợi mở: hỏi lại ngắn, giúp người dùng tự giải tỏa

### Gemini-to-Llama Pipeline
```pseudo
function generate_companion_dialogues():
  scripts = load_stress_scenarios(n=50)  # thất tình, deadline, thi cử...
  raw = []
  for s in scripts:
    g = gemini.play("sitcom_writer", scenario=s, style="anti-advice")
    raw.append(g)  # có thể trả về JSON không chuẩn
  fixed = []
  for r in raw:
    j = try_json_parse(r)
    if !j:
      r = sanitize_json(r)           # loại dấu phẩy thừa, escape quote
      j = safe_parse(r, schema=CompanionSchema)
    fixed.append(j)
  return fixed
```
- Vấn đề JSON thường gặp:
  - Dấu phẩy cuối mảng/đối tượng
  - Ký tự xuống dòng không escape trong chuỗi
  - Khóa thiếu hoặc đặt sai kiểu
- Cách fix:
  - Áp schema JSON (bắt buộc các trường `role`, `content`, `tone`)
  - Sanitize bằng quy tắc: bỏ trailing commas, chuẩn hóa dấu nháy, thay kí tự điều khiển
  - Thêm validator kiểm tra độ dài, từ ngữ nhạy cảm

### Sàng lọc Tâm lý qua Hội thoại
```pseudo
function infer_phq_gad(conversation):
  signals = detect_signals(conversation)  # từ khoá: mất ngủ, buồn, lo âu...
  score_phq = map_to_phq9(signals)        # 0-27, chuẩn câu hỏi PHQ-9
  score_gad = map_to_gad7(signals)        # 0-21, chuẩn GAD-7
  level_phq = interpret_phq(score_phq)     # none/mild/moderate/mod-severe/severe
  level_gad = interpret_gad(score_gad)
  return { phq9: { score: score_phq, level: level_phq },
           gad7: { score: score_gad, level: level_gad } }
```
- Trình bày kết quả: thẻ card + biểu đồ vòng tròn, khuyến nghị nhẹ (thiền, hít thở, nghỉ ngơi)
- Điều hướng: nếu người dùng muốn tâm sự sâu → `/tam-su` (`medical-consultation-app/app/tam-su/page.tsx:1-9`)

---

## PHẦN 4: THÁCH THỨC VÀ GIẢI PHÁP

### Tổng hợp vấn đề kỹ thuật
- OOM với 8B trên GPU Colab
- Ảo giác nội dung y tế khi thiếu ngữ cảnh
- Lỗi định dạng JSON trong synthetic Companion
- Mất kết nối GPU/ngrok, reset kết nối Windows asyncio
- Đồng bộ trạng thái GPU/CPU giữa Backend–UI

### Giải pháp cụ thể
- OOM 8B:
  - Thiết lập `PYTORCH_CUDA_ALLOC_CONF=expandable_segments:True`
  - Retry với `max_new_tokens` thấp hơn; dọn cache GPU
  - Ưu tiên QLoRA 4-bit, r=16, alpha=16; Unsloth tăng tốc giảm thời gian chiếm VRAM
- Giảm ảo giác:
  - Áp dụng RAG với ChromaDB, citations bắt buộc
  - Kiểm tra liên quan; nếu không y tế: trả `redirect_url` (backend `server.py:1122-1141`)
- Fix JSON synthetic:
  - Sanitize + schema validation; bộ lọc ngôn ngữ nhạy cảm
- Kết nối/Windows:
  - `asyncio.WindowsSelectorEventLoopPolicy()` và handler bỏ qua `ConnectionResetError`
- Đồng bộ trạng thái:
  - Single Source of Truth: `runtime-mode.json`
  - API trả `metadata.mode/tier/fallback/model_init/rag`, UI cập nhật `ComputeToggle`

---

## Phụ lục: Đặc tả API & Triển khai

### API chính
| Endpoint | Mô tả | Ghi chú |
|----------|-------|---------|
| `/api/llm-chat` | Gateway GPU-first, fallback CPU | trả metadata |
| `/api/tam-su-chat` | Proxy Companion GPU-first | friend prompt, `mode` |
| `POST /v1/health-lookup` | Tra cứu y tế RAG | `mode`, `redirect_url` |
| `POST /v1/vision-chat` | Text + Image (VLM) | lazy-load VLM nếu GPU lỗi |

### Tiêu đề hội thoại
- Backend: nếu title rỗng → gọi LLM tóm tắt ngắn
- Frontend: nếu offline → lấy 6 từ đầu tiên của tin nhắn làm tiêu đề tạm

### Kiểm thử hiệu năng
- Theo dõi `runtime-metrics.jsonl` và sự kiện `runtime-events.jsonl`
- UI đồng bộ theo `metadata.mode` để phản ánh thực trạng backend

---

## Tài liệu tham chiếu nội bộ
- `medical-consultation-app/app/api/llm-chat/route.ts:41-68`, `:117-125`, `:187-205`
- `medical-consultation-app/components/compute-toggle.tsx:30-54`
- `server.py:1068-1323`, `server.py:1122-1141`, `server.py:241-245`
- `colab server/server_ai_mcs/Cell 6 server .py:259-266`, `:281-285`
- `systemPatterns.md:267-275`

