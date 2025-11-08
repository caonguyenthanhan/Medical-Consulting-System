
from langchain_community.embeddings import HuggingFaceEmbeddings
from llama_index.core import (
    VectorStoreIndex,
    StorageContext,
)
from llama_index.vector_stores.chroma import ChromaVectorStore
import chromadb
from llama_index.embeddings.langchain import LangchainEmbedding
from langchain_openai import ChatOpenAI
from langchain.callbacks.base import BaseCallbackHandler
import torch
class StreamHandler(BaseCallbackHandler):
    def on_llm_new_token(self, token: str, **kwargs) -> None:
        print(token, end="", flush=True)
        
class LLM_CHAT:
    def __init__(self):
        self.embed_model = LangchainEmbedding(
            HuggingFaceEmbeddings(model_name="bkai-foundation-models/vietnamese-bi-encoder",model_kwargs={'device': 'cuda' if torch.cuda.is_available() else 'cpu'})
        )
        self.chroma_client = chromadb.PersistentClient(path="./DB_ALL")
        self.chroma_collection = self.chroma_client.get_or_create_collection("KienThucYKhoa")
        self.vector_store = ChromaVectorStore(chroma_collection=self.chroma_collection)
        self.storage_context = StorageContext.from_defaults(vector_store=self.vector_store)
        self.index = VectorStoreIndex.from_vector_store(
            vector_store=self.vector_store,
            embed_model=self.embed_model,
            storage_context=self.storage_context,            
        )
        self.retriever = self.index.as_retriever(similarity_top_k=5)
        self.llm =  ChatOpenAI(
            api_key="any-string", 
            base_url="http://127.0.0.1:8080",
            # streaming=True,        #nếu streaming bật thì gỡ 2 dòng này
            # callbacks=[StreamHandler()],# streaming
            )
    def answer(self,question):
        nodes = self.retriever.retrieve(question)
        context ="Đây là câu hỏi của người dùng:\n"+question+"\nThông tin trích xuất"
        for i in range (len(nodes)):
            context=context +f"\nđây là context thứ {i+1}:\n"+ nodes[i].node.get_content()
        # print(context) # in ket qua truy xuat RAG
        # print("_"*50) 
        response = self.llm.invoke(context)
        return response.content
if __name__ == "__main__":
    llm_chat=LLM_CHAT()
    while True:
        question=input("Nhập câu hỏi của bạn (gõ 'exit' để thoát): ")
        if question.lower() == 'exit':
            break
        print("Câu trả lời:")
        answer=llm_chat.answer(question)
        print(answer)