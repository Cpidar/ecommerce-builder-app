// apps/cms/src/services/TemplateService.ts
import { loadTemplatePackage } from "../lib/loadTemplatePackage";
import { mergeSettingsIntoNode } from "@shared-utils/mergeTemplateSettings";

/**
 * TemplateService handles:
 * - resolving template package by tenant
 * - exposing puck config with component availability
 * - merging template settings
 * - returning default snapshots for new pages
 */

export const TemplateService = {
  async load(tenant) {
    const template = tenant.template;
    const version = tenant.templateVersion || "v1";
    return await loadTemplatePackage(template, version);
  },

  async getPuckConfig(tenant) {
    const pkg = await this.load(tenant);
    const { puckConfig, componentAvailability } = pkg;

    // filter unavailable components
    const filteredConfig = {
      ...puckConfig,
      components: Object.fromEntries(
        Object.entries(puckConfig.components).filter(([key]) => {
          return componentAvailability?.[key] !== false;
        })
      ),
    };

    return filteredConfig;
  },

  async getDefaultPageSnapshot(tenant, slug) {
    const pkg = await this.load(tenant);

    const pages = pkg.pages || {}; // package/pages/home.json etc.
    const base = pages[slug];

    if (!base) return null;

    // deep clone
    let tree = JSON.parse(JSON.stringify(base));
    let settings = tenant.templateSettings || {};

    // merge tenant-level design settings
    tree = mergeSettingsIntoNode(tree, settings);

    return tree;
  },
};
