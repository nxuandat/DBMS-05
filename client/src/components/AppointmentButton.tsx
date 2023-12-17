import React from "react";
import { Link } from "react-router-dom";
import { IconButton } from "@mui/material";
import EventNoteIcon from "@mui/icons-material/EventNote";
import "./AppointmentButton.css";

const AppointmentButton = () => (
  <div className='appointment-button-container'>
    <Link to='/appointment' className='appointment-button'>
      <IconButton color='primary' aria-label='add an appointment'>
        <EventNoteIcon />
      </IconButton>
      ĐẶT HẸN NGAY
    </Link>
  </div>
);

export default AppointmentButton;
