import React ,{useEffect,Fragment, useState} from 'react'
import "./UserList.css"
import { DataGrid } from '@mui/x-data-grid'
import { useSelector,useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { useAlert } from 'react-alert'
import { Button } from '@mui/material'
import MetaData from '../layout/MetaData'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import SideBar from './Sidebar'
import Loader from '../layout/Loader/Loader'
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    DialogContentText,
} from "@mui/material"
import { clearErrors, deleteUser, getAllUsers } from '../../actions/userAction'
import { DELETE_USER_RESET } from '../../constants/userConstant'

const UserList = () => {

    const [open,setOpen] = useState(false)
    const [id,setId] = useState(null)
    
    const dispatch = useDispatch()
    const alert = useAlert()
    const navigate = useNavigate()

    const {users,error ,loading} = useSelector((store) => store.allUser)
    const {error:deleteUserError,isDeleted} = useSelector((store)=>store.userAction)

    useEffect(()=>{
        if(error){
            alert.error(error)
            dispatch(clearErrors())
        }
        if(deleteUserError){
            alert.error(deleteUserError)
            dispatch(clearErrors())
        }
        if(isDeleted){
            alert.success("User Deleted Successfully")
            navigate("/admin/users")
            dispatch({type:DELETE_USER_RESET})
        }

        dispatch(getAllUsers())

    },[dispatch,error,deleteUserError,isDeleted,alert,navigate])

    const columns = [
        {
            field: "id",
            headerName: "User ID",
            minWidth: 250,
            flex: 0.8,
        },
        {
            field: "email",
            headerName: "Email",
            minWidth: 150,
            flex: 1,
        },
        {
            field: "name",
            headerName: "Name",
            minWidth: 140,
            flex: 0.5,
        },
        {
            field: "role",
            headerName: "Role",
            minWidth: 150,
            flex: 0.3,
            type: "number",
            cellClassName:(params)=>{
                return (
                    params.row.role === "admin" ? "greenColor" : "redColor"
                )
            }
        },
        {
            field: "actions",
            flex: 0.8,
            headerName: "Actions",
            minWidth: 150,
            type: "number",
            sortable: false,
            renderCell: (params) => {
    
                return (
                    <Fragment>
                        <Link to={`/admin/user/${params.row.id}`}>
                            <EditIcon />
                        </Link>
    
                        <Button >
                            <DeleteIcon onClick={()=>{
                                deleteButtonToggle()
                                setId(params.row.id)
                            }}/>
                        </Button>
                    </Fragment>
                )
            },
        },
       ]
    
 
    const rows = []

    users && users.map((user)=>{

        return rows.push({
            id:user._id,
            role:user.role,
            email:user.email,
            name:user.name,
        })
    })



   const deleteUserHandler = () => {
        dispatch(deleteUser(id))
        deleteButtonToggle()
        navigate("/admin/users")
   }

   const deleteButtonToggle = () =>{
        open ? setOpen(false) : setOpen(true)
   }

  return (
    <Fragment>
        <MetaData title={`ALL USERS - Admin`} />

            <div className="dashboard">
            <SideBar />
            {
                loading ?
                (
                    <Loader/>
                ):
                (
                    <div className="productListContainer">
                        <h1 id="productListHeading">ALL USERS</h1>

                        <DataGrid
                            rows={rows}
                            columns={columns}
                            pageSize={10}
                            disableSelectionOnClick
                            className="productListTable"
                            autoHeight
                        />
                    </div>
                )
            }
            
            </div>

            <Dialog
                    open={open}
                    onClose={deleteButtonToggle}
                    aria-labelledby='alert-dialog-title'
                    aria-describedby='alert-dialog-description'
                    >
                        <DialogTitle id='simple-dialog-title'>Delete User : {id}</DialogTitle>

                        <DialogContent className='submitDialog'>
                            <DialogContentText id='alert-dialog-description'>
                                    Are you sure you want to delete this user?
                            </DialogContentText>

                        </DialogContent>

                        <DialogActions>
                            <Button onClick={deleteButtonToggle} color='secondary'>Cancel</Button>
                            <Button onClick={()=>deleteUserHandler()}  color='primary' >Yes</Button>
                        </DialogActions>
                </Dialog>      
    </Fragment>
  )
}

export default UserList