import React, { useState, useCallback, useEffect } from 'react';
import Scheduler from '../components/Scheduler/Scheduler.tsx';
import Toolbar from '../components/Toolbar/Toolbar.tsx';
import '../components/Scheduler/Scheduler.css'
import '../components/Toolbar/Toolbar.css'
import axios from 'axios'


interface Event {
    start_date: string;
    end_date: string;
    text: string;
    id: number;
    doctor: string;
}

const data: Event[] = [
    { start_date:'2020-06-10 6:00', end_date:'2020-06-10 8:00', text:'Event 1', id: 1,doctor:'John'},
    { start_date:'2020-06-13 10:00', end_date:'2020-06-13 18:00', text:'Event 2', id: 2 ,doctor:'Kenny'}
];

const DentistSchedule: React.FC = () => {
    const [currentTimeFormatState, setCurrentTimeFormatState] = useState(true);
    const [messages, setMessages] = useState<string[]>([]);
    const [dentistSchedules, setDentistSchedules] = useState([]);


    const fetchDentistSchedules = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_REACT_SERVER_PORT}/user/get-all-dentists-schedules`, { withCredentials: true });
            return response.data.dentistsSchedules;
        } catch (error) {
            console.error('Failed to fetch dentist schedules:', error);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
          const data = await fetchDentistSchedules();
          // Convert data to the format that Scheduler component expects
          const events = data.map(item => ({
            start_date: item.GioBatDau,
            end_date: item.GioKetThuc,
            text: item.TinhTrangCuocHen,
            id: item.STT,
            doctor: item.MaNS
          }));
          scheduler.parse(events);
        };
        fetchData();
      }, []);


    const addMessage = useCallback((message: string) => {
        const maxLogLength = 5;
        const newMessages = [message, ...messages];
        if (newMessages.length > maxLogLength) {
            newMessages.length = maxLogLength;
        }
        setMessages(newMessages);
    }, [messages]);

    const logDataUpdate = useCallback((action: string, ev: any, id: number, doctor:string) => {
        const text = ev && ev.text ? ` (${ev.text})` : '';
        const doctorText = ` (Doctor: ${doctor})`;
        // const message = `event ${action}: ${id} ${text}`;
        const message = `event ${action}: ${id} ${text}${doctorText}`;
        addMessage(message);
    }, [addMessage]);

    const handleTimeFormatStateChange = useCallback((state: boolean) => {
        setCurrentTimeFormatState(state);
    }, []);

    return (
        <div>
            <div className="tool-bar">
                <Toolbar
                    timeFormatState={currentTimeFormatState}
                    onTimeFormatStateChange={handleTimeFormatStateChange}
                />
            </div>
            <div className='scheduler-container'>
                <Scheduler
                    events={data}
                    // events={dentistSchedules}
                    timeFormatState={currentTimeFormatState}
                    onDataUpdated={logDataUpdate}
                />
            </div>
           
        </div>
    );
}

export default DentistSchedule;