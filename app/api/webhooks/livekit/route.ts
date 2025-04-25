import { headers } from "next/headers";
import { WebhookReceiver } from "livekit-server-sdk";
import { db } from "@/lib/db";

//this will keep the correct order 
const receiver = new WebhookReceiver(
    process.env.LIVEKIT_API_KEY!,
    process.env.LIVEKIT_API_SECRET!
);

export async function POST(req: Request) {
    console.log('LiveKit webhook called');
    
    try {
        const body = await req.text();
        const headersList = headers();
        const authHeader = (await headersList).get("Authorization");
        
        if (!authHeader) {
            console.error('No Authorization header provided');
            return new Response("Unauthorized", { status: 400 });
        }
        
        const event = await receiver.receive(body, authHeader);
        console.log('Event received:', event.event);
        
        //this will extract the ingressId from the event
        const ingressId = event.ingressInfo?.ingressId;
        
        if (!ingressId) {
            console.error('No ingressId in webhook payload');
            return new Response("Missing ingressId", { status: 400 });
        }
        
        //this will find the stream by ingressId first to confirm it exists
        const existingStream = await db.streaming.findFirst({
            where: { ingressId }
        });
        
        if (!existingStream) {
            console.error(`No stream found with ingressId: ${ingressId}`);
            return new Response("Stream not found", { status: 404 });
        }
        
        if (event.event === "ingress_started") {
            //this will direct update with the found stream ID
            await db.streaming.update({
                where: { id: existingStream.id },
                data: { isLive: true }
            });
            console.log(`Stream ${ingressId} marked as LIVE`);
        } 
        
        if (event.event === "ingress_ended") {
            //this will direct update with the found stream ID
            await db.streaming.update({
                where: { id: existingStream.id },
                data: { isLive: false }
            });
            console.log(`Stream ${ingressId} marked as NOT LIVE`);
        }
        
        return new Response("Success", { status: 200 });
    } catch (error) {
        console.error('Error processing webhook:', error);
        return new Response(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`, { 
            status: 500 
        });
    }
}

