export const commonLinks = [
  {
    id: 1,
    path: "/",
    label: "Home",
  },
  {
    id: 4,
    path: "/products",
    label: "Shop",
  },
  {
    id: 2,
    path: "/about",
    label: "About us",
  },
  {
    id: 3,
    path: "/contact",
    label: "Contact us",
  },
];

export const unAuthenticatedLinks = [
  {
    id: 11,
    path: "/login",
    label: "Sign in",
  },
  {
    id: 41,
    path: "/register",
    label: "Sign up",
  },
];
export const authenticatedLinks = {
  customer: [
    {
      id: 12,
      path: "/cart",
      label: "Cart",
    },
    {
      id: 142,
      path: "/wishlist",
      label: "Wishlist",
    },
    {
      id: 44,
      path: "/orders",
      label: "My orders",
    },
  ],
  admin: [
    {
      id: 122,
      path: "/admin/dashboard",
      label: "Dashboard",
    },
    {
      id: 54,
      path: "/admin/products",
      label: "Manage products",
    },
    {
      id: 444,
      path: "/admin/orders",
      label: "Manage orders",
    },
    {
      id: 123,
      path: "/admin/users",
      label: "Users",
    },
  ],
};
