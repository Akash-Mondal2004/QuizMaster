import { useReducer, useState } from "react";
import { quizReducer } from "../reducers/quizReducer";
import { quizData } from "../data/quizData";

export const initialState = {
  status: "question",
  currentQuestionIndex: 0,
  answers: Array(quizData.length).fill(null),
  score: 0,
};
export const isLoaded = true; // This can be used to control loading state in the UI
export function useQuiz() {
  const [state, dispatch] = useReducer(quizReducer, initialState);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  return { state, dispatch, selectedAnswer, setSelectedAnswer };
}