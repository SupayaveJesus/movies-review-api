// src/review/review.module.ts  (o reviews.module.ts)
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Review } from "./entities/review.entity";
import { ReviewService } from "./review.service";
import { ReviewsController } from "./review.controller";
import { Movie } from "../movie/entities/movie.entity";
import { User } from "../users/entities/user.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Review, Movie, User])],
    controllers: [ReviewsController],
    providers: [ReviewService],
    exports: [ReviewService],
})
export class ReviewModule {}
