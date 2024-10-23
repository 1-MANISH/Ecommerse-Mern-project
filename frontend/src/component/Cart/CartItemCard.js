import React from 'react'
import "./CartItemCard.css"
import { Link } from 'react-router-dom'
import productImage from "../../images/dummyProduct.jpg"
import { useDispatch } from 'react-redux'
const CartItemCard = ({item,deleteItemFromCart}) => {
    const dispatch = useDispatch()
  return (
    <div className="CartItemCard">
        <img src={ productImage} alt="productImage" />
        <div>
            <Link to={`/product/${item?.product}`}>{item?.name}</Link>
            <span>{`Price: ₹${item?.price}`}</span>
            <p onClick={()=>dispatch(deleteItemFromCart(item?.product))}>Remove</p>
        </div>
    </div>
  )
}

export default CartItemCard