/**
 * What the lesson page reads and writes: the course around a lesson, the
 * learner's progress through it, its discussion thread and its quiz.
 * Implementation lives in `lib/`.
 */
export {
  flattenCourseLessons,
  getCourseWithDetails,
  getLessonById,
  getModuleById,
  getUserById,
} from "./lib/course.server";
export {
  calculateWatchProgress,
  getLastWatchPosition,
  getLessonProgress,
  getLessonProgressForCourse,
  markLessonComplete,
  markLessonInProgress,
} from "./lib/progress.server";
export {
  getCommentById,
  getLessonThread,
  renderThread,
} from "./lib/thread.server";
export {
  computeResult,
  getBestAttempt,
  getQuizById,
  getQuizByLessonId,
  getQuizWithQuestions,
} from "./lib/quiz.server";
