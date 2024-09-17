import { ChatGoogleGenerativeAI } from '@langchain/google-genai'

const generateResponse = async (query: string, context: string) => {
  const genAI = new ChatGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY!,
    modelName: 'gemini-1.5-pro'
  })

  const prompt = `
    السياق: ${context}
    
    استفسار المستخدم: ${query}
    
    يرجى تقديم إجابة مفصلة بناءً على السياق المعطى واستفسار المستخدم. قم بتنسيق الإجابة باستخدام Markdown لتحسين القراءة.
  `

  const result = await genAI.invoke(prompt)
  return result
}

export default generateResponse