import express from "express";
import { createBookController, getBookController, deleteBookController, getRecommendedBookController } from "../controller/book.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/",protectRoute, createBookController)
router.get("/",protectRoute, getBookController)
router.delete("/:id",protectRoute, deleteBookController)
router.get("/user",protectRoute, getRecommendedBookController)

export default router;
