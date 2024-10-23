import React, { Fragment, useEffect, useState } from 'react'
import "./ProductDetails.css"
import { useParams } from 'react-router-dom'
import Carousel from 'react-material-ui-carousel'
import { useSelector,useDispatch } from 'react-redux'
import { clearErrors, getProductDetails, newReview } from '../../actions/productAction'
import dummyProductImage from "../../images/dummyProduct.jpg"
import ReviewCard from "./ReviewCard.js"
import Loader from '../layout/Loader/Loader.js'
import { useAlert } from 'react-alert'
import MetaData from '../layout/MetaData.js'
import { addItemsToCart } from '../../actions/cartAction.js'
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button
} from "@mui/material"
import {Rating} from "@mui/material"
import { NEW_REVIEW_RESET } from '../../constants/productConstant.js'





const ProductDetails = () => {

    const [quantity,setQuantity] = useState(1)

    const [open,setOpen] = useState(false)
    const [rating,setRating] = useState(0)
    const [comment,setComment] = useState("")


    const alert =useAlert()
    const params = useParams()
    const dispatch = useDispatch()
    const {product,loading,error} = useSelector((store)=>store.product)

    const {success,error:reviewError} = useSelector((store)=>store.newReview)

    useEffect(() => {
        if(error){
            alert.error(error)
            dispatch(clearErrors())
        }
        if(reviewError){
            alert.error(reviewError)
            dispatch(clearErrors())

        }
        if(success){
            alert.success("Review Submitted Successfully")
            dispatch({type:NEW_REVIEW_RESET})
        }
        if(params.productId)
            dispatch(getProductDetails(params.productId))
    }, [dispatch,params.productId,error,alert,reviewError,success])

    
    const increaseQuantity = () => {
        if(quantity >= product?.stock) return;
        setQuantity(quantity + 1)
    }

    const decreaseQuantity = () => {
        if(quantity <= 1) return;
        setQuantity(quantity - 1)
    }

    const addToCartHandler = () => {
        dispatch(addItemsToCart(params.productId,quantity))
        alert.success("Item added to cart")
    }

    const submitReviewToggle = () => {
        open ? setOpen(false) : setOpen(true)
    }

    const reviewSubmitHandler = () =>{
        const myForm = new FormData()

        myForm.set("rating",rating)
        myForm.set("comment",comment)
        myForm.set("productId",params.productId)
        
        dispatch(newReview(myForm))

        setOpen(false)
    }
    
    const options = {
        value:product?.ratings,
        size:'large',
        readOnly:true,
        precision:0.5
    };

  return (
   <Fragment>
    {
        loading ?
        (
           <Loader/>     
        ) :
        (
        <Fragment>
            <MetaData title={`${product?.name} - ECOMMERSE`} />
            <div className='ProductDetails'>
                <div>
                    <Carousel className='CarouselBox'>
                        {product && product?.images &&
                         product?.images.map((item, i) => (
                            <img
                            className="CarouselImage"
                            key={i}
                            src={item?.url.startsWith("http") ? item?.url : dummyProductImage }
                            alt={`${i} Slide`}
                            />
                        ))}
                    </Carousel>
    
                </div>
                <div>
                    <div className='detailsBlock-1'>
                        <h2>{product?.name}</h2>
                        <p> Product # {product?._id}</p>
                    </div>
                    <div className='detailsBlock-2'>
                        <Rating {...options} />
                        <span className='detailsBlock-2-span'>{product?.numberOfReviews} Reviews</span>
                    </div>
                    <div className='detailsBlock-3'>
                        <h1>{`₹${product?.price}`}</h1>
                        <div className='detailsBlock-3-1'>
                            <div className='detailsBlock-3-1-1'>
                                <button onClick={decreaseQuantity}>-</button>
                                <input readOnly type="number"  value={quantity} />
                                <button onClick={increaseQuantity}>+</button>
                            </div>
                            <button disabled={product?.stock < 1} onClick={addToCartHandler}>Add to Cart</button>
                        </div>
                        <p>
                            Status: 
                            <b className={product?.stock < 1 ? "redColor" : "greenColor"}>
                                {product?.stock < 1 ? "OutOfStock" : "InStock"}
                            </b>
                        </p>
                    </div>
    
                    <div className="detailsBlock-4">
                        Description : <p>{product?.description}</p>
                    </div>
    
                    <button onClick={submitReviewToggle}  className="submitReview">
                         Submit Review
                    </button>
                </div>
            </div>
    
            <h3 className='reviewsHeading'> Reviews</h3>


           <Dialog
            aria-labelledby='simple-dialog-title'
            open={open}
            onClose={submitReviewToggle}
            >
               <DialogTitle>Submit Review</DialogTitle>

               <DialogContent className='submitDialog'>

                   <Rating
                    onChange={(e)=>setRating(e.target.value)}
                    value={rating}
                    size="large"
                    precision={0.5}
                    
                    />

                   <textarea
                    className="submitDialogTextArea"
                    cols="30"   
                    rows="5"
                    value={comment}
                    onChange={(e)=>setComment(e.target.value)}
                    >   
                    </textarea>


               </DialogContent>

               <DialogActions>
                  <Button onClick={submitReviewToggle} color='secondary'>Cancel</Button>
                  <Button onClick={reviewSubmitHandler}  color='primary' >Submit</Button>
               </DialogActions>

           </Dialog>

            
            {
               product && product?.reviews && product?.reviews[0]  ? 
                (
                    <div className="reviews">
                        {
                            product?.reviews && product?.reviews.map((review)=>(
                                <ReviewCard review={review} />
                            ))
                        }
                    </div>
                ) : 
                (
                    <p className='noReviews'>No Reviews Yet</p>
                )
    
            }
                        
        </Fragment>
        )
    }
   </Fragment>
  )
}

export default ProductDetails