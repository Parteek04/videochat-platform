import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { Report } from '../models/Report';

const router = Router();

// POST /api/reports - Submit a new report against a user
router.post('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { reportedId, reason } = req.body;
    const reporterId = req.user!.uid;

    if (!reportedId || !reason) {
      res.status(400).json({ error: 'reportedId and reason are required' });
      return;
    }

    if (reporterId === reportedId) {
      res.status(400).json({ error: 'You cannot report yourself' });
      return;
    }

    const report = await Report.create({ reporterId, reportedId, reason });
    res.status(201).json({ message: 'Report submitted successfully', report });
  } catch (error) {
    console.error('Create report error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/reports - Admin retrieve reports (Basic auth wrapper for now)
router.get('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // In a real app, verify req.user has Admin roles here
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
