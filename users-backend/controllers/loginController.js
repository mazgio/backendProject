import { db } from "../index.js";
import User from "../models/user.js";
import createError from "http-errors";


export const loginPost = async (req, res, next) => {
    // Take the username and password the user tried to log in with
    const { username, password } = req.body;

    // Search inside the current list of users
    // Do any users have the SAME username AND password?
    //const found = db.data.users.find(user => user.username === username && user.password === password);

    let found;
    try {
        found = await User.findOne({ username: username, password: password });
    } catch {
        return next(new createError.InternalServerError("Couldn´t query database. Please try again"));
        // const err = new Error("Couldn´t query database. Please try again");
        // err.statusCode = 500;
        // return next(err);
    }



    // If we found a user in our db with the same login details as we received from the frontend...
    // Send that user's id back the frontend in the response for further processing
    if (found) {


        res.json({ id: found._id });
        // If we found no user in our db with the same login details as we received from the frontend
        // (E.g. the person logging in made a mistake with their username/password/both!)
        // Create an error object with a relevant message and statusCode, and pass it to the error handling middleware
    } else {
        return next(new createError.Unauthorized("You could not be logged in. Please try again"));
        // const err = new Error("You could not be logged in. Please try again");  // Message
        // err.statusCode = 401;   // "Unauthorized"
        // next(err);
    }
};