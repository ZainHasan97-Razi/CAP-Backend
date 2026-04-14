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

const router = Router();

router.get('/:assessmentId/comments', getComments_validation, getComments);
router.post('/:assessmentId/comments/create', createComment_validation, createComment);
router.post('/:assessmentId/comments/:commentId/reply', createReply_validation, createReply);
router.put('/comments/:commentId/update', updateComment_validation, updateComment);
router.delete('/comments/:commentId/delete', deleteComment_validation, deleteComment);
router.patch('/comments/:commentId/approval', updateApproval_validation, updateApproval);

export default router;