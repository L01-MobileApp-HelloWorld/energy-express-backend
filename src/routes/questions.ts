import { NextFunction, Request, Response, Router } from 'express';
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
 *
 * /questions/{id}:
 *   get:
 *     summary: Get question by id
 *     tags: [Questions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Question detail
 *       400:
 *         description: Invalid id
 *       404:
 *         description: Question not found
 *   put:
 *     summary: Update question by id
 *     tags: [Questions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
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
 *       200:
 *         description: Question updated
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Question not found
 *   delete:
 *     summary: Delete question by id
 *     tags: [Questions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Question deleted
 *       400:
 *         description: Invalid id
 *       404:
 *         description: Question not found
 */
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
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

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
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

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      res.status(400).json({ message: 'id không hợp lệ.' });
      return;
    }

    const question = await prisma.question.findUnique({
      where: { id },
      include: { answer: true, category: true }
    });

    if (!question) {
      res.status(404).json({ message: 'Không tìm thấy question.' });
      return;
    }

    res.json(question);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const { name, description, answerId, categoryId } = req.body as {
      name?: string;
      description?: string;
      answerId?: number;
      categoryId?: number;
    };

    if (Number.isNaN(id)) {
      res.status(400).json({ message: 'id không hợp lệ.' });
      return;
    }

    if (!name || typeof answerId !== 'number' || typeof categoryId !== 'number') {
      res.status(400).json({
        message: 'name, answerId và categoryId là bắt buộc.'
      });
      return;
    }

    const existingQuestion = await prisma.question.findUnique({
      where: { id }
    });

    if (!existingQuestion) {
      res.status(404).json({ message: 'Không tìm thấy question.' });
      return;
    }

    const question = await prisma.question.update({
      where: { id },
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

    res.json(question);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      res.status(400).json({ message: 'id không hợp lệ.' });
      return;
    }

    const existingQuestion = await prisma.question.findUnique({
      where: { id }
    });

    if (!existingQuestion) {
      res.status(404).json({ message: 'Không tìm thấy question.' });
      return;
    }

    await prisma.question.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
