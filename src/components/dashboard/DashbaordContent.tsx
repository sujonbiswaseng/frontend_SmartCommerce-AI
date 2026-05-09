"use client"

import { cn } from "@/lib/utils";
import { NavSection } from "@/types/dashboard.type";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { getIconComponent } from "@/lib/iconMapper";

interface DashboardSidebarContentProps {
  userInfo: any;
  navItems: NavSection[];
  dashboardHome: string;
}

const DashboardSidebarContent = ({
  dashboardHome,
  navItems,
  userInfo,
}: DashboardSidebarContentProps) => {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex h-full w-64 flex-col border-r border-border bg-card overflow-y-auto">
      <div className="flex items-center h-10 border-b border-border px-6 bg-background">
        <Link href={dashboardHome} className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-ring rounded-md transition-colors">
          <span className="text-xl mb-4 font-bold text-primary tracking-tight select-none">
            BiteBase
          </span>
        </Link>
      </div>
      <ScrollArea className="flex-1 px-4 py-6">
        <nav className="flex flex-col gap-8">
          {navItems.map((section, sectionId) => (
            <div key={sectionId}>
              {section.title && (
                <h4 className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide select-none">
                  {section.title}
                </h4>
              )}
              <ul className="flex flex-col gap-2">
                {section.items.map((item, id) => {
                  const isActive = pathname === item.href;
                  const Icon = getIconComponent(item.icon);
                  return (
                    <li key={id}>
                      <Link
                        href={item.href}
                        className={cn(
                          "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200",
                          isActive
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        )}
                        tabIndex={0}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <Icon
                          className={cn(
                            "w-5 h-5 transition-colors",
                            isActive
                              ? "text-primary-foreground"
                              : "text-muted-foreground group-hover:text-white"
                          )}
                          aria-hidden="true"
                        />
                        <span className="truncate">{item.title}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              {sectionId < navItems.length - 1 && (
                <Separator className="my-6" />
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>
      <div className="border-t border-border px-4 py-6 bg-background">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
            {userInfo.image ? (
              <img
                src={userInfo.image}
                alt={userInfo.name}
                className="object-cover rounded-full w-10 h-10 border-2 border-primary"
                referrerPolicy="no-referrer"
                width={40}
                height={40}
              />
            ) : (
              <span
                className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-semibold text-base uppercase"
                aria-label={userInfo.name}
              >
                {userInfo.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-card-foreground">{userInfo.name}</p>
            <p className="text-xs text-muted-foreground truncate capitalize">
              {userInfo.role?.toLocaleLowerCase().replace("_", " ")}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebarContent;