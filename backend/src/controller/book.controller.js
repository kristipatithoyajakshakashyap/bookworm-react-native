import cloudinary from "../lib/cloudinary.js";
import Book from "../models/Book.model.js";

export const createBookController = async (req, res) => {
    try {
        const { title, caption, rating, image } = req.body;
        if (!image || !title || !caption || !rating) return res.status(400).json({ message: "All fields are required" })
        const uploadResponse = await cloudinary.uploader.upload(image);
        const imageUrl = uploadResponse.secure_url;
        const newBook = new Book({
            title,
            caption,
            rating,
            image: imageUrl,
            user: req.user._id
        })
        await newBook.save();
        res.status(201).json(newBook);
    } catch (error) {
        console.log(`Error in createBookController ${error.message}`.bgRed.white)
        res.status(500).json({ message: error.message })
    }
}

export const getBookController = async (req, res) => {
    // const response = await fetch("http://localhost:3000/api/books?page=1&limit=5");
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 5;
        const skip = (page - 1) * limit;
        const books = await Book.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("user", "username profileImage")
        const total = await Book.countDocuments()
        res.status(200).json({
            books,
            currentPage: page,
            totalBooks: total,
            totalPages: Math.ceil(total / limit),
        })
    } catch (error) {
        console.log(`Error in getBookController ${error.message}`.bgRed.white)
        res.status(500).json({ message: error.message })
    }
}

export const deleteBookController = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: "Book not found" });
        if (book.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: "Unauthorized" })
        // delete image from cloudinary
        if (book.image && book.image.includes("cloudinary")) {
            try {
                const publicId = book.image.split("/").pop().split(".")[0]
                await cloudinary.uploader.destroy(publicId);
            } catch (deleteError) {
                console.log(`Error deleting image from cloudinary ${deleteError}`.bgRed.white)
            }
        }
        await book.deleteOne();
        res.json({ message: "Book deleted successfully" })
    } catch (error) {
        console.log(`Error in deleteBookController ${error.message}`.bgRed.white)
        res.status(500).json({ message: error.message })
    }
}

export const getRecommendedBookController = async (req, res) => {
    try {
        const books = await Book.find({ user: req.user._id }).sort({createdAt: -1})
        res.status(200).json(books)
    } catch (error) {
        console.log(`Error in getRecommendedBookController ${error.message}`.bgRed.white)
        res.status(500).json({ message: error.message })
    }
}