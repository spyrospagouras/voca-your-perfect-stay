import { Outlet } from "react-router-dom";
import TopHeader from "./TopHeader";
import BottomNavigation from "./BottomNavigation";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <TopHeader />
      
      {/* Main content area with padding for header and bottom nav */}
      <main className="pt-14 pb-20">
        <Outlet />
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default AppLayout;
