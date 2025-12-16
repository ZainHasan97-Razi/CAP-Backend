import { ARequest } from "types/auth.request.type";
import { NextFunction, Response } from 'express';
// import controlService from "../services/control.service";
import assesmentService from "../services/assesment.service";
import { ApiError } from "../middleware/validate.request";

export const create = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const assesment = await assesmentService.create(req.body)
    res.json({ message: 'Request success', assesment });
  } catch (error) {
    console.error(error);
    next(error); // pass to global handler
  }
}

// export const update = async (req: ARequest, res: Response, next: NextFunction) => {
//   try {
//     const { id } = req.params;
//     const framework = await controlService.update(id, req.body)
//     if (!framework) {
//       // return res.status(401).json({ error: 'Invalid framwork id' });
//       throw ApiError.badRequest("Invalid framwork id");
//     }

//     res.json({ message: 'Request success', framework });
//   } catch (error) {
//     console.error(error);
//     next(error); // pass to global handler
//   }
// }

export const findById = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const user = await assesmentService.findById(id);
    if (!user) {
      throw ApiError.badRequest("Assesment not found");
    }

    res.json({ message: 'Request success', user });
  } catch (error) {
    console.error(error);
    next(error); // pass to global handler
  }
}