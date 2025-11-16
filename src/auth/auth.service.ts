import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { generateAuthToken, stringToSha1 } from "./crypto.utils";
import { UserLoginDto } from "./dto/user-login.dto";
import { UserRegisterDto } from "./dto/user-register.dto";
import { UserRegisterResponseDto } from "./dto/register-response.dto";

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}

    async login(body: UserLoginDto): Promise<any> {
        const user = await this.usersService.findByEmail(body.email);
        if (!user) {
            throw new UnauthorizedException();
        }
        const hashedPassword = stringToSha1(body.password);
        if (user.password !== hashedPassword) {
            throw new UnauthorizedException();
        }
        const token = generateAuthToken(user.email);
        //TODO: Almacenar el token o usar JWT para no necesitar almacenarlo
        return { token, user: { id: user.id, email: user.email, fullName: user.fullName } };
    }
    async register(body: UserRegisterDto): Promise<UserRegisterResponseDto> {
        const user = await this.usersService.findByEmail(body.email);
        if (user) {
            throw new ConflictException("User already exists");
        }
        const hashedPassword = stringToSha1(body.password);
        const newUser = await this.usersService.createUser({
            email: body.email,
            password: hashedPassword,
            fullName: body.fullName,
        });
        return { id: newUser.id, email: newUser.email, fullName: newUser.fullName } as UserRegisterResponseDto;
    }
}
