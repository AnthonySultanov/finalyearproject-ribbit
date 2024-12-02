import { Logo } from "./_components/logo";


const signuplayout = ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
       <div className="h-full flex flex-col items-center justify-center">
            <Logo />
              {children}
       </div>
    );
}
export default signuplayout;