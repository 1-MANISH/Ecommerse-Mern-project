import React, { useState } from "react";
import './App.css';
import Header from "./component/layout/Header/Header.js"
import Footer from "./component/layout/Footer/Footer.js"
import {BrowserRouter as Router,Route,Routes} from "react-router-dom"
import webFont from "webfontloader"
import Home from "./component/Home/Home.js"
import ProductDetails from "./component/Product/ProductDetails.js";
import Products from "./component/Product/Products.js";
import Search from "./component/Product/Search.js"
import LoginSignUp from "./component/User/LoginSignUp"
import store from "./store"
import {loadUser} from "./actions/userAction"
import UserOptions from "./component/layout/Header/UserOptions"
import { useSelector } from "react-redux";
import Profile from "./component/User/Profile.js"
import UpdateProfile from "./component/User/UpdateProfile.js"
import UpdatePassword from "./component/User/UpdatePassword.js"
import ForgotPassword from "./component/User/ForgotPassword.js"
import ResetPassword from "./component/User/ResetPassword.js"
import Cart from "./component/Cart/Cart.js"
import Shipping from "./component/Cart/Shipping.js"
import ConfirmOrder from "./component/Cart/ConfirmOrder.js"
import Payment from "./component/Cart/Payment.js"
import OrderSuccess from "./component/Cart/OrderSuccess.js"
import MyOrders from "./component/Order/MyOrders.js"
import OrderDetails from "./component/Order/OrderDetails.js"
import axios from "axios";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Dashboard from "./component/Admin/Dashboard.js"
import ProductList from "./component/Admin/ProductList.js"
import NewProduct from "./component/Admin/NewProduct.js";
import UpdateProduct from "./component/Admin/UpdateProduct.js";
import OrderList from "./component/Admin/OrderList.js"
import ProcessOrder from "./component/Admin/ProcessOrder.js"
import UserList from "./component/Admin/UserList.js"
import UpdateUser from "./component/Admin/UpdateUser.js"
import ProductReviews from "./component/Admin/ProductReviews.js"
import Contact from "./component/layout/Contact/Contact.js";
import About from "./component/layout/About/About.js";
import NotFound from "./component/layout/NotFound/NotFound.js"
function App() {


  const { isAuthenticated, user ,isAdmin } = useSelector((store) => store.user)

  const [stripeApiKey,setStripeApiKey] = useState("")

  async function getStipeApiKey(){
    const {data} = await axios.get("/api/v1/stripeApiKey")
    
    setStripeApiKey(data.stripeApiKey.toString())
  }


  React.useEffect(()=>{
    webFont.load({
      google:{
        families: ["Roboto", "Droid Sans", "Chilanka"],
      }
    })
    store.dispatch(loadUser())
    getStipeApiKey()
  },[stripeApiKey])

  window.addEventListener("contextmenu",(e) =>
    e.preventDefault()
  )

  const PaymentComponent = () => {
    return (
      stripeApiKey &&
      <Elements stripe={loadStripe(stripeApiKey)}>
        <Payment />
      </Elements>
    );
  };

  return (
    <Router>

       <Header />

       {isAuthenticated && <UserOptions user={user} />}

      <Routes>

          <Route exact path="/" Component={Home} />
          <Route exact path="/product/:productId" Component={ProductDetails} />
          <Route exact path="/products" Component={Products} />
          <Route  path="/products/:keyword" Component={Products} />
          <Route exact path="/search" Component={Search} /> 
          <Route exact path="/about" Component={About} /> 
          <Route exact path="/contact" Component={Contact} /> 

          {isAuthenticated && <Route exact path="/account" Component={Profile} /> }
          {isAuthenticated && <Route exact path="/me/update" Component={UpdateProfile} /> }
          {isAuthenticated && <Route exact path="/password/update" Component={UpdatePassword} />}
          
          <Route exact path="/password/forgot" Component={ForgotPassword} />
          <Route exact path="/password/reset/:token" Component={ResetPassword} />

          <Route exact path="/login" Component={LoginSignUp} />

          <Route exact path="/cart" Component={Cart} />

          {isAuthenticated && <Route exact path="/shipping" Component={Shipping} />}
          {isAuthenticated && <Route exact path="/order/confirm" Component={ConfirmOrder} />}
          {isAuthenticated  && <Route exact path="/process/payment" Component={PaymentComponent}  />}
          {isAuthenticated && <Route exact path="/success" Component={OrderSuccess} />}
          {isAuthenticated && <Route exact path="/orders" Component={MyOrders} />}
          {isAuthenticated && <Route exact path="/order/:id" Component={OrderDetails} />}

          {isAuthenticated && isAdmin && <Route exact path="/admin/dashboard" Component={Dashboard} />}
          {isAuthenticated && isAdmin && <Route exact path="/admin/products" Component={ProductList} />}
          {isAuthenticated && isAdmin && <Route exact path="/admin/product" Component={NewProduct} />}
          {isAuthenticated && isAdmin && <Route exact path="/admin/product/:id" Component={UpdateProduct} />}
          {isAuthenticated && isAdmin && <Route exact path="/admin/orders" Component={OrderList} />}
          {isAuthenticated && isAdmin && <Route exact path="/admin/order/:id" Component={ProcessOrder} />}
          {isAuthenticated && isAdmin && <Route exact path="/admin/users" Component={UserList} />}
          {isAuthenticated && isAdmin && <Route exact path="/admin/user/:id" Component={UpdateUser} />}
          {isAuthenticated && isAdmin && <Route exact path="/admin/reviews" Component={ProductReviews} />}

          <Route
          path="*"
          Component={
           NotFound
          }
        />


      </Routes>
     
     

       <Footer />

    </Router>
  );
}

export default App;
