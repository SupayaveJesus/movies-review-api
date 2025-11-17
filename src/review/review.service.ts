// src/review/review.service.ts
import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Review } from "./entities/review.entity";
import { Movie } from "../movie/entities/movie.entity";
import { User } from "../users/entities/user.entity";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";

@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(Review)
        private readonly reviewRepo: Repository<Review>,

        @InjectRepository(Movie)
        private readonly movieRepo: Repository<Movie>,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) {}

    async createReview(userId: number, dto: CreateReviewDto) {
        const movie = await this.movieRepo.findOne({ where: { id: dto.movieId } });
        if (!movie) {
            throw new NotFoundException("Película no encontrada");
        }

        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException("Usuario no encontrado");
        }

        const review = this.reviewRepo.create({
            rating: dto.rating,
            text: dto.text,
            movie,
            user,
        });

        return this.reviewRepo.save(review);
    }

    async updateReview(reviewId: number, userId: number, dto: UpdateReviewDto) {
        const review = await this.reviewRepo.findOne({
            where: { id: reviewId },
            relations: ["user"],
        });

        if (!review) {
            throw new NotFoundException("Review no encontrada");
        }

        if (review.user.id !== userId) {
            throw new ForbiddenException("No puedes editar esta reseña");
        }

        if (dto.rating !== undefined) review.rating = dto.rating;
        if (dto.text !== undefined) review.text = dto.text;

        return this.reviewRepo.save(review);
    }

    async deleteReview(reviewId: number, userId: number) {
        const review = await this.reviewRepo.findOne({
            where: { id: reviewId },
            relations: ["user"],
        });

        if (!review) {
            throw new NotFoundException("Review no encontrada");
        }

        if (review.user.id !== userId) {
            throw new ForbiddenException("No puedes eliminar esta reseña");
        }

        await this.reviewRepo.remove(review);
        return { success: true };
    }

    async findByMovie(movieId: number) {
        return this.reviewRepo.find({
            where: { movie: { id: movieId } },
            relations: ["user"],
            order: { id: "DESC" },
        });
    }

    async findByUser(userId: number) {
        return this.reviewRepo.find({
            where: { user: { id: userId } },
            relations: ["movie"],
            order: { id: "DESC" },
            take: 20,
        });
    }

    async findLatestMoviesByUser(userId: number, limit: number) {
        const reviews = await this.reviewRepo.find({
            where: { user: { id: userId } },
            relations: ["movie"],
            order: { id: "DESC" },
            take: limit,
        });

        const moviesMap = new Map<number, Movie>();
        for (const r of reviews) {
            if (r.movie && !moviesMap.has(r.movie.id)) {
                moviesMap.set(r.movie.id, r.movie);
            }
        }
        return Array.from(moviesMap.values());
    }
}
