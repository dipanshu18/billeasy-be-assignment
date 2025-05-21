import { z } from "zod";

export const addBookSchema = z.object({
  title: z.string().min(4, { message: "Book title must be 4 characters long" }),
  description: z.string().optional(),
  author: z.string().min(4, "Author name must be 4 characters long"),
  genre: z.enum(
    [
      "FICTION",
      "SCIENTIFIC",
      "ROMANCE",
      "HORROR",
      "NOVEL",
      "MYSTERY",
      "HISTORIC",
      "FANTASY",
    ],
    {
      message:
        "Genre needs to be any one of these types: FICTION, SCIENTIFIC, ROMANCE, HORROR, NOVEL, MYSTERY, HISTORIC, FANTASY",
    }
  ),
});

export const submitReviewSchema = z.object({
  rating: z.number().min(1).max(5),
  content: z.string().min(5, { message: "Review must be 5 characters long" }),
});
