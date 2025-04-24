export const NAV_LINKS = [
  { id: 1, text: "Home", path: "/" },
  { id: 2, text: "Shop", path: "/products" },
];

export const UNAUTHENTICATED_NAV_LINKS = [
  { id: 3, text: "Sign In", path: "/login" },
  { id: 4, text: "Sign Up", path: "/register" },
];

export const AUTHENTICATED_NAV_LINKS = {
  customer: [
    { id: 5, text: "Cart", path: "/cart" },
    { id: 6, text: "Orders", path: "/orders" },
    { id: 7, text: "Profile", path: "/profile" },
    { id: 8, text: "Logout", path: "/logout" },
  ],
  admin: [
    { id: 9, text: "Dashboard", path: "/admin/dashboard" },
    { id: 10, text: "Manage Products", path: "/admin/products" },
    { id: 11, text: "Manage Orders", path: "/admin/orders" },
    { id: 12, text: "Users", path: "/admin/users" },
    { id: 13, text: "Logout", path: "/logout" },
  ],
};
