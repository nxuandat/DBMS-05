import React, { useEffect, useState } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";
import axios from 'axios';

const styles = {
    title: "text-[25px] text-black dark:text-white font-[500] font-Poppins text-center py-2",
    label: "text-[16px] font-Poppins text-black dark:text-white",
    input: "w-full text-black dark:text-white bg-transparent border rounded h-[40px] px-2 outline-none mt-[10px] font-Poppins",
    button: "flex flex-row justify-center items-center py-3 px-6 rounded-full cursor-pointer bg-[#2190ff] min-h-[45px] w-full text-[16px] font-Poppins font-semibold"
}

const InvoiceAnalytics = () => {
    const [data, setData] = useState<any[]>([]);

    console.log(data);

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(`${import.meta.env.VITE_REACT_SERVER_PORT}/admin/get-invoices-analytics`, { withCredentials: true });
            const analyticsData: any = [];

            response.data.users.last12Months.forEach((item: any) => {
                analyticsData.push({ name: item.month, count: item.count });
            });

            setData(analyticsData);
        };

        fetchData();
    }, []);

    return (
        <div className="mt-[50px] dark:bg-[#111C43] shadow-sm pb-5 rounded-sm">
            <div>
                <h1 className={`${styles.title} px-5 !text-start`}>
                    Invoices Analytics
                </h1>
                <p className={`${styles.label} px-5`}>
                    Last 12 months analytics data{" "}
                </p>
            </div>

            <div className="w-full h-screen flex items-center justify-center">
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <AreaChart
                        data={data}
                        width={1000}
                        height={300}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 0,
                            bottom: 0,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Area
                            type="monotone"
                            dataKey="count"
                            stroke="#4d62d9"
                            fill="#4d62d9"
                        />
                    </AreaChart>
                </div>
            </div>
        </div>
    )
}

export default InvoiceAnalytics
