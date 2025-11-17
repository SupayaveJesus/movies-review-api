import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, Request } from "@nestjs/common";
import { ReviewService } from "./review.service";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { Request as ExpressRequest } from "express";
import { JwtUser } from "../auth/dto/jwt-user.interface";

@Controller("reviews")
export class ReviewsController {
    constructor(private readonly reviewService: ReviewService) {}


    @UseGuards(JwtAuthGuard)
    @Post()
    createReview(@Request() req: ExpressRequest & { user: JwtUser }, @Body() dto: CreateReviewDto): Promise<any> {
        const userId = req.user.id;
        return this.reviewService.createReview(userId, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(":id")
    updateReview(@Param("id") id: string, @Request() req: ExpressRequest & { user: JwtUser }, @Body() dto: UpdateReviewDto): Promise<any> {
        const userId = req.user.id;
        return this.reviewService.updateReview(Number(id), userId, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(":id")
    deleteReview(@Param("id") id: string, @Request() req: ExpressRequest & { user: JwtUser }): Promise<any> {
        const userId = req.user.id;
        return this.reviewService.deleteReview(Number(id), userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get("me")
    getMyReviews(@Request() req: ExpressRequest & { user: JwtUser }): Promise<any> {
        const userId = req.user.id;
        return this.reviewService.findByUser(userId);
    }

    //  "lista de las últimas películas que el usuario haya hecho review")
    @UseGuards(JwtAuthGuard)
    @Get("me/latest-movies")
    getMyLatestMovies(@Request() req: ExpressRequest & { user: JwtUser }): Promise<any> {
        const userId = req.user.id;
        return this.reviewService.findLatestMoviesByUser(userId, 20);
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
