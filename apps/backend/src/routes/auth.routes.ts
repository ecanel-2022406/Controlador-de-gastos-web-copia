import { Router } from 'express';
import { registrarUsuario, loginUsuario } from '../controller/auth.controller';

const router = Router();

router.post('/register', registrarUsuario);
router.post('/login', loginUsuario);

export default router;