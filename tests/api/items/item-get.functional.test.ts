import { expect } from 'chai';
import 'mocha';
import axios from 'axios';
import { truncateTables } from '../../truncate';
import { beforeEach } from 'mocha';
import { Item } from '../../../src/models/Item';
import { getManager, Repository, Connection } from 'typeorm';

describe('src/controllers/item.ts getItemOneById(id)', () => {
    let pdb: Connection;
    beforeEach(async () => {
        pdb = await truncateTables(['item']);
    });

    afterEach(async () => {
        await pdb.close();
    });

    it('returns no data if no item with given id found', async () => {
        const response = await axios.get('http://localhost:8081/item/1');
        const { data } = response;

        expect(response.status).to.equal(204);
        expect(data).to.be.empty;
    });

    it('returns an item object with given id', async () => {
        const itemRepository: Repository<Item> = getManager().getRepository(
            Item,
        );

        const item = new Item();
        item.name = 'Test Item';
        item.price = 0.0;
        item.in_sale = 1;
        item.category_id = 1;

        await itemRepository.save(item);

        const response = await axios.get('http://localhost:8081/item/1');
        const { data } = response;

        expect(
            data.name === item.name &&
                data.price === item.price &&
                data.in_sale === item.in_sale &&
                data.category_id === item.category_id,
        );
        expect(response.status).to.equal(200);
        expect(data).to.not.be.empty;
    });
});
