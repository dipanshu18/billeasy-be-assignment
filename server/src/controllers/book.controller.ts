import type { Request, Response } from "express";
import { addBookSchema, submitReviewSchema } from "../zodSchemas/book";
import { db } from "../utils/db";
import type { Genre, Prisma } from "@prisma/client";

export async function addNewBook(req: Request, res: Response) {
  try {
    const result = addBookSchema.safeParse(req.body);

    if (!result.success) {
      res.status(422).json({
        message: "Please provide all valid inputs",
      });
      return;
    }

    const { title, description, genre, author } = result.data;

    const newBook = await db.book.create({
      data: {
        title,
        description: description ?? "",
        genre,
        author,
      },
    });

    if (!newBook) {
      res.status(400).json({
        message: "Could not add new book with provided inputs",
      });
      return;
    }

    res.status(201).json({
      message: "Added book",
    });
    return;
  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({
      message: "Something went wrong while adding a new book",
    });
    return;
  }
}

export async function getAllBooks(req: Request, res: Response) {
  try {
    const limit = Number(req.query.limit) || 5;
    const page = Number(req.query.page) || 1;

    const start = (page - 1) * limit;

    const totalBooks = await db.book.count();
    const books = await db.book.findMany({
      take: limit,
      skip: start,
    });

    if (totalBooks < 1) {
      res.status(404).json({ message: "No books found" });
      return;
    }

    const results: {
      books: any;
      next?: {
        page: number;
        limit: number;
      };
      prev?: {
        page: number;
        limit: number;
      };
    } = { books };

    if (start + limit < totalBooks) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }

    if (start > 0) {
      results.prev = {
        page: page - 1,
        limit: limit,
      };
    }

    res.status(200).json(results);
    return;
  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({
      message: "Something went wrong while logging out",
    });
    return;
  }
}

export async function getBookDetails(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const limit = Number(req.query.limit) || 3;
    const page = Number(req.query.page) || 1;

    const start = (page - 1) * limit;

    const bookDetails = await db.book.findFirst({
      where: {
        id,
      },
    });

    if (!bookDetails) {
      res.status(404).json({ message: "No book found" });
      return;
    }

    const totalReviews = await db.review.count({
      where: {
        bookId: id,
      },
    });

    const bookReviews = await db.review.findMany({
      take: limit,
      skip: start,
      where: {
        bookId: id,
      },
      include: {
        user: {
          omit: {
            email: true,
            password: true,
          },
        },
      },
    });

    const avgRatingResult = await db.review.aggregate({
      where: {
        bookId: id,
      },
      _avg: {
        rating: true,
      },
    });

    const avgRating = Math.round(avgRatingResult._avg.rating as number) ?? 0;

    const results: {
      avgRating: number;
      reviews: any;
      next?: {
        page: number;
        limit: number;
      };
      prev?: {
        page: number;
        limit: number;
      };
    } = { avgRating, reviews: bookReviews };

    if (start + limit < totalReviews) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }

    if (start > 0) {
      results.prev = {
        page: page - 1,
        limit: limit,
      };
    }

    res.status(200).json({ book: bookDetails, results });
    return;
  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({
      message: "Something went wrong while logging out",
    });
    return;
  }
}

export async function submitReview(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const bookDetails = await db.book.findFirst({
      where: {
        id,
      },
    });

    if (!bookDetails) {
      res.status(404).json({ message: "No book found" });
      return;
    }

    const reviewExists = await db.review.findFirst({
      where: {
        userId,
        bookId: id,
      },
    });

    if (reviewExists) {
      res
        .status(400)
        .json({ message: "You have already submitted a review for this book" });
      return;
    }

    const result = submitReviewSchema.safeParse(req.body);

    if (!result.success) {
      res.status(422).json({
        message: "Please provide all valid inputs",
      });
      return;
    }

    const { rating, content } = result.data;

    const newReview = await db.review.create({
      data: {
        rating,
        content,
        bookId: id,
        userId,
      },
    });

    if (!newReview) {
      res
        .status(400)
        .json({ message: "Could not add review with provided inputs" });
      return;
    }

    res.status(200).json({ message: "Added review" });
    return;
  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({
      message: "Something went wrong while adding review",
    });
    return;
  }
}

export async function searchBooks(req: Request, res: Response) {
  try {
    const title = req.query.title;
    const author = req.query.author;
    const genre = req.query.genre;

    const whereConditions: Prisma.BookWhereInput[] = [];

    if (title) {
      whereConditions.push({
        title: {
          mode: "insensitive",
          contains: title as string,
        },
      });
    }

    if (author) {
      whereConditions.push({
        author: {
          contains: author as string,
          mode: "insensitive",
        },
      });
    }

    if (genre) {
      whereConditions.push({
        genre: {
          in: [...(genre?.toString().split(",") as Genre[])],
        },
      });
    }

    const filteredBooks = await db.book.findMany({
      where: {
        OR: whereConditions as Prisma.BookWhereInput[],
      },
    });

    if (filteredBooks.length < 1) {
      res.status(404).json({
        message: "No books found with the provided search filter",
      });
      return;
    }

    res.status(200).json({
      results: filteredBooks,
    });
    return;
  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({
      message: "Something went wrong while searching book",
    });
    return;
  }
}
