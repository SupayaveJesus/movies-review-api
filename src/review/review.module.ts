import { Module } from "@nestjs/common";
import { ReviewService } from "./review.service";
import { ReviewsController } from "./review.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Review } from "./entities/review.entity";
import { MovieModule } from "src/movie/movie.module";
import { UsersModule } from "src/users/users.module";

@Module({
    imports: [TypeOrmModule.forFeature([Review]), MovieModule, UsersModule],
    controllers: [ReviewsController],
    providers: [ReviewService],
})
export class ReviewModule {}
