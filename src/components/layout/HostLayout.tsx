import { Outlet } from "react-router-dom";
import HostBottomNavigation from "./HostBottomNavigation";

const HostLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Main content area with padding for bottom nav */}
      <main className="pb-24">
        <Outlet />
      </main>
      
      <HostBottomNavigation />
    </div>
  );
};

export default HostLayout;
