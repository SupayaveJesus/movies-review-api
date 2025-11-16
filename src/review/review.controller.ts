import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ReviewService } from "./review.service";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";

@Controller("reviews")
export class ReviewsController {
    constructor(private readonly reviewService: ReviewService) {}

    @Post()
    createReview(@Query("userId") userId: string, @Body() dto: CreateReviewDto): Promise<any> {
        return this.reviewService.createReview(Number(userId), dto);
    }

    @Patch(":id")
    updateReview(@Param("id") id: string, @Query("userId") userId: string, @Body() dto: UpdateReviewDto): Promise<any> {
        return this.reviewService.updateReview(Number(id), Number(userId), dto);
    }

    @Delete(":id")
    deleteReview(@Param("id") id: string, @Query("userId") userId: string): Promise<any> {
        return this.reviewService.deleteReview(Number(id), Number(userId));
    }

    @Get("/movie/:movieId")
    findReviewsByMovie(@Param("movieId") movieId: string): Promise<any> {
        return this.reviewService.findByMovie(Number(movieId));
    }

    @Get("/user/:userId")
    findReviewsByUser(@Param("userId") userId: string): Promise<any> {
        return this.reviewService.findByUser(Number(userId));
    }

    @Get("/user/:userId/latest-movies")
    findLatestMovies(@Param("userId") userId: string): Promise<any> {
        return this.reviewService.findLatestMoviesByUser(Number(userId), 20);
    }
}
