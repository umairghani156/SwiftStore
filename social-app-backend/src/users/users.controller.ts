import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/updateUser.dto';

@Controller('users')
export class UsersController {
    constructor(
        private prisma : PrismaService,
        private userService : UsersService
    ) {}

    @Get()
    async getAllUsers() {
        return this.userService.getAllUsers()
    }

    @Put(":id")
    async updateUser( @Param("id") id: string,@Body() updateUserDto: UpdateUserDto){
       
        return this.userService.updateUser(id,updateUserDto)
    }
}
