import Link from 'next/link'
import React, { useState } from 'react'

interface ImageHoverInterface {
  url: string
  metaTitle: string
  metaImage: string
}
const ImageHover = ({ url, metaTitle, metaImage }: ImageHoverInterface) => {
  const [isHovering, setIsHovering] = useState(false)
  return (
    <Link
      href={url}
      className="max-w-[250px] object-cover max-h-[100px] relative"
      onMouseOver={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="absolute top-1/2 left-0 text-xs">{metaTitle}</div>
      <img
        src={metaImage}
        alt={url}
        className={`w-full h-full object-cover  ${
          isHovering ? 'bg-black opacity-30' : 'opacity-100'
        }`}
      />
    </Link>
  )
}

export default ImageHover
