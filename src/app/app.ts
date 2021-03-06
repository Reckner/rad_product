import Koa from 'koa';
// import jwt from 'koa-jwt';
import bodyParser from 'koa-bodyparser';
import helmet from 'koa-helmet';
import cors from '@koa/cors';
import winston from 'winston';
import { createConnection } from 'typeorm';
import 'reflect-metadata';
import { logger } from '../logger';
import { config } from '../config';
import { publicRouter } from '../routes/public';

// create connection with database
// note that its not active database connection
// TypeORM creates you connection pull to uses connections from pull on your requests
export function initApp(): void {
    createConnection({
        type: 'mysql',
        host: config.db.host,
        port: config.db.port,
        username: config.db.username,
        password: config.db.password,
        database: config.db.endpoint,
        synchronize: true,
        logging: false,
        entities: config.dbEntitiesPath,
        extra: {
            ssl: config.dbsslconn, // if not development, will use SSL
        },
    })
        .then(async connection => {
            const app = new Koa();

            // Provides important security headers to make your app more secure
            app.use(helmet());

            // Enable cors with default options
            app.use(cors());

            // Logger middleware -> use winston as logger (logging.ts with config)
            app.use(logger(winston));

            // Enable bodyParser with default options
            app.use(bodyParser());

            // these routes are NOT protected by the JWT middleware, also include middleware to respond with "Method Not Allowed - 405".
            app.use(publicRouter.routes()).use(publicRouter.allowedMethods());

            // JWT middleware -> below this line routes are only reached if JWT token is valid, secret as env variable
            // do not protect swagger-json and swagger-html endpoints
            // app.use(
            //     jwt({ secret: config.jwtSecret }).unless({ path: [/^\/swagger-/] }),
            // );

            // These routes are protected by the JWT middleware, also include middleware to respond with "Method Not Allowed - 405".
            //app.use(protectedRouter.routes()).use(protectedRouter.allowedMethods());

            // Register cron job to do any action needed
            //cron.start();

            app.listen(config.port);

            console.log(`Server running on port ${config.port}`);
        })
        .catch(error => console.log('TypeORM connection error: ', error));
}
