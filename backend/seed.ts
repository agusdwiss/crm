import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { UsersService } from './src/users/users.service';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const usersService = app.get(UsersService);

    const adminUsername = 'admin';
    const existingUser = await usersService.findOne(adminUsername);

    if (!existingUser) {
        await usersService.create({
            username: adminUsername,
            password: 'password123',
            name: 'Admin User',
        });
        console.log('Admin user created');
    } else {
        console.log('Admin user already exists');
    }

    await app.close();
}

bootstrap();
