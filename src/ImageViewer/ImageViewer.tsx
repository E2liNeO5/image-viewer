import { createPortal } from 'react-dom'
import styles from './ImageViewer.module.scss'
import { useEffect, useState, MouseEvent, WheelEvent, useRef, useCallback, DragEvent } from 'react'
import { RotateCcw, X } from 'lucide-react'

type Props = {
  imageUrl: string
  onClose: () => void
}

const ImageViewer = ({ imageUrl, onClose }: Props) => {
  const [imageSize, setImageSize] = useState('')
  
  const ref = useRef<HTMLImageElement>(null)
  const refImageState = useRef({
    grab: false,
    scale: 1,
    startX: 0,
    startY: 0,
    x: 0,
    y: 0
  })

  useEffect(() => {
    var img = new Image
    img.src = imageUrl
    img.onload = async () => {
      if(img.width > img.height)
        setImageSize(styles.size_by_width)
      else
        setImageSize(styles.size_by_height)
    }

    const wheelHandler = (e: WheelEvent): any => {
      if(ref && ref.current) {
        e.preventDefault()
        const delta = e.deltaY > 0 ? -1 : 1
        if(delta < 0 && +(refImageState.current.scale - 0.1 * delta).toFixed(1) >= 0.5 || delta > 0)
          refImageState.current.scale += 0.1 * delta
        ref.current.style.transform = `translateX(${refImageState.current.x}px) translateY(${refImageState.current.y}px) scale(${refImageState.current.scale})`
      }
    }

    if(ref && ref.current)
      ref.current.addEventListener('wheel', wheelHandler) // хз как решать

    return () => {
      ref.current?.removeEventListener('wheel', wheelHandler) // аналогично
    }

  }, [ref, imageUrl])

  const resetImageStyle = useCallback(() => {
    if(ref && ref.current) {
      refImageState.current = {
        grab: false,
        scale: 1,
        startX: 0,
        startY: 0,
        x: 0,
        y: 0
      }
      ref.current.style.transform = `translateX(${refImageState.current.x}px) translateY(${refImageState.current.y}px) scale(${refImageState.current.scale})`
    }
  }, [ref, imageUrl])

  const mouseDownHandler = (e: MouseEvent<HTMLImageElement>) => {
    refImageState.current.grab = true
    refImageState.current.startX = e.clientX - refImageState.current.x
    refImageState.current.startY = e.clientY - refImageState.current.y
  }

  const mouseMoveHandler = (e: MouseEvent<HTMLImageElement>) => {
    if(ref && ref.current && refImageState.current.grab) {
      refImageState.current.x = e.clientX - refImageState.current.startX
      refImageState.current.y = e.clientY - refImageState.current.startY
      ref.current.style.transform = `translateX(${refImageState.current.x}px) translateY(${refImageState.current.y}px) scale(${refImageState.current.scale})`
    }
  }

  return createPortal(
    <div className={styles.wrapper} onClick={onClose}>
      <div
        className={styles.image_container}
        onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        <div className={styles.buttons}>
          <RotateCcw className={styles.btn} onClick={resetImageStyle} />
          <X className={styles.btn} onClick={onClose} />
        </div>
        
        <img
          src={imageUrl}
          alt="image_viewer" className={imageSize}
          ref={ref}
          onMouseDown={mouseDownHandler}
          onMouseUp={() => refImageState.current.grab = false}
          onDragStart={(e: DragEvent<HTMLImageElement>) => e.preventDefault()}
          onMouseMove={mouseMoveHandler}
        />
      </div>
    </div>
  , document.body)
}

export default ImageViewer