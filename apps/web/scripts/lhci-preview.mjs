import { spawn } from "node:child_process";

const host = "127.0.0.1";
const port = "4173";
const url = `http://${host}:${port}/`;

const preview = spawn("pnpm", ["preview", "--host", host, "--port", port], {
  stdio: ["ignore", "inherit", "inherit"],
});

const shutdown = () => {
  preview.kill("SIGTERM");
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

preview.on("exit", (code) => {
  if (code !== null && code !== 0) process.exit(code);
});

const waitForPreview = async () => {
  const deadline = Date.now() + 120_000;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        console.log(`Local: ${url}`);
        return;
      }
    } catch {
      // Astro preview is still starting.
    }

    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  console.error(`Timed out waiting for Astro preview at ${url}`);
  shutdown();
  process.exit(1);
};

await waitForPreview();
