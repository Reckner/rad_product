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

    it("doesn't create new item, wrong request body", async () => {
        const itemRepository: Repository<Item> = getManager().getRepository(
            Item,
        );

        try {
            await axios.post('http://localhost:8081/item', {
                name: 'Test T-Shirt',
                price: 50.0,
            });
        } catch (err) {
            const item = await itemRepository.findOne({
                name: 'Test T-Shirt',
                price: 50.0,
            });

            expect(item).to.be.undefined;
            expect(err.response.status).to.equal(422);
            expect(err.response.data).to.equal(
                "request body is missing some of ['name', 'price', 'category', 'in_sale']",
            );
        }
    });

    it('creates new item in db', async () => {
        const itemRepository: Repository<Item> = getManager().getRepository(
            Item,
        );

        const payload = {
            name: 'Test T-Shirt',
            price: 50.0,
            category_id: 1,
            in_sale: 1,
        };
        const response = await axios.post(
            'http://localhost:8081/item',
            payload,
        );

        const item = await itemRepository.findOne(payload);

        expect(response.status).to.equal(200);
        expect(
            item?.name === payload.name &&
                item?.price === payload.price &&
                item?.category_id === payload.category_id &&
                item?.in_sale === payload.in_sale,
        );
    });
});
