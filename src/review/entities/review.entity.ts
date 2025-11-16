import { Movie } from "src/movie/entities/movie.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Review {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    text: string;

    @Column()
    rating: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // --- Relación con usuario ---
    @ManyToOne(() => User, { eager: true })
    user: User;

    // --- Relación con película ---
    @ManyToOne(() => Movie, { eager: true })
    movie: Movie;
}
