import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplication } from '@nestjs/common';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import { Server, ServerOptions } from 'socket.io';

export class SocketRedisAdapter extends IoAdapter {
    protected redisAdapter;

    constructor(app: INestApplication) {
        super(app);

        const pubClient = createClient({
            socket: {
                host: process.env.REDIS_HOST,
                port: process.env.REDIS_PORT ? +process.env.REDIS_PORT : 9164,
                tls: process.env.NODE_ENV === 'development' ? undefined : true,
            },
            username: process.env.REDIS_USER ?? undefined,
            password: process.env.REDIS_PASSWORD ?? undefined,
        });
        const subClient = pubClient.duplicate();

        pubClient.connect();
        subClient.connect();

        this.redisAdapter = createAdapter(pubClient, subClient);
    }

    createIOServer(port: number, options?: ServerOptions): any {
        const server = super.createIOServer(port, options) as Server;
        server.adapter(this.redisAdapter);
        return server;
    }
}
