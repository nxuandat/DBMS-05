import doctorHomeImg from "../images/doctorHome.svg";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import React, { useEffect } from 'react';
// import AppointmentForm from "./AppointmentForm";
import ServiceList from "../components/ServiceList/ServiceList";
import Reviews from "../components/ReviewsList/Reviews";
// import Carousel from "../components/Carousel";
// import banner1 from "../images/Banner1.png";
// import banner2 from "../images/Banner2.png";


export function Home() {
  
  return (
    
    <div id='biggg' className='mt-11'>
      <div className='row mb-9 mt-11'>
        <div className='col-md-8 col-lg-7 col-xl-6'>
          <img src={doctorHomeImg} className='img-fluid' alt='doctorHomeImg' />
        </div>
        <div className='col-md-4 col-lg-5 col-xl-6 d-flex align-items-center'>
          <div className='text-center'>
            <h1>Chào mừng bạn đến với trang của PerfectSmile Dental</h1>
            <Button
              style={{
                backgroundColor: "#34C38F",
                color: "white",
                marginRight: "10px",
                border: "1px solid #34C38F",
              }}
              component={Link}
              to='#'
            >
              (028) 3838 8388
            </Button>

            <Button
              style={{
                backgroundColor: "#ffffff",
                color: "#34C38F",
                marginRight: "10px",
                borderColor: "#34C38F",
                border: "1px solid #34C38F",
              }}
              component={Link}
              to='/appointment'
            >
              Đặt lịch hẹn
            </Button>
          </div>
        </div>
      </div>
      <ServiceList/>
      <Reviews/>
      {/* <Carousel bannerImages={[banner1, banner2]} /> */}
    </div>
  );
}
