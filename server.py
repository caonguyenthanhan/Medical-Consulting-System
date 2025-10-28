# FastAPI server that wraps a local llama.cpp GGUF model via llama-cpp-python
from fastapi import FastAPI, Request, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Optional
import os
import json
import asyncio
import tempfile
import datetime

try:
    from llama_cpp import Llama
    from llama_cpp.llama_chat_format import Llava15ChatHandler
except Exception:
    Llama = None
    Llava15ChatHandler = None

try:
    from PIL import Image
    import base64
    from io import BytesIO
except ImportError:
    Image = None
    base64 = None
    BytesIO = None

try:
    from gtts import gTTS
except ImportError:
    gTTS = None

try:
    import speech_recognition as sr
except ImportError:
    sr = None

try:
    from pydub import AudioSegment
except ImportError:
    AudioSegment = None

import requests

# Import audio utilities
try:
    from audio_utils import AudioChunker, ParallelSpeechRecognizer, TextChunker
except ImportError:
    AudioChunker = None
    ParallelSpeechRecognizer = None
    TextChunker = None

# MODEL_RELATIVE_PATH = os.path.join("models", "Llama-3.2-1B-Instruct-IQ3_M.gguf")
MODEL_RELATIVE_PATH = os.path.join("models", "Llama-3.2-1B-Instruct-Q6_K_L.gguf")
MODEL_PATH = os.path.abspath(MODEL_RELATIVE_PATH)

# VLM Model paths
VLM_MODEL_RELATIVE_PATH = os.path.join("models", "llava-v1.5-7b-Q6_K.gguf")
VLM_MODEL_PATH = os.path.abspath(VLM_MODEL_RELATIVE_PATH)
VLM_CLIP_MODEL_RELATIVE_PATH = os.path.join("models", "llava-v1.5-7b-mmproj-model-f16.gguf")
VLM_CLIP_MODEL_PATH = os.path.abspath(VLM_CLIP_MODEL_RELATIVE_PATH)

LLAMA_SERVER_URL = os.environ.get("LLAMA_SERVER_URL", "http://127.0.0.1:8080")

app = FastAPI(title="Local LLaMA Chat API", version="1.0.0")

# CORS for Next.js dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001", "http://127.0.0.1:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatMessage(BaseModel):
    role: str  # 'system' | 'user' | 'assistant'
    content: str

class ChatRequest(BaseModel):
    model: Optional[str] = "local-llama"
    messages: List[ChatMessage]
    temperature: Optional[float] = 0.7
    max_tokens: Optional[int] = 512

class ChatChoice(BaseModel):
    index: int
    message: ChatMessage
    finish_reason: Optional[str] = None

class ChatResponse(BaseModel):
    id: str
    object: str = "chat.completion"
    choices: List[ChatChoice]

class TextToSpeechRequest(BaseModel):
    text: str
    lang: Optional[str] = "vi"

class SpeechToTextResponse(BaseModel):
    success: bool
    text: Optional[str] = None
    error: Optional[str] = None

class VisionChatRequest(BaseModel):
    text: str
    image_base64: str
    temperature: Optional[float] = 0.7
    max_tokens: Optional[int] = 512

class VisionChatResponse(BaseModel):
    success: bool
    response: Optional[str] = None
    error: Optional[str] = None

# Load model once at startup
llm: Optional[Llama] = None
vlm_llm: Optional[Llama] = None

@app.on_event("startup")
async def load_model():
    global llm, vlm_llm
    print(f"Checking model path: {MODEL_PATH}")
    print(f"Model file exists: {os.path.exists(MODEL_PATH)}")
    print(f"Llama available: {Llama is not None}")
    
    # Load regular text model
    if os.path.exists(MODEL_PATH) and Llama is not None:
        try:
            print("Loading text model...")
            llm = Llama(
                model_path=MODEL_PATH,
                n_ctx=2048,
                n_threads=4,
                verbose=False
            )
            print("✅ Text model loaded successfully!")
        except Exception as e:
            print(f"❌ Failed to load text model: {e}")
            llm = None
    
    # Load VLM model
    print(f"Checking VLM model path: {VLM_MODEL_PATH}")
    print(f"VLM model file exists: {os.path.exists(VLM_MODEL_PATH)}")
    print(f"VLM CLIP model file exists: {os.path.exists(VLM_CLIP_MODEL_PATH)}")
    
    if (os.path.exists(VLM_MODEL_PATH) and os.path.exists(VLM_CLIP_MODEL_PATH) 
        and Llama is not None and Llava15ChatHandler is not None):
        try:
            print("Loading VLM model...")
            chat_handler = Llava15ChatHandler(clip_model_path=VLM_CLIP_MODEL_PATH)
            vlm_llm = Llama(
                model_path=VLM_MODEL_PATH,
                chat_handler=chat_handler,
                n_ctx=2048,
                n_threads=4,
                verbose=False
            )
            print("✅ VLM model loaded successfully!")
        except Exception as e:
            print(f"❌ Failed to load VLM model: {e}")
            vlm_llm = None
    else:
        print("❌ VLM model files not found or dependencies missing")
        vlm_llm = None
    
    if llm is None and vlm_llm is None:
        print("❌ No models loaded successfully")
    else:
        print("✅ Model loading completed!")

@app.get("/health")
async def health():
    return {
        "status": "ok", 
        "text_model_loaded": llm is not None, 
        "vlm_model_loaded": vlm_llm is not None,
        "proxy_target": LLAMA_SERVER_URL
    }

@app.post("/v1/chat/completions")
async def chat_completions(req: ChatRequest):
    if llm is not None:
        # llama_cpp supports chat completion format for chat-tuned models
        result = llm.create_chat_completion(
            messages=[{"role": m.role, "content": m.content} for m in req.messages],
            temperature=req.temperature,
            max_tokens=req.max_tokens,
        )
        content = result.get("choices", [{}])[0].get("message", {}).get("content", "")
        response = ChatResponse(
            id=str(result.get("id", "local-llama")),
            choices=[ChatChoice(index=0, message=ChatMessage(role="assistant", content=content))],
        )
        return response

    # Fallback: proxy to llama.cpp server
    try:
        proxied = requests.post(
            f"{LLAMA_SERVER_URL}/v1/chat/completions",
            headers={"Content-Type": "application/json"},
            data=json.dumps(req.dict()),
            timeout=120,
        )
        proxied.raise_for_status()
        proxied_data = proxied.json()
        
        # If proxy returns valid response, return it as is
        if "choices" in proxied_data:
            return proxied_data
        else:
            # If proxy returns unexpected format, create a proper ChatResponse
            error_content = proxied_data.get("error", "Unknown error from proxy")
            return ChatResponse(
                id="proxy-error",
                choices=[ChatChoice(index=0, message=ChatMessage(role="assistant", content=f"Xin lỗi, tôi đang gặp sự cố kỹ thuật: {error_content}"))]
            )
    except Exception as e:
        # Always return a proper ChatResponse object, never a dict
        error_message = f"Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau. (Lỗi: {str(e)})"
        return ChatResponse(
            id="error",
            choices=[ChatChoice(index=0, message=ChatMessage(role="assistant", content=error_message))]
        )

@app.post("/v1/text-to-speech")
async def text_to_speech(req: TextToSpeechRequest):
    if gTTS is None:
        raise HTTPException(status_code=500, detail="gTTS library not available")
    
    try:
        # Tạo đối tượng gTTS
        tts = gTTS(text=req.text, lang=req.lang)
        
        # Tạo tên file với timestamp
        now = datetime.datetime.now()
        timestamp = now.strftime("%Y%m%d_%H%M%S")
        filename = f"tts_output_{timestamp}.mp3"
        
        # Tạo thư mục audio nếu chưa tồn tại
        audio_dir = os.path.join(os.path.dirname(__file__), "audio")
        os.makedirs(audio_dir, exist_ok=True)
        
        # Đường dẫn file đầy đủ
        file_path = os.path.join(audio_dir, filename)
        
        # Lưu file audio
        tts.save(file_path)
        
        return {
            "success": True,
            "filename": filename,
            "file_path": file_path,
            "download_url": f"/v1/audio/{filename}"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating audio: {str(e)}")

@app.post("/v1/text-to-speech-streaming")
async def text_to_speech_streaming(req: TextToSpeechRequest):
    """
    Enhanced text-to-speech with text chunking for faster response
    """
    if gTTS is None:
        raise HTTPException(status_code=500, detail="gTTS library not available")
    
    if TextChunker is None:
        print("WARNING: Text chunking utilities not available, falling back to regular processing")
        return await text_to_speech(req)
    
    try:
        # Chunk the text into smaller parts
        print(f"Chunking text for streaming TTS: {req.text[:100]}...")
        chunks = TextChunker.chunk_by_sentences(req.text, max_chunk_length=150)
        print(f"Text chunked into {len(chunks)} parts")
        
        if len(chunks) <= 1:
            # If only one chunk, use regular processing
            return await text_to_speech(req)
        
        # Create audio for each chunk
        audio_files = []
        combined_audio = None
        
        for i, chunk in enumerate(chunks):
            if not chunk.strip():
                continue
                
            print(f"Processing chunk {i+1}/{len(chunks)}: {chunk[:50]}...")
            
            # Create gTTS for this chunk
            tts = gTTS(text=chunk.strip(), lang=req.lang)
            
            # Create temporary file for this chunk
            with tempfile.NamedTemporaryFile(delete=False, suffix=f"_chunk_{i}.mp3") as temp_file:
                chunk_path = temp_file.name
                
            # Save chunk audio
            tts.save(chunk_path)
            audio_files.append(chunk_path)
            
            # Combine with previous audio using pydub
            if AudioSegment is not None:
                chunk_audio = AudioSegment.from_mp3(chunk_path)
                
                if combined_audio is None:
                    combined_audio = chunk_audio
                else:
                    # Add small pause between chunks
                    pause = AudioSegment.silent(duration=200)  # 200ms pause
                    combined_audio = combined_audio + pause + chunk_audio
        
        # Save combined audio
        now = datetime.datetime.now()
        timestamp = now.strftime("%Y%m%d_%H%M%S")
        filename = f"tts_streaming_{timestamp}.mp3"
        
        # Create audio directory
        audio_dir = os.path.join(os.path.dirname(__file__), "audio")
        os.makedirs(audio_dir, exist_ok=True)
        
        file_path = os.path.join(audio_dir, filename)
        
        if combined_audio is not None:
            # Export combined audio
            combined_audio.export(file_path, format="mp3")
            print(f"Streaming TTS completed: {filename}")
        else:
            # Fallback: just use the first chunk
            if audio_files:
                import shutil
                shutil.copy2(audio_files[0], file_path)
                print(f"Fallback TTS completed: {filename}")
            else:
                raise Exception("No audio chunks created")
        
        # Cleanup chunk files
        for chunk_file in audio_files:
            try:
                if os.path.exists(chunk_file):
                    os.remove(chunk_file)
            except Exception as e:
                print(f"Error cleaning up chunk file {chunk_file}: {e}")
        
        return {
            "success": True,
            "filename": filename,
            "file_path": file_path,
            "download_url": f"/v1/audio/{filename}",
            "chunks_processed": len(chunks),
            "streaming": True
        }
        
    except Exception as e:
        print(f"Error in streaming TTS: {e}")
        # Cleanup any created files
        for chunk_file in audio_files:
            try:
                if os.path.exists(chunk_file):
                    os.remove(chunk_file)
            except:
                pass
        raise HTTPException(status_code=500, detail=f"Error generating streaming audio: {str(e)}")

@app.get("/v1/audio/{filename}")
async def get_audio_file(filename: str):
    audio_dir = os.path.join(os.path.dirname(__file__), "audio")
    file_path = os.path.join(audio_dir, filename)
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Audio file not found")
    
    return FileResponse(
        path=file_path,
        media_type="audio/mpeg",
        filename=filename
    )

@app.post("/v1/speech-to-text")
async def speech_to_text(audio_file: UploadFile = File(...)):
    print(f"Speech-to-text request received. File: {audio_file.filename}, Content-Type: {audio_file.content_type}")
    
    if sr is None:
        print("ERROR: speech_recognition library not available")
        raise HTTPException(status_code=500, detail="speech_recognition library not available")
    
    temp_file_path = None
    wav_file_path = None
    
    try:
        print(f"Received audio file: {audio_file.filename}, content_type: {audio_file.content_type}")
        
        # Đọc nội dung file
        content = await audio_file.read()
        print(f"Audio file size: {len(content)} bytes")
        
        # Xác định extension dựa trên content type
        file_extension = ".webm"
        if audio_file.content_type:
            if "webm" in audio_file.content_type:
                file_extension = ".webm"
            elif "ogg" in audio_file.content_type:
                file_extension = ".ogg"
            elif "mp4" in audio_file.content_type or "m4a" in audio_file.content_type:
                file_extension = ".m4a"
            elif "wav" in audio_file.content_type:
                file_extension = ".wav"
        
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as temp_file:
            temp_file.write(content)
            temp_file_path = temp_file.name
            print(f"Temporary file created: {temp_file_path}")
        
        # Convert to WAV if not already WAV
        if file_extension != ".wav":
            if AudioSegment is None:
                print("WARNING: pydub not available, cannot convert audio format")
                audio_file_to_process = temp_file_path
            else:
                print(f"Converting {file_extension} to WAV using pydub...")
                try:
                    # Load audio file with pydub
                    print(f"Loading audio file: {temp_file_path}")
                    audio = AudioSegment.from_file(temp_file_path)
                    print(f"Audio loaded successfully. Duration: {len(audio)}ms, Channels: {audio.channels}, Frame rate: {audio.frame_rate}")
                    
                    # Create WAV file
                    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as wav_file:
                        wav_file_path = wav_file.name
                    
                    # Export as WAV
                    print(f"Exporting to WAV: {wav_file_path}")
                    audio.export(wav_file_path, format="wav")
                    print(f"Audio converted to WAV successfully: {wav_file_path}")
                    
                    # Use the converted WAV file
                    audio_file_to_process = wav_file_path
                except Exception as e:
                    print(f"Error converting audio with pydub: {e}")
                    import traceback
                    traceback.print_exc()
                    print("Fallback to original file (may cause speech recognition error)")
                    # Fallback to original file
                    audio_file_to_process = temp_file_path
        else:
            print("File is already WAV format, no conversion needed")
            audio_file_to_process = temp_file_path
        
        # Khởi tạo recognizer
        recognizer = sr.Recognizer()
        print("Speech recognizer initialized")
        
        # Đọc file audio
        print("Reading audio file...")
        with sr.AudioFile(audio_file_to_process) as source:
            audio_data = recognizer.record(source)
        print("Audio data recorded successfully")
        
        # Chuyển đổi speech thành text
        try:
            print("Converting speech to text...")
            # Sử dụng Google Speech Recognition
            text = recognizer.recognize_google(audio_data, language="vi-VN")
            print(f"Speech recognition successful: {text}")
            return SpeechToTextResponse(success=True, text=text)
        except sr.UnknownValueError:
            print("Speech recognition: Could not understand audio")
            return SpeechToTextResponse(success=False, error="Could not understand audio")
        except sr.RequestError as e:
            print(f"Speech recognition request error: {e}")
            return SpeechToTextResponse(success=False, error=f"Could not request results; {e}")
        
    except Exception as e:
        print(f"ERROR in speech-to-text: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error processing audio: {str(e)}")
    
    finally:
        # Xóa file tạm thời
        if temp_file_path and os.path.exists(temp_file_path):
            os.unlink(temp_file_path)
            print(f"Temporary file deleted: {temp_file_path}")
        
        # Xóa file WAV đã convert (nếu có)
        if wav_file_path and os.path.exists(wav_file_path):
            os.unlink(wav_file_path)
            print(f"Converted WAV file deleted: {wav_file_path}")

@app.post("/v1/speech-to-text-chunked")
async def speech_to_text_chunked(audio_file: UploadFile = File(...), chunk_duration: int = 5):
    """
    Enhanced speech-to-text with audio chunking for better performance
    
    Args:
        audio_file: Audio file to process
        chunk_duration: Duration of each chunk in seconds (default: 5)
    """
    print(f"Chunked speech-to-text request received. File: {audio_file.filename}, Chunk duration: {chunk_duration}s")
    
    if sr is None:
        print("ERROR: speech_recognition library not available")
        raise HTTPException(status_code=500, detail="speech_recognition library not available")
    
    if AudioChunker is None or ParallelSpeechRecognizer is None:
        print("WARNING: Audio chunking utilities not available, falling back to regular processing")
        # Fallback to regular speech-to-text
        return await speech_to_text(audio_file)
    
    temp_file_path = None
    wav_file_path = None
    chunk_files = []
    
    try:
        print(f"Received audio file: {audio_file.filename}, content_type: {audio_file.content_type}")
        
        # Đọc nội dung file
        content = await audio_file.read()
        print(f"Audio file size: {len(content)} bytes")
        
        # Xác định extension dựa trên content type
        file_extension = ".webm"
        if audio_file.content_type:
            if "webm" in audio_file.content_type:
                file_extension = ".webm"
            elif "ogg" in audio_file.content_type:
                file_extension = ".ogg"
            elif "mp4" in audio_file.content_type or "m4a" in audio_file.content_type:
                file_extension = ".m4a"
            elif "wav" in audio_file.content_type:
                file_extension = ".wav"
        
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as temp_file:
            temp_file.write(content)
            temp_file_path = temp_file.name
            print(f"Temporary file created: {temp_file_path}")
        
        # Convert to WAV if not already WAV
        if file_extension != ".wav":
            if AudioSegment is None:
                print("WARNING: pydub not available, cannot convert audio format")
                audio_file_to_process = temp_file_path
            else:
                print(f"Converting {file_extension} to WAV using pydub...")
                try:
                    # Load audio file with pydub
                    print(f"Loading audio file: {temp_file_path}")
                    audio = AudioSegment.from_file(temp_file_path)
                    print(f"Audio loaded successfully. Duration: {len(audio)}ms, Channels: {audio.channels}, Frame rate: {audio.frame_rate}")
                    
                    # Create WAV file
                    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as wav_file:
                        wav_file_path = wav_file.name
                    
                    # Export as WAV
                    print(f"Exporting to WAV: {wav_file_path}")
                    audio.export(wav_file_path, format="wav")
                    print(f"Audio converted to WAV successfully: {wav_file_path}")
                    
                    # Use the converted WAV file
                    audio_file_to_process = wav_file_path
                except Exception as e:
                    print(f"Error converting audio with pydub: {e}")
                    import traceback
                    traceback.print_exc()
                    print("Fallback to original file (may cause speech recognition error)")
                    # Fallback to original file
                    audio_file_to_process = temp_file_path
        else:
            print("File is already WAV format, no conversion needed")
            audio_file_to_process = temp_file_path
        
        # Chunk the audio file
        print(f"Chunking audio into {chunk_duration}s segments...")
        chunker = AudioChunker(chunk_duration_ms=chunk_duration * 1000)
        chunk_files = chunker.chunk_audio_file(audio_file_to_process)
        print(f"Audio chunked into {len(chunk_files)} segments")
        
        if not chunk_files:
            print("No chunks created, falling back to regular processing")
            # Fallback to regular processing
            recognizer = sr.Recognizer()
            with sr.AudioFile(audio_file_to_process) as source:
                audio_data = recognizer.record(source)
            
            try:
                text = recognizer.recognize_google(audio_data, language="vi-VN")
                return SpeechToTextResponse(success=True, text=text)
            except sr.UnknownValueError:
                return SpeechToTextResponse(success=False, error="Could not understand audio")
            except sr.RequestError as e:
                return SpeechToTextResponse(success=False, error=f"Could not request results; {e}")
        
        # Process chunks in parallel
        print("Processing chunks in parallel...")
        recognizer = ParallelSpeechRecognizer(max_workers=3)
        combined_text = await recognizer.recognize_chunks_parallel(chunk_files, language="vi-VN")
        
        if combined_text:
            print(f"Chunked speech recognition successful: {combined_text}")
            return SpeechToTextResponse(success=True, text=combined_text)
        else:
            print("Chunked speech recognition: Could not understand audio")
            return SpeechToTextResponse(success=False, error="Could not understand audio")
        
    except Exception as e:
        print(f"ERROR in chunked speech-to-text: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error processing audio: {str(e)}")
    
    finally:
        # Cleanup temporary files
        if temp_file_path and os.path.exists(temp_file_path):
            os.unlink(temp_file_path)
            print(f"Temporary file deleted: {temp_file_path}")
        
        if wav_file_path and os.path.exists(wav_file_path):
            os.unlink(wav_file_path)
            print(f"Converted WAV file deleted: {wav_file_path}")
        
        # Cleanup chunk files
        if chunk_files and AudioChunker is not None:
            chunker = AudioChunker()
            chunker.cleanup_chunks(chunk_files)
            print(f"Cleaned up {len(chunk_files)} chunk files")

@app.post("/v1/speech-chat-optimized")
async def speech_chat_optimized(audio_file: UploadFile = File(...)):
    """
    Optimized speech-to-speech chat with chunking for better performance
    """
    print("=== OPTIMIZED SPEECH CHAT STARTED ===")
    
    try:
        # Step 1: Speech-to-Text with chunking
        print("Step 1: Processing speech-to-text with chunking...")
        
        if AudioChunker is not None and ParallelSpeechRecognizer is not None:
            # Use chunked processing
            # Reset file pointer to beginning
            await audio_file.seek(0)
            stt_response = await speech_to_text_chunked(audio_file, chunk_duration=3)
            if not stt_response.success:
                raise HTTPException(status_code=400, detail=stt_response.error or "Speech recognition failed")
            user_text = stt_response.text
        else:
            # Fallback to regular processing
            print("Chunking not available, using regular speech-to-text...")
            # Reset file pointer to beginning
            await audio_file.seek(0)
            stt_response = await speech_to_text(audio_file)
            if not stt_response.success:
                raise HTTPException(status_code=400, detail=stt_response.error or "Speech recognition failed")
            user_text = stt_response.text
        
        print(f"User speech recognized: {user_text}")
        
        # Step 2: AI Chat Processing
        print("Step 2: Processing AI chat...")
        
        # Create chat request
        chat_request = ChatRequest(
            messages=[
                ChatMessage(role="system", content="Bạn là một trợ lý AI y tế thông minh và hữu ích. Hãy trả lời các câu hỏi về sức khỏe một cách chính xác và dễ hiểu. Luôn khuyên người dùng tham khảo ý kiến bác sĩ chuyên khoa khi cần thiết."),
                ChatMessage(role="user", content=user_text)
            ],
            temperature=0.7,
            max_tokens=300  # Limit response length for faster TTS
        )
        
        # Get AI response
        chat_response = await chat_completions(chat_request)
        ai_response = chat_response.choices[0].message.content
        print(f"AI response generated: {ai_response[:100]}...")
        
        # Step 3: Text-to-Speech with streaming
        print("Step 3: Processing text-to-speech with streaming...")
        
        if TextChunker is not None:
            # Use streaming TTS
            tts_request = TextToSpeechRequest(text=ai_response, lang="vi")
            tts_response = await text_to_speech_streaming(tts_request)
        else:
            # Fallback to regular TTS
            print("Text chunking not available, using regular text-to-speech...")
            tts_request = TextToSpeechRequest(text=ai_response, lang="vi")
            tts_response = await text_to_speech(tts_request)
        
        print("=== OPTIMIZED SPEECH CHAT COMPLETED ===")
        
        return {
            "success": True,
            "user_text": user_text,
            "ai_response": ai_response,
            "audio_filename": tts_response["filename"],
            "audio_url": tts_response["download_url"],
            "optimized": True,
            "chunking_used": {
                "speech_to_text": AudioChunker is not None,
                "text_to_speech": TextChunker is not None,
                "chunks_processed": tts_response.get("chunks_processed", 1)
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"ERROR in optimized speech chat: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error in optimized speech chat: {str(e)}")

@app.post("/v1/vision-chat")
async def vision_chat(req: VisionChatRequest):
    """
    Endpoint để xử lý ảnh với VLM model
    """
    if vlm_llm is None:
        raise HTTPException(status_code=503, detail="VLM model not available")
    
    if not req.image_base64 or not req.text:
        raise HTTPException(status_code=400, detail="Both image_base64 and text are required")
    
    try:
        # Tạo messages theo format của llama-cpp-python với VLM
        messages = [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": req.text},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{req.image_base64}"
                        }
                    }
                ]
            }
        ]
        
        # Gọi VLM model
        response = vlm_llm.create_chat_completion(
            messages=messages,
            temperature=req.temperature,
            max_tokens=req.max_tokens
        )
        
        # Lấy response text
        response_text = response["choices"][0]["message"]["content"]
        
        return VisionChatResponse(
            success=True,
            response=response_text
        )
        
    except Exception as e:
        print(f"ERROR in vision chat: {str(e)}")
        import traceback
        traceback.print_exc()
        return VisionChatResponse(
            success=False,
            error=f"Error processing vision chat: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=False)