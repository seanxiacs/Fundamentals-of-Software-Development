import React, { useEffect, useState } from "react";
import SearchBar from './SearchBar.js';
import Login from "./Login.js";
import Signup from "./Signup.js";
import api from '../api/router.js'

async function handleLogout() {
    window.localStorage.setItem('loggedIn', false)
    window.localStorage.removeItem('token')
    window.location.reload()
}

function UserInfo() {
    const [userDetails, setUserDetails] = useState({})
    // get token from local storage
    const token = window.localStorage.getItem('token')
    // get user info from token
    useEffect(() => {
        async function getUserData() {
            await api.getUserData(token).then(res => {
                setUserDetails(res.data)
            }).catch(err => {
                console.log(err)
            })
        }
        getUserData()
    }, [token])

    console.log(userDetails)

    // display user info
    return (
        <div className="userLabel">
            <svg stroke="currentColor" fill="#bbb" stroke-width="0" viewBox="0 0 16 16" height="2em" width="2em" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M14 1H2a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V2a1 1 0 00-1-1zM2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z" clip-rule="evenodd"></path><path fill-rule="evenodd" d="M2 15v-1c0-1 1-4 6-4s6 3 6 4v1H2zm6-6a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"></path></svg>
            <h1 className="ud">{userDetails.username}: {userDetails.reputation}</h1>
            <h1 className="logout" onClick={handleLogout}>Log Out</h1>
        </div>
    )
}

export default function Header({handleSearch, currentPg, setCurrentPg, selectedQ, setSelectedQ, searchQuery, setSearchQuery}) {  

    const [loggedIn, setLoggedIn] = useState(false)

    useEffect(() => {
        // listen for changes in local storage
        window.addEventListener('storage', () => {
            setLoggedIn(window.localStorage.getItem('loggedIn') === 'true' ? true : false)
        })
        // set loggedIn state
        setLoggedIn(window.localStorage.getItem('loggedIn') === 'true' ? true : false)
    }, [])

    return (
        <div id="header" className="header">
            <div className="tw1">
                <div class="header_inner1">
                    <h1 class="mr-1 tw9"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M32 464a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128H32zm272-256a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zM432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z"></path></svg></h1>
                    <h1 class="">trash<b>overflow</b></h1>
                </div>
                <SearchBar onEnter={handleSearch} currentPg={currentPg} setCurrentPg={setCurrentPg} selectedQ={selectedQ} setSelectedQ={setSelectedQ} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                <div className="flex rel">
                    {
                        loggedIn ? (
                            <UserInfo />
                        ) : [<Login />, <Signup />]
                    }
                </div>
            </div>
        </div>
    );
}