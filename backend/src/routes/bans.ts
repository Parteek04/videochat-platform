import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { Ban } from '../models/Ban';
import { User } from '../models/User';

const router = Router();

// POST /api/bans - Ban a user
router.post('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { bannedUid, reason, expiresAt } = req.body;
    const bannedBy = req.user!.uid; // In production, verify user is Admin

    if (!bannedUid || !reason) {
      res.status(400).json({ error: 'bannedUid and reason are required' });
      return;
    }

    // Upsert the ban record
    const ban = await Ban.findOneAndUpdate(
      { bannedUid },
      { bannedBy, reason, expiresAt },
      { new: true, upsert: true }
    );

    // Update the User document directly
    await User.findOneAndUpdate({ uid: bannedUid }, { isBanned: true });

    res.status(201).json({ message: 'User has been banned', ban });
  } catch (error) {
    console.error('Create ban error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/bans/:uid - Check if a specific user is banned (useful for middleware checks)
router.get('/:uid', async (req, res: Response): Promise<void> => {
  try {
    const { uid } = req.params;
    const ban = await Ban.findOne({ bannedUid: uid });
    
    if (!ban) {
      res.json({ isBanned: false });
      return;
    }
    
    // Check if ban is expired
    if (ban.expiresAt && new Date() > ban.expiresAt) {
      await User.findOneAndUpdate({ uid }, { isBanned: false });
      await Ban.deleteOne({ _id: ban._id });
      res.json({ isBanned: false });
      return;
    }

    res.json({ isBanned: true, ban });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
