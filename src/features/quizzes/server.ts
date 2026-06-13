export {
  getQuizByLessonId,
  getQuizWithQuestions,
  createQuiz,
  updateQuizWithQuestions,
  getQuizAttempts,
  createQuizAttempt,
} from "./repositories/quiz.repository";

import { quizzesService as service } from "./services/quiz.service";
export { service };

export { canQuiz, assertQuizAccess } from "./permissions/quiz.permissions";

export {
  quizCreateSchema,
  quizUpdateSchema,
  quizSubmitSchema,
} from "./contracts/quiz.contract";
export type {
  QuizCreateInput,
  QuizUpdateInput,
  QuizSubmitInput,
} from "./contracts/quiz.contract";
