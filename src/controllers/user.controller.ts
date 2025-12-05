import { ARequest } from "types/auth.request.type";
import { Response } from 'express';
import userService from "../services/user.service";

// export const getUserDetails = async (req: ARequest, res: Response) => {
//   try {
//     const { id } = req.params;

//     const user = await prisma.user.findUnique({
//       where: { id: parseInt(id) },
//       include: {
//         bookings: true,
//       },
//     });

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     res.json(user);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Something went wrong' });
//   }
// }

export const findById = async (req: ARequest, res: Response) => {
  try {
    const { id } = req.params;

    // In a real app, you would check the password here with bcrypt!
    const user = await userService.findById(id);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // In a real app, you would generate a JWT token here and send it back
    res.json({ message: 'Request success', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
}