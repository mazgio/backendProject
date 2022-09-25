import express from "express";
import { getUserData, deleteAlbums, deleteAlbum, deleteUser, updateAlbums } from "../controllers/usersController.js";

const router = express.Router();

router.get("/:id", getUserData);    // GET /user/1234

router.route("/:id/albums").delete(deleteAlbum).patch(updateAlbums);    // POST /user/1234/albums

//router.delete("/:id/albums", deleteAlbums);    // DELETE /user/1234/albums

router.delete("/:id/albums/:albumId", deleteAlbum);

router.delete("/:id", deleteUser);

export default router;