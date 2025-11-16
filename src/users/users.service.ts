import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { UserRegisterDto } from "src/auth/dto/user-register.dto";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}
    findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOneBy({ email });
    }
    createUser(user: UserRegisterDto): Promise<User> {
        const newUser = this.usersRepository.create(user);
        return this.usersRepository.save(newUser);
    }
}
