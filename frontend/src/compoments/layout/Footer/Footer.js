import React from "react";
import playstore from "../../../images/playstore.png";
import Appstore from "../../../images/Appstore.png";
import "./footer.css";
const Footer = () => {
  return (
    <>
      <footer id="footer">
        <div className="leftfooter">
          <h4>Download Your App</h4>
          <p>Download App for Android and IOS mobile phone</p>
          <img src={playstore} alt="playstore" />
          <img src={Appstore} alt="Appstore" />
        </div>
        <div className="midfooter">
          <h1>ECOMMERCE.</h1>
          <p>High Quality is our first priority</p>
          <p>NEVER LETS YOU DOWN</p>
        </div>
        <div className="rightfooter">
          <h4>Follow Us</h4>
          <a href="http://instagram.com/meabhisingh">Instagram</a>
          <a href="http://youtube.com/6packprogramemr">Youtube</a>
          <a href="http://instagram.com/meabhisingh">Facebook</a>
        </div>
      </footer>
    </>
  );
};

export default Footer;
