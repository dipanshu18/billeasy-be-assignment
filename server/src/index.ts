import { APP_ORIGIN, PORT } from "./constants/env";

import express from "express";
import cors from "cors";
import bookRoutes from "./routes/book.route";
import reviewRoutes from "./routes/review.route";
import authRoutes from "./routes/auth.route";
import authMiddleware from "./middlewares/auth.middleware";

const app = express();

app.use(
  cors({
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    origin: [APP_ORIGIN],
  })
);
app.use(express.json());

app.use((req, _, next) => {
  console.log(req.method, req.path, new Date().toLocaleString());
  next();
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/books", bookRoutes);
app.use("/api/v1/reviews", authMiddleware, reviewRoutes);

app.listen(PORT, () => {
  console.log("Server started on port:", PORT);
});
