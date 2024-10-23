import React, {  Fragment } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Route } from 'react-router-dom'

const ProtectedRoute = ({Component:Component,...rest}) => {

    const {loading,isAuthenticated} =  useSelector((store)=>store.user)

  return (
   <Fragment>
        {
            !loading && 
            (
               <Route
               {...rest} 
                render={(props)=>{
                if(!isAuthenticated)
                    return <Navigate to="/login" />
                
                 return <Component {...props}  />
               }}
               />      
            )
        }
    </Fragment> 
  )
}

export default ProtectedRoute