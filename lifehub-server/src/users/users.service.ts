import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { User } from './user.entity';

import { CreateUserDto } from './dto/create-user.dto';


@Injectable()
export class UsersService {


    constructor(

        @InjectRepository(User)

        private userRepository: Repository<User>

    ) { }

    



    async create(
        createUserDto: CreateUserDto
    ) {


        const {
            username,
            password
        } = createUserDto;


        const existUser =
            await this.userRepository.findOne({
                where: {
                    username
                }
            });


        if (existUser) {

            throw new Error(
                '用户名已存在'
            );

        }

        


        const hashPassword = await bcrypt.hash(
            password,
            10
        );


        const user = this.userRepository.create({

            username,

            password: hashPassword,

        });


        const savedUser = await this.userRepository.save(user);


        const {
            password: _,
            ...result
        } = savedUser;

        return result;

    }

    async findByUsername(
    username:string
){

    return this.userRepository.findOne({

        where:{
            username
        }

    });

}


}