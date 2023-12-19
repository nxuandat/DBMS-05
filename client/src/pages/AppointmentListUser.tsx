import React, { useEffect,useState } from "react";
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from 'axios'

function AppointmentListUser() {
  const [events, setEvents] = useState([]);
  useEffect(() => {
    
    axios.get(`${import.meta.env.VITE_REACT_SERVER_PORT}/user/get-appointment`,{ withCredentials:true }) // Thay đổi URL này thành URL của API của bạn
      .then(response => {
        const appointments = response.data.appointments;
       

        
        const events = appointments.map((appointment: { HoTen: any; NgayGioKham: any; MaSoHen: any; MaNS: any; MaKH: any; SoDT: any; }) => ({
          title:`(Nha Sĩ: ${appointment.HoTen})`,
          start: appointment.NgayGioKham,
          extendedProps: {
            MaSoHen: appointment.MaSoHen,
            MaNS: appointment.MaNS,
            MaKH: appointment.MaKH,
            SoDT: appointment.SoDT,
          },
        }));

        // Cập nhật state
        setEvents(events);
      })
      .catch(error => {
        console.error("Error fetching appointments:", error);
      });
  }, []);
  return (
    <div>
      <Fullcalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={"dayGridMonth"}
        headerToolbar={{
          start: "today prev,next", 
          center: "title",
          end: "dayGridMonth,timeGridWeek,timeGridDay", 
        }}
        slotLabelFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }}
        timeZone='UTC'
        height={"90vh"}
        events={events}
      />
    </div>
  );
}

export default AppointmentListUser;