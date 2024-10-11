import React, { useState, useEffect } from 'react'
import { FaHeart, FaTrophy, FaRedo } from 'react-icons/fa'

const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'cyan', 'indigo']

const App = () => {
  const [darkMode, setDarkMode] = useState(false)
  const [selectedColor, setSelectedColor] = useState(null)
  const [lives, setLives] = useState(3)
  const [score, setScore] = useState(0)
  const [sequence, setSequence] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [highScore, setHighScore] = useState(0)
  const [userClicked, setUserClicked] = useState(false)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  useEffect(() => {
    let timer
    if (isPlaying && !gameOver) {
      timer = setTimeout(() => {
        selectNextColor()
        setUserClicked(false)
      }, 600)
    }
    return () => clearTimeout(timer)
  }, [isPlaying, gameOver, currentIndex])

  useEffect(() => {
    const storedHighScore = localStorage.getItem('highScore')
    if (storedHighScore) {
      setHighScore(parseInt(storedHighScore))
    }
  }, [])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const selectNextColor = () => {
    if (currentIndex >= sequence.length) {
      addToSequence()
    } else {
      setSelectedColor(sequence[currentIndex])
      setCurrentIndex(prevIndex => prevIndex + 1)
      setTimeout(() => {
        setSelectedColor(null)
      }, 400)
    }
  }

  const addToSequence = () => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)]
    setSequence(prevSequence => [...prevSequence, randomColor])
    setCurrentIndex(0)
    setSelectedColor(randomColor)
  /
    setTimeout(() => {
      setSelectedColor(null)
    }, 400)
  }

  const handleColorClick = (color) => {
    if (!isPlaying || gameOver) return

    setUserClicked(true)

    if (color === sequence[currentIndex - 1]) {
      setScore(prevScore => prevScore + 1)
      if (currentIndex === sequence.length) {
        setTimeout(selectNextColor, 300)
      }
    } else {
      setLives(prevLives => prevLives - 1)
      if (lives === 1) {
        endGame()
      }
    }
  }

  const startGame = () => {
    setSequence([])
    setCurrentIndex(0)
    setLives(3)
    setScore(0)
    setGameOver(false)
    setIsPlaying(true)
    setUserClicked(false)
    addToSequence()
  }

  const endGame = () => {
    setGameOver(true)
    setIsPlaying(false)
    if (score > highScore) {
      setHighScore(score)
      localStorage.setItem('highScore', score.toString())
    }
  }

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8 md:mb-10">Simon Says</h1>
      <div className="flex justify-between w-full max-w-sm sm:max-w-md md:max-w-lg mb-6">
        <div className="flex items-center">
          {[...Array(lives)].map((_, index) => (
            <FaHeart key={index} className="text-red-500 mr-1 text-lg sm:text-xl md:text-2xl" />
          ))}
        </div>
        <div className="text-xl sm:text-2xl md:text-3xl font-semibold">
          Score: {score}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mb-8 sm:mb-10">
        {colors.map((color) => (
          <button
          key={color}
          onClick={() => handleColorClick(color)}
          disabled={!isPlaying || gameOver}
          className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full transition-all hover:scale-105 
            ${color === 'red' ? `bg-red-500 ${!userClicked ? 'focus:ring-red-300' : ''} ${darkMode ? 'dark:bg-red-700' : ''}` :
            color === 'blue' ? `bg-blue-500 ${!userClicked ? 'focus:ring-blue-300' : ''} ${darkMode ? 'dark:bg-blue-700' : ''}` :
            color === 'green' ? `bg-green-500 ${!userClicked ? 'focus:ring-green-300' : ''} ${darkMode ? 'dark:bg-green-700' : ''}` :
            color === 'yellow' ? `bg-yellow-500 ${!userClicked ? 'focus:ring-yellow-300' : ''} ${darkMode ? 'dark:bg-yellow-600' : ''}` :
            color === 'purple' ? `bg-purple-500 ${!userClicked ? 'focus:ring-purple-300' : ''} ${darkMode ? 'dark:bg-purple-700' : ''}` :
            color === 'orange' ? `bg-orange-500 ${!userClicked ? 'focus:ring-orange-300' : ''} ${darkMode ? 'dark:bg-orange-700' : ''}` :
            color === 'pink' ? `bg-pink-500 ${!userClicked ? 'focus:ring-pink-300' : ''} ${darkMode ? 'dark:bg-pink-700' : ''}` :
            color === 'cyan' ? `bg-cyan-500 ${!userClicked ? 'focus:ring-cyan-300' : ''} ${darkMode ? 'dark:bg-cyan-700' : ''}` :
            `bg-indigo-500 ${!userClicked ? 'focus:ring-indigo-300' : ''} ${darkMode ? 'dark:bg-indigo-700' : ''}`
            } 
            ${selectedColor === color ? 'ring-4 ring-white dark:ring-gray-300 scale-110' : ''} 
            ${(!isPlaying || gameOver) ? 'opacity-50 cursor-not-allowed' : ''} 
            focus:outline-none`}
          />
        
        ))}
      </div>
      <button
        onClick={startGame}
        disabled={isPlaying && !gameOver}
        className={`px-6 sm:px-7 md:px-8 py-3 sm:py-3.5 md:py-4 text-lg sm:text-xl md:text-2xl rounded-lg font-semibold transition-colors focus:outline-none focus:ring-4 focus:ring-opacity-50 focus:ring-gray-500 ${
          darkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'
        } ${isPlaying && !gameOver ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {gameOver ? 'Play Again' : isPlaying ? 'Game in Progress' : 'Start Game'}
      </button>
      <button
        onClick={toggleDarkMode}
        className={`mt-6 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 text-sm sm:text-base md:text-lg rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-gray-500 ${
          darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-300 text-black hover:bg-gray-400'
        }`}
      >
        {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      </button>
      {gameOver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className={`bg-gradient-to-br from-purple-600 to-blue-500 p-8 rounded-lg shadow-lg text-center text-white`}>
            <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
            <div className="flex justify-center items-center mb-6">
              <FaTrophy className="text-yellow-400 text-4xl mr-3" />
              <p className="text-2xl">Your score: <span className="font-bold text-yellow-300">{score}</span></p>
            </div>
            <p className="text-xl mb-6">High Score: <span className="font-bold text-green-300">{highScore}</span></p>
            <button
              onClick={startGame}
              className="px-6 py-3 text-lg rounded-lg font-semibold transition-colors focus:outline-none focus:ring-4 focus:ring-opacity-50 focus:ring-white bg-white text-purple-600 hover:bg-gray-200 flex items-center justify-center mx-auto"
            >
              <FaRedo className="mr-2" /> Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App