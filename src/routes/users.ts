import { Router } from 'express';
import Joi from 'joi';
import db from '../db';
import { User } from '../types/user';

const router = Router();
const table = 'user';

const createSchema = Joi.object<User>({
  azureId: Joi.string().required(),
  mail: Joi.string().email().required(),
  givenName: Joi.string().optional(),
  surname: Joi.string().optional(),
  displayName: Joi.string().optional(),
  jobTitle: Joi.string().optional(),
  department: Joi.string().optional(),
  mobile: Joi.string().optional(),
  telephoneNumber: Joi.string().optional(),
  status: Joi.string().valid('enabled', 'disabled').default('enabled'),
  external: Joi.boolean().required(),
  superAdmin: Joi.boolean().optional(),
  adType: Joi.string().required(),
  bannerAdmin: Joi.boolean().optional(),
});

const updateSchema = createSchema.fork(['azureId'], (s) => s.forbidden());

router.get('/', async (_req, res) => {
  const users = await db<User>(table).select();
  res.json(users);
});

router.get('/:id', async (req, res) => {
  const user = await db<User>(table)
    .where({ azureId: req.params.id })
    .first();
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

router.post('/', async (req, res) => {
  const { error, value } = createSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  const user: User = value;
  try {
    await db<User>(table).insert(user);
    res.status(201).json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { error, value } = updateSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  try {
    const count = await db<User>(table)
      .where({ azureId: req.params.id })
      .update(value);
    if (count === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const updated = await db<User>(table)
      .where({ azureId: req.params.id })
      .first();
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const count = await db<User>(table)
    .where({ azureId: req.params.id })
    .del();
  if (count === 0) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.status(204).send();
});

export default router;
