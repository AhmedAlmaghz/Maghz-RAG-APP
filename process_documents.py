import os
from unstructured.partition.auto import partition
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import VoyageEmbeddings
from langchain.vectorstores import SupabaseVectorStore
from supabase import create_client, Client

# Supabase setup
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

# Voyage AI setup
voyage_api_key = os.getenv("VOYAGE_API_KEY")
embeddings = VoyageEmbeddings(api_key=voyage_api_key)

def process_file(file_path):
    # Use unstructured to extract text from various file types
    elements = partition(filename=file_path)
    text = "\n\n".join([str(el) for el in elements])

    # Split text into chunks
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
    )
    chunks = text_splitter.split_text(text)

    # Create metadata
    metadata = {"source": file_path}

    # Create documents with text and metadata
    documents = [{"text": chunk, "metadata": metadata} for chunk in chunks]

    # Store in Supabase
    vector_store = SupabaseVectorStore(
        embedding=embeddings,
        client=supabase,
        table_name="documents",
    )
    vector_store.add_documents(documents)

def process_directory(directory_path):
    for root, _, files in os.walk(directory_path):
        for file in files:
            file_path = os.path.join(root, file)
            try:
                process_file(file_path)
                print(f"Processed: {file_path}")
            except Exception as e:
                print(f"Error processing {file_path}: {str(e)}")

if __name__ == "__main__":
    content_dir = "./content"  # Change this to your content directory
    process_directory(content_dir)