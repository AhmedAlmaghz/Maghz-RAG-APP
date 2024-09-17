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


import { VoyageEmbeddings } from "@langchain/community/embeddings/voyage";
import { PineconeStore } from '@langchain/pinecone'
import { Pinecone as PineconeClient } from '@pinecone-database/pinecone'


const search = async (query: string) => {

  const embeddings = new VoyageEmbeddings({
    apiKey: "pa-_HBc1oHXIWTqi134SnjX1jAQUHniKQeAkK4CLZj1OE8",
    // apiKey: process.env.VOYAGE_API_KEY,
    modelName:process.env.VOYAGE_MODEL,
  })

  const pinecone = new PineconeClient({
    apiKey: "1a5c754c-5452-4f43-be40-a12373ae3690",
    // apiKey: process.env.PINECONE_API_KEY,
  })

  // const index = pinecone.Index(process.env.PINECONE_INDEX!);
  const index = pinecone.Index("sample-movies");

  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex:index,
    // Maximum number of batch requests to allow at once. Each batch is 1000 vectors.
    maxConcurrency: 5,
    // You can pass a namespace here too
    // namespace: "foo",
  });

  const results = await vectorStore.similaritySearch(query)
  return results
}

export default search