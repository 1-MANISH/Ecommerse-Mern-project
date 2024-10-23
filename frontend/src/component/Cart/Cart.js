import React, { Fragment } from 'react'
import "./Cart.css"
import  CartItemCard from "./CartItemCard.js"
import { useDispatch, useSelector } from 'react-redux'
import { addItemsToCart , removeItemsfromCart } from '../../actions/cartAction.js'
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import { Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import MetaData from '../layout/MetaData.js'
const Cart = () => {

    const {isAuthenticated} = useSelector((store)=>store.user)

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const cartItems = useSelector((store)=>store.cart).cartItems
   
    const increaseQuantity = (id,quantity,stock) => {
        if(quantity >= stock) return;
        dispatch(addItemsToCart(id,quantity+1))
    }
    const decreaseQuantity = (id,quantity) => {
        if(quantity <= 1) return;
        dispatch(addItemsToCart(id,quantity-1))
    }


    const checkoutHandler = () => {
        // navigate("/login?redirect=shipping")
        if(!isAuthenticated){
            navigate("/login")
            return
        }
        navigate("/shipping")
    }

  return (
    <Fragment>
        {
            cartItems.length === 0 ? 
            <div className="emptyCart">
                <RemoveShoppingCartIcon />

                <Typography>No Product in Your Cart</Typography>
                <Link to="/products">View Products</Link>
            </div>
            :
            (
                <Fragment>
                    <MetaData title={"Your Cart"} />
                    <div className='cartPage'>
                        <div className="cartHeader">
                            <p>Product</p>
                            <p>Quantity</p>
                            <p>Subtotal</p>
                        </div>

                        {
                        cartItems &&  
                        cartItems?.map((item)=>(
                                <div className="cartContainer" key={item?.product}>
                                    <CartItemCard item={item} deleteItemFromCart={removeItemsfromCart}/>
                                    <div className='cartInput'>
                                    <button onClick={()=>decreaseQuantity(item?.product,item?.quantity)}>-</button>
                                    <input type="number" readOnly value={item?.quantity}/> 
                                    <button onClick={()=>increaseQuantity(item?.product,item?.quantity,item?.stock)}>+</button>
                                    
                                    </div>
                                    <p className='cartSubtotal'>
                                        {`₹${item?.price * item?.quantity}`}
                                    </p>
                                </div>
                            ))
                        }

                        

                        <div className="cartGrossProfit">
                            <div></div>
                            <div className="cartGrossProfitBox">
                                <p>Gross Total</p>
                                <p>
                                    {`₹
                                     ${cartItems?.reduce((acc,item)=>{
                                        return acc+ (item.quantity * item.price)
                                     },0)}
                                    `}
                                </p>
                            </div>
                            <div></div>
                            <div className="checkOutBtn">
                                <button onClick={checkoutHandler}>Check Out</button>
                            </div>
                        </div>
                    </div>
                </Fragment>
            )
        }
    </Fragment>
  )
}

export default Cart