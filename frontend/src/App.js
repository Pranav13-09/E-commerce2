import "./App.css";
import Header from "./compoments/layout/Header/Header";
import Footer from "./compoments/layout/Footer/Footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./compoments/Home/Home";
import React from "react";
import ProductDetails from "./compoments/ProductDetail/ProductDetail";
import Products from "./compoments/Products/Products";
import Login from "./compoments/User/Login";
import { useEffect, useState } from "react";
import store from "./store";
import { loaduser } from "./actions/userAction";
import { useSelector } from "react-redux";
import Profile from "./compoments/User/Profile";
import UpdateProfile from "./compoments/User/UpdateProfile";
import UpdatePassword from "./compoments/User/UpdatePassword";
import ForgotPassword from "./compoments/User/ForgotPassword";
import ResetPassword from "./compoments/User/ResetPassword";
import Cart from "./compoments/Cart/Cart";
import Shipping from "./compoments/Cart/Shipping";
import ConfirmOrder from "./compoments/Cart/ConfirmOrder";
import axios from "axios";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import OrderSuccess from "./compoments/Cart/OrderSucess";
import Payment from "./compoments/Cart/Payment";
import OrderDetails from "./compoments/Order/OrderDetails";
import MyOrders from "./compoments/Order/MyOrder";
import Dashboard from "./compoments/Admin/DashBoard";
import ProductList from "./compoments/Admin/ProductList";
import UsersList from "./compoments/Admin/UserList";
import OrderList from "./compoments/Admin/OrderList";
import ProductReviews from "./compoments/Admin/ProductReview";
import NewProduct from "./compoments/Admin/NewProduct";
import ProcessOrder from "./compoments/Admin/ProcessOrder";

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    const { data } = await axios.get("/payment/stripeapikey");

    setStripeApiKey(data.stripeApiKey);
  }
  useEffect(() => {
    store.dispatch(loaduser());
    getStripeApiKey();
  }, []);
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/product/:id" element={<ProductDetails />}></Route>
          <Route path="/products" element={<Products />}></Route>
          <Route path="/products/:keyword" element={<Products />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/account" element={<Profile />}></Route>
          <Route path="/me/update" element={<UpdateProfile />}></Route>
          <Route path="/password/update" element={<UpdatePassword />}></Route>
          <Route path="/password/forgot" element={<ForgotPassword />}></Route>
          <Route
            path="/user/password/reset/:token"
            element={<ResetPassword />}
          ></Route>
          <Route path="/cart" element={<Cart />}></Route>
          <Route path="/login/shipping" element={<Shipping />}></Route>
          <Route path="/order/confirm" element={<ConfirmOrder />} />
          {stripeApiKey && (
            <Route
              path="/process/payment"
              element={
                <Elements stripe={loadStripe(stripeApiKey)}>
                  <Payment />
                </Elements>
              }
            />
          )}

          <Route path="/success" element={<OrderSuccess />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/order/:id" element={<OrderDetails />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin/products" element={<ProductList />} />
          <Route path="/admin/users" element={<UsersList />} />
          <Route path="/admin/orders" element={<OrderList />} />
          <Route path="/admin/reviews" element={<ProductReviews />} />
          <Route path="/admin/product" element={<NewProduct />} />
          <Route path="/admin/order/:id" element={<ProcessOrder />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
