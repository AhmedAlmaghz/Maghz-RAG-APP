// import { readdir } from 'fs/promises'
// import path from 'path'
// import { Document } from 'langchain/document'
// import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
// import { VoyageEmbeddings } from '@langchain/community/embeddings/voyage'
// import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase'
// import { supabase } from './supabase'
// import { UnstructuredLoader } from '@langchain/community/document_loaders/fs/unstructured'

// const processDocuments = async () => {
//   try {
//     const contentDir = path.join(process.cwd(), 'content')
//     const files = await readdir(contentDir)

//     console.log('VOYAGE_API_KEY:', process.env.VOYAGE_API_KEY ? 'Set' : 'Not set')

//     const embeddings = new VoyageEmbeddings({
//       apiKey: process.env.VOYAGE_API_KEY,
//     })

//     const vectorStore = new SupabaseVectorStore(embeddings, {
//       client: supabase,
//       tableName: 'documents',
//     })

//     for (const file of files) {
//       console.log(`معالجة الملف: ${file}`)
//       const filePath = path.join(contentDir, file)
      
//       // استخدام UnstructuredLoader لتحميل الملف
//       const loader = new UnstructuredLoader(filePath)
//       const docs = await loader.load()

//       const textSplitter = new RecursiveCharacterTextSplitter({
//         chunkSize: 1024,
//         chunkOverlap: 200,
//       })

//       const chunks = await textSplitter.splitDocuments(docs)
//       console.log(`عدد الأجزاء للملف ${file}:`, chunks.length)

//       if (chunks.length === 0) {
//         console.warn(`No chunks created for ${file}. Skipping.`)
//         continue
//       }

//       try {
//         // Test embedding a single chunk
//         const testEmbedding = await embeddings.embedQuery(chunks[0].pageContent)
//         console.log(`Test embedding for ${file}:`, testEmbedding.slice(0, 5))

//         await vectorStore.addDocuments(chunks)
//         console.log(`Processed: ${file}`)
//       } catch (error) {
//         console.error(`Error processing ${file}:`, error)
//       }
//     }

//     console.log('All documents processed successfully')
//   } catch (error) {
//     console.error('خطأ في processDocuments:', error)
//     throw error
//   }
// }

// export default processDocuments


import { readdir } from 'fs/promises'
import path from 'path'
import { Document } from 'langchain/document'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { VoyageEmbeddings } from '@langchain/community/embeddings/voyage'
import { Pinecone as PineconeClient } from '@pinecone-database/pinecone'
import { PineconeStore } from '@langchain/pinecone'
import { UnstructuredLoader } from '@langchain/community/document_loaders/fs/unstructured'

const processDocuments = async () => {
  try {
    const contentDir = path.join(process.cwd(), 'content')
    const files = await readdir(contentDir)

    console.log('VOYAGE_API_KEY:', process.env.VOYAGE_API_KEY ? 'Set' : 'Not set')
    console.log('PINECONE_API_KEY:', process.env.PINECONE_API_KEY ? 'Set' : 'Not set')
    console.log('PINECONE_ENVIRONMENT:', process.env.PINECONE_ENVIRONMENT ? 'Set' : 'Not set')

    const embeddings = new VoyageEmbeddings({
      apiKey: process.env.VOYAGE_API_KEY,
      inputType: 'document',
      modelName:process.env.VOYAGE_MODEL,
    })

    const pinecone = new PineconeClient({
      apiKey: process.env.PINECONE_API_KEY,
      // environment: process.env.PINECONE_ENVIRONMENT,
    })

    const index = pinecone.Index(process.env.PINECONE_INDEX!);
    // استبدل 'your-index-name' باسم الفهرس الخاص بك

    for (const file of files) {
      console.log(`معالجة الملف: ${file}`)
      const filePath = path.join(contentDir, file)
      
      let retries = 3
      let success = false

      while (retries > 0 && !success) {
        try {
          // استخدام UnstructuredLoader لتحميل الملف
          const loader = new UnstructuredLoader(filePath)
          const docs = await loader.load()

          const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1024,
            chunkOverlap: 128,
          })

          const chunks: Document[] = await textSplitter.splitDocuments(docs)
          console.log(`عدد الأجزاء للملف ${file}:`, chunks.length)

          if (chunks.length === 0) {
            console.warn(`No chunks created for ${file}. Skipping.`)
            success = true
            continue
          }

          // Test embedding a single chunk
          const testEmbedding = await embeddings.embedDocuments(chunks[0].pageContent)
          if (!testEmbedding) {
            console.error(`Embedding failed for ${file}. Skipping.`)
            success = true
            continue
          }
          console.log(`Test embedding for ${file}:`, testEmbedding.slice(0, 5))

          // Prepare documents for Pinecone
          const documentsToInsert = chunks.map((chunk, index) => {
            const metadata = {
              ...chunk.metadata,
              loc: JSON.stringify(chunk.metadata.loc), // تحويل البيانات الوصفية إلى سلسلة نصية
              originalText: chunk.pageContent, // إضافة النص الأصلي للجزء
            }
            return {
              id: `${file}-${index}`, // إنشاء معرف فريد لكل جزء
              values: testEmbedding, // استخدم التضمين الناتج
              metadata, // استخدم البيانات الوصفية المنظفة
            }
          })

          // Insert documents into Pinecone
          await index.upsert(documentsToInsert)
          console.log(`Processed: ${file}`)
          success = true
        } catch (error) {
          retries -= 1
          if (retries === 0) {
            console.error(`Error processing ${file}:`, error)
          } else {
            console.warn(`Retrying ${file} (${retries} retries left)`)
          }
        }
      }
    }

    console.log('All documents processed successfully')
  } catch (error) {
    console.error('خطأ في processDocuments:', error)
    throw error
  }
}

export default processDocuments