import express from "express";
import cors from "cors";
import { router } from "./routes/index.js";
import cookieParser from 'cookie-parser';
import { errorHandler } from "./middlewares/errorHandler.js";
import swaggerUi from 'swagger-ui-express';
import { generateSwaggerDoc } from './docs/openapi.js';
import './docs/registerAll.js';

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));

const swaggerSpec = generateSwaggerDoc();

app.get('/api-docs-json', (req, res) => {
    res.json(swaggerSpec);
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
        persistAuthorization: true,  
    },
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));
app.use('/api', router);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});

export { app };