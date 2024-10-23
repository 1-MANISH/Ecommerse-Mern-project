import React, { Fragment, useEffect, useState } from 'react'
import "./ProcessOrder.css"
import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import {  useParams } from 'react-router-dom'
import { clearErrors, getOrderDetails, updateOrderStatus } from '../../actions/orderAction'
import { Link } from 'react-router-dom'
import { Typography } from '@mui/material'
import Sidebar from './Sidebar'
import Loader from '../layout/Loader/Loader'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import {Button} from '@mui/material'
import { UPDATE_ORDER_RESET } from '../../constants/orderConstant'
import MetaData from '../layout/MetaData'
import dummyProductImage from "../../images/dummyProduct.jpg"

const ProcessOrder = () => {

  const [status,setStatus] = useState("")

  const dispatch = useDispatch()
  const alert = useAlert()
  const params = useParams()

  const {order,error,loading} = useSelector((store)=>store.orderDetails)
  const {error:updateOrderError,isUpdated} = useSelector((store)=>store.order)

  const orderId = params.id


  useEffect(()=>{

    if(error){
      alert.error(error)
      dispatch(clearErrors())
    }

    if(updateOrderError){
      alert.error(updateOrderError);
      dispatch(clearErrors());
    }

    if(isUpdated){
      alert.success("Order Updated Successfully")
      dispatch({type:UPDATE_ORDER_RESET})
    }

    dispatch(getOrderDetails(orderId))


  },[dispatch,error,isUpdated,updateOrderError,alert,params,orderId])
  
  const updateOrderSubmitHandler = (e) => {
    e.preventDefault()

    const myForm = new FormData()

    myForm.set("status",status)

    dispatch(updateOrderStatus(myForm,orderId))
  }



  return (
    <Fragment>
      <MetaData title="Process Order" />
      <div className="dashboard">
        <Sidebar />
        <div className="newProductContainer">
          {loading ? (
            <Loader />
          ) : (
            <div
              className="confirmOrderPage"
              style={{
                display: order?.orderStatus === "Delivered" ? "block" : "grid",
              }}
            >
              <div>
                <div className="confirmshippingArea">
                  <Typography>Shipping Info</Typography>
                  <div className="orderDetailsContainerBox">
                    <div>
                      <p>Name:</p>
                      <span>{order?.user && order?.user?.name}</span>
                    </div>
                    <div>
                      <p>Phone:</p>
                      <span>
                        {order?.shippingInfo && order.shippingInfo?.phoneNumber}
                      </span>
                    </div>
                    <div>
                      <p>Address:</p>
                      <span>
                        {order?.shippingInfo &&
                          `${order?.shippingInfo?.address}, ${order?.shippingInfo?.city}, ${order.shippingInfo.state}, ${order.shippingInfo.pinCode}, ${order.shippingInfo.country}`}
                      </span>
                    </div>
                  </div>

                  <Typography>Payment</Typography>
                  <div className="orderDetailsContainerBox">
                    <div>
                      <p
                        className={
                          order?.paymentInfo &&
                          order?.paymentInfo?.status === "succeeded"
                            ? "greenColor"
                            : "redColor"
                        }
                      >
                        {order?.paymentInfo &&
                        order?.paymentInfo?.status === "succeeded"
                          ? "PAID"
                          : "NOT PAID"}
                      </p>
                    </div>

                    <div>
                      <p>Amount:</p>
                      <span> ₹{order?.totalPrice && order?.totalPrice}</span>
                    </div>
                  </div>

                  <Typography>Order Status</Typography>
                  <div className="orderDetailsContainerBox">
                    <div>
                      <p
                        className={
                          order?.orderStatus && order?.orderStatus === "Delivered"
                            ? "greenColor"
                            : "redColor"
                        }
                      >
                        {order?.orderStatus && order?.orderStatus}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="confirmCartItems">
                  <Typography>Your Cart Items:</Typography>
                  <div className="confirmCartItemsContainer">
                    {
                    order?.orderItems &&
                      order.orderItems.map((item) => (
                        <div key={item.product}>
                          <img src={item.image.startsWith("http") ? item.image : dummyProductImage} alt="Product" />
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                          <span>
                            {item.quantity} X ₹{item.price} ={" "}
                            <b>₹{item.price * item.quantity}</b>
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              {/*  */}
              <div
                style={{
                  display: order?.orderStatus === "Delivered" ? "none" : "block",
                }}
              >
                <form
                  className="updateOrderForm"
                  onSubmit={updateOrderSubmitHandler}
                >
                  <h1>Process Order</h1>

                  <div>
                    <AccountTreeIcon />
                    <select onChange={(e) => setStatus(e.target.value)}>
                      <option value="">Choose Category</option>

                      {
                        order?.orderStatus === "Processing" && 
                        (
                          <option value="Shipped">Shipped</option>
                        )
                      }

                      {
                      order?.orderStatus === "Shipped" && 
                        (
                          <option value="Delivered">Delivered</option>
                        )
                      }
                    </select>
                  </div>

                  <Button
                    id="createProductBtn"
                    type="submit"
                    disabled={
                      loading ? true : false || status === "" ? true : false
                    }
                  >
                    Process
                  </Button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  )
}

export default ProcessOrder