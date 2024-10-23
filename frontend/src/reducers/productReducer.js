
import { 
    ALL_PRODUCT_REQUEST,
    ALL_PRODUCT_SUCCESS,
    ALL_PRODUCT_FAIL,
    PRODUCT_DETAIL_REQUEST,
    PRODUCT_DETAIL_SUCCESS,
    PRODUCT_DETAIL_FAIL,
    NEW_REVIEW_REQUEST,
    NEW_REVIEW_SUCCESS,
    NEW_REVIEW_RESET,
    NEW_REVIEW_FAIL,
    ADMIN_PRODUCT_REQUEST,
    ADMIN_PRODUCT_SUCCESS,
    ADMIN_PRODUCT_FAIL,
    CREATE_NEW_PRODUCT_REQUEST,
    CREATE_NEW_PRODUCT_SUCCESS,
    CREATE_NEW_PRODUCT_RESET,
    CREATE_NEW_PRODUCT_FAIL,
    DELETE_PRODUCT_REQUEST,
    DELETE_PRODUCT_SUCCESS,
    DELETE_PRODUCT_RESET,
    DELETE_PRODUCT_FAIL,
    UPDATE_PRODUCT_REQUEST,
    UPDATE_PRODUCT_SUCCESS,
    UPDATE_PRODUCT_RESET,
    UPDATE_PRODUCT_FAIL,
    CLEAR_ERRORS, 
    ALL_REVIEWS_REQUEST,
    ALL_REVIEWS_SUCCESS,
    ALL_REVIEWS_FAIL,
    DELETE_REVIEW_REQUEST,
    DELETE_REVIEW_SUCCESS,
    DELETE_REVIEW_FAIL,
    DELETE_REVIEW_RESET
} from "../constants/productConstant"

export const productReducer  = (state={products:[]},action ) => {
    
    switch (action.type) {
        case ALL_PRODUCT_REQUEST:
        case ADMIN_PRODUCT_REQUEST:
            return {
                loading:true,
                products:[]
            }
        case ALL_PRODUCT_SUCCESS:
            return {
                loading:false,
                products:action.payload.products,
                productCounts:action.payload.productCounts,
                resultPerPage:action.payload.resultPerPage,
                filteredProductCounts:action.payload.filteredProductCounts
            }
        case ADMIN_PRODUCT_SUCCESS:
            return {
                loading:false,
                products:action.payload
            }
        case ALL_PRODUCT_FAIL:
        case ADMIN_PRODUCT_FAIL:
            return {
                loading:false,
                error:action.payload
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                error:null
            }
        default:
            return state
    }
}

export const productDetailsReducer  = (state={product:{}},action ) =>{
    
    switch (action.type) {
        case PRODUCT_DETAIL_REQUEST:
            return {
                loading:true,
                ...state
            }
        case PRODUCT_DETAIL_SUCCESS:
            return {
                loading:false,
                product:action.payload.product
            }
        case PRODUCT_DETAIL_FAIL:
            return {
                loading:false,
                error:action.payload
            }
        case CLEAR_ERRORS:
            return {  
                ...state,
                error:null
            } 
            default:
                return state
    }
}

export const newReviewReducer  = (state={},action ) =>{
    
    switch (action.type) {
        case NEW_REVIEW_REQUEST:
            return {
                loading:true,
                ...state
            }
        case NEW_REVIEW_SUCCESS:
            return {
                loading:false,
                success:action.payload
            }
        case NEW_REVIEW_FAIL:
            return {
                ...state,
                loading:false,
                error:action.payload
            }
        case NEW_REVIEW_RESET:
            return {
                ...state,
                success:false,
                loading:false
            }
        case CLEAR_ERRORS:
            return {  
                ...state,
                error:null
            } 
            default:
                return state
    }
}

// for admin only
// Create New PRODUCT
export const newProductReducer  = (state={product:{}},action ) =>{
    
    switch (action.type) {
        case CREATE_NEW_PRODUCT_REQUEST:
            return {
                loading:true,
                ...state
            }
        case CREATE_NEW_PRODUCT_SUCCESS:
            return {
                loading:false,
                success:action.payload.success,
                product:action.payload.product
            }
        case CREATE_NEW_PRODUCT_FAIL:
            return {
                ...state,
                loading:false,
                error:action.payload
            }
        case CREATE_NEW_PRODUCT_RESET:
            return {
                ...state,
                success:false,
                loading:false
            }
        case CLEAR_ERRORS:
            return {  
                ...state,
                error:null
            } 
            default:
                return state
    }
}

// Delete Product , update Product
export const deleteProductReducer  = (state={},action ) =>{
    
    switch (action.type) {
        case DELETE_PRODUCT_REQUEST:
        case UPDATE_PRODUCT_REQUEST:
            return {
                loading:true,
                ...state
            }
        case DELETE_PRODUCT_SUCCESS:
            return {
                ...state,
                loading:false,
                isDeleted:action.payload
            }
        case UPDATE_PRODUCT_SUCCESS:
            return {
                ...state,
                loading:false,
                isUpdated:action.payload
            }
        case DELETE_PRODUCT_FAIL:
        case UPDATE_PRODUCT_FAIL:
            return {
                ...state,
                loading:false,
                error:action.payload
            }
        case DELETE_PRODUCT_RESET:
            return {
                ...state,
                isDeleted:false,
                loading:false
            }
        case UPDATE_PRODUCT_RESET:
            return {
                ...state,
                isUpdated:false,
                loading:false
            }
        
        case CLEAR_ERRORS:
            return {  
                ...state,
                error:null
            } 
            default:
                return state
    }
}

export const allReviewReducer = (state={reviews:[]},action) => {

    switch (action.type) {
        case ALL_REVIEWS_REQUEST:
            return {
                ...state,
                loading: true
            }
        case ALL_REVIEWS_SUCCESS:
            return {
                loading: false,
                reviews: action.payload
            }
        case ALL_REVIEWS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }
        default:
            return state
    }
}
export const reviewActionReducer = (state = {}, action) => {

    switch (action.type) {

        case DELETE_REVIEW_REQUEST:
            return {
                ...state,
                loading: true
            }
        case DELETE_REVIEW_SUCCESS:
            return {
                loading: false,
                isDeleted: action.payload
            }
        case DELETE_REVIEW_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
                isDeleted: false
            }
        case DELETE_REVIEW_RESET:
            return {
                ...state,
                loading: false,
                isDeleted: false
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }
        default:
            return state
    }
}