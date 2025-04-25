"use server"

import {IngressAudioEncodingPreset, IngressInput, IngressClient, IngressVideoEncodingPreset, RoomServiceClient, TrackSource, type CreateIngressOptions, IngressVideoOptions, IngressAudioOptions} from "livekit-server-sdk";
import {db} from "@/lib/db"
import { infouser } from "@/lib/services-fetchuser";
import { revalidatePath } from "next/cache";

const roomclient = new RoomServiceClient(process.env.LIVEKIT_URL!, process.env.LIVEKIT_API_KEY!, process.env.LIVEKIT_API_SECRET!)
const ingressclient = new IngressClient(process.env.LIVEKIT_URL!)

export const resetingress = async (hostIdentity: string) => {
  const ingress = await ingressclient.listIngress({roomName: hostIdentity});

  const rooms = await roomclient.listRooms([hostIdentity]);

  for (const room of rooms) {
    await roomclient.deleteRoom(room.name);
  }

  for (const ingressItem of ingress) {
    if (ingressItem.ingressId) {
      await ingressclient.deleteIngress(ingressItem.ingressId);
    }
  }
}

export const createingress = async (ingressType: string) => {
    const self = await infouser();
    await resetingress(self.id);

    const options: CreateIngressOptions = {
        name: self.username,
        roomName: self.id,
        participantName: self.username,
        participantIdentity: self.id,
    }

    //here we will convert the string to the IngressInput enum
    const inputType = ingressType === "WHIP" 
        ? IngressInput.WHIP_INPUT 
        : IngressInput.RTMP_INPUT;

    if (inputType === IngressInput.WHIP_INPUT) {
        options.bypassTranscoding = true;
    } else {
        options.video = new IngressVideoOptions({
            source: TrackSource.CAMERA,
            encodingOptions: {
                case: 'preset',
                value: IngressVideoEncodingPreset.H264_1080P_30FPS_3_LAYERS,
            },
        });
        options.audio = new IngressAudioOptions({
            source: TrackSource.MICROPHONE,
            encodingOptions: {
                case: 'preset',
                value: IngressAudioEncodingPreset.OPUS_STEREO_96KBPS,
            },
        });
    }

    const ingress = await ingressclient.createIngress(inputType, options);

    if (!ingress || !ingress.url || !ingress.streamKey) {
        throw new Error("Failed to create ingress");
    }

    await db.streaming.update({
        where: { userId: self.id },
        data: {
          ingressId: ingress.ingressId,
          serverUrl: ingress.url,
          streamingKey: ingress.streamKey,
        },
      });

    revalidatePath(`/u/${self.username}/keys`);
    
    return ingress;
}















