import { Request, Response, NextFunction } from "express";

export const allowingCors = (req: Request, res: Response, next: NextFunction) => {
  // CORS
  // ALLOWING Origin TO BACKEND
  res.setHeader("Access-Control-Allow-Origin", "*");
  // ALLOWING ACCESS TO BACKEN
  res.setHeader("Access-Control-Allow-Credentials", "true");
  // POST, GET, PUT,....
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, PATCH, DELETE");
  // Authorization --> ACCEPT
  res.setHeader("Access-Control-Allow-Headers", "*");

  // Set security headers
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.setHeader('X-Frame-Options', 'DENY'); // use for iframe
  res.setHeader('X-Content-Type-Options', 'nosniff'); // nosniff use for text/html, none
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'same-origin');

  next();
};
