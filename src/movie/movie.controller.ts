import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { MoviesService } from "./movie.service";
import { CreateMovieDto } from "./dto/movie-create.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Controller("movies")
export class MoviesController {
    constructor(private moviesService: MoviesService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() body: CreateMovieDto): Promise<any> {
        return this.moviesService.createMovie(body);
    }

    @Get()
    findAll(): Promise<any> {
        return this.moviesService.findAll();
    }

    @Get("top-rated")
    findTopRated(): Promise<any> {
        return this.moviesService.findTopRated();
    }

    @Get(":id")
    findOne(@Param("id") id: string): Promise<any> {
        return this.moviesService.findById(Number(id));
    }
}
