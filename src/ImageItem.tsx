import { memo, useState } from 'react'
import './App.css'
import ImageViewer from './ImageViewer/ImageViewer'

type Props = {
  imageUrl: string
}

function ImageItem({ imageUrl }: Props) {
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false)  

  return (
    <>
      <img src={imageUrl} alt="picture" onClick={() => setIsImageViewerOpen(true)} />
      { isImageViewerOpen && <ImageViewer imageUrl={imageUrl} onClose={() => setIsImageViewerOpen(false)} /> }
    </>
  )
}

export default memo(ImageItem)
