import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'



export default function ProductedRoutes  ({children,isAdmin}){
    const {isAuthenticated,user} = useSelector(state=>state.authState)
    
    if(!isAuthenticated){
        if(isAdmin === true &&user.role!=='admin'){
            return <Navigate to='/'/>
        }
        return <Navigate to='/login'/>
    }
    return children;
}
