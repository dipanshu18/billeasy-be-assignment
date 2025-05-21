import type { Request, Response } from "express";
import { db } from "../utils/db";
import { submitReviewSchema } from "../zodSchemas/book";

export async function updateReview(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const reviewExists = await db.review.findFirst({
      where: {
        id,
      },
    });

    if (!reviewExists) {
      res.status(404).json({
        message: "Review does not exists",
      });
      return;
    }

    const result = submitReviewSchema.safeParse(req.body);

    if (!result.success) {
      res.status(422).json({
        message: "Please provide all valid required inputs",
      });
      return;
    }

    const { rating, content } = result.data;
    const updatedReview = await db.review.update({
      where: {
        id,
      },
      data: {
        rating,
        content,
      },
    });

    if (!updatedReview) {
      res.status(400).json({
        message: "Could not update review with provided inputs",
      });
      return;
    }

    res.status(200).json({
      message: "Review updated",
    });
    return;
  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({
      message: "Something went wrong while updating the review",
    });
    return;
  }
}

export async function deleteReview(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const reviewExists = await db.review.findFirst({
      where: {
        id,
      },
    });

    if (!reviewExists) {
      res.status(404).json({
        message: "Review does not exists",
      });
      return;
    }

    const deletedReview = await db.review.delete({
      where: {
        id,
      },
    });

    if (!deletedReview) {
      res.status(400).json({
        message: "Could not able to delete review",
      });
      return;
    }

    res.status(200).json({
      message: "Review deleted",
    });
    return;
  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({
      message: "Something went wrong while updating the review",
    });
    return;
  }
}
