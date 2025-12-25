import { Router } from 'express';
import { 
  getComments, 
  createComment, 
  createReply, 
  updateComment, 
  deleteComment 
} from '../../controllers/assesment-comment.controller';
import { 
  getComments_validation,
  createComment_validation, 
  createReply_validation, 
  updateComment_validation, 
  deleteComment_validation 
} from '../validators/assesment-comment.validator';

const router = Router();

router.get('/:assessmentId/comments', getComments_validation, getComments);
router.post('/:assessmentId/comments', createComment_validation, createComment);
router.post('/:assessmentId/comments/:commentId/reply', createReply_validation, createReply);
router.put('/comments/:commentId', updateComment_validation, updateComment);
router.delete('/comments/:commentId', deleteComment_validation, deleteComment);

export default router;