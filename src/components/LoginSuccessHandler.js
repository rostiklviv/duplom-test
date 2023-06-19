import React, { useEffect, useContext } from 'react'
import { UserContext } from './UserContext'
import {useNavigate} from 'react-router-dom'

const { REACT_APP_BASE_BACKEND_URL } = process.env;

function LoginSuccessHandler() {
    const { user, setUser } = useContext(UserContext)
    const navigate = useNavigate()
    useEffect(() => {

        fetch(REACT_APP_BASE_BACKEND_URL + '/api/users/me', {
            credentials: 'include'
        }).then(res =>
            res.json()
        ).then(data => {
            setUser(data);
            navigate('/')
        })
    }, [])

    return (
        <div>LoginSuccessHandler</div>
    )
}

export default LoginSuccessHandler