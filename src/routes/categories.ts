import { NextFunction, Request, Response, Router } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Categories
 *
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories
 *   post:
 *     summary: Create a category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category created
 */
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        questions: true
      }
    });

    res.json(categories);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body as { name?: string };

    if (!name) {
      res.status(400).json({ message: 'name là bắt buộc.' });
      return;
    }

    const category = await prisma.category.create({
      data: {
        name
      }
    });

    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
});

export default router;
