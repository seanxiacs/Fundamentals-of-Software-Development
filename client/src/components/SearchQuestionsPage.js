// import React, { useState } from "react";
import QuestionsCard from './QuestionsCard.js'

import api from '../api/router.js'
import React, { useState, useEffect } from "react";

export default function SearchQuestionsPage(props) { 
    const [sortBy, setSortBy] = useState(-1);
    // const [clone3] = useState(props.clone2.getDataCopy())
    const [questions, setQuestions] = useState([]);
    // const [answers, setAnswers] = useState([]);
    const [tags, setTags] = useState([]);

    useEffect(() => {
        const fetchQuestionsAnswersTags = async () => {
        try {
            console.log("The search query in the useEffect in SearchQuestionsPage is:", props.searchQuery)
            const qresponse = await api.searchByCriteria( props.searchQuery );
            const questionsData = qresponse.data;
            setQuestions(questionsData);

            // const aresponse = await api.getAllAnswers();
            // const answersData = aresponse.data;
            // setQuestions(answersData);

            const tresponse = await api.getAllTags();
            const tagsData = tresponse.data;
            setTags(tagsData);
        } catch (error) {
            console.error("Error fetching questions answes and tags:", error);
        }
        };

        fetchQuestionsAnswersTags();
    }, [props.searchQuery]);

    console.log("The search result is: ", questions)

    const handleAskQuestion = (event) => {
        console.log("Clicked handleAskQuestion in SearchQuestionsPage")
        console.log(event)
        props.setCurrentPageIndex(2)
        props.sSQ(-1)
    }

    const handleSortNewest = async (event) => {
        console.log("Clicked sortByNewest")
        console.log(event)
        setSortBy(0)
    
        // setQuestions(sortedQuestions);
        try {
        // Fetch the updated questions, answers, and tags
        const qresponse = await api.searchByCriteriaSortNewest(props.searchQuery);
        const questionsData = qresponse.data;
        
        // Update the questions state with the fetched data
        setQuestions(questionsData);
        } catch (error) {
        console.error("Error fetching questions, answers, and tags:", error);
        }
        
        props.sSQ(-1)
    }

    const handleSortActive = async (event) => {
        console.log("Clicked sortByActive")
        console.log(event)
        setSortBy(1)
;
        try {
        // Fetch the updated questions, answers, and tags
        const qresponse = await api.searchByCriteriaSortActive(props.searchQuery);
        const questionsData = qresponse.data;
        
        // Update the questions state with the fetched data
        setQuestions(questionsData);
        } catch (error) {
        console.error("Error fetching questions, answers, and tags:", error);
        }
        
        props.sSQ(-1)
    }

    const handleSortUnanswered = async (event) => {
        console.log("Clicked sortByUnanswered")
        console.log(event)
        setSortBy(2)

        try {
        // Fetch the updated questions, answers, and tags
        const qresponse = await api.searchByCriteriaSortUnanswered(props.searchQuery);
        const questionsData = qresponse.data;
        
        // Update the questions state with the fetched data
        setQuestions(questionsData);
        } catch (error) {
        console.error("Error fetching questions, answers, and tags:", error);
        }

        // setQuestions(unansweredQuestions);

        props.sSQ(-1)
    }

    return (
        <>
        <div id="questions-answers-tags-page" className="questions-answers-tags-page">
        <div id="qat-header" className="qat-header">
            <div id="questionsPageType" className="questionsPageType">Search Results</div>
            <button id="askQuestion" onClick={handleAskQuestion} >Ask Question</button>
            <div id="numQuestions" className="numQuestions">{questions.length} question(s)</div>
            <div id="sortButtons" className="sortButtons">
            <button 
                id="newest" 
                className={ sortBy === 0 ? "sort-by-buttons active" : "sort-by-buttons" }
                onClick={handleSortNewest}
            >Newest</button>
            <button 
                id="active" 
                className={ sortBy === 1 ? "sort-by-buttons active" : "sort-by-buttons" }
                onClick={handleSortActive}
            >Active</button>
            <button 
                id="unanswered" 
                className={ sortBy === 2 ? "sort-by-buttons active" : "sort-by-buttons" }
                onClick={handleSortUnanswered}
            >Unanswered</button>
            </div>
        </div>
        <div id="questions-list" className="questions-list">
            {/* <QuestionsCard /> */}
            {questions.length === 0 ? (
            <div id="noquestionsfound">No Questions Found</div>
            ) : <div id="nothing"></div>}
            {questions.map((question) => <QuestionsCard key={question._id} setCurrentPageIndex={props.setCurrentPageIndex} sQ={props.sQ} sSQ={props.sSQ} q={question} t={tags} />)}

        </div>
        </div>
        </>
    );
}

//Todo sorts on all and searched questions, fix the answers page, make it so I can click on tags to search on it, 