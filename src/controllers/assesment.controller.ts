import { ARequest } from "types/auth.request.type";
import { NextFunction, Response } from 'express';
import assesmentService from "../services/assesment.service";
import { ApiError } from "../middleware/validate.request";
import { CreateAssesmentDto, PriorityEnumType } from "../models/assesment.model";
import framewaorkService from "../services/framewaork.service";
import controlService from "../services/control.service";
import { IUser } from "types/req.user.type";

type CreateRequestDto = {
  assesmentId: string;
  name: string;
  description: string;
  framework: string;
  control: string;
  participants?: string[];
  attachments?: string[];
  priority: PriorityEnumType;
  dueDate: number;
}

export const create = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const body = req.body as CreateRequestDto;
    const framework = await framewaorkService.findById(body.framework);
    if(!framework) {
      throw ApiError.badRequest("Invalid framework id");
    }
    const control = await controlService.findById(body.control)
    if(!control) {
      throw ApiError.badRequest("Invalid control id");
    }
    const payload: CreateAssesmentDto = {
      assesmentId: body.assesmentId,
      name: body.name,
      description: body.description,
      framework: framework._id,
      frameworkName: framework.displayName,
      control: control._id,
      controlId: control.controlId,
      controlName: control.displayName,
      participants: body.participants || [],
      attachments: body.attachments || [],
      priority: body.priority,
      dueDate: body.dueDate,
      createdBy: (req.user as IUser).userName,
    }
    const assesment = await assesmentService.create(payload)
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