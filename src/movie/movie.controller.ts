import { Body, Controller, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { MoviesService } from "./movie.service";
import { CreateMovieDto } from "./dto/movie-create.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import * as fs from "fs";

@Controller("movies")
export class MoviesController {
    constructor(private moviesService: MoviesService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    @UseInterceptors(
        FileInterceptor("image", {
            storage: diskStorage({
                destination: (req: Express.Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
                    const uploadPath = "./uploads";

                    try {
                        if (!fs.existsSync(uploadPath)) {
                            fs.mkdirSync(uploadPath, { recursive: true });
                        }
                        cb(null, uploadPath);
                    } catch (error) {
                        cb(error as Error, uploadPath);
                    }
                },

                filename: (req: Express.Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
                    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
                    const fileName = "movie-" + uniqueSuffix + extname(file.originalname);
                    cb(null, fileName);
                },
            }),

            fileFilter: (req: Express.Request, file: Express.Multer.File, cb: (error: Error | null, accept: boolean) => void) => {
                const allowed = /\/(jpg|jpeg|png|webp)$/;

                if (!allowed.test(file.mimetype)) {
                    return cb(new Error("Only image files are allowed!"), false);
                }

                cb(null, true);
            },

            limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
        }),
    )
    async create(@UploadedFile() file: Express.Multer.File, @Body() body: CreateMovieDto) {
        const imageUrl = file ? `/uploads/${file.filename}` : body.imageUrl;

        return this.moviesService.createMovie({
            ...body,
            imageUrl,
        });
    }

    @Get()
    findAll() {
        return this.moviesService.findAll();
    }

    @Get("top-rated")
    findTopRated() {
        return this.moviesService.findTopRated();
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.moviesService.findById(Number(id));
    }
}
