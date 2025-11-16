import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserLoginDto } from "./dto/user-login.dto";
import { UserRegisterDto } from "./dto/user-register.dto";
import { UserRegisterResponseDto } from "./dto/register-response.dto";

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post("login")
    login(@Body() body: UserLoginDto): Promise<any> {
        return this.authService.login(body);
    }
    @Post("register")
    register(@Body() body: UserRegisterDto): Promise<UserRegisterResponseDto> {
        return this.authService.register(body);
    }
}
