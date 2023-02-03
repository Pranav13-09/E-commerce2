import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Loader from "../loader/Loader";
import { Link } from "react-router-dom";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import { logOutUser } from "../../actions/userAction";

import Image from "../../images/Profile.png";
import Header from "../layout/Header/Header";
import { Button } from "@material-ui/core";

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading, isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();
  console.log("i am on profile page");

  const handleLogOut = () => {
    console.log("i am clicked");
    dispatch(logOutUser());
    console.log("i can be here too");
    window.location.reload();
    // navigate("/login");
    console.log("why cant i be here why");
  };

  const handleBack = () => {
    navigate("/");
  };

  useEffect(() => {
    console.log("i am here inside");
    console.log(loading, "i am loading");
    console.log(isAuthenticated, "i am authenticated");

    console.log("i am inside loading");
    if (!isAuthenticated) {
      console.log("i am isAurhticated");
      navigate("/");
    }
  });

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <div className="profileContainer">
            <div>
              <button className="home" onClick={handleBack}>
                Back
              </button>

              <h1>My Profile</h1>
              <img src={Image} alt={user.name} />
              <Link to="/me/update">Edit Profile</Link>
            </div>
            <div>
              <div>
                <h4>Full Name</h4>
                <p>{user.name}</p>
              </div>
              <div>
                <h4>Email</h4>
                <p>{user.email}</p>
              </div>
              <div>
                <h4>Joined On</h4>
                <p>{String(user.createdAt).substr(0, 10)}</p>
              </div>

              <div>
                <Link to="/orders">My Orders</Link>
                <Link to="/password/update">Change Password</Link>
                <button className="LogOut" onClick={handleLogOut}>
                  LOG OUT{" "}
                </button>
                {user.role === "admin" && (
                  <Link to="/dashboard">DASHBOARD </Link>
                )}
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Profile;
