// // server.js
// import express from 'express'
// import dotenv from 'dotenv'
// import { VoyageEmbeddings } from "@langchain/community/embeddings/voyage";
// import { PineconeStore } from '@langchain/pinecone'
// import { Pinecone as PineconeClient } from '@pinecone-database/pinecone'

// dotenv.config()

// const app = express()
// const port = 3001

// app.use(express.json())

// app.post('/search', async (req, res) => {
//   const query = req.body.query

//   // التحقق من وجود متغيرات البيئة
//   console.log('VOYAGE_API_KEY:', process.env.VOYAGE_API_KEY)
//   console.log('PINECONE_API_KEY:', process.env.PINECONE_API_KEY)
//   console.log('PINECONE_ENVIRONMENT:', process.env.PINECONE_ENVIRONMENT)
//   console.log('PINECONE_INDEX:', process.env.PINECONE_INDEX)

//   const embeddings = new VoyageEmbeddings({
//     apiKey: process.env.VOYAGE_API_KEY,
//   })

//   const pinecone = new PineconeClient({
//     apiKey: process.env.PINECONE_API_KEY,
//     // environment: process.env.PINECONE_ENVIRONMENT,
//   })

//   const index = pinecone.Index(process.env.PINECONE_INDEX);

//   const vectorStore = new PineconeStore(embeddings, {
//     pineconeIndex: index,
//   })

//   try {
//     const results = await vectorStore.similaritySearch(query, 5)
//     res.json(results)
//   } catch (error) {
//     console.error('Error during search:', error)
//     res.status(500).json({ error: 'Error during search' })
//   }
// })

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`)
// })

// server.js
import express from 'express'
import dotenv from 'dotenv'
import { VoyageEmbeddings } from "@langchain/community/embeddings/voyage";
import { PineconeStore } from '@langchain/pinecone'
import { Pinecone as PineconeClient } from '@pinecone-database/pinecone'
import cors from 'cors'

dotenv.config()

const app = express()
const port = 3001

app.use(express.json())
app.use(cors()) // تمكين CORS

app.post('/search', async (req, res) => {
  const query = req.body.query

  // التحقق من وجود متغيرات البيئة
  console.log('VOYAGE_API_KEY:', process.env.VOYAGE_API_KEY)
  console.log('PINECONE_API_KEY:', process.env.PINECONE_API_KEY)
  console.log('PINECONE_ENVIRONMENT:', process.env.PINECONE_ENVIRONMENT)
  console.log('PINECONE_INDEX:', process.env.PINECONE_INDEX)

  const embeddings = new VoyageEmbeddings({
    apiKey: process.env.VOYAGE_API_KEY,
  })

  const pinecone = new PineconeClient({
    apiKey: process.env.PINECONE_API_KEY,
    // environment: process.env.PINECONE_ENVIRONMENT,
  })

  const index = pinecone.Index(process.env.PINECONE_INDEX);

  const vectorStore = new PineconeStore(embeddings, {
    pineconeIndex: index,
    maxConcurrency: 5,
  })

  try {
    const results = await vectorStore.maxMarginalRelevanceSearch(query,{k:5})
    // res.json(results)
    console.log(res.json(results))
  } catch (error) {
    console.error('Error during search:', error)
    res.status(500).json({ error: 'Error during search' })
  }
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})