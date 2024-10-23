import React,{useEffect,Fragment} from 'react'
import {DataGrid} from "@mui/x-data-grid"
import {useSelector,useDispatch} from "react-redux"
import {clearErrors,getMyOrders} from "../../actions/orderAction"
import Loader from "../layout/Loader/Loader"
import {Link} from "react-router-dom"
import {useAlert} from "react-alert"
import { Typography } from '@mui/material'
import MetaData from "../layout/MetaData"
import LaunchIcon from '@mui/icons-material/Launch'
import "./MyOrders.css"

const MyOrders = () => {

    const dispatch = useDispatch()
    const alert = useAlert()

    const {loading,error,orders} = useSelector(store=>store.myOrders)
    const {user} = useSelector(store=>store.user)

   const columns = [
    {
        field: "id",
        headerName: "Order ID",
        minWidth: 300,
        flex:1,
    
    },
    {
        field: "status",
        headerName: "Status",
        minWidth: 150,
        flex:0.5,
        cellClassName: (params)=>{
            return (
                params.row.status === "Delivered" ? "greenColor" : "redColor"
            )
        }
    },
    {
        field: "itemsQty",
        headerName: "Items Qty",
        type:'number',
        minWidth: 150,
        flex:0.3
    },
    {
        field: "amount",
        headerName: "Amount",
        type:'number',
        minWidth: 270,
        flex:0.5
    },
    {
        field: "actions",
        flex:0.3,
        headerName: "Actions",
        minWidth: 150,
        type:"number",
        sortable:false,
        renderCell: (params)=>{
            return (
                <Link to={`/order/${params.id}`}>
                    <LaunchIcon/>
                </Link>
            )
        }
    }
   ]

   const rows = []

   orders && orders.forEach((order,index)=>{
    rows.push({
        id:order?._id,
        itemsQty:order?.orderItems.length,
        amount:order?.totalPrice,
        status:order?.orderStatus
    })
   })


    useEffect(() => {
        if(error){
            alert.error(error)
            dispatch(clearErrors())
        }
        dispatch(getMyOrders())
    },[dispatch,error,alert])
  return (
    <Fragment>
        <MetaData title={`${user?.name}  - Orders`}/>
         
         {
            loading ?
            (
                <Loader/>
            ):
            (
                <div className="myOrdersPage">
                    <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    disableSelectionOnClick
                    className="myOrdersTable"
                    autoHeight
                    />
                    <Typography id="myOrdersHeading">{user?.name}'s - Orders</Typography>
                </div>
            )
         }
    </Fragment>
  )
}

export default MyOrders