import { UserButton } from "@clerk/nextjs";
export default function Homepage() {
  return (
  <div className="flex flex-col gap-y-8">
<h1>dashboard</h1>
<UserButton afterSignOutUrl="/"/>
   </div>
   
  );
}
