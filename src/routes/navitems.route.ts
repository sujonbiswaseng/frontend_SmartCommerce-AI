interface NavItem {
    to: string;
    label: string;
    icon?: string;    
    authRequired?: boolean;
    roles?: string[];
  }
  
  export const navItems: NavItem[] = [
    { to: "/", label: "Home", icon: "Home" },
    { to: "/shops", label: "shops", icon: "Utensils" },
    { to: "/blogs", label: "Blogs", icon: "BookOpen" },
    { to: "/about", label: "About", icon: "Info" },
    { to: "/contact", label: "Contact", icon: "Mail" },

    { 
      to: "/my-orders", 
      label: "orders", 
      icon: "ShoppingBag", 
 
      authRequired: true, 
      roles: ["USER"]
    },
    { 
      to: "/admin/dashboard/categories", 
      label: "categories", 
      icon: "Store",
 
      authRequired: true, 
      roles: ["ADMIN"] 
    },
    { 
      to: "/seller/dashboard/my-shop", 
      label: "my-menu", 
      icon: "Utensils",
      authRequired: true, 
      roles: ["SELLER"] 
    }
  ];