import express from "express";
import cors from "cors";
import { Low, JSONFile } from "lowdb";
import morgan from "morgan";
import mongoose from "mongoose";

import globalErrorHandler from "./middleware/globalErrorHandler.js";
import registerRouter from "./routes/register.js";
import loginRouter from "./routes/login.js";
import usersRouter from "./routes/users.js";
import albumsRouter from "./routes/albums.js";
import dotenv from "dotenv";

const app = express();


dotenv.config();

//! Connect to MongoDB CRUD Method

mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.lgsk576.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`);

mongoose.connection.on("open", () => console.log("Database connection established "));

mongoose.connection.on("error", () => console.error);


// Lowdb
const adapter = new JSONFile("./data/db.json");
export const db = new Low(adapter);

//we don´t use it anymore
//await db.read();



// Allows ALL cors requests to all our routes
app.use(cors());

// We can use express's .json() method to parse JSON data received in any request
app.use(express.json());

// Register our "logger" middleware (no longer used - now we are using "morgan" for logging)
// app.use(logger);

// Use morgan to make a small log every time a request is received
app.use(morgan("tiny"));

app.use("/register", registerRouter);

app.use("/login", loginRouter);

app.use("/users", usersRouter);

app.use("/albums", albumsRouter);

// The last registered middleware = global error handler
app.use(globalErrorHandler);

app.listen(process.env.PORT || 3001, () => {
    console.log(`Server has started on port ${process.env.port || 3001}!`);
});