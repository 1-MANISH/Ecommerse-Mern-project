import React, { Fragment, useEffect, useState } from 'react'
import "./ResetPassword.css"
import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import { clearErrors, resetPassword } from '../../actions/userAction'
import { useNavigate, useParams } from 'react-router-dom'
import MetaData from '../layout/MetaData'
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import Loader from '../layout/Loader/Loader'
const ResetPassword = () => {

    const dispatch = useDispatch()
    const alert = useAlert()
    const params = useParams()
    const navigate = useNavigate()

    const [password,setPassword] = useState("")
    const [confirmPassword,setConfirmPassword] = useState("")

    const {error,success,loading} = useSelector((store)=>store.forgotPassword)

    const resetPasswordSubmit = (e) => {

        e.preventDefault()

        const myForm = new FormData();

        myForm.set("password", password);
        myForm.set("confirmPassword", confirmPassword);

        dispatch(resetPassword(params.token, myForm));
    }

    useEffect(() => {

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
          }
      
          if (success) {
            alert.success("Password Updated Successfully");
            navigate("/login");
          }

    },[dispatch,error,success,navigate,params,alert])

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Change Password" />
          <div className="resetPasswordContainer">
            <div className="resetPasswordBox">
              <h2 className="resetPasswordHeading">Reset Password</h2>

              <form
                className="resetPasswordForm"
                onSubmit={resetPasswordSubmit}
              >
                <div>
                  <LockOpenIcon />
                  <input
                    type="password"
                    placeholder="New Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="loginPassword">
                  <LockIcon />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <input
                  type="submit"
                  value="Update"
                  className="resetPasswordBtn"
                />
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  )
}

export default ResetPassword