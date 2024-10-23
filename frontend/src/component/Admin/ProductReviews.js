import React, { Fragment, useEffect, useState } from 'react'
import "./ProductReviews.css"
import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import { useNavigate, useParams } from 'react-router-dom'
import { clearErrors, deleteReviews, getAdminProducts, getAllReviews } from '../../actions/productAction'
import { DataGrid } from '@mui/x-data-grid'
import DeleteIcon from '@mui/icons-material/Delete'
import Star from '@mui/icons-material/Star'
import { Button } from '@mui/material'
import MetaData from '../layout/MetaData'
import Sidebar from './Sidebar'
import { DELETE_REVIEW_RESET } from '../../constants/productConstant'
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    DialogContentText,
} from "@mui/material"
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';


const ProductReviews = () => {

    const [productId,setProductId] = useState("")
    const [reviewId,setReviewId] = useState(null)
    const [open,setOpen] = useState(false)
    

    const dispatch = useDispatch()
    const alert = useAlert()
    const navigate = useNavigate()
    const params = useParams()

    const {error,reviews,loading} = useSelector((store)=>store.allReview)
    const {error:deleteReviewError,isDeleted} = useSelector((store)=>store.reviewAction)
    const {error:getProductsError, products } = useSelector((store) => store.products);
    useEffect(()=>{

        if(productId && productId.length === 24){
            dispatch(getAllReviews(productId))
        }

        if(error){
            alert.error(error)
            dispatch(clearErrors())
        }
        if(deleteReviewError){
            alert.error(deleteReviewError)
            dispatch(clearErrors())
        }
        if(isDeleted){
            alert.success("Review Deleted Successfully")
            navigate("/admin/reviews")
            dispatch({type:DELETE_REVIEW_RESET})
        }
        if(getProductsError){
            alert.error(getProductsError)
            dispatch(clearErrors())
        }

        dispatch(getAdminProducts())

    },[dispatch,alert,navigate,productId,params,isDeleted,deleteReviewError,error,getProductsError])

 

    const productReviewsSubmitHandler = (e) => {
        e.preventDefault()
        dispatch(getAllReviews(productId))
    }

    const deleteReviewHandler = (reviewId) => {
        dispatch(deleteReviews(productId,reviewId))
        deleteButtonToggle()
    }

    const deleteButtonToggle = () =>{
        open ? setOpen(false) : setOpen(true)
    }



    const columns = [
        { 
            field: "id", 
            headerName: "Review ID", 
            minWidth: 200, 
            flex: 0.8 
        },
    
        {
          field: "user",
          headerName: "User",
          minWidth: 200,
          flex: 0.6,
        },
    
        {
          field: "comment",
          headerName: "Comment",
          minWidth: 350,
          flex: 1,
        },
    
        {
          field: "rating",
          headerName: "Rating",
          type: "number",
          minWidth: 180,
          flex: 0.4,
    
          cellClassName: (params) => {
            return params.row.rating >= 3
              ? "greenColor"
              : "redColor";
          },
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
                    <Button
                    onClick={() => {
                            deleteButtonToggle()
                            setReviewId(params.row.id)
                        }
                    }
                    >
                        <DeleteIcon />
                    </Button>
              </Fragment>
            );
          },
        },
      ];

      const rows = [];

      reviews &&
        reviews.forEach((item) => {
            rows.push({
                id: item._id,
                rating: item.rating,
                comment: item.comment,
                user: item.name,
            })
        })


  return (
    <Fragment>

        <MetaData title={`ALL REVIEWS - Admin`} />

        <div className="dashboard">

            <Sidebar />

            <div className="productReviewsContainer">

                <form
                    className="productReviewsForm"
                    onSubmit={productReviewsSubmitHandler}
                >
                    <h1 className="productReviewsFormHeading">ALL REVIEWS</h1>

                    <div>
                        
                        <Star />
                        {
                            products && products.length > 0 && 
                            (
                                <Autocomplete
                                   
                                    freeSolo // Allow typing custom input
                                    options={products?.map((product) => product._id)} // Map to extract product IDs
                                    inputValue={productId} // Controlled input value
                                    onInputChange={(e, newValue) => setProductId(newValue)} // Handle input change
                                    renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        required
                                        placeholder="Enter or select Product Id "
                                        className="productReviewsFormInput"
                                    />
                                    )}
                                    
                                />
                            )
                        }

                        
                    </div>
                    

                <Button
                    id="createProductBtn"
                    type="submit"
                    disabled={
                        loading ? true : false || productId === "" ? true : false
                    }
                >
                    Search
                </Button>
            </form>

          {
                reviews && 
                reviews.length > 0 ? (
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        disableSelectionOnClick
                        className="productListTable"
                        autoHeight
                    />
                ) : 
                (
                    <h1 className="productReviewsFormHeading">No Reviews Found</h1>
                )}
        </div>
      </div>

      <Dialog
                    open={open}
                    onClose={deleteButtonToggle}
                    aria-labelledby='alert-dialog-title'
                    aria-describedby='alert-dialog-description'
                    >
                        <DialogTitle id='simple-dialog-title'>Delete Review : {reviewId}</DialogTitle>

                        <DialogContent className='submitDialog'>
                            <DialogContentText id='alert-dialog-description'>
                                    Are you sure you want to delete this review?
                            </DialogContentText>

                        </DialogContent>

                        <DialogActions>
                            <Button onClick={deleteButtonToggle} color='secondary'>Cancel</Button>
                            <Button onClick={()=>{ 
                                deleteReviewHandler(reviewId)
                                }
                            }  color='primary' >Yes</Button>
                        </DialogActions>
      </Dialog>   
    </Fragment>
  )
}

export default ProductReviews