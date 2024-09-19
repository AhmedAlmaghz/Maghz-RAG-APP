import { ChatGoogleGenerativeAI } from '@langchain/google-genai'

const generateResponse = async (query: string, context: string) => {
  const genAI = new ChatGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
    modelName: process.env.GEMINI_MODEL,
    maxOutputTokens: process.env.MAX_OUT_TOKEN,
  })

  // السياق: ${context}
  const prompt = `
    السياق: ${context}
 
    استفسار المستخدم: ${query}
    
    يرجى تقديم إجابة مفصلة بناءً على السياق المعطى واستفسار المستخدم. قم بتنسيق الإجابة باستخدام Markdown لتحسين القراءة.
  `

  const result = await genAI.invoke(prompt)
  return result.content
}

export default generateResponse