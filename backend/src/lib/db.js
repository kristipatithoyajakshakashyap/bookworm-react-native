import mongoose from "mongoose";

export const connectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Database connected ${conn.connection.host}`.bgCyan.white);
    } catch (error) {
        console.log(`Error connecting database ${error}`.bgRed.white)
        process.exit(1);
    }
}