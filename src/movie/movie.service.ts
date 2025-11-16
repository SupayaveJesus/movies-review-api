import { Injectable, NotFoundException } from "@nestjs/common";
import { Movie } from "./entities/movie.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateMovieDto } from "./dto/movie-create.dto";

@Injectable()
export class MoviesService {
    constructor(
        @InjectRepository(Movie)
        private moviesRepository: Repository<Movie>,
    ) {}

    // Crear película
    async createMovie(body: CreateMovieDto): Promise<Movie> {
        const newMovie = this.moviesRepository.create(body);
        return this.moviesRepository.save(newMovie);
    }

    // Listar todas las películas
    async findAll(): Promise<Movie[]> {
        return this.moviesRepository.find();
    }

    // Top 20 (cuando tengamos reviews se ordenará por rating promedio)
    async findTop(): Promise<Movie[]> {
        const movies = await this.moviesRepository.find();
        return movies.slice(0, 20);
    }

    // Buscar película por ID
    async findById(id: number): Promise<Movie> {
        const movie = await this.moviesRepository.findOne({
            where: { id },
        });

        if (!movie) {
            throw new NotFoundException("Movie not found");
        }

        return movie;
    }
}
