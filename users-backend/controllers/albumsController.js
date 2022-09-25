import Album from "../models/album.js";
import createError from "http-errors";


export const albumsPost = async (req, res, next) => {
    // Take the username and password the user tried to log in with
    // const { albumTitle, albumYear, band } = req.body;

    // Search inside the current list of users
    // Do any users have the SAME username AND password?
    //const found = db.data.users.find(user => user.username === username && user.password === password);

    let existingAlbum;
    try {
        existingAlbum = await Album.findOne(req.body);
    } catch {
        return next(new createError.InternalServerError("Couldn´t query database. Please try again"));
        // const err = new Error("Couldn´t query database. Please try again");
        // err.statusCode = 500;
        // return next(err);
    }

    if (existingAlbum) {
        req.json({ id: existingAlbum._id });
    } else {
        let newAlbum;

        newAlbum = new Album(req.body);
        try {
            await newAlbum.save();
        } catch {
            return next(createError(500, "Album couldn´t be created. Please try again"));
        }

        res.json({ id: newAlbum._id });

    }



    // If we found a user in our db with the same login details as we received from the frontend...
    // Send that user's id back the frontend in the response for further processing
    // if (!newAlbum) {

    // If we found no user in our db with the same login details as we received from the frontend
    // (E.g. the person logging in made a mistake with their username/password/both!)
    // Create an error object with a relevant message and statusCode, and pass it to the error handling middleware
    // } else {
    //     return next(new createError.Unauthorized("You could not be logged in. Please try again"));
    //     // const err = new Error("You could not be logged in. Please try again");  // Message
    //     // err.statusCode = 401;   // "Unauthorized"
    //     // next(err);
    // }
    //}
};
// };