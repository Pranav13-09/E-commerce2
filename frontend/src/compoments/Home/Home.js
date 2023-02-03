import React from "react";
import "./Home.css";
import { CgMouse } from "react-icons/cg";
import Product from "./Product";
import Metadata from "../layout/Metadata";
import { getProducts } from "../../actions/productAction";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../loader/Loader";
import { useAlert } from "react-alert";

const Home = () => {
  const dispatch = useDispatch();

  const { loading, error, products, productsCount } = useSelector(
    (state) => state.products
  );

  const alert = useAlert();
  useEffect(() => {
    console.log(products, "i am products");

    if (error) {
      return alert.error(error);
    }
    dispatch(getProducts());
  }, [dispatch, error, alert]);
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Metadata title="HOME PAGE" />
          <div className="banner">
            <p>Welcome to E-commerce</p>
            <h1>FIND AMAZING PRODUCT BELOW</h1>
            <a href="#container">
              <button>
                Scroll <CgMouse />
              </button>
            </a>
          </div>

          <h2 className="homeHeading">FEATURED PRODUCTS</h2>
          <div className="container" id="container">
            {products &&
              products.map((product) => (
                <Product product={product} key={product._id} />
              ))}
          </div>
        </>
      )}
    </>
  );
};

export default Home;
