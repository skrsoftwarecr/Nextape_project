import { defineCloudflareConfig } from "@opennextjs/cloudflare/config";

const config = defineCloudflareConfig({});

config.cloudflare = {
  useWorkerdCondition: false,
};

config.edgeExternals = [
  "node:crypto",
  "jose",
  "@opentelemetry/sdk-node",
  "@opentelemetry/instrumentation",
  "@opentelemetry/api",
];

export default config;