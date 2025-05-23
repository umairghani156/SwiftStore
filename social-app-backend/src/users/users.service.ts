import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UsersService {
    constructor(
        private prisma: PrismaService
    ) { }

    async getAllUsers() {
        return await this.prisma.user.findMany()
    }

    async updateUser(id: string, updateUserDto: UpdateUserDto) {
        if (!id) {
            throw new BadRequestException("User Id is required.")
        }
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    id: id,
                }
            });
             if (!user) {
                throw new NotFoundException("User not found")
            }

            const isEmailExist = await this.prisma.user.findFirst({
                where: {
                    email: updateUserDto.email,
                    NOT: {
                        id: id,
                    }
                }
            });

            if (isEmailExist) {
                throw new ConflictException("Email already exist. Please choose another one")
            }

           

            const updateExistingUser = await this.prisma.user.update({
                where: {
                    id: id
                },
                data: {
                    username: updateUserDto.username,
                    email: updateUserDto.email,
                    profile_picture: updateUserDto.profile_picture,
                    cover_picture: updateUserDto.cover_picture,
                    updatedAt: new Date()
                }
            });

            if (!updateExistingUser) {
                throw new ConflictException("Error in updating User")
            }

            return {
                success: true,
                message: "User Updated Successfully",
                data: updateExistingUser
            }
        } catch (error) {
            if(error instanceof BadRequestException ||
                error instanceof ConflictException ||
                error instanceof NotFoundException

            ){
                throw error
            }
            throw new ConflictException("Something went wrong while updating the user.")
        }
    }
}
