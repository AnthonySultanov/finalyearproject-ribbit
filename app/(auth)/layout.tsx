const autlayout = ({
    children
}: {
    children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col gap-y-4">
        <nav className="bg-green-700 w-full">
        nav bar
        </nav>
      {children}
    </div>
  );
}
export default autlayout;