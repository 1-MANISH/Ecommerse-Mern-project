
import axios from "axios"
import { 
    ALL_PRODUCT_FAIL,
    ALL_PRODUCT_REQUEST,
    ALL_PRODUCT_SUCCESS,
    PRODUCT_DETAIL_FAIL,
    PRODUCT_DETAIL_REQUEST,
    PRODUCT_DETAIL_SUCCESS,
    NEW_REVIEW_REQUEST,
    NEW_REVIEW_SUCCESS,
    NEW_REVIEW_FAIL,
    ADMIN_PRODUCT_REQUEST,
    ADMIN_PRODUCT_SUCCESS,
    ADMIN_PRODUCT_FAIL,
    CREATE_NEW_PRODUCT_REQUEST,
    CREATE_NEW_PRODUCT_SUCCESS,
    CREATE_NEW_PRODUCT_FAIL,
    DELETE_PRODUCT_REQUEST,
    DELETE_PRODUCT_SUCCESS,
    DELETE_PRODUCT_FAIL,
    UPDATE_PRODUCT_REQUEST,
    UPDATE_PRODUCT_SUCCESS,
    UPDATE_PRODUCT_FAIL,
    ALL_REVIEWS_REQUEST,
    ALL_REVIEWS_SUCCESS,
    ALL_REVIEWS_FAIL,
    DELETE_REVIEW_REQUEST,
    DELETE_REVIEW_SUCCESS,
    DELETE_REVIEW_FAIL,
    CLEAR_ERRORS 
} from "../constants/productConstant"

// Get Products

export const getProducts = (keyword="",currentPage=1,price=[0,125000],category="",ratings=0) => async (dispatch) => {
    try {
        
        dispatch({
            type:ALL_PRODUCT_REQUEST,
        })

        let link =`/api/v1/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}`

        if(category !== "" && category !== "All")
            link = link + `&category=${category}`

        if(ratings!==0)
            link = link + `&ratings[gte]=${ratings}`
        const {data} = await axios.get(link) // lots of things we ar getting so data taking

        dispatch({
            type:ALL_PRODUCT_SUCCESS,
            payload:data
        })


    } catch (error) {
        dispatch({
            type:ALL_PRODUCT_FAIL,
            payload:error.response.data.message
        })
    }
}

// Get Product Details
export const getProductDetails = (productId) => async (dispatch) => {
    try {
        
        dispatch({
            type:PRODUCT_DETAIL_REQUEST,
        })

        const {data} = await axios.get(`/api/v1/product/${productId}`) // lots of things we ar getting so data taking

        dispatch({
            type:PRODUCT_DETAIL_SUCCESS,
            payload:data
        })


    } catch (error) {
        dispatch({
            type:PRODUCT_DETAIL_FAIL,
            payload:error.response.data.message
        })
    }
}

// for admin only

// Create a Product review
export const newReview = (reviewData) => async (dispatch) => {
    try {
        
        dispatch({
            type:NEW_REVIEW_REQUEST,
        })

        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }

        const {data} = await axios.put(`/api/v1/product/review`, 
            reviewData, 
            config
        ) // lots of things we ar getting so data taking

        dispatch({
            type:NEW_REVIEW_SUCCESS,
            payload:data.success
        })


    } catch (error) {
        dispatch({
            type:NEW_REVIEW_FAIL,
            payload:error.response.data.message
        })
    }
}

// Get All Products For Admin
export const getAdminProducts = () => async (dispatch) => {
    try {
        
        dispatch({
            type:ADMIN_PRODUCT_REQUEST,
        })

        const {data} = await axios.get(`/api/v1/admin/products`) // lots of things we ar getting so data taking

        dispatch({
            type:ADMIN_PRODUCT_SUCCESS,
            payload:data.products
        })
    } catch (error) {
        dispatch({
            type:ADMIN_PRODUCT_FAIL,
            payload:error.response.data.message
        })
    }
}


// Create a new product
export const createNewProduct = (productData) => async (dispatch) => {
    try {
        
        dispatch({
            type:CREATE_NEW_PRODUCT_REQUEST,
        })

        const config = {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }

        const {data} = await axios.post(`/api/v1/admin/product/new`, 
            productData, 
            config
        ) // lots of things we ar getting so data taking

        dispatch({
            type:CREATE_NEW_PRODUCT_SUCCESS,
            payload:data
        })


    } catch (error) {
        dispatch({
            type:CREATE_NEW_PRODUCT_FAIL,
            payload:error.response.data.message
        })
    }
}

// update Product
export const updateProduct = (productData,id) => async (dispatch) => {
    try {
        
        dispatch({
            type:UPDATE_PRODUCT_REQUEST,
        })

        const config = {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }

        const {data} = await axios.put(`/api/v1/admin/product/${id}`, 
            productData,    
            config
        ) // lots of things we ar getting so data taking

        
        dispatch({
            type:UPDATE_PRODUCT_SUCCESS,
            payload:data.success
        })

    } catch (error) {
        dispatch({
            type:UPDATE_PRODUCT_FAIL,
            payload:error.response.data.message
         })
    }
}

// Delete Product
export const deleteProduct = (id) => async (dispatch) => {
    try {
        
        dispatch({
            type:DELETE_PRODUCT_REQUEST,
        })

        const {data} = await axios.delete(`/api/v1/admin/product/${id}`) // lots of things we ar getting so data taking

        dispatch({
            type:DELETE_PRODUCT_SUCCESS,
            payload:data.success
        })


    } catch (error) {
        dispatch({
            type:DELETE_PRODUCT_FAIL,
            payload:error.response.data.message
        })
    }
}

// Get all reviews of a product
export const getAllReviews = (productId) => async (dispatch) => {
    try {
        
        dispatch({
            type:ALL_REVIEWS_REQUEST,
        })

        const {data} = await axios.get(`/api/v1/reviews?productId=${productId}`) // lots of things we ar getting so data taking

        dispatch({
            type:ALL_REVIEWS_SUCCESS,
            payload:data.reviews
        })


    } catch (error) {
        dispatch({
            type:ALL_REVIEWS_FAIL,
            payload:error.response.data.message
        })
    }
}

// delete review of a product
export const deleteReviews = (productId,reviewId) => async (dispatch) => {
    try {
        
        dispatch({
            type:DELETE_REVIEW_REQUEST,
        })

        const {data} = await axios.delete(`/api/v1/product/review?productId=${productId}&reviewId=${reviewId}`) // lots of things we ar getting so data taking

        dispatch({
            type:DELETE_REVIEW_SUCCESS,
            payload:data.success
        })


    } catch (error) {
        dispatch({
            type:DELETE_REVIEW_FAIL,
            payload:error.response.data.message
        })
    }
} 



// Clearing error
export const clearErrors = () => async(dispatch) =>{
    dispatch({
        type:CLEAR_ERRORS
    })
}