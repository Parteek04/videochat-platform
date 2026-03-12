import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { Room } from '../models/Room';

const router = Router();

// GET /api/rooms - Get all active rooms (admin/debug)
router.get('/', authMiddleware, async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const rooms = await Room.find({ status: { $ne: 'ended' } }).limit(50);
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/rooms/stats
router.get('/stats', async (_req, res: Response): Promise<void> => {
  try {
    const activeRooms = await Room.countDocuments({ status: 'active' });
    const waitingUsers = await Room.countDocuments({ status: 'waiting' });
    res.json({ activeRooms, waitingUsers });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
