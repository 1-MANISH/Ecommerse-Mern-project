import React, { useEffect } from 'react'
import "./Dashboard.css"
import Sidebar from "./Sidebar.js"
import { Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import {Doughnut ,Line} from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { useDispatch, useSelector } from 'react-redux'
import { clearErrors, getAdminProducts } from '../../actions/productAction.js'
import { useAlert } from 'react-alert'
import Loader from '../layout/Loader/Loader.js'
import {clearErrors as clearAllOrderErrors, getAllOrders } from '../../actions/orderAction.js'
import {clearErrors as clearAllUserErrors, getAllUsers } from '../../actions/userAction.js'
// import store from '../../store.js'
// Register the necessary components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend,ArcElement);

const Dashboard = () => {

    const dispatch = useDispatch();
    const alert = useAlert()

    const {error, products , loading } = useSelector((store) => store.products);
    const {error:allOrderError,orders,loading:ordersLoading} = useSelector((store) => store.allOrder)
    const {error:allUserError,users,loading:usersLoading} = useSelector((store) => store.allUser)

    let outOfStock = 0;

    products && products?.forEach((item)=>{
        if(item.stock===0){
            outOfStock += 1;
        }
    })

    let amountEarned = 0;
    orders && orders?.forEach((item)=>{
        amountEarned += item.totalPrice
    })

    useEffect(()=>{

        if(error){
            alert.error(error);
            dispatch(clearErrors());                    
        }
        if(allOrderError){
            alert.error(allOrderError);
            dispatch(clearAllOrderErrors());                    
        }
        if(allUserError){
            alert.error(allUserError);
            dispatch(clearAllUserErrors());                    
        }
        dispatch(getAdminProducts())
        dispatch(getAllOrders())
        dispatch(getAllUsers())
    },[dispatch,error,alert,allOrderError,allUserError])



   const lineState = {
       labels:["Initial Amount","Amount Earned"],
       datasets:[
           {
               label:"TOTAL AMOUNT",
               backgroundColor:["tomato"],
               hoverBackgroundColor:["rgb(197, 72, 49)"],
               data:[0,amountEarned],
           },
       ]
   }

   const doughnutState = {
       labels:["Out of Stock","InStock"],
       datasets:[
           {
               label:"TOTAL QUANTITY",
               backgroundColor: ["#00A6B4", "#6800B4"],
               hoverBackgroundColor: ["#4B5000", "#35014F"],
               data:[outOfStock,products?.length - outOfStock],
           },
       ]
   }


  return (
    <div className='dashboard'>

        <Sidebar/>

        {
            (loading || ordersLoading || usersLoading) ? 
            ( 
                <Loader/>
            ):
            (
                <div className='dashboardContainer'>
                        <Typography component="h1">Dashboard</Typography>
                        <div className='dashboardSummary'>
                            <div>
                                <p>
                                    Total Amount <br/> ₹ {amountEarned}
                                </p>
                            </div>

                            <div className='dashboardSummaryBox2'>
                                <Link to="/admin/products">
                                    <p>Products</p>
                                    <p>{products && products?.length}</p>
                                </Link>
                                <Link to="/admin/orders">
                                    <p>Orders</p>
                                    <p>{orders && orders?.length}</p>
                                </Link>
                                <Link to="/admin/users">
                                    <p>Users</p>
                                    <p>{users && users?.length}</p>
                                </Link>
                            </div>
                        </div>

                        <div className="lineChart">
                            <Line
                            data={lineState}
                            />
                        </div>

                        <div className="doughnutChart">
                            <Doughnut
                            data={doughnutState}
                            />
                        </div>

                </div>
            )
        }

    </div>
  )
}

export default Dashboard