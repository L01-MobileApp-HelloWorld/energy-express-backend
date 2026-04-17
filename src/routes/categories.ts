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
 *
 * /categories/{id}:
 *   get:
 *     summary: Get category by id
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Category detail
 *       400:
 *         description: Invalid id
 *       404:
 *         description: Category not found
 *   put:
 *     summary: Update category by id
 *     tags: [Categories]
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
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Category not found
 *   delete:
 *     summary: Delete category by id
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Category deleted
 *       400:
 *         description: Invalid id
 *       404:
 *         description: Category not found
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

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      res.status(400).json({ message: 'id không hợp lệ.' });
      return;
    }

    const category = await prisma.category.findUnique({
      where: { id },
      include: { questions: true }
    });

    if (!category) {
      res.status(404).json({ message: 'Không tìm thấy category.' });
      return;
    }

    res.json(category);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const { name } = req.body as { name?: string };

    if (Number.isNaN(id)) {
      res.status(400).json({ message: 'id không hợp lệ.' });
      return;
    }

    if (!name) {
      res.status(400).json({ message: 'name là bắt buộc.' });
      return;
    }

    const existingCategory = await prisma.category.findUnique({
      where: { id }
    });

    if (!existingCategory) {
      res.status(404).json({ message: 'Không tìm thấy category.' });
      return;
    }

    const category = await prisma.category.update({
      where: { id },
      data: { name },
      include: { questions: true }
    });

    res.json(category);
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

    const existingCategory = await prisma.category.findUnique({
      where: { id }
    });

    if (!existingCategory) {
      res.status(404).json({ message: 'Không tìm thấy category.' });
      return;
    }

    await prisma.category.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
