import { services } from "@tpps/content";

export const serviceRoutes = services
  .filter((service) =>
    [
      "patios-pathways",
      "driveways",
      "fencing",
      "groundworks",
      "garden-design",
      "garden-maintenance",
    ].includes(service.id),
  )
  .map((service) => ({
    path: `/services/${service.id}/`,
    service,
  }));

export const staticRoutes = [
  { path: "/", priority: "1.0", changefreq: "monthly" },
  ...serviceRoutes.map(({ path }) => ({ path, priority: "0.8", changefreq: "monthly" })),
] as const;
