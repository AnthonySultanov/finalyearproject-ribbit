import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { resetingress } from '@/actions/ingress'

export async function POST(req: Request) {
  console.log('Webhook received')
  
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env')
  }

  //this will get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  //if there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }

  //this will get the body
  const payload = await req.json()
  const body = JSON.stringify(payload);

  //this will create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent

  //this will verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    })
  }

  //this will handle the webhook
  const eventType = evt.type;
  
  if (eventType === 'user.created') {
    
    console.log('Creating user:', evt.data);
    try {
      await db.userlogged.create({
        data: {
          username: evt.data.username || '',
          imageUrl: evt.data.image_url || '',
          externalUserId: evt.data.id,
          bio: '',
          streaming: {
            create: {
              name: `${evt.data.username}s stream`,
              
           
            },
          },
        }
      });
      console.log('User created successfully');
    } catch (error: unknown) {
      console.error('Error creating user:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return new Response(JSON.stringify({error: errorMessage}), {
        status: 500
      });
    }
  }

  if (eventType === 'user.updated') {
    //this will update the user in the database
    await db.userlogged.update({
      where: { externalUserId: evt.data.id },
      data: {
        username: evt.data.username || '',
        imageUrl: evt.data.image_url || '',
      }
    });
  }

  if (eventType === 'user.deleted') {
    await resetingress(payload.data.id);
    //this will delete the user from the database
    await db.userlogged.delete({
      where: { externalUserId: evt.data.id }
    });
  }

  return new Response('', { 
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}














