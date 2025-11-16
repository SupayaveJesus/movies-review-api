// src/movies/dto/create-movie.dto.ts
import { IsNotEmpty, IsString, IsNumber } from "class-validator";

export class CreateMovieDto {
    @IsNotEmpty()
    @IsString()
    title: string; // título

    @IsNotEmpty()
    @IsNumber()
    year: number; // año

    @IsNotEmpty()
    @IsString()
    imageUrl: string; // imagen
}
