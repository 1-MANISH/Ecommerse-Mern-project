import React, { Fragment } from 'react'
import "./ConfirmOrder.css"
import CheckoutSteps from './CheckoutSteps.js'
import {useSelector} from "react-redux"
import MetaData from '../layout/MetaData'
import {Link, useNavigate} from 'react-router-dom'
import { Typography } from '@mui/material'
import productImage from "../../images/dummyProduct.jpg"

const ConfirmOrder = () => {
    
    const navigate = useNavigate()

    const {shippingInfo,cartItems} = useSelector((store)=>store.cart)
    const {user} = useSelector((store)=>store.user)

    const subtotal = cartItems?.reduce((acc,item)=>{
        return acc + item?.quantity * item?.price
    },0)

    const shippingCharges = subtotal > 1000 ? 0 : 200

    const tax = subtotal * 0.18

    const totalPrice = subtotal + tax + shippingCharges

    const address = `${shippingInfo?.address}, ${shippingInfo?.city},${shippingInfo?.pinCode}, ${shippingInfo?.state}, ${shippingInfo?.country}`
    
    const proceedToPayment = ()=> {
        const data = {
            subtotal,
            shippingCharges,
            tax,
            totalPrice
        }
        sessionStorage.setItem("orderInfo",JSON.stringify(data)) // only on open tab otherwise it will be lost
        navigate("/process/payment")
    }

  return (
    <Fragment>
        <MetaData title="Confirm Order"/>
        <CheckoutSteps activeStep={1}/>

        <div className="confirmOrderPage">

            <div>
                <div className="confirmshippingArea">
                    <Typography>Shipping Info</Typography>
                    <div className="confirmshippingAreaBox">
                        <div>
                            <p>Name:</p>
                            <span>{user?.name}</span>
                        </div>
                        <div>
                            <p>Phone:</p>
                            <span>{shippingInfo?.phoneNumber}</span>
                        </div>
                        <div>
                            <p>Address:</p>
                            <span>{address}</span>
                        </div>
                    </div>
                </div>
                <div className="confirmCartItems">
                    <Typography>Your cart Items : </Typography>
                    <div className="confirmCartItemsContainer">
                        {
                            cartItems &&
                            cartItems.map((item)=>{
                                return (
                                <div key={item.product}>
                                    <img src={productImage} alt="Product" />
                                    <Link to={`/product/${item.product}`}>
                                    {item?.name}
                                    </Link>
                                    <span>
                                      {item?.quantity } X {`₹${item?.price}`} = 
                                      <b> {`₹${item?.quantity * item?.price}`}</b>
                                    </span>
                                </div>)
                            })
                        }
                    </div>
                </div>
            </div>

            <div>
                <div className="orderSummary">
                    <Typography>Order Summery</Typography>
                    <div>
                        <div>
                            <p>Subtotal:</p>
                            <span>{`₹${subtotal}`}</span>
                        </div>
                        <div>
                            <p>Shipping Charges:</p>
                            <span>{`₹${shippingCharges}`}</span>
                        </div>
                        <div>
                            <p>GST:</p>
                            <span>{`₹${tax}`}</span>
                        </div>
                    </div>
               

                    <div className="orderSummaryTotal">
                        <p>
                            <b>Total:</b>
                        </p>
                        <span>{`₹${totalPrice}`}</span>
                        
                    </div>

                    <button onClick={proceedToPayment}> Proceed To Payment</button>   
                
                </div>
            </div>
        </div>
    </Fragment>
  )
}

export default ConfirmOrder