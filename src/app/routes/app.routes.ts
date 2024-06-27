import { Router } from 'express';
import AppController from '../controllers/app.controller';

const router = Router();

router.get('/', AppController.showHomePage);

export default router;
