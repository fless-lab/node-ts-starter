import { Router } from 'express';
import { AppController } from '../controllers';

const router = Router();

router.get('/', AppController.showHomePage);

export default router;
