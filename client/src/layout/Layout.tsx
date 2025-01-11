import SideBar from "@/components/sidebar/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { Outlet } from "react-router-dom";

export default function Layout() {
  const { user } = useAuth();

  if (!user?._id) {
    return <Outlet />;
  }
  return (
    <div>
      <SideBar>
        <Outlet />
      </SideBar>
    </div>
  );
}
