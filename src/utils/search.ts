// import { VoyageEmbeddings } from "@langchain/community/embeddings/voyage";
// import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase'
// import { supabase } from './supabase'

// const search = async (query: string) => {
//   const embeddings = new VoyageEmbeddings({
//     apiKey: process.env.VOYAGE_API_KEY,
//   })

//   const vectorStore = new SupabaseVectorStore(embeddings, {
//     client: supabase,
//     tableName: 'documents',
//   })

//   const results = await vectorStore.similaritySearch(query, 5)
//   return results
// }

// export default search

import dotenv from 'dotenv'
import { VoyageEmbeddings } from "@langchain/community/embeddings/voyage";
import { PineconeStore } from '@langchain/pinecone'
import { Pinecone as PineconeClient } from '@pinecone-database/pinecone'

dotenv.config()

const search = async (query: string) => {

  const embeddings = new VoyageEmbeddings({
    apiKey: process.env.VOYAGE_API_KEY,
    modelName:process.env.VOYAGE_MODEL,
  })

  const pinecone = new PineconeClient({
    apiKey: process.env.PINECONE_API_KEY,
  })

  const index = pinecone.Index(process.env.PINECONE_INDEX!);

  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex:index,
    // Maximum number of batch requests to allow at once. Each batch is 1000 vectors.
    maxConcurrency: 5,
    // You can pass a namespace here too
    // namespace: "foo",
  });

  const results = await vectorStore.similaritySearch(query, 5)
  return results
}

export default search