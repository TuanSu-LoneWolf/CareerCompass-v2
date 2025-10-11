# rag_engine.py
# RAG engine dùng Gemini API (Google Generative AI)
# Dành cho demo local — chỉ cần .env có GEMINI_API_KEY
# Nếu FAISS index đã build, sẽ tự load để tránh tốn quota embedding

import os
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_google_genai.embeddings import GoogleGenerativeAIEmbeddings
from langchain.prompts import PromptTemplate
from langchain.chains import RetrievalQA

# -----------------------
# Load environment
# -----------------------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOTENV_PATH = os.path.join(BASE_DIR, ".env")
load_dotenv(DOTENV_PATH)

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("❌ Missing GEMINI_API_KEY in .env file")

os.environ["GEMINI_API_KEY"] = api_key  # LangChain vẫn dùng biến này nội bộ

# -----------------------
# Paths
# -----------------------
PDF_FOLDER = os.path.join(BASE_DIR, "Data", "rag", "pdfs")
FAISS_INDEX_DIR = os.path.join(BASE_DIR, "Data", "rag", "faiss_index")

os.makedirs(PDF_FOLDER, exist_ok=True)
os.makedirs(FAISS_INDEX_DIR, exist_ok=True)

# -----------------------
# Step 1: Load & split PDFs
# -----------------------
def load_all_pdfs(folder_path):
    """Load tất cả PDF trong thư mục."""
    documents = []
    for filename in os.listdir(folder_path):
        if filename.lower().endswith(".pdf"):
            path = os.path.join(folder_path, filename)
            loader = PyPDFLoader(path)
            documents.extend(loader.load())
    return documents

def prepare_docs():
    print("📄 Đang load tài liệu PDF...")
    raw_docs = load_all_pdfs(PDF_FOLDER)
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    docs_local = splitter.split_documents(raw_docs)
    print(f"✅ Tổng số đoạn: {len(docs_local)}")
    return docs_local

# Tạm để docs = None, chỉ load nếu cần build
docs = None

# -----------------------
# Step 2: FAISS + Embeddings (with auto-detect + rebuild on dim mismatch)
# -----------------------
import shutil
from langchain_google_genai.embeddings import GoogleGenerativeAIEmbeddings

API_KEY = os.getenv("GEMINI_API_KEY")

embedding_model = GoogleGenerativeAIEmbeddings(
    model="models/embedding-001",
    google_api_key=API_KEY
)

def build_faiss_from_docs():
    docs_local = prepare_docs()
    print("🚀 Bắt đầu build FAISS index (sẽ tốn request embedding)...")
    vs = FAISS.from_documents(docs_local, embedding_model)

    print("🚀 Bắt đầu build FAISS index (sẽ tốn request embedding)...")
    vs = FAISS.from_documents(docs, embedding_model)
    vs.save_local(FAISS_INDEX_DIR)
    print("💾 Đã lưu FAISS index.")
    return vs

vectorstore = None
index_path = os.path.join(FAISS_INDEX_DIR, "index.faiss")

if os.path.exists(index_path):
    print("📦 Tìm thấy FAISS index, đang load...")
    try:
        vectorstore = FAISS.load_local(
            FAISS_INDEX_DIR,
            embedding_model,
            allow_dangerous_deserialization=True,
        )
        # Kiểm tra nhanh: thử chạy 1 truy vấn tìm kiếm để phát hiện mismatch dim
        try:
            # thử tìm 1 kết quả; nếu dimension mismatch sẽ ném AssertionError từ faiss
            _ = vectorstore.similarity_search("kiểm tra dimension", k=1)
            print("✅ FAISS index hợp lệ với embedding hiện tại.")
        except AssertionError:
            print("⚠️ Phát hiện mismatch dimension giữa index và embedding. Rebuild FAISS...")
            shutil.rmtree(FAISS_INDEX_DIR)
            os.makedirs(FAISS_INDEX_DIR, exist_ok=True)
            vectorstore = build_faiss_from_docs()
    except Exception as e:
        print("❌ Lỗi khi load FAISS index:", e)
        print("➡️ Xóa và rebuild lại FAISS index để an toàn.")
        if os.path.exists(FAISS_INDEX_DIR):
            shutil.rmtree(FAISS_INDEX_DIR)
            os.makedirs(FAISS_INDEX_DIR, exist_ok=True)
        vectorstore = build_faiss_from_docs()
else:
    # chưa có index → build mới
    vectorstore = build_faiss_from_docs()

# -----------------------
# Step 3: Model + Prompt
# -----------------------
llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.1, google_api_key=os.getenv("GEMINI_API_KEY"))

prompt_template = PromptTemplate.from_template(
    """Bạn là một trợ lý AI chuyên về tư vấn hướng nghiệp.
Dưới đây là ngữ cảnh từ tài liệu mà bạn có thể tham khảo:

{context}

Câu hỏi: {question}

Hãy trả lời chi tiết, tự nhiên và chính xác. Nếu không đủ dữ kiện, hãy phản hồi chung mang tính định hướng nghề nghiệp."""
)

qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=vectorstore.as_retriever(search_kwargs={"k": 5}),
    chain_type_kwargs={"prompt": prompt_template},
)

# -----------------------
# Step 4: Hàm truy vấn
# -----------------------
def answer_question(question: str) -> str:

    """Trả về câu trả lời từ hệ thống RAG (có debug chi tiết)."""
    print(f"🧠 Nhận câu hỏi: {question}")
    try:
        result = qa_chain.invoke({"query": question})
        print(f"🧩 Raw result type: {type(result)}")
        print(f"🧩 Raw result content: {result}")

        if isinstance(result, dict):
            return result.get("result") or result.get("output_text") or str(result)
        elif hasattr(result, "output_text"):
            return result.output_text
        else:
            return str(result)

    except Exception as e:
        import traceback
        print("❌ FULL ERROR TRACEBACK:")
        traceback.print_exc()
        print(f"❌ Error message: {e}")
        return "Xin lỗi, hệ thống gặp lỗi khi xử lý câu hỏi của bạn."



