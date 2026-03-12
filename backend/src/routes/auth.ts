import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { User } from '../models/User';

const router = Router();

// POST /api/auth/sync - Sync Firebase user to MongoDB after login
router.post('/sync', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { uid, email, displayName } = req.user!;
    const { photoURL } = req.body;

    let user = await User.findOne({ uid });

    if (!user) {
      user = await User.create({ uid, email: email || '', displayName: displayName || 'Anonymous', photoURL });
      res.status(201).json({ message: 'User created', user });
    } else {
      user.displayName = displayName || user.displayName;
      user.photoURL = photoURL || user.photoURL;
      await user.save();
      res.json({ message: 'User synced', user });
    }
  } catch (error) {
    console.error('Auth sync error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/auth/me - Get current user
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findOne({ uid: req.user!.uid });
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
