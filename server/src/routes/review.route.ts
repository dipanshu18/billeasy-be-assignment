import express from "express";
import { deleteReview, updateReview } from "../controllers/review.controller";

const reviewRoutes = express.Router();

// PUT /reviews/:id – Update your own review
reviewRoutes.put("/:id", updateReview);

// DELETE /reviews/:id – Delete your own review
reviewRoutes.delete("/:id", deleteReview);

export default reviewRoutes;
