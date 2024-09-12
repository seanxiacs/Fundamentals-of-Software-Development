import React from 'react'
import { useState } from 'react'
import api from '../api/router'

export default function Signup() {

    const [clicked, setClicked] = useState(false)
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    async function handleSignUp() {
        if (email.length === 0) {
            alert('Email cannot be empty')
        } else if (username.length === 0) {
            alert('Username cannot be empty')
        } else if (password.length === 0) {
            alert('Password cannot be empty')
        } else if (password !== confirmPassword) {
            alert('Passwords do not match')
        } else {
            const payload = { email, username, password }
            await api.createAccount(payload).then(res => {
                // alert then reload after user presses ok
                alert('Account created successfully!')
                window.location.reload()
            }).catch(err => {
                alert('Server error. Please try again later.')
                console.log(err)
            })
        }
    }

    return (
        <div>
            <h1 className='tw4' onClick={() => setClicked(!clicked)}>Sign Up</h1>
            <div className={clicked ? 'tw10' : 'gone'}>
                <h1>Create an Account!</h1>
                <div className='loginform'>
                    <input className='email' onChange={(e) => setEmail(e.target.value)} type="text" placeholder="Email" />
                    <input className='username' onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Username" />
                    <input className='password' onChange={(e) => setPassword(e.target.value)} type="text" placeholder="Password" />
                    <input className='password' onChange={(e) => setConfirmPassword(e.target.value)} type="text" placeholder="Confirm Password" />
                    <button className='tw11' onClick={handleSignUp}>Sign Up</button>
                </div>
            </div>
        </div>
    )
}