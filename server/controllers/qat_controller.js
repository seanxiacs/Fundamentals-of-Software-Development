const Question = require('../models/questions.js')
const Answer = require('../models/answers.js')
const Tag = require('../models/tags.js');
const Comment = require('../models/comments.js');
const Account = require('../models/accounts.js')

const SECRET_KEY = "N+7+MHwin+1E/bVH8zXSPU37F7oPxHX3+oF/pbhoWXR37Yqs1SmgL5mw2AAPn/6TCo5dglSraSdNnMnHKdQKMMFVFJLKtvPXOhMRqZxbBMwxLmoK5nQwlbWggFG1I0azVnuQSkpRNeI2aUs+xlrSmkFChMmD3FwQfM4o7COMHawZIbfAjE9uTHoSZd5sNwOMrTIS6s9PXECIdjMURO3xIa+gLrxR1ji2CFwF+VJn8AzZ9ZgGQqEGc77wDiqzZlB/U9D6gGkNi8TYWxN4J3mgp1eYv9nnE85zQ+q/o3vM6dQWtLiMqoKJieCo4gRCeSanExTOJxrIjwgXkofgk/rK3Q==";

/*
    This is our back-end API. It provides all the data services
    our database needs. Note that this file contains the controller
    functions for each endpoint.
*/

/*
  QUESTIONS
*/
async function getAllQuestions(req, res) {
    // console.log("We are getting all questions by ID")
    try {
        console.log("We are getting all questions by ID")
        // Retrieve all questions from the database
        const questions = await Question.find();
    
        res.json(questions); //res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve questions' });
    }
}

async function sortNewest(req, res) {
    try {
        const questions = await Question.find().sort({ ask_date_time: -1 });
        res.json(questions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to sort questions' });
    }
}
  
async function sortActive(req, res) {
    try {
        const questions = await Question.aggregate([
            {
            $lookup: {
                from: 'answers',
                localField: 'answers',
                foreignField: '_id',
                as: 'answers'
            }
            },
            {
            $addFields: {
                latest_answer_time: { $max: '$answers.ans_date_time' }
            }
            },
            {
            $sort: { latest_answer_time: -1 }
            }
        ]);
    
        res.json(questions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to sort questions' });
    }
}

async function sortUnanswered(req, res) {
    try {
        const unansweredQuestions = await Question.find({ answers: { $size: 0 } });
        res.json(unansweredQuestions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve unanswered questions' });
    }
}

// Question Answers Page
async function getQuestionById(req, res) {
    try {
        const { questionId } = req.params;
        const question = await Question.findById(questionId);
    
        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }
    
        res.json(question);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve question' });
    }
}
  
async function incrementViewCountById(req, res) {
    try {
        const { questionId } = req.params;
        const question = await Question.findById(questionId);
    
        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }
    
        console.log("In incrementViewCountById:", question)
    
        question.views += 1;
        await question.save();
    
        console.log("It managed to save the view increment")
    
        res.json({ message: 'View count incremented successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to increment view count' });
    }
}

async function getAllAnswersForQuestion(req, res) {
    try {
        const { questionId } = req.params;
    
        // Find the question by ID and populate the answers field
        const question = await Question.findById(questionId).populate('answers');
    
        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }
    
        const answers = question.answers;
        res.json(answers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve answers' });
    }
}
  
async function getAllAnswerIdsForQuestionSortNewest(req, res) {
    try {
        console.log("In getAllAnswerIdsForQuestionSortNewest")
        const { questionId } = req.params;
    
        // Find the question by ID and populate the answers field
        const question = await Question.findById(questionId).populate({
            path: 'answers',
            options: { sort: { ans_date_time: -1 } }, // Sort answers by newest
            select: '_id', // Select only the answer IDs
            // model: 'answer', // Specify the model name
        });
    
        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }
    
        // const answer = question.answers;
        const answerIds = question.answers.map(answer => answer._id);
        res.json(answerIds); // res.json(answers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve answerIds and sort by newest' });
    }
}
  
async function getAllTagsForQuestion(req, res) {
    try {
        const { questionId } = req.params;
        const question = await Question.findById(questionId).populate('tags');
    
        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }
    
        const tags = question.tags;
        res.json(tags);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve tags' });
    }
}

// Create Questions Page
async function createQuestion(req, res) {
    try {
        // Extract the question details from the request body
        const { title, text, tags, asked_by, summary } = req.body;

        console.log('title: ', title)
        console.log('text: ', text)
        console.log('tags: ', tags)
        console.log('asked_by: ', asked_by)
        console.log('summary: ', summary)

        const account = await Account.findOne({ username: asked_by })

        console.log("Account: ", account.email);
        /*if (!account) {
            return res.status(404).json({ error: 'You must be logged in to ask a question.' });
        }*/
    
        // Split the tags string into an array
        const tagNames = tags.split(' ');
    
        const tagIds = [];
    
        // // Create tags and collect their ObjectIds
        // for (const tagName of tagNames) {
        //   const tag = new Tag({ name: tagName });
        //   const savedTag = await tag.save();
        //   tagIds.push(savedTag._id);
        // }
        
        // Check if each tag already exists or create a new one
        for (const tagName of tagNames) {
            // Find the tag with the given name
            let tag = await Tag.findOne({ name: { $regex: new RegExp(tagName, 'i') } }); // Tag.findOne({ name: tagName });
    
            // If the tag doesn't exist, create it
            if (!tag) {
                // Check if the account has over 50 reputation
                if (account.reputation < 50) {
                    return res.status(403).json({ error: 'Insufficient reputation (>50) to make a new tag while creating question.' });
                }
                tag = await Tag.create({ name: tagName });
            }
    
            // Add the tag's id to the tagIds list
            tagIds.push(tag._id);
        }
    
        // Create a new question object with the tagIds
        const question = new Question({
            title: title,
            text: text,
            tags: tagIds,
            asked_by: asked_by,
            summary: summary
        });
    
        console.log("New Question: ", question);
    
        // Save the question to the database
        const savedQuestion = await question.save();
    
        res.status(201).json(savedQuestion);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create question' });
    }
} //Done I think?



// Post Answer Page
async function postAnswerToQuestion(req, res) {
    try {
        const { questionId } = req.params;
        const { text, ans_by } = req.body;
    
        // Check if ans_by is a valid Account
        const account = await Account.findOne({ username: ans_by });
        if (!account) {
            return res.status(404).json({ error: 'You must be logged in to post answer to question.' });
        }
    
        // Create a new answer object
        const answer = new Answer({
            text,
            ans_by: account.username
        });
    
        // Save the answer to the database
        const savedAnswer = await answer.save();
    
        // Find the question by ID
        const question = await Question.findById(questionId);
    
        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }
    
        // Add the answer to the answers list of the question
        question.answers.push(savedAnswer._id);
        await question.save();
    
        res.status(201).json(savedAnswer);
    } catch (error) {
        res.status(500).json({ error: 'Failed to post answer' });
    }
}  //Done I think?

  
// All Tags Page
async function getAllTags(req, res) {
    try {
        const tags = await Tag.find();
        res.json(tags);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve tags' });
    }
}

async function getTagById(req, res) {
    try {
    const { tagId } = req.params;
    const tag = await Tag.findById(tagId);

    if (!tag) {
        return res.status(404).json({ error: 'Tag not found' });
    }

    res.json(tag);
    } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve tag' });
    }
}

async function numberQuestionsWithTag(req, res) {
    try {
        const { tagId } = req.params; // get the tag id from the request parameters
        let counter = 0; // initialize a counter variable
    
        const questions = await Question.find(); // retrieve all questions from the database
    
        questions.forEach((question) => {
            if (question.tags.includes(tagId)) {
                counter++; // increment the counter if the tag id is found in the question's tags array
            }
        });
    
        res.json({ count: counter }); // return the count as a JSON response
    } catch (error) {
        res.status(500).json({ error: 'Error getting questions by tag' });
    }
}

// Miscellaneous Answers Getters
async function getAllAnswers(req, res) {
    // console.log("We are getting all questions by ID")
    try {
        console.log("We are getting all answers")
        // Retrieve all questions from the database
        const answers = await Answer.find();
    
        res.json(answers); //res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve questions' });
    }
}
  
async function getAnswerById(req, res) {
    // console.log("We are getting answer by ID")
    try {
        console.log("We are getting answer by ID")
        const { answerId } = req.params;
        const answer = await Answer.findById(answerId);
    
        if (!answer) {
            return res.status(404).json({ error: 'Answer not found' });
        }
    
        res.json(answer);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve answer' });
    }
}

//Search Questions Page
async function searchByCriteria(req, res) {
    try {
        const { searchString } = req.query;
    
        // Split the search string into words and tags
        const searchTerms = searchString.split(' ');
    
        const words = [];
        const tags = [];
    
        // Separate words and tags based on presence of square brackets
        searchTerms.forEach(term => {
            if (term.startsWith('[') && term.endsWith(']')) {
                tags.push(term.slice(1, -1)); // Remove square brackets and add to tags
            } else {
                words.push(term); // Add word to words
            }
        });
    
        console.log("The words are: ", words)
        console.log("The tags are: ", tags)
    
        // V6
        // Construct regex patterns for case-insensitive tag name matching
        const tagRegexes = tags.map(tag => new RegExp(tag, 'i'));
    
        // Find the tags in the database that match the names in the `tags` array
        const tagIds = await Tag.find({ name: { $in: tagRegexes } }).distinct('_id');
    
        console.log("The tagIds are: ", tagIds);
        
        // Create a search query based on words and tags
        let query = {};
    
        if (words.length > 0 && tagIds.length > 0) {
            query = {
                $or: [
                    {
                        $or: words.map(word => ({
                            $or: [
                                { title: { $regex: word, $options: 'i' } },
                                { text: { $regex: word, $options: 'i' } }
                            ]
                        }))
                    },
                    { tags: { $in: tagIds } }
                ]
            };
        } else if (words.length > 0) {
            query = {
                $or: words.map(word => ({
                    $or: [
                        { title: { $regex: word, $options: 'i' } },
                        { text: { $regex: word, $options: 'i' } }
                    ]
                }))
            };
        } else if (tagIds.length > 0) {
            query = { tags: { $in: tagIds } };
        } else {
            // No words and no tags provided, set query to an empty object
            // query = {};
            query = { _id: null };
        }
    
        // Retrieve questions that match the search criteria
        const questions = await Question.find(query);
    
        console.log("These are the questions: ", questions);
    
        res.json(questions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to search questions' });
    }
}

async function searchByCriteriaSortNewest(req, res) {
    try {
        const { searchString } = req.query;
    
        // Split the search string into words and tags
        const searchTerms = searchString.split(' ');
    
        const words = [];
        const tags = [];
    
        // Separate words and tags based on presence of square brackets
        searchTerms.forEach(term => {
            if (term.startsWith('[') && term.endsWith(']')) {
                tags.push(term.slice(1, -1)); // Remove square brackets and add to tags
            } else {
                words.push(term); // Add word to words
            }
        });
    
        console.log("The words are: ", words)
        console.log("The tags are: ", tags)
    
        // V6
        // Construct regex patterns for case-insensitive tag name matching
        const tagRegexes = tags.map(tag => new RegExp(tag, 'i'));
    
        // Find the tags in the database that match the names in the `tags` array
        const tagIds = await Tag.find({ name: { $in: tagRegexes } }).distinct('_id');
    
        console.log("The tagIds are: ", tagIds);
        
        // Create a search query based on words and tags
        let query = {};
    
        if (words.length > 0 && tagIds.length > 0) {
            query = {
                $or: [
                    {
                        $or: words.map(word => ({
                            $or: [
                                { title: { $regex: word, $options: 'i' } },
                                { text: { $regex: word, $options: 'i' } }
                            ]
                        }))
                    },
                    { tags: { $in: tagIds } }
                ]
            };
        } else if (words.length > 0) {
            query = {
                $or: words.map(word => ({
                    $or: [
                        { title: { $regex: word, $options: 'i' } },
                        { text: { $regex: word, $options: 'i' } }
                    ]
                }))
            };
        } else if (tagIds.length > 0) {
            query = { tags: { $in: tagIds } };
        } else {
            // No words and no tags provided, set query to an empty object
            // query = {};
            query = { _id: null };
        }
    
        // Retrieve questions that match the search criteria
        const questions = await Question.find(query).sort({ ask_date_time: -1 });
    
        console.log("These are the questions: ", questions);
    
        res.json(questions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to search questions and sort by newest' });
    }
}

async function searchByCriteriaSortActive(req, res) {
    try {
        const { searchString } = req.query;
    
        // Split the search string into words and tags
        const searchTerms = searchString.split(' ');
    
        const words = [];
        const tags = [];
    
        // Separate words and tags based on presence of square brackets
        searchTerms.forEach(term => {
            if (term.startsWith('[') && term.endsWith(']')) {
                tags.push(term.slice(1, -1)); // Remove square brackets and add to tags
            } else {
                words.push(term); // Add word to words
            }
        });
    
        console.log("The words are: ", words)
        console.log("The tags are: ", tags)
    
        // V6
        // Construct regex patterns for case-insensitive tag name matching
        const tagRegexes = tags.map(tag => new RegExp(tag, 'i'));
    
        // Find the tags in the database that match the names in the `tags` array
        const tagIds = await Tag.find({ name: { $in: tagRegexes } }).distinct('_id');
    
        console.log("The tagIds are: ", tagIds);
        
        // Create a search query based on words and tags
        let query = {};
    
        if (words.length > 0 && tagIds.length > 0) {
            query = {
                $or: [
                    {
                        $or: words.map(word => ({
                            $or: [
                                { title: { $regex: word, $options: 'i' } },
                                { text: { $regex: word, $options: 'i' } }
                            ]
                        }))
                    },
                    { tags: { $in: tagIds } }
                ]
            };
        } else if (words.length > 0) {
            query = {
                $or: words.map(word => ({
                    $or: [
                        { title: { $regex: word, $options: 'i' } },
                        { text: { $regex: word, $options: 'i' } }
                    ]
                }))
            };
        } else if (tagIds.length > 0) {
            query = { tags: { $in: tagIds } };
        } else {
            // No words and no tags provided, set query to an empty object
            // query = {};
            query = { _id: null };
        }
    
        // Retrieve questions that match the search criteria
        let questions = await Question.find(query);
    
        // Get the question IDs
        const questionIds = questions.map(q => q._id);
    
        // Retrieve the questions with answers and sort by latest answer time
        questions = await Question.aggregate([
            { $match: { _id: { $in: questionIds } } },
            {
                $lookup: {
                    from: 'answers',
                    localField: 'answers',
                    foreignField: '_id',
                    as: 'answers'
                }
            },
            {
                $addFields: {
                    latest_answer_time: { $max: '$answers.ans_date_time' }
                }
            },
            {
                $sort: { latest_answer_time: -1 }
            }
        ]);
    
        // questions = await Question.aggregate([
        //   { $match: { _id: { $in: questions.map(q => q._id) } } },
        //   {
        //     $lookup: {
        //       from: 'answers',
        //       localField: 'answers',
        //       foreignField: '_id',
        //       as: 'answers'
        //     }
        //   },
        //   {
        //     $addFields: {
        //       latest_answer_time: { $max: '$answers.ans_date_time' }
        //     }
        //   },
        //   {
        //     $sort: { latest_answer_time: -1 }
        //   }
        // ]);
    
        console.log("These are the questions: ", questions);
    
        res.json(questions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to search questions' });
    }
}

//Search Questions Page
async function searchByCriteriaSortUnanswered(req, res) {
    try {
        const { searchString } = req.query;
    
        // Split the search string into words and tags
        const searchTerms = searchString.split(' ');
    
        const words = [];
        const tags = [];
    
        // Separate words and tags based on presence of square brackets
        searchTerms.forEach(term => {
            if (term.startsWith('[') && term.endsWith(']')) {
                tags.push(term.slice(1, -1)); // Remove square brackets and add to tags
            } else {
                words.push(term); // Add word to words
            }
        });
    
        console.log("The words are: ", words)
        console.log("The tags are: ", tags)
    
        // V6
        // Construct regex patterns for case-insensitive tag name matching
        const tagRegexes = tags.map(tag => new RegExp(tag, 'i'));
    
        // Find the tags in the database that match the names in the `tags` array
        const tagIds = await Tag.find({ name: { $in: tagRegexes } }).distinct('_id');
    
        console.log("The tagIds are: ", tagIds);
        
        // Create a search query based on words and tags
        let query = {};
    
        if (words.length > 0 && tagIds.length > 0) {
            query = {
                $or: [
                    {
                        $or: words.map(word => ({
                            $or: [
                                { title: { $regex: word, $options: 'i' } },
                                { text: { $regex: word, $options: 'i' } }
                            ]
                        }))
                    },
                    { tags: { $in: tagIds } }
                ]
            };
        } else if (words.length > 0) {
            query = {
                $or: words.map(word => ({
                    $or: [
                        { title: { $regex: word, $options: 'i' } },
                        { text: { $regex: word, $options: 'i' } }
                    ]
                }))
            };
        } else if (tagIds.length > 0) {
            query = { tags: { $in: tagIds } };
        } else {
            // No words and no tags provided, set query to an empty object
            // query = {};
            query = { _id: null };
        }
        query['answers'] = { $size: 0 };
    
        // Retrieve questions that match the search criteria
        const questions = await Question.find(query);
    
        console.log("These are the questions: ", questions);
    
        res.json(questions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to search questions' });
    }
}



async function increaseQuestionVoteCountAndUserReputationById(req, res) {
    try {
        const { questionId } = req.params;
        const { loggedInString } = req.body;
    
        // Check if comment_by is a valid Account
        const account = await Account.findById(loggedInString);
        if (!account) {
            return res.status(404).json({ error: 'You must be logged in to upvote a question.' });
        }
    
        // Check if the account has over 50 reputation
        if (account.reputation < 50) {
            return res.status(403).json({ error: 'Insufficient reputation (>50) to upvote a question.' });
        }
    
        const question = await Question.findById(questionId);
    
        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }
    
        question.votes += 1;
        const accountId = question.asked_by;
        //NEED TO INCREASE THE REPUTATION OF THE ACCOUNTID BY +5
        
        // Find the account by ID
        const accountToUpdate = await Account.findById(accountId);
    
        if (!accountToUpdate) {
            return res.status(404).json({ error: 'Account of question being voted on not found' });
        }
    
        // Increase the reputation by 5
        accountToUpdate.reputation += 5;
    
        // Save the updated account
        await accountToUpdate.save();
        await question.save();
    
        res.json({ message: 'Vote count incremented successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to increment vote count' });
    }
} //Done I think?
  
async function decreaseQuestionVoteCountAndUserReputationById(req, res) {
    try {
        const { questionId } = req.params;
        const { loggedInString } = req.body;

        // Check if comment_by is a valid Account
        const account = await Account.findById(loggedInString);
        if (!account) {
            return res.status(404).json({ error: 'You must be logged in to downvote a question.' });
        }

        // Check if the account has over 50 reputation
        if (account.reputation < 50) {
            return res.status(403).json({ error: 'Insufficient reputation (>50) to downvote a question.' });
        }

        const question = await Question.findById(questionId);

        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }

        question.votes -= 1;
        const accountId = question.asked_by;
        //NEED TO INCREASE THE REPUTATION OF THE ACCOUNTID BY +5
        
        // Find the account by ID
        const accountToUpdate = await Account.findById(accountId);

        if (!accountToUpdate) {
            return res.status(404).json({ error: 'Account of question being voted on not found' });
        }

        // Decrease the reputation by 10
        accountToUpdate.reputation -= 10;

        // Save the updated account
        await accountToUpdate.save();
        await question.save();

        res.json({ message: 'Vote count decreased successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to decrease vote count' });
    }
} //Done I think?
  
async function increaseAnswerVoteCountAndUserReputationById(req, res) {
    try {
        const { answerId } = req.params;
        const { loggedInString } = req.body;
        
        console.log("loggedInString: ", loggedInString);
        console.log("answerId: ", answerId);
        // Check if comment_by is a valid Account
        const account = await Account.findOne({ username: loggedInString });

        
        /*if (!account) {
            return res.status(404).json({ error: 'You must be logged in to upvote an answer.' });
        }*/
    
        // Check if the account has over 50 reputation
        if (account.reputation < 50) {
            return res.status(403).json({ error: 'Insufficient reputation (>50) to upvote an answer.' });
        }
    
        const answer = await Answer.findById(answerId);
    
        /*if (!answer) {
            return res.status(404).json({ error: 'Answer not found' });
        }*/
    
        answer.votes += 1;
        const accountId = answer.ans_by;
        //NEED TO INCREASE THE REPUTATION OF THE ACCOUNTID BY +5
        
        // Find the account by ID
        const accountToUpdate = await Account.findOne({ username: accountId });
    
        /*if (!accountToUpdate) {
            return res.status(404).json({ error: 'Account of answer being voted on not found' });
        }*/
    
        // Increase the reputation by 5
        accountToUpdate.reputation += 5;
    
        // Save the updated account
        await accountToUpdate.save();
        await answer.save();
    
        res.json({ message: 'Vote count incremented successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to increment vote count' });
    }
} //Done I think?
  
async function decreaseAnswerVoteCountAndUserReputationById(req, res) {
    try {
        const { answerId } = req.params;
        const { loggedInString } = req.body;
    
        // Check if comment_by is a valid Account
        const account = await Account.findById(loggedInString);
        if (!account) {
            return res.status(404).json({ error: 'You must be logged in to downvote an answer.' });
        }
    
        // Check if the account has over 50 reputation
        if (account.reputation < 50) {
            return res.status(403).json({ error: 'Insufficient reputation (>50) to downvote an answer.' });
        }
    
        const answer = await Answer.findById(answerId);
    
        if (!answer) {
            return res.status(404).json({ error: 'Answer not found' });
        }
    
        answer.votes = answer.votes - 1;
        const accountId = answer.asked_by;
        //NEED TO INCREASE THE REPUTATION OF THE ACCOUNTID BY +5
        
        // Find the account by ID
        const accountToUpdate = await Account.findById(accountId);
    
        if (!accountToUpdate) {
            return res.status(404).json({ error: 'Account of answer being voted on not found' });
        }
    
        // Decrease the reputation by 10
        accountToUpdate.reputation -= 10;
    
        // Save the updated account
        await accountToUpdate.save();
        await answer.save();
    
        res.json({ message: 'Vote count decreased successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to decrease vote count' });
    }
} //Done I think?
  
async function increaseCommentVoteCountById(req, res) {
    try {
        const { commentId } = req.params;
        const { loggedInString } = req.body;
    
        // Check if comment_by is a valid Account
        const account = await Account.findById(loggedInString);
        if (!account) {
            return res.status(404).json({ error: 'You must be logged in to upvote a comment.' });
        }
    
        const comment = await Comment.findById(commentId);
    
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
    
        comment.votes += 1;
        await comment.save();
    
        //NEED TO ADD LOGGED IN PRECONDITIOON
    
        res.json({ message: 'Vote count incremented successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to increment vote count' });
    }
} //Done I think?


async function getAllCommentsForQuestion(req, res) {
    try {
        const { questionId } = req.params;
        const question = await Question.findById(questionId).populate('comments');
    
        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }
    
        const comments = question.comments;
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve comments for question' });
    }
}
  
async function getAllCommentIdsForQuestionSortNewest(req, res) {
    try {
        console.log("In getAllCommentIdsForQuestionSortNewest")
        const { questionId } = req.params;
    
        // Find the question by ID and populate the answers field
        const question = await Question.findById(questionId).populate({
            path: 'comments',
            options: { sort: { comment_date_time: -1 } }, // Sort answers by newest
            select: '_id', // Select only the answer IDs
            // model: 'answer', // Specify the model name
        });
    
        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }
    
        // const answer = question.answers;
        const commentIds = question.comments.map(comment => comment._id);
        res.json(commentIds); // res.json(answers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve commentIds from question and sort by newest' });
    }
}
  
async function getAllCommentsForAnswer(req, res) {
    try {
        const { answerId } = req.params;
        const answer = await Answer.findById(answerId).populate('comments');
    
        if (!answer) {
            return res.status(404).json({ error: 'Answer not found' });
        }
    
        const comments = answer.comments;
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve comments for answer' });
    }
}
  
async function getAllCommentIdsForAnswerSortNewest(req, res) {
    try {
        console.log("In getAllCommentIdsForAnswerSortNewest")
        const { answerId } = req.params;
    
        // Find the question by ID and populate the answers field
        const answer = await Answer.findById(answerId).populate({
            path: 'comments',
            options: { sort: { comment_date_time: -1 } }, // Sort answers by newest
            select: '_id', // Select only the answer IDs
            // model: 'answer', // Specify the model name
        });
    
        if (!answer) {
            return res.status(404).json({ error: 'Question not found' });
        }
    
        // const answer = question.answers;
        const commentIds = answer.comments.map(comment => comment._id);
        res.json(commentIds); // res.json(answers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve commentIds from answer and sort by newest' });
    }
}



async function postCommentToQuestion(req, res) {
    try {
        const { questionId } = req.params;
        const { text, comment_by } = req.body;
    
        // Check if comment_by is a valid Account
        const account = await Account.findById(comment_by);
        if (!account) {
            return res.status(404).json({ error: 'You must be logged in to post comment to question.' });
        }
    
        // Check if the account has over 50 reputation
        if (account.reputation < 50) {
            return res.status(403).json({ error: 'Insufficient reputation (>50) to post comment to question.' });
        }
    
        // Create a new answer object
        const comment = new comment({
            text,
            comment_by
        });
    
        // Save the answer to the database
        const savedComment = await comment.save();
    
        // Find the question by ID
        const question = await Question.findById(questionId);
    
        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }
    
        // Add the answer to the answers list of the question
        question.comments.push(savedComment._id);
        await question.save();
    
        res.status(201).json(savedComment);
    } catch (error) {
        res.status(500).json({ error: 'Failed to post comment to question' });
    }
}  //Done I think?
  
async function postCommentToAnswer(req, res) {
    try {
        const { answerId } = req.params;
        const { text, comment_by } = req.body;
    
        // Check if comment_by is a valid Account
        const account = await Account.findById(comment_by);
        if (!account) {
            return res.status(404).json({ error: 'You must be logged in to post answer to question.' });
        }
    
        // Check if the account has over 50 reputation
        if (account.reputation < 50) {
            return res.status(403).json({ error: 'Insufficient reputation (>50) to post comment to answer.' });
        }
    
        // Create a new answer object
        const comment = new comment({
            text,
            comment_by
        });
    
        // Save the answer to the database
        const savedComment = await comment.save();
    
        // Find the question by ID
        const answer = await Question.findById(answerId);
    
        if (!answer) {
            return res.status(404).json({ error: 'Answer not found' });
        }
    
        // Add the answer to the answers list of the question
        answer.comments.push(savedComment._id);
        await answer.save();
    
        res.status(201).json(savedComment);
    } catch (error) {
        res.status(500).json({ error: 'Failed to post comment to answer' });
    }
}  //Done I think?



async function getCommentById(req, res) {
    // console.log("We are getting answer by ID")
    try {
        console.log("We are getting comment by ID")
        const { commentId } = req.params;
        const comment = await Comment.findById(commentId);
    
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
    
        res.json(comment);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve comment' });
    }
}

module.exports = {
    getAllQuestions,
    sortNewest,
    sortActive,
    sortUnanswered,


    getQuestionById,
    incrementViewCountById,

    getAllAnswersForQuestion,
    getAllAnswerIdsForQuestionSortNewest,
    getAllTagsForQuestion,

    createQuestion, //Done but not tested
    postAnswerToQuestion, //Done but not tested

    getAllTags,
    getTagById,
    numberQuestionsWithTag,
    getAllAnswers,
    getAnswerById,
    searchByCriteria,
    searchByCriteriaSortNewest,
    searchByCriteriaSortActive,
    searchByCriteriaSortUnanswered,



    increaseQuestionVoteCountAndUserReputationById, //Done but not tested
    decreaseQuestionVoteCountAndUserReputationById, //Done but not tested
    increaseAnswerVoteCountAndUserReputationById, //Done but not tested
    decreaseAnswerVoteCountAndUserReputationById, //Done but not tested
    increaseCommentVoteCountById, //Done but not tested



    getAllCommentsForQuestion, //Done but not tested
    getAllCommentIdsForQuestionSortNewest, //Done but not tested
    getAllCommentsForAnswer, //Done but not tested
    getAllCommentIdsForAnswerSortNewest, //Done but not tested

    postCommentToQuestion, //Done but not tested
    postCommentToAnswer, //Done but not tested

    getCommentById, //Done but not tested///////////////////////////////////////////
}