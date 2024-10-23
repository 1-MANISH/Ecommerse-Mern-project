import React ,{Fragment,useEffect,useRef} from 'react'
import "./Payment.css"
import CheckoutSteps from './CheckoutSteps'
import { useSelector,useDispatch } from 'react-redux'
import MetaData from '../layout/MetaData'
import { Typography } from '@mui/material'
import { useAlert } from 'react-alert'
import {
    CardNumberElement,
    CardCvcElement,
    CardExpiryElement,
    useStripe,
    useElements

} from "@stripe/react-stripe-js"

import axios from 'axios'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import EventIcon from "@mui/icons-material/Event"
import VpnKeyIcon from "@mui/icons-material/VpnKey"
import { useNavigate } from 'react-router-dom'
import { clearErrors,createOrder } from '../../actions/orderAction'
const Payment = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const alert = useAlert()
    const stripe = useStripe()
    const elements = useElements()
    const payBtn = useRef(null)

    const {shippingInfo,cartItems} = useSelector((store)=>store.cart)
    const {user} = useSelector((store)=>store.user)
    const {error} = useSelector((store)=>store.newOrder)

    const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"))
    
    const paymentData ={
        amount: Math.round(orderInfo?.totalPrice * 100) // converting paisa
    }

    const order = {
        shippingInfo,
        orderItems:cartItems,
        itemsPrice:orderInfo?.subtotal,
        taxPrice:orderInfo?.tax,
        shippingPrice:orderInfo?.shippingCharges,
        totalPrice:orderInfo?.totalPrice
    }

    const submitHandler =  async (e) => {
        e.preventDefault()
        payBtn.current.disabled = true

        try {

            const config = {
                headers:{
                    'Content-Type':"application/json"
                }
            }

            const {data} = await axios.post("/api/v1/payment/process",
                paymentData,
                config
            )

            const client_secret = data.client_secret

            if(!stripe || !elements) {
                return
            }

            const result = await stripe.confirmCardPayment(client_secret, {
                payment_method:{
                    card:elements.getElement(CardNumberElement),
                    billing_details:{
                        name: user?.name,
                        email: user?.email,
                        address:{
                            line1:shippingInfo?.address,
                            city:shippingInfo?.city,
                            state:shippingInfo?.state,
                            postal_code:shippingInfo?.pinCode,
                            country:shippingInfo?.country
                        }
                    }
                }
            })

            if(result.error){
                payBtn.current.disabled = false
                alert.error(result.error.message)
            }else{
                if(result.paymentIntent.status === "succeeded"){

                    // create a order
                    order.paymentInfo = {
                        id:result.paymentIntent.id,
                        status:result.paymentIntent.status
                    }
                    dispatch(createOrder(order))
                    navigate("/success")
                }else{
                    alert.error(`Payment failed: Something went wrong`)
                }
            }
            
        } catch (error) {
            payBtn.current.disabled = false
            alert.error(error.response.data.message)
        }
    }

    useEffect(()=>{
        if(error){
            alert.error(error)
            dispatch(clearErrors())
        }
    },[dispatch,error,alert,navigate])


  return (


    <Fragment>

        
        <MetaData title="Payment"/>
        <CheckoutSteps activeStep={2}/>
        
        <div className='paymentContainer'>

            <form className='paymentForm' onSubmit={(e)=>submitHandler(e)}>
                <Typography>Card Info</Typography>
                <div>
                    <CreditCardIcon/>
                    <CardNumberElement className='paymentInput'/>
                </div>
                <div>
                    <EventIcon/>
                    <CardExpiryElement className='paymentInput'/>
                </div>
                <div>
                    <VpnKeyIcon/>
                    <CardCvcElement className='paymentInput'/>
                </div>
                <input
                  type='submit'
                  value={`Pay - ₹${orderInfo && orderInfo?.totalPrice}`}
                  ref={payBtn}
                  className='paymentFormBtn'
                />
            </form>

        </div>
  
        </Fragment>

  )
}

export default Payment