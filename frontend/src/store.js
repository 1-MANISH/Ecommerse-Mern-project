import {createStore,combineReducers,applyMiddleware} from "redux"
import {thunk} from "redux-thunk"
import {composeWithDevTools} from "@redux-devtools/extension"
import { allReviewReducer, deleteProductReducer, newProductReducer, newReviewReducer, productDetailsReducer, productReducer, reviewActionReducer } from "./reducers/productReducer"
import { allUserReducer, forgotPasswordReducer, profileReducer, userActionReducer, userDetailsReducer, userReducer } from "./reducers/userReducer"
import { cartReducer } from "./reducers/cartReducer"
import { allOrderReducer, myOrdersReducer, newOrderReducer, orderDetailsReducer, orderReducer } from "./reducers/orderReducer"

const reducer = combineReducers({
    products:productReducer,
    product:productDetailsReducer,
    user:userReducer,
    profile:profileReducer,
    forgotPassword:forgotPasswordReducer,
    cart:cartReducer,
    newOrder:newOrderReducer,
    myOrders:myOrdersReducer,
    orderDetails:orderDetailsReducer,
    newReview:newReviewReducer,
    newProduct:newProductReducer,
    deleteProduct:deleteProductReducer,
    allOrder:allOrderReducer,
    order:orderReducer,
    allUser:allUserReducer,
    userDetails:userDetailsReducer,
    userAction:userActionReducer,
    allReview:allReviewReducer,
    reviewAction:reviewActionReducer,
})


let initialState = {
    cart:{
        cartItems:localStorage.getItem("cartItems") ? 
        JSON.parse(localStorage.getItem("cartItems")) : 
        [],
        shippingInfo:localStorage.getItem("shippingInfo") ?
        JSON.parse(localStorage.getItem("shippingInfo")) : {},
    }
}

const middleware = [thunk]

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
)


export default store
