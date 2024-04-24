'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { useFormState } from 'react-dom'
import { searchWithDuckDuckGoSearch } from '../../actions'
import { getLinkPreview, getPreviewFromContent } from 'link-preview-js'
import { useEffect, useState } from 'react'
import { LinkPreview } from '@dhaiwat10/react-link-preview'
import axios from 'axios'
import cheerio from 'cheerio'
import Image from 'next/image'
import Link from 'next/link'
import ImageHover from '@/components/ImageHover'
import { metadata } from './layout'

export default function Home() {
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [state, action] = useFormState(searchWithDuckDuckGoSearch, {
    search: '',
  })

  console.log('state', state)

  return (
    <main className=" p-24 min-h-screen">
      <div className="w-full flex flex-col items-center justify-between lg:flex-row divide-x lg:space-x-12">
        <form className="flex-1 space-y-4" action={action}>
          <Label htmlFor="search">Where knowledge starts hehe</Label>
          <Input name="search" placeholder="Ask Anything..." />
          <Button type="submit">Enter</Button>
        </form>
      </div>
      {state?.sources && (
        <div className="flex flex-col mt-12">
          <div className="text-lg font-medium">Sources</div>
          <div className="lg:grid lg:grid-cols-3 gap-5">
            {state?.result &&
              state?.sources.map((st: any, i: number) => {
                // const pageContent = JSON.parse(st.pageContent)
                // take the link from
                console.log('pageContent', st)
                // const metadata = fetchMetaData(st.link)
                return (
                  <ImageHover
                    key={i}
                    metaImage={st.metaImage}
                    metaTitle={st.metaTitle}
                    url={st.url}
                  />
                  // <Link
                  //   href={st.url}
                  //   key={i}
                  //   className="max-w-[250px] object-cover max-h-[100px] relative"
                  // >
                  //   <div className="absolute top-1/2 left-1/2 ">
                  //     {st.metaTitle}
                  //   </div>
                  //   <img
                  //     src={st.metaImage}
                  //     alt={st.url}
                  //     className="w-full h-full object-cover"
                  //   />
                  // </Link>
                )
              })}
          </div>
        </div>
      )}
      {state?.result && (
        <div className="mt-24">
          <div className="text-lg font-medium">Answer:</div>
          {state.result.answer}
        </div>
      )}
    </main>
  )
}
