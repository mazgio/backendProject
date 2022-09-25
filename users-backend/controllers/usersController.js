import { db } from "../index.js";
import { v4 as uuid } from "uuid";
import User from "../models/user.js";
// import Album from "../models/albums.js";
import createError from "http-errors";


// ==============================================
// GET the logged in user's data
// ==============================================

export const getUserData = async (req, res, next) => {
    // Take the :id parameter from the request path ("/users/:id/albums")
    const userId = req.params.id;

    // Try to find a user in the "users" collection "users" array with the same id
    // If you find a user object with the correct id, make a copy and put it in the "foundUser" variable
    // If you do not find the user, "foundUser" = undefined
    //const foundUser = db.data.users.find(user => user.id === userId);

    let foundUser;
    try {
        foundUser = await User.findById(userId);
    } catch {
        return next(new createError.InternalServerError("Couldn´t query database. Please try again"));

        // const err = new Error("Couldn´t query database. Please try again");
        // err.statusCode = 500;
        // return next(err);
    }
    // If a user was found with the same id as the :id parameter...
    if (foundUser) {
        // Send in the response back to the frontend:
        //  - firstName
        //  - list of albums
        const userData = {
            firstName: foundUser.firstName,
            albums: foundUser.albums
        };

        res.json(userData);

        // If no user was found with the same id as the :id parameter...
        // Create an error object with a relevant message and statusCode, and pass it to the error handling middleware
    } else {
        return next(new createError.NotFound("User could not be found"));

        // const err = new Error("User could not be found");
        // err.statusCode = 404;
        // next(err);
    }
};

// =======================================================
// POST a new album to the logged in user's "albums" list
// =======================================================
/*  cancellare la funzione postAlbum perche´ viene eseguita in albumsController
export const postAlbum = async (req, res, next) => {

    // Take the user's id from the "id" parameter of their request URL
    const userId = req.params.id;

    // Take the new album object from the body of the request

    const newAlbum = req.body;



    // Find the index of the user inside the "users" array of the database file
    // const indexOfUser = db.data.users.findIndex(user => user.id === userId);

    // Search in the user's array of albums to see if they already have the new album there
    //const foundAlbum = db.data.users[indexOfUser].albums.find(album => {



    // * Task 5, Step 1: Find the document representing the logged-in user
    let foundUser;

    try {
        foundUser = await User.findById(userId);
    } catch {
        return next(createError(500, "Query could not be completed. Please try again"));
    }


    // * Task 5, Step 2: Check to see if the user already has the new album in their "albums" array
    const foundAlbum = foundUser.albums.find(album => {
        return album.band.toLowerCase() === newAlbum.band.toLowerCase()
            && album.albumTitle.toLowerCase() === newAlbum.albumTitle.toLowerCase()
            && album.albumYear == newAlbum.albumYear;
    });

    // * Task 5, Step 3: If the user does not already have the new album in their "albums" array...
    // * ... use findByIdAndUpdate to try to update the user's "albums" array with the new album.
    // * If this is successful, return the updated array of albums in the response
    if (!foundAlbum) {
        let updatedUser;

        try {
            //                                        (1) id   (2) update                      (3) options
            updatedUser = await User.findByIdAndUpdate(userId, { $push: { albums: newAlbum } }, { new: true, runValidators: true });
        } catch {
            return next(createError(500, "User could not be updated. Please try again"));
        }

        res.status(201).json(updatedUser.albums);

        // If the new album is already in the user's "albums" array...
        // Create an error object with a relevant message and statusCode, and pass it to the error handling middleware    
    } else {
        next(createError(409, "The album already exists in your collection!"));
    }
};
*/
// ==========================================================
// DELETE all albums from the logged in user's "albums" list
// ==========================================================

export const deleteAlbums = async (req, res, next) => {
    const userId = req.params.id;

    // const indexOfUser = db.data.users.findIndex(user => user.id === userId);

    // If the user exists in the db...

    let updatedUser;

    try {
        //                                        
        updatedUser = await User.findByIdAndUpdate(userId, { albums: [] }, { new: true, runValidators: true });
    } catch {
        return next(createError(500, "User could not be updated. Please try again"));
    }
    // db.data.users[indexOfUser].albums = [];

    // await db.write();

    // res.json(db.data.users[indexOfUser].albums);

    res.json(updatedUser.albums);

};;

//==========================================================
// DELETE a single album from the logged in user's "albums" list


export const deleteAlbum = async (req, res, next) => {
    const userId = req.params.id;
    const albumId = req.params.albumId;
    let updatedUser;

    try {
        //                                        
        updatedUser = await User.findByIdAndUpdate(userId, { $pull: { albums: { _id: albumId } } }, { new: true, runValidators: true });
    } catch {
        return next(createError(500, "User could not be updated. Please try again"));
    }

    console.log("User id", userId);
    console.log("Album id", albumId);
    res.json(updatedUser.albums);
};

export const deleteUser = async (req, res, next) => {
    const userId = req.params.id;
    let deletedUser = await User.findById(userId);


    try {
        //                                        
        await User.findByIdAndRemove(userId);
    } catch {
        return next(createError(500, "User could not be deleted. Please try again"));
    }

    // console.log("User id", removeUser);

    res.json({ message: `${deletedUser.firstName} has been successfully deleted. Come back soon!` });
};


//   UPDATE ALBUMS

export const updateAlbums = async (req, res, next) => {
    const albumId = req.body.id; //String
    const userId = req.params.id;

    let foundUser;

    try {
        //                                        
        foundUser = await User.findById(userId);
    } catch {
        return next(createError(500, "User could not be completed. Please try again"));
    }
    //existingId is an obj
    const foundAlbum = foundUser.albums.find(existingId => existingId == albumId);

    // console.log("User id", removeUser);


    if (!foundAlbum) {
        let updateUser;

        try {
            updateUser = await User.findByIdAndUpdate(userId, { $push: { albums: albumId } }, { new: true, runValidators: true });
        } catch {
            return next(createError(500, "User could not be updated.Please try again"));
        }
        res.json({ albums: updateUser.albums });
    } else {
        next(409, "The album already exists in your collection");
    }
};