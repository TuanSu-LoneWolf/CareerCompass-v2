# rag_engine.py
# Logic RAG (embedding Google GenAI + ChatGoogleGenerativeAI)
# Đường dẫn và cấu trúc FAISS phù hợp chatbot 1
# Đã tối ưu: load FAISS nếu tồn tại, tránh rebuild nhiều lần → tiết kiệm quota embedding

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
# Load .env
# -----------------------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOTENV_PATH = os.path.join(BASE_DIR, ".env")
load_dotenv(DOTENV_PATH)

# GOOGLE_API_KEY phải có trong .env
# Nếu chưa set, SDK sẽ báo lỗi khi gọi API
# .env phải có: GOOGLE_API_KEY=your_api_key_here

# -----------------------
# Paths
# -----------------------
PDF_FOLDER = os.path.join(BASE_DIR, "Data", "rag", "pdfs")
FAISS_INDEX_DIR = os.path.join(BASE_DIR, "Data", "rag", "faiss_index")

# -----------------------
# Step 1: Load & split PDFs
# -----------------------
def load_all_pdfs(folder_path):
    """Load tất cả PDF từ thư mục và trả về danh sách Document"""
    documents = []
    for filename in os.listdir(folder_path):
        if filename.lower().endswith(".pdf"):
            loader = PyPDFLoader(os.path.join(folder_path, filename))
            documents.extend(loader.load())
    return documents

raw_docs = load_all_pdfs(PDF_FOLDER)
splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
docs = splitter.split_documents(raw_docs)  # tách thành các đoạn nhỏ

# -----------------------
# Step 2: Embeddings + FAISS (load nếu tồn tại)
# -----------------------
embedding_model = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

if os.path.exists(FAISS_INDEX_DIR):
    # Nếu FAISS index đã tồn tại, load từ disk → không tốn request embedding
    vectorstore = FAISS.load_local(FAISS_INDEX_DIR, embedding_model, allow_dangerous_deserialization=True)
else:
    # Nếu chưa tồn tại, build FAISS từ documents → tốn request embedding
    vectorstore = FAISS.from_documents(docs, embedding_model)
    # Lưu index ra disk để lần sau load, tránh build lại
    vectorstore.save_local(FAISS_INDEX_DIR)

# -----------------------
# Step 3: LLM + Prompt
# -----------------------
llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.1)

prompt_template = PromptTemplate.from_template(
    """Bạn là một trợ lý AI chuyên về tư vấn hướng nghiệp cho học sinh, sinh viên hoặc người đang tìm kiếm định hướng nghề nghiệp. Dưới đây là ngữ cảnh tài liệu bạn có thể tham khảo để đưa ra câu trả lời phù hợp và chính xác:

{context}

Câu hỏi từ người dùng: {question}

Dựa trên ngữ cảnh trên, hãy trả lời một cách rõ ràng, chuyên nghiệp và mang tính định hướng. Nếu thông tin trong ngữ cảnh chưa đủ, hãy đưa ra phản hồi chung mang tính khuyến nghị, nhưng không bịa đặt. Nếu câu hỏi không có liên quan đến lĩnh vực của bạn đang tư vấn thì bảo là 'Tui chỉ trả lời câu hỏi liên quan đến nghề nghiệp.'. Nếu mà kiểu người dùng giao tiếp bình thường như là chào hỏi này nọ thì bạn vẫn trả lời bình thường"""
)

# -----------------------
# Step 4: QA chain
# -----------------------
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=vectorstore.as_retriever(),
    chain_type_kwargs={"prompt": prompt_template}
)

# -----------------------
# Step 5: Hàm xử lý truy vấn
# -----------------------
def answer_question(question: str) -> str:
    """
    Trả về câu trả lời từ RAG.
    Lưu ý:
    - Chỉ tốn request LLM (không tốn embedding) nếu FAISS đã được build trước đó.
    - Nếu FAISS chưa tồn tại, lần đầu build sẽ tốn request embedding → cần quota.
    """
    return qa_chain.run(question)
