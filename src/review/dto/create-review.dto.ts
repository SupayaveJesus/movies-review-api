import { IsNotEmpty, IsNumber, IsString, Min, Max, ValidateNested, IsOptional } from "class-validator";
import { Type } from "class-transformer";
import { CreateMovieDto } from "src/movie/dto/movie-create.dto";

export class CreateReviewDto {
    @IsNotEmpty()
    @IsString()
    text: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(5)
    rating: number;

    // Puede enviar movieId (película existente) o movie (objeto para crear nueva película)
    @IsOptional()
    @IsNumber()
    movieId?: number;

    @IsOptional()
    @ValidateNested()
    @Type(() => CreateMovieDto)
    movie?: CreateMovieDto;
}
