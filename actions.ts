'use server'

import { DuckDuckGoSearch } from '@langchain/community/tools/duckduckgo_search'

// const tool = new DuckDuckGoSearch({ maxResults: 3 })

type FormState = {
  search: string
  result: any
}

async function searchWithDuckDuckGoSearch(
  prevState: FormState,
  formData: FormData
) {
  const search = formData.get('search')
  if (!search) return
  // const resultString = await tool.invoke(search as string)
  const data = await fetch(`${process.env.SITE_URL}/api/prompt`, {
    method: 'POST',
    body: JSON.stringify({
      input: search,
    }),
  })
  // const result = JSON.parse(resultString)
  const result = await data.json()
  // process the links here
  let sources: string[] = []
  console.log('result', result)
  if (result.result.context) {
    console.log('there is result context')
    for await (const context of result.result.context) {
      console.log('context', context)
      const jsonContext = JSON.parse(context.pageContent)
      const url = jsonContext.link
      console.log('url', url)
      const source = await fetch(`${process.env.SITE_URL}/api/proxy`, {
        method: 'POST',
        body: JSON.stringify({
          url,
        }),
      })
      const s = await source.json()
      console.log('s', s)
      sources.push(s)
    }
  }
  console.log('sources', sources)
  return {
    search,
    result: result.result,
    sources,
  }
}

export { searchWithDuckDuckGoSearch }
