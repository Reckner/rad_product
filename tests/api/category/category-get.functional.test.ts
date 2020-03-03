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

    it('returns no data if no category with given id found', async () => {
        const response = await axios.get('http://localhost:8081/category/1');
        const { data } = response;

        expect(response.status).to.equal(204);
        expect(data).to.be.empty;
    });

    it('returns category object with given id', async () => {
        const categoryRepository: Repository<Category> = getManager().getRepository(
            Category,
        );

        const category = new Category();
        category.name = 'Test category';

        await categoryRepository.save(category);

        const response = await axios.get('http://localhost:8081/category/1');
        const { data } = response;

        expect(
            data.name === category.name,
        );
        expect(response.status).to.equal(200);
        expect(data).to.not.be.empty;
    });
});
