import { z } from "zod";

export const AddBookSchema = z.object({
  title: z
    .string()
    .min(4, { message: "Book title must be minimum 4 characters long" }),
  description: z.string().optional(),
  genres: z.enum(
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
        "Genre needs to be any of these types: FICTION, SCIENTIFIC, ROMANCE, HORROR, NOVEL, MYSTERY, HISTORIC, FANTASY",
    }
  ),
});

export const submitReviewSchema = z.object({
  content: z.string().min(5, { message: "Review must be 5 characters long" }),
});
