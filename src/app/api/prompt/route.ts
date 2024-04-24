import { NextRequest } from 'next/server'

import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { SerpAPILoader } from 'langchain/document_loaders/web/serpapi'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents'
import { createRetrievalChain } from 'langchain/chains/retrieval'

// const tools = [new DuckDuckGoSearch({ maxResults: 3 })]

const llm = new ChatOpenAI({
  model: 'gpt-4',
  apiKey: process.env.OPENAI_API_KEY,
  temperature: 0,
})
const embeddings = new OpenAIEmbeddings()

export async function POST(req: NextRequest) {
  const data = await req.json()
  const input = data.input

  // Define your question and query

  // const query = 'Your query here'

  // Use SerpAPILoader to load web search results
  const loader = new SerpAPILoader({
    q: input,
    apiKey: process.env.SERP_API_KEY,
  })
  const docs = await loader.load()
  const vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings)

  // const prompt = await pull<ChatPromptTemplate>(
  //   'hwchase17/openai-functions-agent'
  // )
  const questionAnsweringPrompt = ChatPromptTemplate.fromMessages([
    [
      'system',
      "Answer the user's questions based on the below context:\n\n{context}",
    ],
    ['human', '{input}'],
  ])
  const combineDocsChain = await createStuffDocumentsChain({
    llm,
    prompt: questionAnsweringPrompt,
  })

  const chain = await createRetrievalChain({
    retriever: vectorStore.asRetriever(),
    combineDocsChain,
  })

  try {
    const result = await chain.invoke({
      input,
    })
    // console.log('result', result)
    return Response.json({ result })
  } catch (err: any) {
    return new Response(err, {
      status: 400,
    })
  }
}
