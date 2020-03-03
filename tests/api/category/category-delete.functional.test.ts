import { expect } from 'chai';
import 'mocha';
import axios from 'axios';
import { truncateTables } from '../../truncate';
import { beforeEach } from 'mocha';
import { Category } from '../../../src/models/Category';
import { getManager, Repository, Connection } from 'typeorm';

describe('src/controllers/category.ts getCategoryOneById(id)', () => {
    let pdb: Connection;
    beforeEach(async () => {
        pdb = await truncateTables(['category']);
    });

    afterEach(async () => {
        await pdb.close();
    });

    it("successfully removes category by it's id", async () => {
        const category = new Category();
        category.name = 'Test category';

        const categoryRepository: Repository<Category> = getManager().getRepository(
            Category,
        );

        await categoryRepository.save(category);

        const response = await axios.delete('http://localhost:8081/category/1');
        const { data } = response;

        expect(response.status).to.equal(200);
        expect(data.affected).to.equal(1);
    });

    it("can't remove, category with given id not found", async () => {
        const response = await axios.delete('http://localhost:8081/category/1');
        const { data } = response;

        expect(response.status).to.equal(200);
        expect(data.affected).to.equal(0);
    });
});
