import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Review } from "./entities/review.entity";
import { MoviesService } from "../movie/movie.service";
import { UsersService } from "src/users/users.service";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";
import { LatestUserMovieDto } from "./dto/latest-user-movie.dto";
import { Movie } from "src/movie/entities/movie.entity";

@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(Review)
        private readonly reviewRepository: Repository<Review>,
        private readonly movieService: MoviesService,
        private readonly userService: UsersService,
    ) {}

    async createReview(userId: number, dto: CreateReviewDto): Promise<Review> {
        const user = await this.userService.findById(userId);
        if (!user) {
            throw new NotFoundException("User not found");
        }

        let movie: Movie;

        if (dto.movieId) {
            //movie existente
            movie = await this.movieService.findById(dto.movieId);
            if (!movie) {
                throw new NotFoundException("Movie not found");
            }
        } else if (dto.movie) {
            //movie nueva
            movie = await this.movieService.createMovie(dto.movie);
        } else {
            throw new BadRequestException("Debe enviar movieId o movie");
        }

        const newReview = this.reviewRepository.create({
            text: dto.text,
            rating: dto.rating,
            user,
            movie,
        });

        return await this.reviewRepository.save(newReview);
    }

    async updateReview(id: number, userId: number, dto: UpdateReviewDto): Promise<Review> {
        const review = await this.reviewRepository.findOne({
            where: { id },
            relations: ["user"], // por si algún día quitas el eager
        });

        if (!review) {
            throw new NotFoundException("Review not found");
        }

        if (review.user.id !== userId) {
            throw new ForbiddenException("You can only update your own reviews");
        }

        Object.assign(review, dto);
        return this.reviewRepository.save(review);
    }

    async deleteReview(id: number, userId: number): Promise<any> {
        const review = await this.reviewRepository.findOne({ where: { id } });

        if (!review) {
            throw new NotFoundException("Review not found");
        }

        if (review.user.id !== userId) {
            throw new ForbiddenException("You can only delete your own reviews");
        }

        await this.reviewRepository.remove(review);

        return { message: "Review deleted successfully" };
    }

    async findByMovie(movieId: number): Promise<Review[]> {
        return this.reviewRepository.find({
            where: { movie: { id: movieId } },
            order: { createdAt: "DESC" },
        });
    }

    async findByUser(userId: number): Promise<Review[]> {
        return this.reviewRepository.find({
            where: { user: { id: userId } },
            order: { createdAt: "DESC" },
        });
    }

    async findLastReviews(userId: number, limit: number = 10): Promise<Review[]> {
        return this.reviewRepository.find({
            where: { user: { id: userId } },
            order: { createdAt: "DESC" },
            take: limit,
        });
    }

    async findLatestMoviesByUser(userId: number, limit = 20): Promise<LatestUserMovieDto[]> {
        const qb = this.reviewRepository
            .createQueryBuilder("review")
            .innerJoin("review.movie", "movie")
            .where("review.userId = :userId", { userId })
            .select(['movie.id AS "movieId"', "movie.title AS title", "movie.year AS year", 'movie.imageUrl AS "imageUrl"', 'MAX(review.createdAt) AS "lastReviewDate"'])
            .groupBy("movie.id")
            .addGroupBy("movie.title")
            .addGroupBy("movie.year")
            .addGroupBy("movie.imageUrl")
            .orderBy('"lastReviewDate"', "DESC")
            .limit(limit);

        return await qb.getRawMany<LatestUserMovieDto>();
    }
}
