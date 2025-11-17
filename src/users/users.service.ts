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
    async findByEmail(email: string, includePassword = false): Promise<User | null> {
        if (includePassword) {
            return this.usersRepository.findOne({
                where: { email },
                select: { id: true, email: true, password: true, fullName: true },
            });
        }

        return this.usersRepository.findOneBy({ email });
    }

    createUser(user: UserRegisterDto): Promise<User> {
        const newUser = this.usersRepository.create(user);
        return this.usersRepository.save(newUser);
    }

    findById(id: number): Promise<User | null> {
        return this.usersRepository.findOneBy({ id });
    }
}
