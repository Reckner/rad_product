import { expect } from 'chai';
import 'mocha';
import axios from 'axios';
import { truncateTables } from '../../truncate';
import { beforeEach } from 'mocha';
import { Category } from '../../../src/models/Category';
import { getManager, Repository, Connection } from 'typeorm';

describe('src/controllers/category.ts getCategories', () => {
    let pdb: Connection;
    beforeEach(async () => {
        pdb = await truncateTables(['category']);
    });

    afterEach(async () => {
        await pdb.close();
    });

    it('returns empty array if no categories', async () => {
        const response = await axios.get('http://localhost:8081/categories');
        const { data } = response;

        expect(response.status).to.equal(200);
        expect(data).to.be.empty;
    });

    it('returns array of categories if there are any', async () => {
        const categoryRepository: Repository<Category> = getManager().getRepository(
            Category,
        );

        const category = new Category();
        category.name = 'Test category';

        await categoryRepository.save(category);

        const response = await axios.get('http://localhost:8081/categories');
        const { data } = response;

        expect(response.status).to.equal(200);
        expect(
            data[0].name === category.name,
        );
        expect(data).to.not.be.empty;
    });
});
