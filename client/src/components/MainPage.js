import React from "react";

import AllQuestionsPage from './AllQuestionsPage.js';
import AskQuestionsPage from './AskQuestionsPage.js';
import AnswersPage from './AnswersPage.js';
import PostAnswersPage from './PostAnswersPage.js';
import AllTagsPage from './AllTagsPage.js';
import SearchQuestionsPage from './SearchQuestionsPage.js'

export default function MainPage({currentPg, setCurrentPg, selectedQ, setSelectedQ, searchQuery, setSearchQuery}) { //I don't need a SideBarCard.js file right?
    console.log("This is current page.", currentPg);
    console.log("This is set current page.", setCurrentPg);
    return (
        <div id="mainpage" className="mainPage">
        {currentPg === 0 ? <AllQuestionsPage setCurrentPageIndex={setCurrentPg} sQ={selectedQ} sSQ={setSelectedQ} /> : 
        (currentPg === 1) ? <AllTagsPage setCurrentPageIndex={setCurrentPg} sQ={selectedQ} sSQ={setSelectedQ} searchQuery={searchQuery} setSearchQuery={setSearchQuery} /> : 
        (currentPg === 2) ? <AskQuestionsPage setCurrentPageIndex={setCurrentPg} sQ={selectedQ} sSQ={setSelectedQ} /> : 
        (currentPg === 3) ? <SearchQuestionsPage setCurrentPageIndex={setCurrentPg} sQ={selectedQ} sSQ={setSelectedQ} searchQuery={searchQuery} setSearchQuery={setSearchQuery} /> : 
        (currentPg === 4) ? <AnswersPage setCurrentPageIndex={setCurrentPg} sQ={selectedQ} sSQ={setSelectedQ} /> : 
        (currentPg === 5) ? <PostAnswersPage setCurrentPageIndex={setCurrentPg} sQ={selectedQ} sSQ={setSelectedQ} /> : 
        <p>You dun messed up somewhere</p> }
        </div>
    );
}