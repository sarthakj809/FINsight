const express = require("express");

const aiRouter = express.Router();

const { getAIInsights } = require("../controllers/aiController");

const {authMiddleware} = require("../middleware/auth");

aiRouter.get("/insights", authMiddleware, getAIInsights);

module.exports = aiRouter;