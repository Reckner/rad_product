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

    it("successfully removes item by it's id", async () => {
        const item = new Item();
        item.name = 'Test Item';
        item.price = 50.0;
        item.category_id = 1;
        item.in_sale = 1;

        const itemRepository: Repository<Item> = getManager().getRepository(
            Item,
        );

        await itemRepository.save(item);

        const response = await axios.delete('http://localhost:8081/item/1');
        const { data } = response;

        expect(response.status).to.equal(200);
        expect(data.affected).to.equal(1);
    });

    it("can't remove, item with given id not found", async () => {
        const response = await axios.delete('http://localhost:8081/item/1');
        const { data } = response;

        expect(response.status).to.equal(200);
        expect(data.affected).to.equal(0);
    });
});
