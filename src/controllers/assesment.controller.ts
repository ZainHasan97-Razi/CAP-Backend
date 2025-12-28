import { ARequest } from "types/auth.request.type";
import { NextFunction, Response } from 'express';
import assesmentService from "../services/assesment.service";
import { ApiError } from "../middleware/validate.request";
import { CreateAssesmentDto, PriorityEnumType } from "../models/assesment.model";
import framewaorkService from "../services/framewaork.service";
import controlService from "../services/control.service";
import departmentService from "../services/department.service";
import { IUser } from "types/req.user.type";

type CreateRequestDto = {
  assesmentId: string;
  name: string;
  description: string;
  framework: string;
  control: string;
  department: string;
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
    const department = await departmentService.findById(body.department)
    if(!department) {
      throw ApiError.badRequest("Invalid department id");
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
      department: department._id,
      departmentName: department.displayName,
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

    const assesment = await assesmentService.findById(id);
    if (!assesment) {
      throw ApiError.badRequest("Assesment not found");
    }

    res.json(assesment);
  } catch (error) {
    console.error(error);
    next(error); // pass to global handler
  }
}

export const dashboardList = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const filters = {
      status: req.query.status as string,
      department: req.query.department as string,
      priority: req.query.priority as string,
      dateFrom: req.query.dateFrom ? parseInt(req.query.dateFrom as string) : undefined,
      dateTo: req.query.dateTo ? parseInt(req.query.dateTo as string) : undefined,
      dueDateFrom: req.query.dueDateFrom ? parseInt(req.query.dueDateFrom as string) : undefined,
      dueDateTo: req.query.dueDateTo ? parseInt(req.query.dueDateTo as string) : undefined,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 10
    };
    
    const result = await assesmentService.dashboardList(filters);
    res.json(result);
  } catch (error) {
    console.error(error);
    next(error);
  }
}