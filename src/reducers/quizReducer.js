import { quizData } from "../data/quizData";
import { initialState } from "../hooks/useQuiz";
//       payload: { answer: selectedAnswer }    
export function quizReducer(state, action) {
  switch (action.type) {
    case "ANSWER":
      const newAnswers = [...state.answers];
      newAnswers[state.currentQuestionIndex] = action.payload.answer;
      const isCorrect = action.payload.answer === quizData[state.currentQuestionIndex].correctAnswer;
      return { ...state, answers: newAnswers, score: isCorrect ? state.score + 1 : state.score };
    case "NEXT":
      return state.currentQuestionIndex === quizData.length - 1 ? { ...state, status: "results" } : { ...state, currentQuestionIndex: state.currentQuestionIndex + 1 };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}