"use server";


import { v4 } from 'uuid';
import {AccessToken} from "livekit-server-sdk";
import { infouser } from '@/lib/services-fetchuser'
import {getaccountid} from "@/lib/account-service";
import { isblockedusers } from '@/lib/blocking-service';

export const createviewertoken = async (hostIdentity: string) => {
let self;

try {
    self = await infouser();
} catch {
    const id = v4();
    const username = `guest-${Math.floor(Math.random() * 1000)}`;
    self = { id, username };
}

const host = await getaccountid(hostIdentity);

if (!host) {
    throw new Error("Host not found");
}

const isBlocked = await isblockedusers(host.id);

if (isBlocked) {
    throw new Error("blocked by user");
}


if (!self) {
    const id = v4();
    const username = `guest-${Math.floor(Math.random() * 1000)}`;
    self = { id, username };
}

const ishost = self.id === host.id;

const token = new AccessToken(process.env.LIVEKIT_API_KEY!, process.env.LIVEKIT_API_SECRET!, {
    identity: ishost ? `Host-${self.id}` : self.id,
      name: self.username,

})


token.addGrant({
    room: host.id,
    roomJoin: true,
    canPublish: false,
    canPublishData: true,
})  


return await Promise.resolve(token.toJwt());

}










