export const BASE_URL = "http://localhost:5000/api/";
//export const BASE_URL = "/api/"

export const axios = {
  UPDATE_TOKEN: "UPDATE_TOKEN"
};

export const admin = {
  UPDATE_ADMIN_INSTANCE: "UPDATE_ADMIN_INSTANCE",
  UPDATE_ADMIN_TOKEN: "UPDATE_ADMIN_TOKEN"
};

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

export const MATERIAL_COLOR = [
  "#f59b23",
  "#a0c3d2",
  "#4b917d",
  "#c3f0c8",
  "#cdf564",
  "#a0c3d2",
  "#b49bc8",
  "#f573a0",
  "#535353",
  "#f037a5",
  "#ffc864",
  "#ff6437",
  "#7950F2"
];


export const REVIEW_LABELS = {
  0.5: 'Useless',
  1: 'Useless+',
  1.5: 'Poor',
  2: 'Poor+',
  2.5: 'Ok',
  3: 'Ok+',
  3.5: 'Good',
  4: 'Good+',
  4.5: 'Excellent',
  5: 'Excellent+',
};