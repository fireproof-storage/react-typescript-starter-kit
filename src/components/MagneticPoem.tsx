import { useState } from 'react'
import { words } from './words'
import Draggable from 'react-draggable'
import { DraggableData, DraggableEvent } from 'react-draggable'

export function MagneticPoem() {
  const [isAnimating, setIsAnimating] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const [myWords, setMyWords] = useState(
    Object.keys(words)
      .sort(() => 0.5 - Math.random())
      .slice(0, 10)
      .map((word, index) => {
        const position = {
          x: 30 + (index % 4) * (95 + Math.random() * 10),
          y: 50 + (index / 4) * (95 + Math.random() * 20)
        }
        return { word, position }
      })
  )

  const handleStop = (index: number, _e: DraggableEvent, data: DraggableData) => {
    const { x, y } = data
    console.log(x, y)
    const outOfBounds = x < 0 || y < 0 || x > 380 || y > 380 // adjust these values based on the size of your board
    setActiveIndex(index)

    if (outOfBounds) {
      setIsAnimating(true)
      setTimeout(() => {
        const newWords = [...myWords]
        newWords[index].position = { x: 190, y: 190 } // reset position to the middle of the board
        setMyWords(newWords)
        setIsAnimating(false)
      }, 500) // delay should match the duration of your CSS transition
    } else {
      setIsAnimating(false)
      const newWords = [...myWords]
      newWords[index].position = { x, y }
      setMyWords(newWords)
    }
  }

  return (
    <div
      className="bg-blue-500 text-white p-6 m-6 rounded-lg shadow-lg"
      style={{ width: '512px', height: '512px', position: 'relative' }}
    >
      <h2 className="text-4xl font-bold mb-2">Magnetic Poem</h2>
      <div className="flex flex-wrap ">
        {myWords.map((item, index) => (
          <Draggable position={item.position} onStart={() => setActiveIndex(index)} onStop={(e, data) => handleStop(index, e, data)}>
            <div
              className="m-2 p-2 bg-white text-black rounded-lg shadow-lg"
              style={{
                position: 'absolute',
                transition: isAnimating ? 'all 0.5s ease-in-out' : 'none',
                zIndex: index === activeIndex ? 2 : 1 // Apply a higher z-index if this is the active word
              }}
            >
              {item.word}
            </div>
          </Draggable>
        ))}
      </div>
    </div>
  )
}
