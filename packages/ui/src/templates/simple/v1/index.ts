// templates/simple/v1/index.ts
export const pages = {
  home: () => import("./home.json"),
  about: () => import("./about.json"),
  contact: () => import("./contact.json"),
  "products-list": () => import("./products-list.json"),
  "products-detail": () => import("./products-detail.json"),
};

export const puckConfig = () => import("./puck-config");
export const componentsMap = () => import("./componentsMap.lazy");
export const componentAvailability = () => import("./componentAvailability");

export default {
  pages,
  puckConfig,
  componentsMap,
  componentAvailability,
};
