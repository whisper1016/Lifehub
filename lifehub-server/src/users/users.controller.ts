import {
    Controller,
    Post,
    Body,
    Get,
    UseGuards,
    Req
} from '@nestjs/common';


import { UsersService } from './users.service';

import { CreateUserDto } from './dto/create-user.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';



@Controller('users')
export class UsersController {


    constructor(
        private usersService: UsersService
    ) { }



    @Get()
    test() {

        return {
            message: 'users api works'
        };

    }
    @Get('profile')
    @UseGuards(JwtAuthGuard)
    profile(
        @Req() req: any
    ) {

        return req.user;

    }



    @Post('register')
    register(
        @Body() createUserDto: CreateUserDto
    ) {

        return this.usersService.create(
            createUserDto
        );

    }


}