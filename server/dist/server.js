"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_js_1 = require("./config/db.js");
const recipeRoutes_js_1 = __importDefault(require("./routes/recipeRoutes.js"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Connect to MongoDB
(0, db_js_1.connectDB)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/recipes', recipeRoutes_js_1.default);
// Health check endpoint
app.get('/api/health', (_req, res) => {
    res.json({ status: 'OK', message: 'TasteCraft MERN API is running' });
});
// Root endpoint
app.get('/', (_req, res) => {
    res.send('TasteCraft Recipe Management API');
});
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
