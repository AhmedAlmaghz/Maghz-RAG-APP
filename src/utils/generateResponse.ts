import { GoogleGenerativeAI } from '@google/generative-ai'

const generateResponse = async (query: string, context: string) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' })

  const prompt = `
    Context: ${context}
    
    User Query: ${query}
    
    Please provide a detailed response based on the given context and user query. Format the response using Markdown for better readability.
  `

  const result = await model.generateContent(prompt)
  const response = await result.response
  return response.text()
}

export default generateResponse