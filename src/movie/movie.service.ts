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

    async findTopRated(): Promise<MovieTopDto[]> {
        const raw: MovieTopRaw[] = await this.moviesRepository
            .createQueryBuilder("movie")
            .leftJoin("movie.reviews", "review")
            .select("movie.id", "id")
            .addSelect("movie.title", "title")
            .addSelect("movie.year", "year")
            .addSelect("movie.imageUrl", "imageUrl")
            .addSelect("AVG(review.rating)", "avgrating")
            .addSelect("COUNT(review.id)", "reviewcount")
            .groupBy("movie.id")
            .orderBy(
                `CASE 
                    WHEN AVG(review.rating) IS NULL THEN 1 
                    ELSE 0 
                END`,
                "ASC",
            )
            .addOrderBy("AVG(review.rating)", "DESC")
            .addOrderBy("COUNT(review.id)", "DESC")
            .addOrderBy("movie.id", "ASC")
            .limit(20)
            .getRawMany();

        return raw.map(item => ({
            id: Number(item.id),
            title: item.title,
            year: Number(item.year),
            imageUrl: item.imageurl,
            avgRating: item.avgrating ? Number(parseFloat(item.avgrating).toFixed(1)) : null,
            reviewCount: Number(item.reviewcount),
        }));
    }
}
