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
  // Bindings nativos del GitHub Engine — nunca bundlear en el Worker de Cloudflare.
  // El GitHub Engine solo corre en Node.js (route handler con runtime="nodejs").
  "tree-sitter",
  "tree-sitter-typescript",
  "@kreuzberg/tree-sitter-language-pack",
];

export default config;