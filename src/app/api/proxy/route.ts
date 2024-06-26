// pages/api/proxy.js
import axios from 'axios'
import { NextRequest } from 'next/server'
import cheerio from 'cheerio'

export async function POST(req: NextRequest) {
  const data = await req.json()
  const url = data.url
  if (!url) return
  try {
    // Make an HTTP request to the external URL
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'topbar', // Some sites require a user agent header
      },
    })
    // console.log('response', response.data)
    const $ = cheerio.load(response.data)
    console.log('$', $)
    const metaTitle =
      $('meta[property="og:title"]').attr('content') || $('title').text()
    const metaDescription =
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="description"]').attr('content')
    const metaImage = $('meta[property="og:image"]').attr('content')
    console.log('metaTitle', metaTitle)
    console.log('metaDescription', metaDescription)
    console.log('metaImage', metaImage)
    // Send back the HTML content

    return Response.json({ metaTitle, metaDescription, metaImage, url })
  } catch (error) {
    console.error('Error fetching data:', error)
    return new Response('Failed to fetch data', {
      status: 400,
    })
  }
}
