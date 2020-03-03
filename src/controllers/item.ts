import { Item } from '../models/Item';
import { Context, ParameterizedContext } from 'koa';
import { getManager, Repository } from 'typeorm';
import { request, summary, responsesAll, tagsAll } from 'koa-swagger-decorator';

@responsesAll({
    200: { description: 'success' },
    400: { description: 'bad request' },
    401: { description: 'unauthorized, missing/wrong jwt token' },
})

@tagsAll(['Item'])
export default class ItemController {
    @request('get', '/items')
    @summary('Find all items')
    public static async getItems(ctx: Context) {
        // get an item repository to perform operations with item
        const itemRepository: Repository<Item> = getManager().getRepository(
            Item,
        );

        // load all items
        const items: Item[] = await itemRepository.find();

        // return OK status code and loaded items array
        ctx.status = 200;
        ctx.body = items;
    }

    @request('get', '/item/:id')
    @summary('Find an item by id')
    public static async getItemOneById(ctx: ParameterizedContext) {
        // get an item repository to perform operations with item
        const itemRepository: Repository<Item> = getManager().getRepository(
            Item,
        );

        const { id } = ctx.params;

        // load an item with specific id
        const item: Item | undefined = await itemRepository.findOne(id);

        // return OK status code and loaded item
        ctx.status = 200;
        item ? (ctx.body = item) : (ctx.body = null);
    }

    @request('post', '/item')
    @summary('Adds item')
    public static async createItem(ctx: Context) {
        // get an item repository to perform operations with item
        const itemRepository: Repository<Item> = getManager().getRepository(
            Item,
        );

        const { name, price, category_id, in_sale } = ctx.request.body;

        const item = new Item();
        item.name = name;
        item.price = price;
        item.category_id = category_id;
        item.in_sale = in_sale;

        if (name && price && category_id && in_sale) {
            const newItem = await itemRepository.save(item);

            ctx.status = 200;
            ctx.body = newItem;
        } else {
            ctx.status = 422;
            ctx.body =
                "request body is missing some of ['name', 'price', 'category', 'in_sale']";
        }
    }

    @request('delete', '/item/:id')
    @summary('Removes item')
    public static async removeItemById(ctx: ParameterizedContext) {
        // get an item repository to perform operations with item
        const itemRepository: Repository<Item> = getManager().getRepository(
            Item,
        );

        const { id } = ctx.params;

        const item = await itemRepository.delete(id);

        ctx.status = 200;
        item
            ? (ctx.body = item)
            : (ctx.body = 'no item to delete with given id');
    }
}
