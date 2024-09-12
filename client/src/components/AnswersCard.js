import api from '../api/router.js'
import React, { useState, useEffect } from "react";

export default function AnswersCard(props) {
    const defaultAnswer = {
        text: '',
        ans_by: 'Anonymous',
        ans_date_time: Date.now(),
    };
    const [answer, setAnswer] = useState(defaultAnswer);

    console.log("props.id is: ", props.id)

    useEffect(() => {
        const fetchAnswer = async () => {
        try {
            const response = await api.getAnswerById(props.id);
            const answerData = response.data;
            setAnswer(answerData);
        } catch (error) {
            console.error("Error fetching tags:", error);
        }
        };

        fetchAnswer();
    }, [props.id]);

    function timeSince(date) {
        date = new Date(date)
        
        let timeString = ""; 
        let timeDiff = new Date() - new Date(date);
        
        let periods = {
        year: 12 * 30 * 24 * 60 * 60 * 1000,
        month: 30 * 24 * 60 * 60 * 1000,
        week: 7 * 24 * 60 * 60 * 1000,
        day: 24 * 60 * 60 * 1000,
        hour: 60 * 60 * 1000,
        minute: 60 * 1000, 
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

    console.log("answer.ans_by is: ", answer.ans_by)

    async function handleUpvoteAnswer() {
        try {
            await api.increaseAnswerVoteCountAndUserReputationById(props.id, answer.ans_by);
            console.log("Answer upvoted successfully");
        } catch (error) {
            console.error("Error handling upvote answer:", error);
        }
    }

    return (
        <>
        <div className="answer-card">
            <div className='flex votes'>
                <div className='flex-col'>
                    <svg onClick={handleUpvoteAnswer} stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M147.6 301.3c-7.5-7.5-7.5-19.8 0-27.3l95.7-95.4c7.3-7.3 19.1-7.5 26.6-.6l94.3 94c3.8 3.8 5.7 8.7 5.7 13.7 0 4.9-1.9 9.9-5.6 13.6-7.5 7.5-19.7 7.6-27.3 0l-81-79.8-81.1 81.9c-7.5 7.5-19.7 7.5-27.3-.1z"></path><path d="M256 464c114.9 0 208-93.1 208-208S370.9 48 256 48 48 141.1 48 256s93.1 208 208 208zm0-32c-47 0-91.2-18.3-124.4-51.6C98.3 347.2 80 303 80 256s18.3-91.2 51.6-124.4C164.8 98.3 209 80 256 80s91.2 18.3 124.4 51.6C413.7 164.8 432 209 432 256s-18.3 91.2-51.6 124.4C347.2 413.7 303 432 256 432z"></path></svg>
                    <h1>{answer.votes}</h1>
                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M147.6 210.7c-7.5 7.5-7.5 19.8 0 27.3l95.7 95.4c7.3 7.3 19.1 7.5 26.6.6l94.3-94c3.8-3.8 5.7-8.7 5.7-13.7 0-4.9-1.9-9.9-5.6-13.6-7.5-7.5-19.7-7.6-27.3 0l-81 79.8-81.1-81.9c-7.5-7.5-19.7-7.5-27.3.1z"></path><path d="M48 256c0 114.9 93.1 208 208 208s208-93.1 208-208S370.9 48 256 48 48 141.1 48 256zm332.4-124.4C413.7 164.8 432 209 432 256s-18.3 91.2-51.6 124.4C347.2 413.7 303 432 256 432s-91.2-18.3-124.4-51.6C98.3 347.2 80 303 80 256s18.3-91.2 51.6-124.4C164.8 98.3 209 80 256 80s91.2 18.3 124.4 51.6z"></path></svg>
                </div>
                <div
                    className="answer-text"
                    dangerouslySetInnerHTML={{
                    __html: answer.text.replace(
                        /\[(.*?)\]\((.*?)\)/g,
                        '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
                    ),
                    }}
                ></div>
            </div>
            <div className="answerer-details">
                <div><h1>{answer.ans_by}</h1> <p>answered {timeSince(answer.ans_date_time)}</p></div>
            </div>
        </div>
        </>
    );
}