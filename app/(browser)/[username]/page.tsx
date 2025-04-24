import { getaccountusername } from "@/lib/account-service";
import { followingtheuser } from "@/lib/following-service";
import { Actions } from "./_components/actions";
import { isblockedusers } from "@/lib/blocking-service";



interface AccountPageProps {
    params: {
        username: string;
    };
};


const AccountPage = async ({ params }: AccountPageProps) => {
   const account = await getaccountusername(params.username);
   if (!account) {
    return <div>Account not found</div>;
   }

   const alreadyfollowing = await followingtheuser(account.id);
   const isblocked = await isblockedusers(account.id);

//    if (isblocked) {
//     return <div>You are blocked by this user</div>;
//    }
   
    return (
        <div className="flex flex-col gap-y-4">
          <p>User: {account.username}</p>
          <p>user id: {account.id}</p>
          <p>already following: {`${alreadyfollowing}`}</p> 
          <p>is blocked: {`${isblocked}`}</p>
          <Actions alreadyfollowing={alreadyfollowing} userid={account.id}/>
        </div>
    );
}

export default AccountPage; 