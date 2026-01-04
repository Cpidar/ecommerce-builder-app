import { schema } from '../../zenstack/schema';
import { ZenStackClient } from '@zenstackhq/orm';
import { PolicyPlugin } from '@zenstackhq/plugin-policy';
import { PostgresDialect } from '@zenstackhq/orm/dialects/postgres';
import { Pool } from 'pg';

export const db = new ZenStackClient(schema, {
    dialect: new PostgresDialect({
        pool: new Pool({
            connectionString: process.env.DATABASE_URL,
        }),
    }),
});

export const authDb = db.$use(new PolicyPlugin());