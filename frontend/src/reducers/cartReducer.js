import { ADD_TO_CART,REMOVE_CART_ITEM ,SAVE_SHIPPING_INFO} from "../constants/cartConstant";

export const cartReducer = (state = { cartItems: [], shippingInfo:{} }, action) => {

    switch (action.type) {
        case ADD_TO_CART:
            const item = action.payload // product we want to add -  ID

            const isItemExist = state.cartItems.find((i)=>{
                return i.product === item.product // product as id ref
            })

            if(isItemExist){
                return {
                    ...state,
                    cartItems: state.cartItems.map((i)=>{
                        return i.product === isItemExist.product ? item : i
                 })
                }
            }else{
                return {
                    ...state,
                    cartItems: [...state.cartItems, item]
                }
            }
        
        case REMOVE_CART_ITEM:
            return {
                ...state,
                cartItems: state.cartItems.filter((i) => i.product !== action.payload) //product id we are sending in payload
            }
        case SAVE_SHIPPING_INFO:
            return {
                ...state,
                shippingInfo: action.payload
            }
        default:
            return state;
    }
}