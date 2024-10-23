import {
    CREATE_ORDER_REQUEST,
    CREATE_ORDER_SUCCESS,
    CREATE_ORDER_FAIL,
    MY_ORDERS_REQUEST,
    MY_ORDERS_SUCCESS,
    MY_ORDERS_FAIL,
    ORDER_DETAILS_REQUEST,
    ORDER_DETAILS_SUCCESS,
    ORDER_DETAILS_FAIL,
    CLEAR_ERRORS,
    ALL_ORDER_REQUEST,
    ALL_ORDER_SUCCESS,
    ALL_ORDER_FAIL,
    DELETE_ORDER_REQUEST,
    DELETE_ORDER_SUCCESS,
    DELETE_ORDER_FAIL,
    UPDATE_ORDER_REQUEST,
    UPDATE_ORDER_SUCCESS,
    UPDATE_ORDER_FAIL
}
from "../constants/orderConstant";

import axios from "axios";

//Create order

export const createOrder = (order) => async (dispatch, getState) => {
    try {
        dispatch({ type: CREATE_ORDER_REQUEST })

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const { data } = await axios.post("/api/v1/order/new",
            order,
            config
        )

        dispatch({
            type: CREATE_ORDER_SUCCESS,
            payload: data.order,
        }); 
    } catch (error) {
        dispatch({
            type: CREATE_ORDER_FAIL,    
            payload: error.response.data.message,
        })
    }
}

// Get my orders

export const getMyOrders = () => async (dispatch, getState) => {
    try {
        dispatch({ type: MY_ORDERS_REQUEST })

        const { data } = await axios.get("/api/v1/orders/me")

        dispatch({
            type: MY_ORDERS_SUCCESS,
            payload: data.orders,
        }); 
    } catch (error) {
        dispatch({
            type: MY_ORDERS_FAIL,    
            payload: error.response.data.message,
        })
    }
}

// Get a single order details

export const getOrderDetails = (orderId) => async (dispatch, getState) => {
    try {
        dispatch({ type: ORDER_DETAILS_REQUEST })

        const { data } = await axios.get(`/api/v1/order/${orderId}`)

        dispatch({
            type: ORDER_DETAILS_SUCCESS,
            payload: data.order,
        }); 
    } catch (error) {
        dispatch({
            type: ORDER_DETAILS_FAIL,    
            payload: error.response.data.message,
        })
    }
}

// Get all order for admin

export const getAllOrders = () => async (dispatch, getState) => {
    try {
        dispatch({ type: ALL_ORDER_REQUEST })

        const { data } = await axios.get("/api/v1/admin/orders/all")

        dispatch({
            type:ALL_ORDER_SUCCESS,
            payload: data.orders,
        }); 
    } catch (error) {
        dispatch({
            type: ALL_ORDER_FAIL,    
            payload: error.response.data.message,
        })
    }
}

// Delete order by admin

export const deleteOrder = (orderId) => async (dispatch, getState) => {
    try {
        dispatch({ type: DELETE_ORDER_REQUEST })

        const { data } = await axios.delete(`/api/v1/admin/order/${orderId}`)

        dispatch({
            type:DELETE_ORDER_SUCCESS,
            payload: data.success,
        }); 
    } catch (error) {
        dispatch({
            type: DELETE_ORDER_FAIL,    
            payload: error.response.data.message,
        })
    }
}


// Update order status
export const updateOrderStatus = (order,orderId) => async (dispatch, getState) => {
    try {
        dispatch({ type: UPDATE_ORDER_REQUEST })

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        }

        const { data } = await axios.put(`/api/v1/admin/order/${orderId}`,
            order,
            config
        )

        dispatch({
            type:UPDATE_ORDER_SUCCESS,
            payload: data.success,
        }); 
    } catch (error) {
        dispatch({
            type: UPDATE_ORDER_FAIL,    
            payload: error.response.data.message,
        })
    }
}

// Clearing error
export const clearErrors = () => async(dispatch) =>{
    dispatch({
        type:CLEAR_ERRORS
    })
}