// src/movies/dto/create-movie.dto.ts
import { IsNotEmpty, IsString, IsNumber, IsOptional } from "class-validator";

export class CreateMovieDto {
    @IsNotEmpty()
    @IsString()
    title: string; // título

    @IsNotEmpty()
    @IsNumber()
    year: number; // año

    @IsOptional()
    @IsString()
    imageUrl?: string; // imagen (ruta opcional)
}
