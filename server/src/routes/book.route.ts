import express from "express";

import {
  addNewBook,
  getAllBooks,
  getBookDetails,
  searchBooks,
  submitReview,
} from "../controllers/book.controller";
import authMiddleware from "../middlewares/auth.middleware";

const bookRoutes = express.Router();

bookRoutes.get("/", getAllBooks);

bookRoutes.post("/", authMiddleware, addNewBook);

bookRoutes.get("/search", searchBooks);

bookRoutes.get("/:id", getBookDetails);

bookRoutes.post("/:id/reviews", authMiddleware, submitReview);

export default bookRoutes;
