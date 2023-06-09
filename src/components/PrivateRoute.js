import React, { useEffect, useContext } from 'react'
import { UserContext } from './UserContext'
import { Navigate } from 'react-router-dom'
import { getCookie } from '../utils'

function PrivateRoute({ children, skipRedirect = false }) {
    const { user } = useContext(UserContext)
    const cookieUserId = getCookie('user_id')

    if(cookieUserId && !user?.id) {
        return <Navigate to={'/login/success/?user_id=' + cookieUserId} />
    }


    if (!user.id && !skipRedirect) return <Navigate to={'/login'} />

    if (!user.id && skipRedirect) return <></>
    return (
        <>{children}</>
    )
}

export default PrivateRoute