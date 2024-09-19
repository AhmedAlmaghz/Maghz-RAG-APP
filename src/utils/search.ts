import { VoyageEmbeddings } from "@langchain/community/embeddings/voyage";
import { PineconeStore } from '@langchain/pinecone'
import { Pinecone as PineconeClient } from '@pinecone-database/pinecone'


const search = async (query: string) => {

  const embeddings = new VoyageEmbeddings({
    apiKey: process.env.VOYAGE_API_KEY,
    modelName:process.env.VOYAGE_MODEL,
  })

  const pinecone = new PineconeClient({ apiKey: process.env.PINECONE_API_KEY});

  const index = pinecone.Index(process.env.PINECONE_INDEX!);

  const embedQuery = await embeddings.embedQuery(query);
  console.log(embedQuery);
  const queryResponse = await index.query({topK:5, vector: embedQuery, includeValues:false, includeMetadata:true});
  
  // تحويل نتائج الاستعلام إلى الشكل المطلوب
  const results = queryResponse.matches.map(match => ({
    pageContent: match.metadata.pageContent,
    metadata: match.metadata
  }));

  console.log(results);
  return results;
}

export default search