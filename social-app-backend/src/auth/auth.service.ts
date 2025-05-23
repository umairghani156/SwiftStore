import { Body, ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDto } from './dto/signup.dto';
import * as bcrypt from "bcryptjs"
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { profile } from 'console';

@Injectable()
export class AuthService {
    constructor(
        private prisma : PrismaService,
         private jwtService: JwtService
    ){}

    async registerUser(signUpDto: SignUpDto){
        const isExisiting = await this.prisma.user.findUnique({
            where:{
                email: signUpDto.email
            }
        });
        if(isExisiting){
            throw new ConflictException("User already exists")
        };

        const hashedPassword = await bcrypt.hash(signUpDto.password, 10);
        return this.prisma.user.create({
            data:{
                username: signUpDto.username,
                email: signUpDto.email,
                password: hashedPassword,
                profile_picture: signUpDto.profile_picture ?? "",
                cover_picture: signUpDto.cover_picture ?? "",
                updatedAt: new Date()
            }
        })


    };

    async loginUser(loginSto: LoginDto){
        const user = await this.prisma.user.findUnique({
            where:{
                email: loginSto.email
            }
        });
        if(!user){
            throw new ConflictException("User not found")
        }

        const isPasswordValid = await bcrypt.compare(loginSto.password, user.password);
        if(!isPasswordValid){
            throw new ConflictException("Password is incorrect. Please enter the correct password")
        };
        const payload = { sub: user.id, username: user.username, email: user.email,
            profile_picture: user.profile_picture,
            cover_picture: user.cover_picture
         };

         const token = await this.jwtService.signAsync(payload)

        return {
            success: true,
            message:"Login Successfully",
            token,
            data: user
        }
    }
}
