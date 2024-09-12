    import QuestionsCard from './QuestionsCard.js'

import api from '../api/router.js'
import React, { useState, useEffect } from "react";

export default function AllQuestionsPage(props) { //I don't need a SideBarCard.js file right?
    console.log("In AllQuestionsPage.js")
    const[sortBy, setSortBy] = useState(-1);
    
    const [questions, setQuestions] = useState([]);
    const [tags, setTags] = useState([]);
    // const [random, setRandom] = useState(-1);
    // const [random1, setRandom1] = useState(-1);

    useEffect(() => {
        const fetchQuestionsAndTags = async () => {
        try {
            const qresponse = await api.getAllQuestions();
            const questionsData = qresponse.data;
            setQuestions(questionsData);

            const tresponse = await api.getAllTags();
            const tagsData = tresponse.data;
            setTags(tagsData);
        } catch (error) {
            console.error("Error fetching questions and tags:", error);
        }
        };

        fetchQuestionsAndTags();
    }, []);

    console.log("AllQuestionsPage testing")

    const handleAskQuestion = (event) => {
        console.log("Clicked handleAskQuestion in AllQuestionsPage")
        console.log(event)
        props.setCurrentPageIndex(2)
        props.sSQ(-1)
    }

    const handleSortNewest = async (event) => {
        console.log("Clicked sortByNewest")
        console.log(event)
        setSortBy(0)

        try {
            const questionsData = await api.getAllQuestionsNewest();
            console.log("The questionsData is: ", questionsData.data)
            setQuestions(questionsData.data);
        // const response = await api.getTagById(props.id);
        // const tagData = response.data;
        // setTag(tagData);
        } catch (error) {
            console.error("Error handling sort newest:", error);
        }
        props.sSQ(-1)
    }

    const handleSortActive = async (event) => {
        console.log("Clicked sortByActive")
        console.log(event)
        setSortBy(1)

        try {
            const questionsData = await api.getAllQuestionsActive();
            console.log("The questionsData is: ", questionsData.data)
            setQuestions(questionsData.data);
        } catch (error) {
            console.error("Error handling sort active:", error);
        }

        props.sSQ(-1)
    }

    const handleSortUnanswered = async (event) => {
        console.log("Clicked sortByUnanswered")
        console.log(event)
        setSortBy(2)

        try {
            const questionsData = await api.getAllQuestionsUnanswered();
            console.log("The questionsData is: ", questionsData.data)
            setQuestions(questionsData.data);
        } catch (error) {
            console.error("Error handling sort unanswered:", error);
        }
        
        props.sSQ(-1)
    }
    
    return (
        <>
        <div id="questions-answers-tags-page" className="questions-answers-tags-page">
        <div id="qat-header" className="qat-header">
            <div id="questionsPageType" className="questionsPageType">All Questions</div>
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