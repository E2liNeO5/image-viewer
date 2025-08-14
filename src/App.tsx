import './App.css'
import ImageItem from './ImageItem'

const IMAGES_URL = [
  "/images/pic1.png",
  "/images/pic2.jpg",
  "/images/pic3.jpg"
]

function App() {

  return (
    <div className="container">
      { IMAGES_URL.map(img => <ImageItem key={img} imageUrl={img} />) }
    </div>
  )
}

export default App
