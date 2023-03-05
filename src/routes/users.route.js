import express from "express";
import usersController from "../controllers/users.controller";

const router = express.Router();

router.get("/:id?", usersController.fetchUsers);

export default router;
