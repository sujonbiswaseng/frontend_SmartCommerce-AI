import { getDefaultDashboardRoute, UserRole } from "@/lib/authUtils";
import { NavSection } from "@/types/dashboard.type";




export const getCommonNavItems = (role : UserRole) : NavSection[] => {
    const defaultDashboard = getDefaultDashboardRoute(role);
    return [
        {
            items : [
                {
                    title : "Home",
                    href : "/",
                    icon : "Home"
                },
                {
                    title : "Dashboard",
                    href : defaultDashboard,
                    icon : "LayoutDashboard"

                }
            ]
        }
    ]
}


export const ManagerNavItem: NavSection[] = [
    {
        title: "Meals Management",
        items: [
            {
                title: "Create product",
                href: "/manager/dashboard/create-meals",
                icon: "PlusSquare"
            },
            {
                title: "my-product",
                href: "/manager/dashboard/my-product",
                icon: "List"
            }
        ]
    },
    {
        title: "Order Management",
        items: [
            {
                title: "orders",
                href: "/manager/dashboard/my-orders",
                icon: "ClipboardList"
            }
        ]
    },
    {
        title: "settings",
        items: [
            {
                title: "setting",
                href: "/manager/dashboard/setting",
                icon: "Settings"
           
            }
        ]
    },
];



export const adminNavItems: NavSection[] = [
    {
        title: "Categories Management",
        items: [
            {
                title: "create-category",
                href: "/admin/dashboard/create-category",
                icon: "Calendar"
            },
            {
                title: "categories",
                href: "/admin/dashboard/categories",
                icon: "Folder"
            },
        ]
    },
    {
        title: "Blog Management",
        items: [
            {
                title: "Blogs",
                href: "/admin/dashboard/blogs",
                icon: "FileText"
            },
            {
                title: "Create Blog",
                href: "/admin/dashboard/create-blog",
                icon: "PlusSquare"
            }
        ]
    },
    {
        title: "Highlight Management",
        items: [
            {
                title: "Highlights",
                href: "/admin/dashboard/highlights",
                icon: "FileText"
            },
            {
                title: "Create Highlight",
                href: "/admin/dashboard/create-highlight",
                icon: "PlusSquare"
            }
        ]
    },
    {
        title: "users Management",
        items: [
            {
                title: "users",
                href: "/admin/dashboard/users",
                icon: "UserCog"
            },
            {
                title: "Newsletter",
                href: "/admin/dashboard/newsletters",
                icon: "MailOpen"
            },
        ]
    },
    {
        title: "product Management",
        items: [
            {
                title: "meals",
                href: "/admin/dashboard/product",
                icon: "Utensils"
            },
            {
                title: "meals",
                href: "/admin/dashboard/create-product",
                icon: "Utensils"
            },
        ]
    },
    {
        title: "order Management",
        items: [
            {
                title: "orders",
                href: "/admin/dashboard/orders",
                icon: "ShoppingCart"
           
            },
        ]
    },
    {
        title: "reviews Management",
        items: [
            {
                title: "reviews",
                href: "/admin/dashboard/reviews",
                icon: "Star"
            },
        ]
    },
    {
        title: "payment Management",
        items: [
            {
                title: "payment",
                href: "/admin/dashboard/payments",
                icon: "CreditCard"           
            },
        ]
    },
    {
        title: "settings",
        items: [
            {
                title: "setting",
                href: "/admin/dashboard/setting",
                icon: "Setting"
           
            }
        ]
    },
]


export const getNavItemsByRole = (role : UserRole) : NavSection[] => {
    const commonNavItems = getCommonNavItems(role);

    switch (role) {
        case "ADMIN":
            return [...commonNavItems, ...adminNavItems];

        case "MANAGER":
            return [...commonNavItems, ...ManagerNavItem];
    }


}