import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private authservice : AuthService
    ) {}

    @Post("register")
    async registerUser(@Body() signUpDto: SignUpDto) {
        return this.authservice.registerUser(signUpDto)
    }

    @Post('login')
    async loginUser(@Body() loginDto: LoginDto){
        return this.authservice.loginUser(loginDto)
    }
}
