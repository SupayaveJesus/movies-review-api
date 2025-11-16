import { IsNotEmpty, IsString, IsNumber } from "class-validator";

export class CreateMovieInlineDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsNumber()
    year: number;

    @IsString()
    imageUrl: string;
}
