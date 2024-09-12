// import React, { useState } from "react";

import api from '../api/router.js'
import React, { useState, useEffect } from "react";

export default function AskQuestionPage(props) { 
    const [questionTitleInputValue, setQuestionTitleInputValue] = useState('');
    const [questionTextInputValue, setQuestionTextInputValue] = useState('');
    const [tagsInputValue, setTagsInputValue] = useState('');
    const [usernameInputValue, setUsernameInputValue] = useState('');

    const [questionTitleWarning, setQuestionTitleWarning] = useState('');
    const [questionTextWarning, setQuestionTextWarning] = useState('');
    const [tagsWarning, setTagsWarning] = useState('');

    const [link, setLink] = useState('');
    const [word, setWord] = useState('');

    const handleQuestionTitleInputChange = (event) => {
        setQuestionTitleInputValue(event.target.value);
        console.log(event.target.value)
    };

    const handleQuestionTextInputChange = (event) => {
        setQuestionTextInputValue(event.target.value);
        console.log(event.target.value)
    };

    const handleTagsInputChange = (event) => {
        setTagsInputValue(event.target.value);
        console.log(event.target.value)
    };

    const handleUsernameInputChange = (event) => {
        setUsernameInputValue(event.target.value);
        console.log(event.target.value)
    };

    async function handlePostQuestion() {
        if (questionTitleInputValue.length > 100) {
        setQuestionTitleWarning('Question Title too long');
        } else if (questionTitleInputValue.length === 0) {
        setQuestionTitleWarning('Question Title cannot be empty');
        } else if (questionTextInputValue.length === 0) {
        setQuestionTextWarning('Question Text cannot be empty');
        } else if (tagsInputValue.length === 0) {
        setTagsWarning('Tags cannot be empty');
        } else if (tagsInputValue.split(" ").length > 5) {
        setTagsWarning('Too many tags');
        } else if (tagsInputValue.split(" ").some(str => str.length > 10)) {
        setTagsWarning('Tags too long');
        } else if (usernameInputValue.length === 0) {
        setUsernameInputValue('Anonymous');
        } else if (questionTextInputValue.match(/\[.+?\]\((?!https?:\/\/)(?!http?:\/\/)(\S*?)\)/g)) {
        setQuestionTextWarning('Bad hyperlink format');
        } else {
        if (questionTextInputValue.match(/\[(.+?)\]\((https?:\/\/\S+?)\)/g)) {
            setLink(questionTextInputValue.match(/(?<=\().+?(?=\))/g));
            setWord(questionTextInputValue.match(/(?<=\[).+?(?=\])/g));

            console.log(link)
            console.log(word)
        }
    
        try {
            await api.createQuestion({
                title: questionTitleInputValue,
                text: questionTextInputValue,
                tags: tagsInputValue,
                asked_by: usernameInputValue,
                summary: questionTextInputValue.substring(0, questionTextInputValue.length > 50 ? 50 : questionTextInputValue.length),
            });
            console.log("Question created successfully");
        } catch (error) {
            console.error("Error handling click post question:", error);
        }
    
        props.setCurrentPageIndex(0);
        props.sSQ(-1);
        }
    }
    
    return (
        <div className="qpage">
            <div id="question-title"><strong>Question Title*</strong></div>
            <div id="question-title-caption">Limit Title to 100 characters or less</div>
            <div id="question-title-searchbar">
                <input 
                    type="text" 
                    id="search-form" 
                    name="search-form" 
                    placeholder="question title" 
                    value={questionTitleInputValue}
                    onChange={handleQuestionTitleInputChange}
                    className="inputlolz"
                />
            </div>
            <div id="question-title-warning"><pre>{questionTitleWarning}</pre></div>

            <div id="question-text"><strong>Question Text*</strong></div>
            <div id="question-text-caption">Add details</div>
            <div id="question-text-searchbar">
            <input 
                type="text" 
                id="search-form" 
                name="search-form" 
                placeholder="question text" 
                value={questionTextInputValue}
                onChange={handleQuestionTextInputChange}
                className='inputlolz'
                />
            </div>
            <div id="question-text-warning"><pre>{questionTextWarning}</pre></div>

            <div id="tags-title"><strong>Tags*</strong></div>
            <div id="tags-caption">Add max 5 keywords of max length 10 seperated by whitespace</div>
            <div id="tags-searchbar">
            <input 
                type="text" 
                id="search-form" 
                name="search-form" 
                placeholder="tags" 
                value={tagsInputValue}
                onChange={handleTagsInputChange}
                className='inputlolz'
                />
            </div>
            <div id="tags-warning" ><pre>{tagsWarning}</pre></div>

            <div id="username-title"><strong>Username*</strong></div>
            <div id="username-searchbar">
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
            
            <div id="post-question-button">
            <button 
                id="post-question" 
                onClick={handlePostQuestion}
                >Post Question
            </button>
            </div>

            <div id="warning">* indicates mandatory field</div>
        </div>
    );
}