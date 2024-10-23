import React, { Fragment, useEffect, useState } from 'react'
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { clearErrors, getUserDetails, updateUserRole } from '../../actions/userAction';
import { UPDATE_USER_RESET } from '../../constants/userConstant';
import MetaData from '../layout/MetaData';
import Sidebar from './Sidebar';
import Loader from '../layout/Loader/Loader';
import PersonIcon from '@mui/icons-material/Person';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import VerifiedUserIcon  from '@mui/icons-material/VerifiedUser';
import { Button } from '@mui/material';


const UpdateUser = () => {

    const [name,setName] = useState("")
    const [email,setEmail] = useState("")
    const [role,setRole] = useState("")

   const dispatch = useDispatch()
   const alert = useAlert()
   const navigate = useNavigate()
   const params = useParams()

   const {loading,error,user} = useSelector((store)=>store.userDetails)
   const {error:updateUserError,isUpdated,loading:updateLoading} = useSelector((store)=>store.userAction)


   const userId = params.id


   useEffect(()=>{

    if(user && user._id !== userId){
        dispatch(getUserDetails(userId))
    }else{

        setName(user?.name)
        setEmail(user?.email)
        setRole(user?.role)
    }


    if(error){
        alert.error(error)
        dispatch(clearErrors())
    }
    if(updateUserError){
        alert.error(updateUserError)
        dispatch(clearErrors())
    }
    if(isUpdated){
        alert.success("User Updated Successfully")
        navigate("/admin/users")
        dispatch({type:UPDATE_USER_RESET})
    }

   },[dispatch,error,alert,user,userId,params,isUpdated,updateUserError,navigate])


   const updateUserSubmitHandler = (e) => {
        e.preventDefault();

        const myForm = new FormData();

        myForm.set("name", name);
        myForm.set("email", email);
        myForm.set("role", role);

        dispatch(updateUserRole(myForm, userId));
  };


  return (
    <Fragment>
      <MetaData title="Update User" />
      <div className="dashboard">
        <Sidebar />
        <div className="newProductContainer">
          {loading ? (
            <Loader />
          ) : (
            <form
              className="createProductForm"
              onSubmit={updateUserSubmitHandler}
            >
              <h1>Update User</h1>

              <div>
                <PersonIcon />
                <input
                  type="text"
                  placeholder="Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <MailOutlineIcon />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <VerifiedUserIcon />
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="">Choose Role</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>

              <Button
                id="createProductBtn"
                type="submit"
                disabled={
                  updateLoading ? true : false || role === "" ? true : false
                }
              >
                Update
              </Button>
            </form>
          )}
        </div>
      </div>
    </Fragment>
  )
}

export default UpdateUser