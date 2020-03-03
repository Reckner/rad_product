import { Category } from '../models/Category';
import { Context, ParameterizedContext } from 'koa';
import { getManager, Repository } from 'typeorm';
import { request, summary, responsesAll, tagsAll } from 'koa-swagger-decorator';

@responsesAll({
    200: { description: 'success' },
    400: { description: 'bad request' },
    401: { description: 'unauthorized, missing/wrong jwt token' },
})

@tagsAll(['Category'])
export default class CategoryController {
    @request('get', '/categories')
    @summary('Find all categories')
    public static async getCategories(ctx: Context) {
        // get a category repository to perform operations with category
        const categoryRepository: Repository<Category> = getManager().getRepository(
            Category,
        );

        // load all categories
        const categories: Category[] = await categoryRepository.find();

        // return OK status code and loaded categories array
        ctx.status = 200;
        ctx.body = categories;
    }


    @request('get', '/category/:id')
    @summary('Find a category by id')
    public static async getCategoryOneById(ctx: ParameterizedContext) {
        // get a category repository to perform operations with category
        const categoryRepository: Repository<Category> = getManager().getRepository(
            Category,
        );

        const { id } = ctx.params;

        // load a category with specific id
        const category: Category | undefined = await categoryRepository.findOne(id);

        // return OK status code and loaded category array
        ctx.status = 200;
        category ? (ctx.body = category) : (ctx.body = null);
    }

    @request('post', '/category')
    @summary('Adds category')
    public static async createCategory(ctx: Context) {
        // get a category repository to perform operations with category
        const categoryRepository: Repository<Category> = getManager().getRepository(
            Category,
        );

        const { name } = ctx.request.body;

        const category = new Category();
        category.name = name;

        if (name) {
            const newCategory = await categoryRepository.save(category);

            ctx.status = 200;
            ctx.body = newCategory;
        } else {
            ctx.status = 422;
            ctx.body =
                "request body is missing 'name'";
        }
    }

    @request('delete', '/category/:id')
    @summary('Removes specified category')
    public static async removeCategoryById(ctx: ParameterizedContext) {
        // get a category repository to perform operations with category
        const categoryRepository: Repository<Category> = getManager().getRepository(
            Category,
        );

        const { id } = ctx.params;

        const category = await categoryRepository.delete(id);

        ctx.status = 200;
        category
            ? (ctx.body = category)
            : (ctx.body = 'no category to delete with given id');
    }
}
