import React, { Fragment, useEffect, useState } from 'react'
import "./UpdatePassword.css"
import MetaData from '../layout/MetaData'
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';
import { useNavigate } from 'react-router-dom';
import { clearErrors, updatePassword } from '../../actions/userAction';
import { UPDATE_PASSWORD_RESET } from '../../constants/userConstant';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import Loader from '../layout/Loader/Loader';

const UpdatePassword = () => {

    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate = useNavigate();
  
    const { error, isUpdated, loading } = useSelector((store) => store.profile);


    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState(""); 
    const [newConfirmPassword, setNewConfirmPassword] = useState("");

    const updatePasswordSubmit = (e) => {
        e.preventDefault();
    
        const myForm = new FormData();
    
        myForm.set("oldPassword", oldPassword);
        myForm.set("newPassword", newPassword);
        myForm.set("newConfirmPassword", newConfirmPassword);
    
        dispatch(updatePassword(myForm));
      };

      useEffect(() => {
        if (error) {
          alert.error(error);
          dispatch(clearErrors());
        }
    
        if (isUpdated) {
          alert.success("Password Updated Successfully");
    
          navigate("/account");
    
          dispatch({
            type: UPDATE_PASSWORD_RESET,
          });
        }
      }, [dispatch, error, alert, navigate, isUpdated]);


  return (
   <Fragment>
    {
        loading ?
        (
            <Loader/>   
        ):
        (
        <Fragment>
            <MetaData title="Update Password"/>
            <div className='updatePasswordContainer'>
                <div className='updatePasswordBox'>
                <h2 className="updatePasswordHeading">Update Password</h2>
                    <form
                        className="updatePasswordForm"
                        encType="application/json"
                        onSubmit={updatePasswordSubmit}
                      >
                        <div className="loginPassword">
                          <VpnKeyIcon />
                          <input
                            type="password"
                            placeholder="Old Password"
                            required
                            name="oldPassword"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                          />
                        </div>
                        <div className="loginPassword">
                          <LockOpenIcon />
                          <input
                            type="password"
                            placeholder="New Password"
                            required
                            name="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                        </div>
        
                        <div className="loginPassword">
                          <LockIcon />
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                required
                                name="newConfirmPassword"
                                value={newConfirmPassword}
                                onChange={(e) => setNewConfirmPassword(e.target.value)}
                            />
                        </div>
                        <input
                          type="submit"
                          value="Update"
                          className="updatePasswordBtn"
                        />
                      </form>
                </div>
            </div>
        </Fragment>
      )
    }
   </Fragment>
  )
}

export default UpdatePassword