import { services } from "@tpps/content";

const serviceRouteOrder = [
  "garden-design",
  "patios-pathways",
  "driveways",
  "fencing",
  "groundworks",
  "garden-maintenance",
];

export const serviceRoutes = services
  .filter((service) => serviceRouteOrder.includes(service.id))
  .sort(
    (first, second) => serviceRouteOrder.indexOf(first.id) - serviceRouteOrder.indexOf(second.id),
  )
  .map((service) => ({
    path: `/services/${service.id}/`,
    service,
  }));

export const staticRoutes = [
  { path: "/", priority: "1.0", changefreq: "monthly" },
  ...serviceRoutes.map(({ path }) => ({ path, priority: "0.8", changefreq: "monthly" })),
] as const;
