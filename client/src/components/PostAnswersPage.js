// import React, { useState } from "react";

import api from '../api/router.js'
import React, { useState, } from "react";

export default function PostAnswerPage(props) {
    const [answerTextInputValue, setAnswerTextInputValue] = useState('');
    const [usernameInputValue, setUsernameInputValue] = useState('');

    const [answerTextWarning, setAnswerTextWarning] = useState('');

    const [link, setLink] = useState('');
    const [word, setWord] = useState('');

    const handleAnswerTextInputChange = (event) => {
        setAnswerTextInputValue(event.target.value);
    };

    const handleUsernameInputChange = (event) => {
        setUsernameInputValue(event.target.value);
    };
    
    async function handlePostAnswer() {
        if (answerTextInputValue.length === 0) {
        setAnswerTextWarning('Answer Text cannot be empty');
        }
        else if (usernameInputValue.length === 0) {
        setUsernameInputValue('Anonymous');
        }
        else if (answerTextInputValue.match(/\[.+?\]\((?!https?:\/\/)(?!http?:\/\/)(\S*?)\)/g)) {
        setAnswerTextWarning('Bad hyperlink format');
        }
        else {
        if (answerTextInputValue.match(/\[(.+?)\]\((https?:\/\/\S+?)\)/g)) {
            setLink(answerTextInputValue.match(/(?<=\().+?(?=\))/g));
            setWord(answerTextInputValue.match(/(?<=\[).+?(?=\])/g));
            
            console.log(link)
            console.log(word)
        }

        try {
            await api.postAnswerToQuestion(props.sQ, {
            text: answerTextInputValue,
            ans_by: usernameInputValue,
            });
            console.log("Answer created successfully");

        } catch (error) {
            console.error("Error handling click post answer:", error);
        }

        props.setCurrentPageIndex(4);
        }
    }

    return (
        <div className='apage'>
            <div id="username-title-">Username*</div>
            <div id="username-searchbar-">
            <input 
                type="text" 
                id="search-form" 
                name="search-form" 
                placeholder="username" 
                value={usernameInputValue}
                onChange={handleUsernameInputChange}
                className='inputlolz'
                />
            </div>

            <div id="answer-text">Answer Text*</div>
            <div id="answer-text-searchbar">
            <input 
                type="text" 
                id="search-form" 
                name="search-form" 
                placeholder="answer text" 
                value={answerTextInputValue}
                onChange={handleAnswerTextInputChange}
                className='inputlolz'
                />
            </div>
            <div id="answer-text-warning"><pre>{answerTextWarning}</pre></div>
            
            <div id="post-answer-button">
            <button 
                id="post-answer" 
                onClick={handlePostAnswer}
                >Post Answer
            </button>
            </div>

            <div id="warning">* indicates mandatory field</div>
        </div>
    );
}