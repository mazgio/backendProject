// import { db } from "../index.js";
// import { v4 as uuid } from "uuid";
import User from "../models/user.js";
import createError from "http-errors";

export const registerPost = async (req, res, next) => {
    const { username, password, firstName, lastName, emailAddress } = req.body;

    // const foundUsername = db.data.users.find(user => user.username === username);


    // let found;

    // try {

    //     found = await User.findOne({ username: username });

    // } catch {
    //     const error = new Error("Could not query database. Please try it again");
    //     error.statusCode = 500;
    //     return next(error);

    // }

    // If there is no user in the db with the username received from the frontend


    // Create a new user based on data received from req.body
    const newUser = new User({
        username: username,
        password: password,
        firstName: firstName,
        lastName: lastName,
        emailAddress: emailAddress,
        albums: []
    });

    // Add the new user object to db.data's "users" array
    //db.data.users.push(newUser);

    // Update db.json
    //await db.write();

    // Send a response to the client containing the new user object in a JSON format


    try {
        await newUser.save();   // We could get a validation error here if the schema is not fulfilled
    } catch {
        return next(new createError.InternalServerError("Couldn´t query database. Please try again"));

        // const error = new Error("User could not be created. Please try again");
        // error.statusCode = 500;
        // return next(error);
    }

    // let allUsers;

    // // Try to use the "User" model to find ALL documents in the "users" collection, including the new one.
    // try {
    //     allUsers = await User.find();
    //     // Handle any errors
    // } catch {
    //     const error = new Error("Could not get all users from the collection. Please try again");
    //     error.statusCode = 500;
    //     return next(error);
    // }

    // If there were no errors, send a response to the frontend containing all the documents in the "users" collection
    res.status(201).json({ id: newUser._id });
    // ? Else, if there is already a document in the "users" collection with the same details...
    // } else {
    //     // If we do find an existing user, we can't successfully process the request!
    //     // Create an error object, and pass it on to our error handler
    //     return next(new createError.Conflict("A user with these details already exists in the db!"));


    //     // const err = new Error("A user with these details already exists in the db!");
    //     // err.statusCode = 409;   // 409 error = "Conflict"
    //     // next(err);  // This will automatically take you to the global error handler middleware
    // }
};