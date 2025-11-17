import { Injectable, NotFoundException } from "@nestjs/common";
import { Movie } from "./entities/movie.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateMovieDto } from "./dto/movie-create.dto";
import { MovieTopDto } from "./dto/movie-top.dto";

type MovieTopRaw = {
    id: number;
    title: string;
    year: number;
    imageurl: string;
    avgrating: string | null;
    reviewcount: string;
};

@Injectable()
export class MoviesService {
    constructor(
        @InjectRepository(Movie)
        private moviesRepository: Repository<Movie>,
    ) {}

    async createMovie(body: CreateMovieDto): Promise<Movie> {
        const newMovie = this.moviesRepository.create(body);
        return this.moviesRepository.save(newMovie);
    }

    async findAll(): Promise<Movie[]> {
        return this.moviesRepository.find();
    }

    async findById(id: number): Promise<Movie> {
        const movie = await this.moviesRepository.findOne({ where: { id } });

        if (!movie) {
            throw new NotFoundException("Movie not found");
        }

        return movie;
    }

    async findTopRated() {
        const movies = await this.moviesRepository
            .createQueryBuilder("movie")
            .leftJoin("movie.reviews", "review")
            .select([
                "movie.id",
                "movie.title",
                "movie.year",
                "movie.imageUrl", // ← IMPORTANTE
            ])
            .addSelect("AVG(review.rating)", "avgRating")
            .addSelect("COUNT(review.id)", "reviewCount")
            .groupBy("movie.id")
            // Use the aggregation expression in ORDER BY to avoid Postgres
            // identifier case/quoting issues with the alias (avgRating).
            .orderBy("AVG(review.rating)", "DESC")
            .limit(20)
            .getRawMany();

        // Convertir resultado raw a formato limpio
        return movies.map(movie => ({
            id: movie.movie_id,
            title: movie.movie_title,
            year: movie.movie_year,
            imageUrl: movie.movie_imageUrl, // ← VA AL FRONTEND
            avgRating: Number(movie.avgRating) || null,
            reviewCount: Number(movie.reviewCount) || 0,
        }));
    }
}
