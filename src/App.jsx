import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Quiz from './components/Quiz';
import {isLoaded} from './hooks/useQuiz';
function App() {
   return (
    <div className="app min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-4 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Animated Heading */}
        <div className="heading-container mb-5 text-center">
          <div className={`relative inline-block ${isLoaded ? 'animate-bounce-in' : ''}`}>
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 mb-2">
              Quiz Master
            </h1>
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 rounded-full transform scale-x-0 animate-expand"></div>
          </div>
          <p className="text-gray-600 mt-3 italic text-lg">Test your General knowledge!</p>
        </div>
        
        {/* Quiz Component */}
        <Quiz />
      </div>
    </div>
  );
}

export default App
