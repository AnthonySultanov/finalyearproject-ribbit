import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { currentUser, WebhookEvent } from '@clerk/nextjs/server'
import {db} from '@/lib/db'






export async function POST(req: Request) {


    //the webhook is the same name as i added in .env
    const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SECRET

    if (!SIGNING_SECRET) {
      throw new Error('Error: Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
    }


    
  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET)

  // Get headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')


   // If there are no headers, error out
   if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    })
  }

  // Get body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  let evt: WebhookEvent

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error: Could not verify webhook:', err)
    return new Response('Error: Verification error', {
      status: 400,
    })
  }

  // Do something with payload
  // For this guide, log payload to console
  
   const eventType = evt.type;
//create user
  if (eventType === 'user.created') {

    await db.userlogged.create({
      data: {
        externalUserId: payload.data.id,
        username: payload.data.username,
        imageUrl: payload.data.image_url,

      }
    });
  
  }


//update user
  if (eventType === 'user.updated') {
//check if user exists
    if (!currentUser){
      return new Response('Error: User not found', { status: 404 })
    }
    
    await db.userlogged.update({
      where: {
        externalUserId: payload.data.id,
      },
      data: {
        username: payload.data.username,
        imageUrl: payload.data.image_url,
      }
    });
  
  }


//delete user
  if (eventType === 'user.deleted') {
    await db.userlogged.delete({
      where: {
        externalUserId: payload.data.id,
      }
    });
  
  }



 

  return new Response('Webhook received', { status: 200 })




};














