import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || "YOUR_PROJECT_ID";
const dataset = process.env.SANITY_STUDIO_DATASET || "production";

export default defineConfig({
  name: "fifi-yijia",
  title: "義家藝館｜內容管理",
  projectId,
  dataset,
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
});
