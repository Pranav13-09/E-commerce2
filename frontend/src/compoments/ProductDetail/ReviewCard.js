import React from "react";
import ReactStars from "react-rating-stars-component";
import ProfilePng from "../../images/Profile.png";
import "./ReviewCard.css";

const ReviewCard = ({ review }) => {
  const options = {
    edit: false,
    value: review.rating,
    isHalf: true,
    activeColor: "tomato",
    color: "rgb(20, 20, 20)",
    size: window.innerWidth < 600 ? 20 : 25,
  };

  return (
    <>
      <div className="ReviewCard">
        <img src={ProfilePng} alt="" />
        <p>{review.name}</p>
        <ReactStars {...options} />
        <span>{review.comment}</span>
      </div>
    </>
  );
};

export default ReviewCard;
