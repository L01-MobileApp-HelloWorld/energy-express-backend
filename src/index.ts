import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import questionsRouter from './routes/questions';
import answersRouter from './routes/answers';
import categoriesRouter from './routes/categories';
import { swaggerOptions } from './config/swagger';

const app = express();
const PORT = Number(process.env.PORT ?? 3000);

app.use(express.json());

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Ensure a trailing slash so Swagger UI static assets resolve as /docs/* in all environments.
app.get(/^\/docs$/, (_req: Request, res: Response) => {
  res.redirect(301, '/docs/');
});
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.use('/questions', questionsRouter);
app.use('/answers', answersRouter);
app.use('/categories', categoriesRouter);

app.use((err: unknown, _req: Request, res: Response, next: NextFunction) => {
  void next;
  console.error(err);
  res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger docs on http://localhost:${PORT}/docs`);
});
