import Router from 'koa-router';
import controllers = require('../controllers');

const publicRouter = new Router();

publicRouter.get('/items', controllers.item.getItems);

export { publicRouter };
