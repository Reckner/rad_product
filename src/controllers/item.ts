import { Item } from '../models/Item';
import { BaseContext } from 'koa';
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
    public static async getItems(ctx: BaseContext) {
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
}
