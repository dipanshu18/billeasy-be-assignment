import express from "express";
import {
  addNewBook,
  getAllBooks,
  getBookDetails,
  search,
  submitReview,
} from "../controllers/book.controller";
import authMiddleware from "../middlewares/auth.middleware";

const bookRoutes = express.Router();

// Get all books (with pagination and optional filters by author and genre)
bookRoutes.get("/", getAllBooks);

bookRoutes.post("/", authMiddleware, addNewBook);

// GET /search – Search books by title or author (partial and case-insensitive)
// bookRoutes.get("/search", search);

// Get book details by ID, including:
// Average rating
// Reviews (with pagination)
bookRoutes.get("/:id", getBookDetails);

// Submit a review (Authenticated users only, one review per user per book)
bookRoutes.post("/:id/reviews", authMiddleware, submitReview);

export default bookRoutes;
