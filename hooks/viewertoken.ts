import {toast} from "sonner";
import {useEffect, useState} from "react";
import {JwtPayload, jwtDecode} from "jwt-decode";
import { createviewertoken } from "@/actions/tokens";

export const useviewertoken = (hostIdentity: string) => {
    const [token, setToken] = useState("");
    const [name, setName] = useState("");
    const [identity, setIdentity] = useState("");

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const viewertoken = await createviewertoken(hostIdentity);
                setToken(viewertoken);
                const decodedToken = jwtDecode(viewertoken) as JwtPayload & { 
                    name?: string;
                    sub?: string;
                    identity?: string;
                };
                const name = decodedToken?.name;
                const identity = decodedToken.sub || decodedToken.identity || decodedToken.jti;
              if (name) {
                setName(name);
              }
              if (identity) {
                setIdentity(identity);
              }
           
            } catch (error) {
                toast.error("Error fetching viewer token");
            }
        };



        fetchToken();
       
    }, [hostIdentity]);
    
    return { token, name, identity };
}
