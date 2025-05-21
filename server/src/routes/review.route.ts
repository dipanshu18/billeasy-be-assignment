import express from "express";

const reviewRoutes = express.Router();

// PUT /reviews/:id – Update your own review
reviewRoutes.put("/:id");

// DELETE /reviews/:id – Delete your own review
reviewRoutes.delete("/:id");

export default reviewRoutes;
