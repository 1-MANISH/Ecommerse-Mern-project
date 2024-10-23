import React, { Fragment, useState } from 'react'
import "./Header.css"
import { SpeedDial,SpeedDialAction } from '@mui/material'
import Dashboard from '@mui/icons-material/Dashboard'
import PersonIcon from '@mui/icons-material/Person'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import ListAltIcon from '@mui/icons-material/ListAlt'
import Backdrop from '@mui/material/Backdrop'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import { logout } from '../../../actions/userAction'
import CartIcon from '@mui/icons-material/ShoppingCart';

const UserOptions = ({user}) => {

    const {cartItems} = useSelector((store)=>store.cart)

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const alert = useAlert()

    const [open,setOpen] = useState(false)

    const options = [
        {icon:<ListAltIcon/>,name:"Orders",func:orders},
        {icon:<PersonIcon/>,name:"Profile",func:account},
        {icon:<CartIcon style={{color:cartItems?.length > 0 ? "tomato" : "unset"}}/>,name:`Cart(${cartItems?.length})`,func:cart},
        {icon:<ExitToAppIcon/>,name:"Logout",func:logoutUser},
    ]

    if(user?.role === "admin"){
        options.unshift(
            {icon:<Dashboard/>,name:"Dashboard",func:dashboard}
        )
    }
    
    function dashboard(){
        navigate("/admin/dashboard")
    }
    function orders(){
        navigate("/orders")
    }
    function account(){
        navigate("/account")
    }
    function cart(){
        navigate("/cart")
    }
    function logoutUser(){
        // localStorage.clear()
        // window.location.href = "/login"
        dispatch(logout())
        alert.success("Logout Successfully")
        navigate("/")
        
    }


  return (
    <Fragment>
        <Backdrop open={open} style={{zIndex:"10"}} />
        <SpeedDial
            ariaLabel='SpeedDial tooltip example'
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            icon={<img 
                className="speedDialIcon" 
                src={user?.avatar?.url ? user?.avatar?.url : "/Profile.png"} 
                alt="Profile" />
            }
            direction='down'
            className='speedDial'
            style={{zIndex:"11"}}
        >
            {
                options.map((item)=>{
                    return(
                        <SpeedDialAction
                            key={item.name}
                            icon={item.icon}
                            tooltipTitle={item.name}
                            onClick={item.func}
                            tooltipOpen={window.innerWidth <= 600 ? true : false}
                        />
                    )
                })
            }
           

        </SpeedDial>
    </Fragment>
  )
}

export default UserOptions