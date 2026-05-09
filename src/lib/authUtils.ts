export type UserRole = "ADMIN" | "MANAGER" ;
export const getDefaultDashboardRoute = (role : UserRole) => {
    if(role === "ADMIN") {
        return "/admin/dashboard";
    }
    if(role === "MANAGER") {
        return "/manager/dashboard";
    }
    return "/";
}