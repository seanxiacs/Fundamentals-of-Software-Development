import TagsCard from './TagsCard.js';

import api from '../api/router.js'
import React, { useState, useEffect } from "react";

export default function AllTagsPage(props) { 

    const handleAskQuestion = (event) => {
        console.log("Clicked handleAskQuestion in AllQuestionsPage")
        console.log(event)
        props.setCurrentPageIndex(2)
        props.sSQ(-1)
    }

    const [tags, setTags] = useState([]);

    useEffect(() => {
        console.log('USE EFFECT FOR TAGS IS WORKING')
        const fetchTags = async () => {
        console.log('USE EFFECT FOR TAGS IS WORKING EVEN MORE')
        try {
            const response = await api.getAllTags();
            console.log(response)
            const tagsData = response.data;
            console.log(tagsData)
            setTags(tagsData);
        } catch (error) { 
            console.error("Error fetching tags:", error);
        }
        };

        fetchTags();
    }, []);

    console.log("The tags after the useEffect in AllTagsPage is: ", tags)


    return (
        <>
        <div id="questions-answers-tags-page" className="questions-answers-tags-page">
        <div id="qat-header2" className="qat-header qh2">
            <div id="tagsPageType" className="tagsPageType">All Tags</div>
            <button id="askQuestion" className='aQ2' onClick={handleAskQuestion} >Ask Question</button>
            <div id="numTags" className="numTags">{tags.length} Tags</div>
        </div>  
        <div id="tags-list" className="tags-list">
            {/* <TagsCard /> */}
            {tags.map((tag) => <TagsCard key={tag._id} setCurrentPageIndex={props.setCurrentPageIndex} sQ={props.sQ} sSQ={props.sSQ} t={tag} clone2={props.clone2} setClone2={props.setClone2} searchQuery={props.searchQuery} setSearchQuery={props.setSearchQuery}/>)}
        </div>
        </div>
        </>
    );
}