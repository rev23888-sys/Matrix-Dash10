/**
 * POST /api/guilds/[guild]/refresh
 * Invalidates the guild info cache so bot-presence is re-checked.
 * Call this after inviting the bot to a server.
 */
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession }                 from '@/utils/auth/server';
import { botRequest }                       from '@/utils/fetch/requests';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const session = getServerSession(req);
  if (!session.success) return res.status(401).json({ error: 'Unauthorized' });

  const { guild } = req.query as { guild: string };

  try {
    // Ping bot API to invalidate cache
    const botRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/guilds/${guild}/refresh`,
      botRequest(session.data, { request: { method: 'POST' } }).request as RequestInit
    );
    // Return 200 even if bot API fails — client will re-fetch
    return res.status(200).json({ refreshed: true, botAcknowledged: botRes.ok });
  } catch {
    return res.status(200).json({ refreshed: true, botAcknowledged: false });
  }
}
