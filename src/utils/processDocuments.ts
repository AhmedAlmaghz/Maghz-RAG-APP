// import { exec } from 'child_process'
// import util from 'util'

// const execPromise = util.promisify(exec)

// const processDocuments = async () => {
//   try {
//     const { stdout, stderr } = await execPromise('python process_documents.py')
//     console.log('Python script output:', stdout)
//     if (stderr) {
//       console.error('Python script error:', stderr)
//     }
//   } catch (error) {
//     console.error('Error executing Python script:', error)
//     throw error
//   }
// }

// export default processDocuments

import { readdir, readFile } from 'fs/promises'
import path from 'path'
import { Document } from 'langchain/document'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { VoyageEmbeddings } from '@langchain/community/embeddings/voyage'
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase'
import { supabase } from './supabase'

const processDocuments = async () => {
  try {
    const contentDir = path.join(process.cwd(), 'content')
    const files = await readdir(contentDir)

    const embeddings = new VoyageEmbeddings({
      apiKey: process.env.VOYAGE_API_KEY,
    })

    const vectorStore = new SupabaseVectorStore(embeddings, {
      client: supabase,
      tableName: 'documents',
    })

    for (const file of files) {
      const content = await readFile(path.join(contentDir, file), 'utf-8')
      const doc = new Document({ pageContent: content, metadata: { source: file } })

      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      })

      const chunks = await textSplitter.splitDocuments([doc])
      await vectorStore.addDocuments(chunks)
      console.log(`Processed: ${file}`)
    }

    console.log('All documents processed successfully')
  } catch (error) {
    console.error('Error in processDocuments:', error)
    throw error
  }
}

export default processDocuments