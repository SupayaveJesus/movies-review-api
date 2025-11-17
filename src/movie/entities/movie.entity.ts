import { Review } from "src/review/entities/review.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Movie {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    year: number;

    @Column()
    @Column({ nullable: true })
    imageUrl?: string;

    @OneToMany(() => Review, review => review.movie)
    reviews: Review[];
}
