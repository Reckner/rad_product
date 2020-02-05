import Router from 'koa-router';
import controllers = require('../controllers');

const publicRouter = new Router();

publicRouter.get('/items', controllers.item.getItems);
publicRouter.get('/item/:id', controllers.item.getItemOneById);
publicRouter.post('/item', controllers.item.createItem);
publicRouter.delete('/item/:id', controllers.item.removeItemById);

export { publicRouter };
