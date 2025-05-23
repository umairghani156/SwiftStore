import { IsDate, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class UpdateUserDto {
        @IsString()
        @IsOptional()
        username?: string;
    
        @IsEmail()
        @IsOptional()
        @IsString()
        email?: string
    
        @IsString()
        @MinLength(8)
        password?: string;
    
        @IsOptional()
        @IsString()
        profile_picture?: string;
    
        @IsOptional()
        @IsString()
        cover_picture?: string;
    
        @IsOptional()
        @IsDate()
        updatedAt? : Date
    

}