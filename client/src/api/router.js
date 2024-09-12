import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/routes', // Update the base URL to match your server configuration
});

// All Questions Page
export const getAllQuestions = () => api.get('/questions');
export const getAllQuestionsNewest = () => api.get('/questions/newest');
export const getAllQuestionsActive = () => api.get('/questions/active');
export const getAllQuestionsUnanswered = () => api.get('/questions/unanswered');

// Question Answers Page: Questions
export const getQuestionById = (questionId) => api.get(`/questions/${questionId}`);
export const incrementViewCountById = (questionId) => api.get(`/questions/${questionId}/view`);

// Question Answers Page: Answers
export const getAllAnswersForQuestion = (questionId) => api.get(`/questions/${questionId}/answers`);
export const getAllAnswerIdsForQuestionSortNewest = (questionId) => api.get(`/questions/${questionId}/answers/newest`); //ONE MISSING HERE DONE
export const getAllTagsForQuestion = (questionId) => api.get(`/questions/${questionId}/tags`);

// All Tags Page
export const getAllTags = () => api.get('/tags');
export const getTagById = (tagId) => api.get(`/tags/${tagId}`);
export const numberQuestionsWithTag = (tagId) => api.get(`/tags/${tagId}/number`);

// Miscellaneous Answers Getters
export const getAllAnswers = () => api.get('/answers');
export const getAnswerById = (answerId) => api.get(`/answers/${answerId}`);

//Search Questions Page
// export const searchByCriteria = (searchString) => api.get('/search', ${searchString});// export const searchByCriteria = (params) => api.get('/search', { params });
export const searchByCriteria = (searchString) => api.get(`/search?searchString=${searchString}`);
export const searchByCriteriaSortNewest = (searchString) => api.get(`/search/newest?searchString=${searchString}`);
export const searchByCriteriaSortActive = (searchString) => api.get(`/search/active?searchString=${searchString}`);
export const searchByCriteriaSortUnanswered = (searchString) => api.get(`/search/unanswered?searchString=${searchString}`);

// Create Questions Page
export const createQuestion = (payload) => api.post('/questions', payload);

// Post Answer Page
export const postAnswerToQuestion = (questionId, payload) => api.post(`/questions/${questionId}/answer`, payload);





// export const getAllAnswerIdsForQuestionNewest = (questionId) => api.get(`/question/${questionId}/answers/newest`);


// VOTE
export const increaseQuestionVoteCountAndUserReputationById = (questionId, payload) => api.get(`/questions/${questionId}/upvote`);
export const decreaseQuestionVoteCountAndUserReputationById = (questionId, payload) => api.get(`/questions/${questionId}/downvote`);
export const increaseAnswerVoteCountAndUserReputationById = (answerId, payload) => api.get(`/answers/${answerId}/upvote`);
export const decreaseAnswerVoteCountAndUserReputationById = (answerId, payload) => api.get(`/answers/${answerId}/downvote`);
export const increaseCommentVoteCountById = (commentId, payload) => api.get(`/comments/${commentId}/upvote`);

// COMMENTS
export const getCommentById = (commentId) => api.get(`/comments/${commentId}`);
export const getAllCommentsForQuestion = (questionId) => api.get(`/questions/${questionId}/comments`);
export const getAllCommentIdsForQuestionNewest = (questionId) => api.get(`/questions/${questionId}/comments/newest`);
export const getAllCommentsForAnswer = (answerId) => api.get(`/answers/${answerId}/comments`);
export const getAllCommentIdsForAnswerNewest = (answerId) => api.get(`/answers/${answerId}/comments/newest`);

export const postCommentToQuestion = (questionId, payload) => api.post(`/questions/${questionId}/comment`, payload);
export const postCommentToAnswer = (answerId, payload) => api.post(`/answers/${answerId}/comment`, payload);


// ACCOUNTS

//Create Account
export const createAccount = (payload) => api.post('/account', payload);

//Get Account
export const getAllAccountsEmail = () => api.get('/account/email');

// Login
export const loginUser = (payload) => api.post('/account/login', payload);

// Get User Data
export const getUserData = (token) => api.get(`/account/token?token=${token}`);

//Get PasswordByAccountId
//export const getPasswordByEmail = (questionId) => api.get(`/question/${questionId}`);




const apis = {
    getAllQuestions,
    getAllQuestionsNewest,
    getAllQuestionsActive,
    getAllQuestionsUnanswered,

    getQuestionById,
    incrementViewCountById, 
    
    getAllAnswersForQuestion,
    getAllAnswerIdsForQuestionSortNewest,
    getAllTagsForQuestion,

    getAllTags,
    getTagById,
    numberQuestionsWithTag,

    getAllAnswers,
    getAnswerById,

    searchByCriteria,
    searchByCriteriaSortNewest,
    searchByCriteriaSortActive,
    searchByCriteriaSortUnanswered,

    createQuestion,
    
    postAnswerToQuestion,

    increaseQuestionVoteCountAndUserReputationById,
    decreaseQuestionVoteCountAndUserReputationById,
    increaseAnswerVoteCountAndUserReputationById,
    decreaseAnswerVoteCountAndUserReputationById,
    increaseCommentVoteCountById,

    getCommentById,
    getAllCommentsForQuestion,
    getAllCommentIdsForQuestionNewest,
    getAllCommentsForAnswer,
    getAllCommentIdsForAnswerNewest,

    postCommentToQuestion,
    postCommentToAnswer,

    createAccount,
    loginUser,
    getUserData,
    getAllAccountsEmail,
};

export default apis;