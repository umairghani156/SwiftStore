import { IsDate, isDate, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class SignUpDto {
    @IsString()
    @IsNotEmpty()
    username : string;

    @IsEmail()
    @IsNotEmpty()
    @IsString()
    email : string

    @IsString()
    @MinLength(8)
    password: string;

    @IsOptional()
    @IsString()
    profile_picture?: string;

    @IsOptional()
    @IsString()
    cover_picture?: string;

    @IsDate()
    updatedAt : Date


}