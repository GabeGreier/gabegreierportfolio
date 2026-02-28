export const APP_ROLES = ["SUPER_ADMIN", "DEALER_MANAGER", "DEALER_STAFF"] as const;

export type AppRole = (typeof APP_ROLES)[number];

export type RouteAccessRule = {
  basePath: string;
  roles: AppRole[];
  requireDealer: boolean;
};

export const PORTAL_MEMBER_ROLES: AppRole[] = ["SUPER_ADMIN", "DEALER_MANAGER", "DEALER_STAFF"];

export const ROUTE_ACCESS_RULES: RouteAccessRule[] = [
  {
    basePath: "/dashboard",
    roles: PORTAL_MEMBER_ROLES,
    requireDealer: true
  },
  {
    basePath: "/vehicles",
    roles: PORTAL_MEMBER_ROLES,
    requireDealer: true
  },
  {
    basePath: "/admin/dealers",
    roles: ["SUPER_ADMIN"],
    requireDealer: false
  }
];
