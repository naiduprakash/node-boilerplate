import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
	const data =
    "This is base {/index} API. Use the respective routing-API to begin.";
	return res.status(200).send(data);
});


export default router;
