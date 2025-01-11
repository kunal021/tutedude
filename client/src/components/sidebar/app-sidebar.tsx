import * as React from "react";
import { motion } from "framer-motion";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import { CircleUser, Home, UserPlus, Users } from "lucide-react";

const data = {
  navMain: [
    {
      title: "Home",
      url: "/home",
      icon: Home,
    },
    {
      title: "Recommendations",
      url: "/recommendations",
      icon: Users,
    },
    {
      title: "Connections",
      url: "/connections",
      icon: UserPlus,
    },
    {
      title: "Profile",
      url: "/profile",
      icon: CircleUser,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex gap-1 items-center">
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex leading-none">
                  <span className="text-2xl font-bold text-black dark:text-white">
                    Tute
                  </span>
                  <span className="text-2xl font-bold text-lime-500">Gram</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="sidebarScroll">
        <SidebarGroup>
          <SidebarMenu className="gap-3">
            {data.navMain.map((item, index) => {
              const isActive = location.pathname.includes(item.url);
              return (
                <Collapsible
                  key={item.title}
                  defaultOpen={index === 1}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        className={`relative font-semibold py-6`}
                      >
                        <div className="size-6 pt-0.5">
                          <item.icon />
                        </div>
                        <div
                          onClick={() => navigate(item.url)}
                          className="w-full text-lg p-1"
                        >
                          {item.title}
                        </div>
                        {isActive && (
                          <motion.div
                            layoutId="active-tab"
                            className="absolute inset-0 flex items-center px-2 gap-1.5 rounded-lg bg-lime-500 text-black font-bold"
                            initial={false}
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 30,
                            }}
                          >
                            <div className="size-6 pt-0.5">
                              <item.icon />
                            </div>
                            <div
                              onClick={() => navigate(item.url)}
                              className="w-full text-lg p-1"
                            >
                              {item.title}
                            </div>
                          </motion.div>
                        )}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                  </SidebarMenuItem>
                </Collapsible>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
