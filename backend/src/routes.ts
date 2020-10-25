import { Router } from 'express';
import multer from 'multer';
import OrphanagesController from './controller/OrphanagesController';

import uploadConfig from './config/upload';

const routes = Router();
const upload = multer(uploadConfig);

// Rota
// Recurso = usuario
// Metodos HTTP = GET, POST, PUT, DELETE
// Parametros

// GET = Buscar uma informação (Lita, item)
// POST = Criando uma informação
// PUT = Editando uma informação
// DELETE = Deletando uma informação

// Query Params: http://localhost:3333/users?search=diego
// Route Params: http://localhost:3333/users/1 (identificar um recurso)
// Body: http://localhost:3333/users (identificar um recurso)


routes.get('/orphanages', OrphanagesController.index);
routes.get('/orphanages/:orphanage', OrphanagesController.show);
routes.post('/orphanages', upload.array('images'), OrphanagesController.create);

export default routes;