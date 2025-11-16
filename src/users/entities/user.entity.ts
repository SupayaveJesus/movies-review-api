import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Review } from "src/review/entities/review.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    fullName: string;

    @OneToMany(() => Review, (r) => r.user)
    reviews?: Review[];
}
