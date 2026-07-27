import { defineCloudflareConfig } from "@opennextjs/cloudflare/config";

const config = defineCloudflareConfig({});

config.cloudflare = {
  useWorkerdCondition: false,
};

config.edgeExternals = ["node:crypto"];

export default config;
