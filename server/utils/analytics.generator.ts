import { Connection, Request as SQLRequest, TYPES } from 'tedious';
import ConnectToDataBaseWithLogin from './dblogin';

interface MonthData {
  month: string;
  count: number;
}


export async function generateLast12MonthsDataUser(MaQTV: any, password: any): Promise<{ last12Months: MonthData[] }> {
    const last12Months: MonthData[] = [];
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);
  
    const promises = Array.from({ length: 12 }, (_, i) => {
      const endDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() - i * 28
      );
      const startDate = new Date(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate() - 28
      );

     
      const monthYear = endDate.toLocaleString("default", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      
  
      return new Promise((resolve, reject) => {
        const connection: Connection = ConnectToDataBaseWithLogin(MaQTV, password);
        connection.on('connect', err => {
          if (err) {
            console.error(err.message);
            reject(err);
          } else {
            const request = new SQLRequest(`SELECT COUNT(*) as count FROM KHACHHANG WHERE NgayTao BETWEEN @startDate AND @endDate`, err => {
              if (err) {
                console.error(err.message);
                reject(err);
              }
            });
  
            request.addParameter('startDate', TYPES.DateTime, startDate);
            request.addParameter('endDate', TYPES.DateTime, endDate);
  
            request.on('row', columns => {
              console.log(columns);
              const count = columns[0].value;
              resolve({ month: monthYear, count });
            });
  
            connection.execSql(request);
          }
        });
      });
    });
  
    const results = await Promise.all(promises) as MonthData[];
    return { last12Months: results.reverse() };
}

export async function generateLast12MonthsDataInvoice(MaQTV: any, password: any): Promise<{ last12Months: MonthData[] }> {
    const last12Months: MonthData[] = [];
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);
  
    const promises = Array.from({ length: 12 }, (_, i) => {
      const endDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() - i * 28
      );
      const startDate = new Date(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate() - 28
      );
  
      const monthYear = endDate.toLocaleString("default", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
  
      return new Promise((resolve, reject) => {
        const connection: Connection = ConnectToDataBaseWithLogin(MaQTV, password);
        connection.on('connect', err => {
          if (err) {
            console.error(err.message);
            reject(err);
          } else {
            const request = new SQLRequest(`SELECT COUNT(*) as count FROM HOADON WHERE NgayXuat BETWEEN @startDate AND @endDate`, err => {
              if (err) {
                console.error(err.message);
                reject(err);
              }
            });
  
            request.addParameter('startDate', TYPES.DateTime, startDate);
            request.addParameter('endDate', TYPES.DateTime, endDate);
  
            request.on('row', columns => {
              console.log(columns);
              const count = columns[0].value;
              resolve({ month: monthYear, count });
            });
  
            connection.execSql(request);
          }
        });
      });
    });
  
    const results = await Promise.all(promises) as MonthData[];
    return { last12Months: results.reverse() };
  }

  export async function generateLast12MonthsDataAppointment(MaQTV: any, password: any): Promise<{ last12Months: MonthData[] }> {
    const last12Months: MonthData[] = [];
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);
  
    const promises = Array.from({ length: 12 }, (_, i) => {
      const endDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() - i * 28
      );
      const startDate = new Date(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate() - 28
      );
  
      const monthYear = endDate.toLocaleString("default", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
  
      return new Promise((resolve, reject) => {
        const connection: Connection = ConnectToDataBaseWithLogin(MaQTV, password);
        connection.on('connect', err => {
          if (err) {
            console.error(err.message);
            reject(err);
          } else {
            const request = new SQLRequest(`SELECT COUNT(*) as count FROM LICHHEN WHERE NgayGioKham BETWEEN @startDate AND @endDate`, err => {
              if (err) {
                console.error(err.message);
                reject(err);
              }
            });
  
            request.addParameter('startDate', TYPES.DateTime, startDate);
            request.addParameter('endDate', TYPES.DateTime, endDate);
  
            request.on('row', columns => {
              console.log(columns);
              const count = columns[0].value;
              resolve({ month: monthYear, count });
            });
  
            connection.execSql(request);
          }
        });
      });
    });
  
    const results = await Promise.all(promises) as MonthData[];
    return { last12Months: results.reverse() };
  }
  
