import { useState, useEffect } from "react";
import { useQuiz } from "../hooks/useQuiz";
import { quizData } from "../data/quizData";
import { motion, AnimatePresence } from "framer-motion";

// Animation variants
const questionVariants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 }
};

const resultVariants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 200, 
      damping: 10 
    }
  }
};

const Quiz = () => {
  const { state, dispatch, selectedAnswer, setSelectedAnswer } = useQuiz();
  const [feedback, setFeedback] = useState(null);
  const [animationComplete, setAnimationComplete] = useState(true);

  // Sound effects
  const playSound = (type) => {
    const audio = new Audio();
    audio.src = type === "correct" 
      ? "/sounds/correct.mp3" 
      : "/sounds/incorrect.mp3";
    audio.volume = 0.3;
    audio.play().catch(err => console.log("Audio play error:", err));
  };

  // Handle answer selection
  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };
  
  // Handle answer submission
  const handleSubmit = () => {
    if (selectedAnswer === null) return; // Don't proceed if no answer selected
    
    // Check if answer is correct
    const isCorrect = selectedAnswer === quizData[state.currentQuestionIndex].correctAnswer;
    
    // Show feedback
    setFeedback(isCorrect ? "correct" : "incorrect");
    
    // Play sound (if available)
    playSound(isCorrect ? "correct" : "incorrect");
    
    // Dispatch answer action
    dispatch({ 
      type: "ANSWER", 
      payload: { answer: selectedAnswer } 
    });
    
    // Clear feedback and move to next question after delay
    setTimeout(() => {
      setFeedback(null);
      setAnimationComplete(false);
      dispatch({ type: "NEXT" });
      setSelectedAnswer(null);
      setTimeout(() => setAnimationComplete(true), 100);
    }, 1000);
  };

  // Handle quiz restart
  const handleRestart = () => {
    dispatch({ type: "RESET" });
  };

  // Calculate progress percentage
  const progressPercentage = ((state.currentQuestionIndex) / quizData.length) * 100;

  return (
    <div className="quiz-container max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-xl">
      {/* Quiz Status */}
      {state.status === "question" && (
        <>
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Question {state.currentQuestionIndex + 1} of {quizData.length}</span>
              <span>{Math.round(progressPercentage)}% Complete</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-blue-500"
                initial={{ width: `${(state.currentQuestionIndex / quizData.length) * 100}%` }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
          
          {/* Question */}
          <AnimatePresence mode="wait">
            {animationComplete && (
              <motion.div
                key={state.currentQuestionIndex}
                variants={questionVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.4 }}
                className="question-container"
              >
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                  {quizData[state.currentQuestionIndex].question}
                </h2>
                
                {/* Answer Options */}
                <div className="space-y-3">
                  {quizData[state.currentQuestionIndex].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(option)}
                      disabled={feedback !== null}
                      className={`w-full p-4 text-left rounded-lg transition-all duration-200 ${
                        selectedAnswer === option
                          ? feedback === "correct"
                            ? "bg-green-100 border-2 border-green-500 text-green-700"
                            : feedback === "incorrect"
                              ? "bg-red-100 border-2 border-red-500 text-red-700"
                              : "bg-blue-100 border-2 border-blue-500 text-blue-700"
                          : "bg-gray-100 hover:bg-gray-200 border-2 border-transparent"
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="w-6 h-6 rounded-full flex items-center justify-center mr-3 bg-white border-2 border-gray-300">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="font-medium">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
                
                {/* Submit Button */}
                <div className="mt-6">
                  <button
                    onClick={handleSubmit}
                    disabled={selectedAnswer === null || feedback !== null}
                    className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors 
                      ${selectedAnswer === null || feedback !== null 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-blue-500 hover:bg-blue-600'}`}
                  >
                    {feedback !== null ? 'Processing...' : 'Submit Answer'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* Results */}
      {state.status === "results" && (
        <motion.div
          variants={resultVariants}
          initial="initial"
          animate="animate"
          className="results-container text-center py-8"
        >
          <h2 className="text-3xl font-bold mb-2 text-gray-800">Quiz Completed!</h2>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-8"
          >
            <p className="text-lg text-gray-600 mb-4">
              You scored:
            </p>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 200, 
                delay: 0.5 
              }}
              className="score-display"
            >
              <div className="inline-flex items-center justify-center w-36 h-36 rounded-full bg-blue-100 border-4 border-blue-500">
                <div className="text-center">
                  <span className="block text-4xl font-bold text-blue-600">{state.score}</span>
                  <span className="block text-blue-600">out of {quizData.length}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Answers Review */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="answers-review mt-8 text-left"
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Your Answers:</h3>
            <div className="space-y-3">
              {quizData.map((question, index) => (
                <div key={index} className="p-4 rounded-lg bg-gray-50">
                  <p className="font-medium text-gray-800">{index + 1}. {question.question}</p>
                  <div className="mt-2 flex justify-between">
                    <p className="text-sm">
                      <span className="font-medium">Your answer:</span>{" "}
                      <span className={state.answers[index] === question.correctAnswer ? "text-green-600" : "text-red-600"}>
                        {state.answers[index] || "Not answered"}
                      </span>
                    </p>
                    {state.answers[index] !== question.correctAnswer && (
                      <p className="text-sm text-green-600">
                        <span className="font-medium">Correct answer:</span> {question.correctAnswer}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            onClick={handleRestart}
            className="mt-8 px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
          >
            Restart Quiz
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default Quiz;