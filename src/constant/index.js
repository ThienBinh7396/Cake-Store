export const BASE_URL = "http://localhost:5000/api/"
//export const BASE_URL = "/api/"

export const axios = {
  UPDATE_TOKEN: "UPDATE_TOKEN"
}

export const admin = {
  UPDATE_ADMIN_INSTANCE: "UPDATE_ADMIN_INSTANCE",
  UPDATE_ADMIN_TOKEN:"UPDATE_ADMIN_TOKEN" 
}

export const CLIENT_NAV = [
  {
    text: "Home",
    path: "/home",
    route: "home",
    icon: "fas fa-home"
  },
  {
    text: "Store",
    route: "store",
    path: "/store"
  },
  {
    text: "Blog",
    route: "blog",
    path: "/blog"
  },
  {
    text: "Contact",
    route: "contact",
    path: "/contact"
  }
];
