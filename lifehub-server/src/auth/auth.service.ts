
import {
    Injectable,
    UnauthorizedException
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';



@Injectable()
export class AuthService {


    constructor(

        private usersService: UsersService,

        private jwtService: JwtService

    ) { }



    async login(

        username: string,

        password: string

    ) {


        const user =
            await this.usersService.findByUsername(
                username
            );



        if (!user) {

            throw new UnauthorizedException(
                '用户名或密码错误'
            );

        }



        const passwordValid =
            await bcrypt.compare(

                password,

                user.password

            );



        if (!passwordValid) {

            throw new UnauthorizedException(
                '用户名或密码错误'
            );

        }



        return {

            access_token:

                this.jwtService.sign({

                    sub: user.id,

                    username: user.username,

                })

        };


    }


}