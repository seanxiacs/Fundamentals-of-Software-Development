import AnswersCard from './AnswersCard.js';

import api from '../api/router.js'
import React, { useState, useEffect } from "react";

export default function AnswerPage(props) {

    const questionID = props.sQ
    console.log("AnswerPage: The selected question ID is: ", questionID)

    // const [question, setQuestion] = useState({});

    const defaultQuestion = {
        title: '',
        text: '',
        tags: [],
        answers: [],
        asked_by: 'Anonymous',
        ask_date_time: Date.now(),
        views: 0,
    };
    
    const [question, setQuestion] = useState(defaultQuestion);
    
    console.log("THE QUESTION IS THIS", question)

    useEffect(() => {
        console.log("The question ID in the try catch block is: ", questionID)
        const fetchQuestion = async () => {
            console.log("Running fetchQuestion in AnswerPage");
            console.log("The question ID in the try catch block is: ", questionID)
            try {  
                console.log("The question ID in the try catch block is: ", questionID)
                const response = await api.getQuestionById(questionID);
                const questionData = response.data;
                setQuestion(questionData);

            } catch (error) {
                console.error("Error fetching question:", error);
            }
        };
    
        fetchQuestion();
    }, [questionID]);

    console.log("The current question is: ", question);

    const handleAskQuestion = (event) => {
        console.log("Clicked handleAskQuestion in AllQuestionsPage")
        console.log(event)
        props.setCurrentPageIndex(2)
        props.sSQ(-1)
    }
    
    const handleAnswerQuestion = (event) => {
        console.log("Clicked handleAskQuestion in AllQuestionsPage")
        console.log(event)
        props.setCurrentPageIndex(5)
    }
    
    function timeSince(date) {
        date = new Date(date)
        
        let timeString = ""; // var timeString = "";
        let timeDiff = new Date() - new Date(date);
        let periods = {
        year: 12 * 30 * 24 * 60 * 60 * 1000,
        month: 30 * 24 * 60 * 60 * 1000,
        week: 7 * 24 * 60 * 60 * 1000,
        day: 24 * 60 * 60 * 1000,
        hour: 60 * 60 * 1000,
        minute: 60 * 1000, //(sec * 1/milliseconds)
        second: 1000,
        };
        let month_names = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];

        if (timeDiff > periods.year) {
        timeString = "" + month_names[(date.getMonth())] + " " + date.getDate() + " " + date.getFullYear() + " at " + date.getHours().toString().padStart(2, "0") + ":" + date.getMinutes().toString().padStart(2, "0");
        }
        else if (timeDiff > periods.month) {
        timeString = "" + Math.floor(timeDiff / periods.month) + " month(s) ago";
        }
        else if (timeDiff > periods.week) {
        timeString = "" + Math.floor(timeDiff / periods.week) + " week(s) ago";
        }
        else if (timeDiff > periods.day) {
        timeString = "" + Math.floor(timeDiff / periods.day) + " day(s) ago";
        }
        else if (timeDiff > periods.hour) {
        timeString = "" + Math.floor(timeDiff / periods.hour) + " hour(s) ago";
        }
        else if (timeDiff > periods.minute) {
        timeString = "" + Math.floor(timeDiff / periods.minute) + " minute(s) ago";
        }
        else {
        timeString = "" + Math.floor(timeDiff / periods.second) + " second(s) ago";
        }

        return timeString;
    }

    return (
        <>
        <div id="questions-answers-tags-page" className="questions-answers-tags-page">
        <div id="qat-header2" className="qat-header qh2">
            {/* <div id="answer-page-num-answers" className="answer-page-num-answers">{props.mC.questions} answer(s)</div> */}
            
            <div id="answer-page-question-title" className="answer-page-question-title">{question.title}</div>
            <button id="askQuestion" className='aQ2' onClick={handleAskQuestion} >Ask Question</button>

            <div className="apnc">
                <div id="answer-page-num-answers" className="answer-page-num-answers">{question.answers.length} answer(s)</div>
                <div id="answer-page-num-views" className="answer-page-num-views">{question.views} view(s)</div>
            </div>

            <div id="answer-page-question-content" className="answer-page-question-content" 
                dangerouslySetInnerHTML={{
                __html: question.text.replace(
                    /\[(.*?)\]\((.*?)\)/g,
                    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
                ),
                }}> 
                {/* {question.text.replace(
                /\[(.*?)\]\((.*?)\)/g,
                '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
            )} */}
            </div>
            <div id="answer-page-asker-details" className="answer-page-asker-details"><div><h1>{question.asked_by}</h1> <p>asked {timeSince(question.ask_date_time)}</p></div></div>
        </div>
        <div id="answers-list" className="answers-list">
            {/* <AnswersCard /> */}
            {question.answers.map((id) => <AnswersCard key={question._id + id} id={id}/>)}
            <button 
            id="answer-question-button"
            className="answer-question-button"
            onClick={handleAnswerQuestion}
            >Answer Question</button>
        </div>
        </div>
        </>
    );

    // return (
    //   <>
    //     <div id="answer-page-question-content" className="answer-page-question-content">{question.text}</div>
    //   </>
    // );
}