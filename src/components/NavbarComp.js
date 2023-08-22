import React from "react";
import "./StyleNavbar.css";
// import { Link } from "react-router-dom";

export const NavbarComp = () => {
  return (
    <div>
      <nav className="main_nav">
        {/* <Link to='/'> */}
        <div className="logo">
          <img src={require("../components/assests/logo.png")} alt="img1" />
        </div>
        {/* </Link> */}
        
        <div className="titles"></div>
        <div className="titles2">
          {/* <Link to="/connected"> */}
            <button className="connect1">Connect to Wallet</button>
          {/* </Link> */}
          {/* <Link to="/sendmatic"> */}
            <button className="connect1">Send Matic</button>
          {/* </Link> */}
          {/* <Link to="/sendtoken"> */}
            <button className="connect1">Send Token</button>
          {/* </Link> */}
          <button id="dark">
            {" "}
            <img src={require("../components/assests/dark.png")} alt="img1" />
          </button>
        </div>
      </nav>
    </div>

    // <div className='menu-link'>
    //     <ul>
    //         <li id='Swap'><a href='#'>Swap</a></li>
    //         <li><a href='#'>Swap</a></li>
    //         <li><a href='#'>About J$WAP</a></li>
    //         <li><a href='#'>Vote</a></li>
    //         <li><a href='#'>0 SQA</a></li>
    //         <li><a href='#'>Connect to Wallet</a></li>
    //         <li><a href='#'>{MdDarkMode}</a></li>

    //     </ul>

    // </div>
  );
};
