import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
  } from "@/components/ui/sidebar";
import { getDefaultDashboardRoute } from "@/lib/authUtils";
import { getNavItemsByRole } from "@/routes/sidebar.navitems";
import { getSession } from "@/services/auth.service";
import { TResponseUserData } from "@/types/user.type";
import ErrorBoundary from "./shared/ErrorBoundary";
import ErrorFallback from "./shared/ErrorFallbace";
import DashboardSidebarContent from "./dashboard/DashbaordContent";
  
  export async function AppSidebar() {
    const userInfo = await getSession();
  
    const navItems = getNavItemsByRole(userInfo?.data.role);
    const dashboardHome = getDefaultDashboardRoute(userInfo?.data.role);
  
    return (
      <Sidebar userinfo={userInfo?.data as TResponseUserData}>
        <SidebarHeader />
        <SidebarContent>
          <SidebarGroup>
            <ErrorBoundary
              fallback={
                <ErrorFallback
                  title="product Load Error"
                  message="There was a problem loading your dashboard product. Please refresh or try again later."
                />
              }
            >
              <DashboardSidebarContent
                userInfo={userInfo?.data}
                navItems={navItems}
                dashboardHome={dashboardHome}
              />
            </ErrorBoundary>
    
      
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter />
      </Sidebar>
    );
  }