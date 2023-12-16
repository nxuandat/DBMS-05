import React, { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Legend,
    Cell,
} from "recharts";
import axios from 'axios';

const styles = {
    title: "text-[25px] text-black dark:text-white font-[500] font-Poppins text-center py-2",
    label: "text-[16px] font-Poppins text-black dark:text-white",
}

const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', 'red', 'pink'];

const getPath = (x: number, y: number, width: number, height: number): string => {
    return `M${x},${y + height}C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3}
    ${x + width / 2}, ${y}
    C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${x + width}, ${y + height}
    Z`;
};

interface TriangleBarProps {
    fill: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

const TriangleBar: React.FC<TriangleBarProps> = ({ fill, x, y, width, height }) => {
    return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
};

interface RevenueData {
    name: string;
    sum: number;
}

const RevenueAnalytics: React.FC = () => {
    const [data, setData] = useState<RevenueData[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(`${import.meta.env.VITE_REACT_SERVER_PORT}/admin/get-revenue-analytics`, { withCredentials: true });
            const analyticsData: RevenueData[] = [];
            response.data.doanhthu.forEach((item: any) => {
                const Thang = new Date(item.Thang).toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
                const TongDoanhThu = Number(item.TongDoanhThu) / 1000;
                analyticsData.push({ name: Thang, sum: TongDoanhThu });
            });
            setData(analyticsData);
        };

        fetchData();
    }, []);

    return (
        <div className="mt-[50px] dark:bg-[#111C43] shadow-sm pb-5 rounded-sm">
            <div>
                <h1 className={`${styles.title} px-5 !text-start`}>
                    Revenue Analytics
                </h1>
                <p className={`${styles.label} px-5`}>
                    Last 12 months revenue data{" "}
                </p>
            </div>

            <div className="w-full h-screen flex items-center justify-center">
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <BarChart
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
                        <YAxis label={{ value: '(x1000)', angle: -90, position: 'insideLeft' }}/>
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="sum" fill="#8884d8" shape={<TriangleBar />} label={{ position: 'top' }}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % 20]} />
                            ))}
                        </Bar>
                    </BarChart>
                </div>
            </div>
        </div>
    )
}

export default RevenueAnalytics;
