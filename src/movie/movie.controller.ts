import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { MoviesService } from "./movie.service";
import { CreateMovieDto } from "./dto/movie-create.dto";

@Controller("movies")
export class MoviesController {
    constructor(private moviesService: MoviesService) {}

    // Crear película
    @Post()
    create(@Body() body: CreateMovieDto): Promise<any> {
        return this.moviesService.createMovie(body);
    }

    // Listar todas (solo para debug o desarrollo)
    @Get()
    findAll(): Promise<any> {
        return this.moviesService.findAll();
    }

    // Top 20 (página principal)
    @Get("top")
    findTop(): Promise<any> {
        return this.moviesService.findTop();
    }

    // Detalle de película por ID
    @Get(":id")
    findOne(@Param("id") id: string): Promise<any> {
        return this.moviesService.findById(Number(id));
    }
}
