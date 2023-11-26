import { Request, Response, NextFunction } from "express";
import { redis } from "../utils/redis";
import { Connection, Request as SQLRequest, TYPES } from 'tedious';
import ConnectToDataBase from '../utils/db';
import { ErrorHandler } from "../utils/Errorhandler";
import ConnectToDataBaseWithLogin from "../utils/dblogin";
import { IDentist } from "../models/dentist.model";

export const getDentistById = async (id: string, res: Response) => {
    const dentistJson = await redis.get(id);
  
    if (dentistJson) {
      const dentist = JSON.parse(dentistJson);
      res.status(201).json({
        success: true,
        dentist,
      });
    }
  };


