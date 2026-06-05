import * as discussionRepo from "../../repositories/discussion.repository";
import * as qaRepo from "../../repositories/qa.repository";

export const getDiscussionsList = discussionRepo.getDiscussionsList;
export const getDiscussionThread = discussionRepo.getDiscussionThread;
export const getQuestionsForLesson = qaRepo.getQuestionsForLesson;
export const getQuestionsForTeacher = qaRepo.getQuestionsForTeacher;
