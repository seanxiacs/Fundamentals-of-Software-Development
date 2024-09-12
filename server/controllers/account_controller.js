const Account = require('../models/accounts.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = "N+7+MHwin+1E/bVH8zXSPU37F7oPxHX3+oF/pbhoWXR37Yqs1SmgL5mw2AAPn/6TCo5dglSraSdNnMnHKdQKMMFVFJLKtvPXOhMRqZxbBMwxLmoK5nQwlbWggFG1I0azVnuQSkpRNeI2aUs+xlrSmkFChMmD3FwQfM4o7COMHawZIbfAjE9uTHoSZd5sNwOMrTIS6s9PXECIdjMURO3xIa+gLrxR1ji2CFwF+VJn8AzZ9ZgGQqEGc77wDiqzZlB/U9D6gGkNi8TYWxN4J3mgp1eYv9nnE85zQ+q/o3vM6dQWtLiMqoKJieCo4gRCeSanExTOJxrIjwgXkofgk/rK3Q==";

async function createAccount(req, res) {
    try {
        const { username, email, password } = req.body;

        const secretPassword = await bcrypt.hash(password, 10); 

        const account = new Account({
            username,
            email,
            secretPassword,
        });
    
        console.log("New Account: ", account);
        
        const savedAccount = await account.save();
    
        res.status(201).json(savedAccount);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create account' });
    }
} //Not complete yet
// The user arrives at the welcome page of the
// application. The page shows options to register as
// a new user, login as an existing user, or continue
// as a guest user. They select the register as a new
// user option. On selecting this option, they enter
// their username, email, a secret password, and a
// password verification. The user presses the
// SignUp button. This saves the information in a
// database. They are then directed to a Login page. 

// No two users can create an account with the same
// email. The email should have a valid form. The
// typed password should not contain the username
// or the email id. Nicely styled feedback must be
// presented to the user if the account could not be
// created due to the above reasons or any other
// reason
//USE THE getAllAccountsEmail FUNCTION TO CHECK IF EMAIL ALREADY EXISTS IN DATABASE AND THEN PROVIDE FEEDBACK ON FORM

async function getAllAccountsEmail(req, res) {
    try {
        console.log("We are getting all accounts by email")
        const emails = await Account.find({}, 'email');
    
        res.json(emails);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve accounts emails' });
    }
} //Use this to check on the client side if trying to create account with the same email. Still need to check if the email is in valid form like user@something.something

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        const user = await Account.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User does not exist' });
        }
        const validPassword = await bcrypt.compare(password, user.secretPassword);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid password' });
        }
        const token = jwt.sign({ id: user._id }, SECRET_KEY);
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Failed to login user' });
    }
}

async function getUserData(req, res) {
    try {
        const { token } = req.query;
        console.log("token: ", token)
        const decoded = jwt.verify(token, SECRET_KEY);
        console.log("decoded: ", decoded)
        const user = await Account.findById(decoded.id);
        console.log("User: ", user);
        res.status(200).json({ username: user.username, email: user.email, reputation: user.reputation, createdAt: user.createdAt });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get user data' });
    }
}
// The user arrives at the welcome page of the
// application. This page has options to register as a
// new user, login as an existing user, or continue as
// a guest user. They select the login as an existing 
// user. On selecting this option, they are asked to
// login with their email and password. Upon
// pressing the login button, they are taken to the
// home page if login is successful.

// The user enters an unregistered email or an
// incorrect password then the application should
// report back appropriate feedback to the user on the
// same page.



//Logging out of account (Use case number 3) should probably be client side unless you decide to implement it where server keeps track of who is logged in.

//Guest user (Use case number 4) can probably also be implemented client side. Actually now that I think about it, can probably have a user named guest account that has lower permissions? Not sure

//We also need toShow “no results found” in case of search failure. Based on use case number 6

//If error with all tags page, we need to:
// Show an appropriate message if there is a system
// or communication failure below the horizontal
// menu. The message should be stylized so the
// message is visible clearly to the user. 
// This is according to use case number 7




// Use-Case
// number
// 14
// Use-Case Name User Profile
// Actors Registered user.
// Preconditions The user has a working internet connection, is
// viewing the user profile page, and is logged in.
// Postconditions The user profile of the currently logged in user.
// Story The page displays a menu as described in the
// home use case. In the main section of the page, the
// length of time the user has been a member of fake
// stack overflow and the reputation of the user is
// shown. Below this information, a set of question
// titles asked by the user is listed. Each question title
// is a link which when clicked shows the New
// question page. In this page the user can modify the
// existing question and post it again or delete it. The
// form displays the existing information for the
// question in appropriate fields. Note posting
// modifications is not considered a new question.
// Deleting a question will delete all answers and
// comments associated with it.
// The menu also shows links to view all tags created
// and all questions answered by the user. When a
// link is clicked, the corresponding set of tags and
// answered questions are listed.
// The set of tags are displayed in the same format as
// described in the Tags page. Each entry in the list
// of tags being displayed has an option for the user
// to delete or edit the tag. If a user deletes a tag, it
// will not be shown with a question. However, a tag
// can be edited or deleted only if it is not being used
// by any other user.
// The questions answered by the user are displayed
// in the same format as Newest questions in the 
// Home page. Clicking a question link shows the
// answers page for that question. Their answer/s for
// the question is displayed first followed by the rest
// in Newest order. A user can edit or delete the
// answer. If a user deletes an answer then all its
// votes and comments are also deleted. The changes
// should be reflected in the home page and questions
// page appropriately.
// Exceptions Display an appropriate message if the user has no
// questions, answers, or tags.
// Display an error message if a user performs an
// invalid action as defined in the user story

// Use-Case Name User Profile
// Actors Admin user.
// Preconditions The user has a working internet connection, is
// viewing the user profile page, and is logged in as
// admin.
// Postconditions The user profile of an admin user.
// Story The page displays a menu as described in the
// home use case. In the main section of the page, the
// length of time the admin user has been a member
// of fake stack overflow and the reputation of the
// user is shown.
// The main section lists all users in the system. Each
// user is a link which when clicked takes the admin 
// to the corresponding user’s page. An admin has
// the same read and write permissions as the user on
// the user’s profile. Each user link has a delete
// button next to them. Clicking delete will remove
// the user and all their information from the system.
// Exceptions Display an appropriate message if the system has
// no users.
// Display a warning message asking for
// confirmation to prevent an admin from
// accidentally deleting a user.



module.exports = {
    createAccount,
    getAllAccountsEmail,
    loginUser,
    getUserData,
}