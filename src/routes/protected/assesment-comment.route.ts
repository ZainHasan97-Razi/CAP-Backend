import { Router } from 'express';
import { 
  getComments, 
  createComment, 
  createReply, 
  updateComment, 
  deleteComment,
  updateApproval,
} from '../../controllers/assesment-comment.controller';
import { 
  getComments_validation,
  createComment_validation, 
  createReply_validation, 
  updateComment_validation, 
  deleteComment_validation,
  updateApproval_validation,
} from '../validators/assesment-comment.validator';
import { blockRoles } from '../../middleware/protect';

const router = Router();

router.get('/:assessmentId/comments', getComments_validation, getComments);
router.post('/:assessmentId/comments/create', blockRoles('super_admin'), createComment_validation, createComment);
router.post('/:assessmentId/comments/:commentId/reply', blockRoles('super_admin'), createReply_validation, createReply);
router.put('/comments/:commentId/update', blockRoles('super_admin'), updateComment_validation, updateComment);
router.delete('/comments/:commentId/delete', blockRoles('super_admin'), deleteComment_validation, deleteComment);
router.patch('/comments/:commentId/approval', blockRoles('super_admin'), updateApproval_validation, updateApproval);

export default router;