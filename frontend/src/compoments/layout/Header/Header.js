import React from "react";
import "./header.css";
import { MdShoppingCart } from "react-icons/md";
import { FaUserAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "../../../images/logo.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
function Header() {
  let navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const searchSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products/${keyword}`);
    } else {
      navigate("/products");
    }
  };
  const handleChange = (e) => {
    const word = e.target.value;
    setKeyword(word);
  };
  return (
    <>
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
          <a class="navbar-brand" href="/">
            <img src={logo} alt="" className="image" />
          </a>

          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link class="nav-link active" aria-current="page" to="/">
                  Home
                </Link>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/products">
                  PRODUCTS
                </a>
              </li>
            </ul>

            <form className="d-flex form" onSubmit={searchSubmit}>
              <input
                class="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
                onChange={handleChange}
                value={keyword}
              />
              <button class="btn btn-outline-success" type="submit">
                Search
              </button>
            </form>

            <ul className="navbar-nav me-auto mb-2 mb-lg-0 right">
              <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="/cart">
                  <MdShoppingCart className="icon" />
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link active" href="/login">
                  <FaUserAlt className="icon" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Header;
