import { Connection, ConnectionConfig, Request } from 'tedious';
require("dotenv").config();


export default function ConnectToDataBaseWithLogin(database_user: string, database_password: string): Connection {
    const config: ConnectionConfig = {
       server: process.env.DB_SERVER, //update me
       authentication: {
         type: 'default',
         options: {
           userName: database_user, //updated
           password: database_password //updated
         }
       },
       options: {
         // If you are on Microsoft Azure, you need encryption:
         encrypt: true,
         trustServerCertificate: true,
         database: process.env.DB_DATABASE //update me
       }
    };
   
    const connection = new Connection(config);
   
    connection.on('connect', (err: Error | null) => {
       if (err) {
         console.error(`Connection error: ${err.message}`);
       } else {
         console.log(`Connected to Microsoft SQL Server with ${database_user}`);
       }
    });
   
    connection.connect();
   
    return connection;
}