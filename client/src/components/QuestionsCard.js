import React from "react";
import QuestionsCardTagsCard from './QuestionsCardTagsCard.js'

import api from '../api/router.js'

export default function QuestionsCard(props) { //I don't need a SideBarCard.js file right?
    console.log("We are using questions card.")

    const qu = props.q
    // console.log("This is qu:", qu)

    let questionID = qu._id;

    let questionTitle = qu.title;
    let questionAsker = qu.asked_by;
    let questionDate = qu.ask_date_time;
    let questionNumAnswers = qu.answers.length;
    let questionNumViews = qu.views;

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

    const handleClickQuestion = async (event) => {
        console.log("Clicked handleClickQuestion in QuestionsCard")
        console.log(event)

        try {
        await api.incrementViewCountById(event.target.id);
        console.log("incremented")
    
        console.log("Right before event.target.id assignment to id")
        const id = event.target.id
        console.log("The event.target.id in handleClickQuestion in QuestionCard is: ", id)
        await props.sSQ(id)
        console.log("After await props.ssQ(id)")
        await props.setCurrentPageIndex(4)
        console.log("Finished setting current page index.")
        } catch (error) {
        console.error("Error handling click question:", error);
        }
    }

    return (
        <>
        <div id={questionID} className="question-card" onClick={handleClickQuestion}>
        <div id={questionID} className="num-answers"><h1>{questionNumAnswers} answers</h1></div>
        <div id={questionID} className="q-title">{questionTitle}</div>
        <div id={questionID} className="num-views">{questionNumViews} views</div> 
        <div id={questionID} className="q-tags">
            {/* <QuestionsCardTagsCard /> */}
            {props.q.tags.map((id) => <QuestionsCardTagsCard key={props.q._id + id} id={id}/>)}
        </div>     
        <div id={questionID} className="q-details"><div><h1>{questionAsker}</h1> <p>asked {timeSince(questionDate)}</p></div></div>
        </div>
        </>
    );
}

// Might need to find a way to include the id for the "question-card"s because need to be able to click on them as well as for "q-title
