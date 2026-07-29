import express, { Request, Response } from 'express';
import { Webhook } from 'svix';
import { User } from '../models/User';

export const handleClerkWebhook = async (req: Request, res: Response): Promise<void> => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  // In development without webhook secret, attempt payload processing if headers present or in bypass mode
  const svix_id = req.headers['svix-id'] as string;
  const svix_timestamp = req.headers['svix-timestamp'] as string;
  const svix_signature = req.headers['svix-signature'] as string;

  let evt: any;

  if (WEBHOOK_SECRET) {
    if (!svix_id || !svix_timestamp || !svix_signature) {
      res.status(400).json({ error: 'Missing Svix headers' });
      return;
    }
    const payload = (req as any).rawBody || JSON.stringify(req.body);
    const wh = new Webhook(WEBHOOK_SECRET);
    try {
      evt = wh.verify(payload, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      });
    } catch (err) {
      console.error('Error verifying Clerk webhook:', err);
      res.status(400).json({ error: 'Webhook verification failed' });
      return;
    }
  } else {
    // If CLERK_WEBHOOK_SECRET is not configured yet, use parsed body directly for dev/testing
    evt = req.body;
  }

  const { type, data } = evt;

  try {
    if (type === 'user.created' || type === 'user.updated') {
      const { id, email_addresses, username, first_name, last_name, profile_image_url } = data;
      const primaryEmail = email_addresses && email_addresses[0]?.email_address;
      const displayName = username || (first_name ? `${first_name} ${last_name || ''}`.trim() : primaryEmail?.split('@')[0] || id);

      await User.findOneAndUpdate(
        { clerkId: id },
        {
          clerkId: id,
          username: displayName,
          email: primaryEmail || '',
          profilePic: profile_image_url || '',
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      console.log(`Synced Clerk user ${id} (${type}) into MongoDB`);
    } else if (type === 'user.deleted') {
      const { id } = data;
      await User.findOneAndDelete({ clerkId: id });
      console.log(`Deleted user ${id} from MongoDB`);
    }

    res.status(200).json({ success: true, message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Error processing webhook event:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
