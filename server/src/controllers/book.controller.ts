import type { Request, Response } from "express";
import { addBookSchema, submitReviewSchema } from "../zodSchemas/book";
import { db } from "../utils/db";

export async function addNewBook(req: Request, res: Response) {
  try {
    const id = req.user?.id;

    if (!id) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    const result = addBookSchema.safeParse(req.body);

    if (!result.success) {
      res.status(422).json({
        message: "Please provide all valid inputs",
      });
      return;
    }

    const { title, description, genre } = result.data;

    const newBook = await db.book.create({
      data: {
        title,
        description: description ?? "",
        genre,
        authorId: id,
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
    const books = await db.book.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });

    if (books.length < 1) {
      res.status(404).json({ message: "No books found" });
      return;
    }

    res.status(200).json({ books });
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
    const bookDetails = await db.book.findFirst({
      where: {
        id,
      },
      include: {
        bookReviews: {
          include: {
            user: {
              omit: {
                email: true,
                password: true,
              },
            },
          },
        },
      },
    });

    if (!bookDetails) {
      res.status(404).json({ message: "No book found" });
      return;
    }

    res.status(200).json({ book: bookDetails });
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
      message: "Something went wrong while logging out",
    });
    return;
  }
}

export async function search(req: Request, res: Response) {}
