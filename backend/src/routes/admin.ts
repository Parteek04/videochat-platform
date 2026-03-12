import { Router, Request, Response } from 'express';
import { User } from '../models/User';
import { Session } from '../models/Session';
import { Report } from '../models/Report';
import { Ban } from '../models/Ban';

const router = Router();

// GET /api/admin/stats
router.get('/stats', async (_req: Request, res: Response) => {
  try {
    const [activeUsers, totalUsers, totalSessions, totalReports, totalBans] = await Promise.all([
      User.countDocuments({ isOnline: true }),
      User.countDocuments(),
      Session.countDocuments(),
      Report.countDocuments(),
      Ban.countDocuments(),
    ]);

    res.json({ activeUsers, totalUsers, totalSessions, totalReports, totalBans });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// GET /api/admin/users?page=1&limit=20
router.get('/users', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const users = await User.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-__v');

    const total = await User.countDocuments();
    res.json({ users, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// POST /api/admin/ban/:uid
router.post('/ban/:uid', async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;
    const { reason = 'Admin ban' } = req.body;

    await User.findOneAndUpdate({ uid }, { isBanned: true });
    await Ban.create({ bannedUid: uid, bannedBy: 'admin', reason });

    res.json({ success: true, message: `User ${uid} banned.` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to ban user' });
  }
});

// POST /api/admin/unban/:uid
router.post('/unban/:uid', async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;
    await User.findOneAndUpdate({ uid }, { isBanned: false });
    res.json({ success: true, message: `User ${uid} unbanned.` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to unban user' });
  }
});

// GET /api/admin/reports?page=1&limit=20
router.get('/reports', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const reports = await Report.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Report.countDocuments();
    res.json({ reports, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

export default router;
