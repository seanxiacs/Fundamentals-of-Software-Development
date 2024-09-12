import React, { useEffect } from 'react'
import { useState } from 'react'
import api from '../api/router'

export default function Login() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [clicked, setClicked] = useState(false)

    async function handleLogIn() {
        if(email.length === 0) {
            alert('Email cannot be empty')
        } else if (password.length === 0) {
            alert('Password cannot be empty')
        } else {
            const payload = { email, password }
            await api.loginUser(payload).then(res => {
                const data = res.data
                try {
                    console.log(data)
                    window.localStorage.setItem('token', data.token)
                    window.localStorage.setItem('loggedIn', true)
                    window.location.reload()
                } catch (err) {
                    console.log(err)
                    alert('Server error. Please try again later.')
                }
            }).catch(err => {
                alert('Server error. Please try again later.')
                console.log(err)
            })
        }
    }

    return (
        <div>
            <h1 className='tw3' onClick={() => setClicked(!clicked)}>Log In</h1>
            <div className={clicked ? 'tw10' : 'gone'}>
                <h1>Sign into your Account!</h1>
                <div className='loginform'>
                    <input className='email' onChange={(e) => setEmail(e.target.value)} type="text" placeholder="Email" />
                    <input className='password' onChange={(e) => setPassword(e.target.value)} type="text" placeholder="Password" />
                    <button className='tw11' onClick={handleLogIn}>Log In</button>
                </div>
            </div>
        </div>
    )
}