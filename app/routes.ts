import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/customers", "routes/customers.tsx"),
  route("/rooms", "routes/rooms.tsx"),
  route("/invoices", "routes/invoices.tsx"),
  route("*", "routes/notfound.tsx"),
] satisfies RouteConfig;