import { VoyageEmbeddings } from "@langchain/community/embeddings/voyage";
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase'
import { supabase } from './supabase'

const search = async (query: string) => {
  const embeddings = new VoyageEmbeddings({
    apiKey: process.env.VOYAGE_API_KEY,
  })

  const vectorStore = new SupabaseVectorStore(embeddings, {
    client: supabase,
    tableName: 'documents',
  })

  const results = await vectorStore.similaritySearch(query, 5)
  return results
}

export default search