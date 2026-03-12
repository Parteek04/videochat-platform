import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { Session } from '../models/Session';

const router = Router();

// POST /api/sessions - Log a completed chat session
router.post('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { participants, startTime, endTime, duration } = req.body;

    if (!participants || !startTime || !endTime || duration === undefined) {
      res.status(400).json({ error: 'Missing required session fields' });
      return;
    }

    // Ensure the user submitting is part of the session
    if (!participants.includes(req.user!.uid)) {
      res.status(403).json({ error: 'Unauthorized to log this session' });
      return;
    }

    const session = await Session.create({ participants, startTime, endTime, duration });
    res.status(201).json(session);
  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/sessions/:uid - Get sessions for a specific user
router.get('/:uid', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { uid } = req.params;

    // Only allow users to fetch their own sessions
    if (uid !== req.user!.uid) {
      res.status(403).json({ error: 'Unauthorized to view these sessions' });
      return;
    }

    const sessions = await Session.find({ participants: uid }).sort({ createdAt: -1 }).limit(50);
    res.json(sessions);
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
