import { Router } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Questions
 *
 * /questions:
 *   get:
 *     summary: Get all questions
 *     tags: [Questions]
 *     responses:
 *       200:
 *         description: List of questions
 *   post:
 *     summary: Create a question
 *     tags: [Questions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, answerId, categoryId]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               answerId:
 *                 type: integer
 *               categoryId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Question created
 */
router.get('/', async (_req, res, next) => {
  try {
    const questions = await prisma.question.findMany({
      include: {
        answer: true,
        category: true
      }
    });

    res.json(questions);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, description, answerId, categoryId } = req.body as {
      name?: string;
      description?: string;
      answerId?: number;
      categoryId?: number;
    };

    if (!name || typeof answerId !== 'number' || typeof categoryId !== 'number') {
      res.status(400).json({
        message: 'name, answerId và categoryId là bắt buộc.'
      });
      return;
    }

    const question = await prisma.question.create({
      data: {
        name,
        description,
        answerId,
        categoryId
      },
      include: {
        answer: true,
        category: true
      }
    });

    res.status(201).json(question);
  } catch (error) {
    next(error);
  }
});

export default router;
