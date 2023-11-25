import {app} from "./app"
import http from "http";
const server = http.createServer(app);
require("dotenv").config();


//create server
server.listen(process.env.PORT, () =>{
    console.log(`Server is connected with port ${process.env.PORT}`);
    
})

