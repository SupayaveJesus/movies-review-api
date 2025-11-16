import { Module } from "@nestjs/common";
import { MoviesService } from "./movie.service";
import { MoviesController } from "./movie.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Movie } from "./entities/movie.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Movie])],
    providers: [MoviesService],
    controllers: [MoviesController],
    exports: [MoviesService],
})
export class MovieModule {}
