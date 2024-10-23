import React ,{useEffect,Fragment, useState} from 'react'
import "./ProductList.css"
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
import { clearErrors, deleteOrder, getAllOrders } from '../../actions/orderAction'
import { DELETE_ORDER_RESET } from '../../constants/orderConstant'


const OrderList = () => {

   const [open,setOpen] = useState(false)
   const [id,setId] = useState(null)
 
   const dispatch = useDispatch()
   const alert = useAlert()
   const navigate = useNavigate()

   const {error,orders,loading} = useSelector((store)=>store.allOrder)
   const {error:deleteOrderError,isDeleted} = useSelector(store=>store.order)
   

   useEffect(()=>{

    if(error){
        alert.error(error)
        dispatch(clearErrors())
    }
    if(deleteOrderError){
        alert.error(deleteOrderError)
        dispatch(clearErrors())
    }
    if(isDeleted){
        alert.success("Order Deleted Successfully")
        setId(null)
        dispatch({type:DELETE_ORDER_RESET})
        navigate("/admin/orders")
    }

    dispatch(getAllOrders())
    

   },[dispatch,error,alert,navigate,isDeleted,deleteOrderError])

   const columns = [
    {
        field: "id",
        headerName: "Order ID",
        minWidth: 250,
        flex: 0.5,
    },
    {
        field: "status",
        headerName: "Status",
        minWidth: 140,
        flex: 1,
        cellClassName: (params) => {
            return (
                params.row.status === "Delivered" ?
                     "greenColor" : "redColor"
            )
        }
    },
    {
        field: "itemsQty",
        headerName: "Items Qty",
        type: "number",
        minWidth: 150,
        flex: 0.4,
      },
      {
        field: "amount",
        headerName: "Amount",
        type: "number",
        minWidth: 270,
        flex: 0.5,
      },  
      {
        field: "actions",
        flex: 0.3,
        headerName: "Actions",
        minWidth: 150,
        type: "number",
        sortable: false,
        renderCell: (params) => {

            return (
                <Fragment>
                    <Link to={`/admin/order/${params.id}`}>
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

    orders &&
    orders.forEach((item) => {
      rows.push({
        id: item._id,
        itemsQty: item.orderItems.length,
        amount: item.totalPrice,
        status: item.orderStatus,
      });
    });

    const deleteOrderHandler = () => {
        dispatch(deleteOrder(id))
        deleteButtonToggle()
        navigate("/admin/orders")
   }

   const deleteButtonToggle = () =>{
        open ? setOpen(false) : setOpen(true)
   }



  return (
    <Fragment>

        <MetaData title={`ALL ORDERS - Admin`} />

        <div className="dashboard">
            <SideBar />
            <div className='productListContainer'>
                <h1 id="productListHeading">ALL ORDERS</h1>
                
                {
                    loading ? 
                    (
                        <Loader />
                    ) :
                    (
                        <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        disableSelectionOnClick
                        className="productListTable"
                        autoHeight
                        />
                    )
                } 

                <Dialog
                    open={open}
                    onClose={deleteButtonToggle}
                    aria-labelledby='alert-dialog-title'
                    aria-describedby='alert-dialog-description'
                    >
                        <DialogTitle id='simple-dialog-title'>Delete Order : {id}</DialogTitle>

                        <DialogContent className='submitDialog'>
                            <DialogContentText id='alert-dialog-description'>
                                    Are you sure you want to delete this order?
                            </DialogContentText>

                        </DialogContent>

                        <DialogActions>
                            <Button onClick={deleteButtonToggle} color='secondary'>Cancel</Button>
                            <Button onClick={()=>deleteOrderHandler()}  color='primary' >Yes</Button>
                        </DialogActions>
                </Dialog>      
                
            </div>
        </div>
    </Fragment>
  )
}

export default OrderList