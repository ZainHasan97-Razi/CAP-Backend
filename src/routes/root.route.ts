import { Express } from 'express';
// import userRouter from './user.route';
// import bookingRouter from './booking.route';
// import roomRouter from './room.route';
import authRouter from './auth.route';


export default (app: Express) => {
  const router = app;
//   router.use('/user', userRouter);
//   router.use(bookingRouter);
//   router.use(roomRouter);
  router.use(authRouter);
};
