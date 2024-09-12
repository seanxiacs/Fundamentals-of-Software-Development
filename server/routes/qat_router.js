const express = require('express');
const router = express.Router();
const QATController = require('../controllers/qat_controller.js')

// All Questions Page
router.get('/questions', QATController.getAllQuestions)
router.get('/questions/newest', QATController.sortNewest)
router.get('/questions/active', QATController.sortActive)
router.get('/questions/unanswered', QATController.sortUnanswered)

// Question Answers Page: Questions
router.get('/questions/:questionId', QATController.getQuestionById);
router.get('/questions/:questionId/view', QATController.incrementViewCountById);

// Question Answers Page: Answers
router.get('/questions/:questionId/answers', QATController.getAllAnswersForQuestion);
router.get('/questions/:questionId/answers/newest', QATController.getAllAnswerIdsForQuestionSortNewest); //THIS IS DIFFERENT FROM THE OLD HW3 VERSION I HAVE
router.get('/questions/:questionId/tags', QATController.getAllTagsForQuestion); // New route for getting all tags for a question

// All Tags Page
router.get('/tags', QATController.getAllTags); // New route for getting all tags
router.get('/tags/:tagId', QATController.getTagById); // New route for getting tag by ID
router.get('/tags/:tagId/number', QATController.numberQuestionsWithTag);

// Miscellaneous Answers Getters
router.get('/answers', QATController.getAllAnswers)
router.get('/answers/:answerId', QATController.getAnswerById);

//Search Questions Page
router.get('/search', QATController.searchByCriteria);
router.get('/search/newest', QATController.searchByCriteriaSortNewest); //ADDED
router.get('/search/active', QATController.searchByCriteriaSortActive); //ADDED
router.get('/search/unanswered', QATController.searchByCriteriaSortUnanswered); //ADDED

// Create Questions Page
router.post('/questions', QATController.createQuestion)

// Post Answer Page
router.post('/questions/:questionId/answer', QATController.postAnswerToQuestion);



// increaseQuestionVoteCountAndUserReputationById, //Not done yet Logged in and rep > 50
//   decreaseQuestionVoteCountAndUserReputationById, //Not done yet Logged in and rep > 50
//   increaseAnswerVoteCountAndUserReputationById, //Not done yet Logged in and rep > 50
//   decreaseAnswerVoteCountAndUserReputationById, //Not done yet Logged in and rep > 50
//   increaseCommentVoteCountById, //Not done yet Logged in is only requirement, does not increase reputation and there is no decrease vote on comments

// router.get('/question/:questionId', QATController.getQuestionById); // New route for getting question by ID
// router.get('/question/:questionId/view', QATController.incrementViewCountById); // New route for incrementing view count
router.get('/questions/:questionId/upvote', QATController.increaseQuestionVoteCountAndUserReputationById);
router.get('/questions/:questionId/downvote', QATController.decreaseQuestionVoteCountAndUserReputationById);
router.get('/answerss/:answerId/upvote', QATController.increaseAnswerVoteCountAndUserReputationById)
router.get('/answerss/:answerId/downvote', QATController.decreaseAnswerVoteCountAndUserReputationById)
router.get('/comments/:commentId/upvote', QATController.increaseCommentVoteCountById)


// getAllCommentsForQuestion, //Not done yet //Done now I think?
// getAllCommentIdsForQuestionSortNewest, //Not done yet //Done now I think?
// getAllCommentsForAnswer, //Not done yet //Done now I think?
// getAllCommentIdsForAnswerSortNewest, //Not done yet //Done now I think? 

// router.get('/question/:questionId/answers', QATController.getAllAnswersForQuestion);
// router.get('/question/:questionId/answers/newest', QATController.getAllAnswerIdsForQuestionSortNewest);
// router.get('/question/:questionId/tags', QATController.getAllTagsForQuestion); // New route for getting all tags for a question
router.get('/questions/:questionId/comments', QATController.getAllCommentsForQuestion);
router.get('/questions/:questionId/comments/newest', QATController.getAllCommentIdsForQuestionSortNewest);
router.get('/answers/:answerId/comments', QATController.getAllCommentsForAnswer);
router.get('/answers/:answerId/comments/newest', QATController.getAllCommentIdsForAnswerSortNewest);


router.post('/questions/:questionId/comment', QATController.postCommentToQuestion);
router.post('/answerss/:answerId/comment', QATController.postCommentToAnswer);

router.get('/comments/:commentId', QATController.getCommentById); // New route for getting question by ID


module.exports = router;