require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
export const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";
import  ConnectToDatabase  from "./utils/db"
import { ErrorMiddleware } from "./middleware/error";
import userRouter from "./routes/user.route";
import dentistRouter from "./routes/dentist.route";
import employeeRouter from "./routes/employee.route";
import adminRouter from "./routes/admin.route";

const ORIGIN: string = process.env.ORIGIN || "http://localhost:3000";

// body parser
app.use(express.json({ limit: "50mb" }));

// cookie parser
app.use(cookieParser());

// cors => cross origin resource sharing
app.use(
  cors({
    origin: [ORIGIN],
    credentials: true,
  })
);



// connect to database sql server
const db = ConnectToDatabase();
app.set('db', db);

app.use(
  "/api/v1",
  userRouter,
  dentistRouter,
  employeeRouter,
  adminRouter,
);

//api request limit
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
	// store: ... , // Use an external store for more precise rate limiting
})

// unknown route
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

//middleware calls
app.use(limiter);
app.use(ErrorMiddleware);