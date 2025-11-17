import { Injectable, UnauthorizedException, ConflictException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { UserLoginDto } from "./dto/user-login.dto";
import { UserRegisterDto } from "./dto/user-register.dto";
import { hashPassword } from "./crypto.utils";

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async login(body: UserLoginDto) {
        const user = await this.usersService.findByEmail(body.email, true);

        if (!user) {
            throw new UnauthorizedException("Invalid credentials");
        }

        const hashed = hashPassword(body.password);

        if (user.password !== hashed) {
            throw new UnauthorizedException("Invalid credentials");
        }

        const payload = { sub: user.id, email: user.email };

        return {
            token: this.jwtService.sign(payload),
            user: { id: user.id, email: user.email, fullName: user.fullName },
        };
    }

    async register(body: UserRegisterDto) {
        const exists = await this.usersService.findByEmail(body.email);
        if (exists) throw new ConflictException("User already exists");

        const hashed = hashPassword(body.password);

        const newUser = await this.usersService.createUser({
            email: body.email,
            password: hashed,
            fullName: body.fullName,
        });

        return {
            id: newUser.id,
            email: newUser.email,
            fullName: newUser.fullName,
        };
    }
}
