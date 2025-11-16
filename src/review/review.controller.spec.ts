import { Test, TestingModule } from "@nestjs/testing";
import { ReviewsController } from "./review.controller";
import { ReviewService } from "./review.service";

describe("ReviewsController", () => {
    let controller: ReviewsController;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ReviewsController],
            providers: [ReviewService],
        }).compile();

        controller = module.get<ReviewsController>(ReviewsController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
