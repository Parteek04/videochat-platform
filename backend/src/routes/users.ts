import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { User } from '../models/User';

const router = Router();

// GET /api/users/online-count
router.get('/online-count', async (_req, res: Response): Promise<void> => {
  try {
    const count = await User.countDocuments({ isOnline: true });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/users/profile - Update user profile
router.patch('/profile', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { displayName, photoURL } = req.body;
    const user = await User.findOneAndUpdate(
      { uid: req.user!.uid },
      { $set: { displayName, photoURL } },
      { new: true },
    );
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
