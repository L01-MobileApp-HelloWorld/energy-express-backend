import { NextFunction, Request, Response, Router } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Answers
 *
 * /answers:
 *   get:
 *     summary: Get all answers
 *     tags: [Answers]
 *     responses:
 *       200:
 *         description: List of answers
 *   post:
 *     summary: Create an answer
 *     tags: [Answers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Answer created
 */
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const answers = await prisma.answer.findMany({
      include: {
        questions: true
      }
    });

    res.json(answers);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { content } = req.body as { content?: string };

    if (!content) {
      res.status(400).json({ message: 'content là bắt buộc.' });
      return;
    }

    const answer = await prisma.answer.create({
      data: {
        content
      }
    });

    res.status(201).json(answer);
  } catch (error) {
    next(error);
  }
});

export default router;
