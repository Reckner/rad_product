import { connection } from '../src/db/connection';

export async function truncateTables(tablesArray: string[]) {
    if (process.env.NODE_ENV !== 'test') {
        throw new Error(
            "Truncate is supposed to be called only in 'test' environment!",
        );
    }

    const pdb = await connection();
    tablesArray.forEach(async table => {
        await pdb.query(`TRUNCATE TABLE ${table}`);
    });
    return pdb;
}