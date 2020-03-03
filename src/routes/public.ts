import Router from 'koa-router';
import controllers = require('../controllers');

const publicRouter = new Router();
// items 
publicRouter.get('/items', controllers.item.getItems);
publicRouter.get('/item/:id', controllers.item.getItemOneById);
publicRouter.post('/item', controllers.item.createItem);
publicRouter.delete('/item/:id', controllers.item.removeItemById);

// categories
publicRouter.get('/categories', controllers.category.getCategories);
publicRouter.get('/category/:id', controllers.category.getCategoryOneById);
publicRouter.delete('/category/:id', controllers.category.removeCategoryById);
publicRouter.post('/category', controllers.category.createCategory);
// publicRouter.put('/category/:id', controllers.category.updateCategory);

export { publicRouter };
