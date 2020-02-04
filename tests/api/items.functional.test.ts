import { expect } from 'chai';
import 'mocha';
import axios from 'axios';
import { truncateTables } from '../truncate';
import { beforeEach } from 'mocha';
import { Item } from '../../src/models/Item';
import { getManager, Repository, Connection } from 'typeorm';

describe('src/controllers/item.ts', () => {
    let pdb: Connection;
    beforeEach(async () => {
        pdb = await truncateTables(['item']);
    });

    afterEach(async () => {
        pdb.close();
    });

    it('returns empty array if no items', async () => {
        const response = await axios.get('http://localhost:8081/items');
        const { data } = response;

        expect(response.status).to.equal(200);
        expect(data).to.be.empty;
    });

    it('returns array of items if there are', async () => {
        const itemRepository: Repository<Item> = getManager().getRepository(
            Item,
        );

        const item = new Item();
        item.name = 'Test Item';
        item.price = 0.0;
        item.in_sale = 1;
        item.category_id = 1;

        await itemRepository.save(item);

        const response = await axios.get('http://localhost:8081/items');
        const { data } = response;

        expect(response.status).to.equal(200);
        expect(
            data[0].name === item.name &&
                data[0].price === item.price &&
                data[0].in_sale === item.in_sale &&
                data[0].category_id === item.category_id,
        );
        expect(data).to.not.be.empty;
    });
});
