// apps/cms/src/services/TemplateService.ts
import { TemplateID, VersionID } from "@repo/ui/templates/types.js";
import { loadTemplatePackage } from "../lib/loadTemplatePackage";
// import { mergeSettingsIntoNode } from "@shared-utils/mergeTemplateSettings";

interface Tenant<T extends TemplateID = TemplateID, V extends VersionID<TemplateID> = VersionID<TemplateID>> {
  template: T;
  templateVersion?: V;
  templateSettings?: Record<string, unknown>;
}

export const TemplateService = {
  // --------------------------------------------
  // Load template version module for tenant
  // --------------------------------------------
  async load<T extends TemplateID, V extends VersionID<T>>(tenant: Tenant<T, V>) {
    const version = (tenant.templateVersion || "v1") as V;
    const versions = await loadTemplatePackage(tenant.template, version);
    return versions;
  },

  // --------------------------------------------
  // Produce filtered Puck config
  // --------------------------------------------
  async getPuckConfig(tenant: Tenant) {
    const pkg = await this.load(tenant);

    const { config: puckConfig } = await pkg.puckConfig();
    const { componentAvailability: availability } = await pkg.componentAvailability();

    if (!puckConfig.components) {
      console.warn("puckConfig.components is missing");
      return puckConfig;
    }

    const availabilityObj = availability ?? {};
    const filteredComponents = Object.fromEntries(
      Object.entries(puckConfig.components).filter(([key]) => availabilityObj[key] !== false)
    );

    return { ...puckConfig, components: filteredComponents };
  },

  // --------------------------------------------
  // Load default page snapshot for new page
  // --------------------------------------------
  async getDefaultPageSnapshot(tenant: Tenant, slug: string) {
    const pkg = await this.load(tenant);

    const pageLoader = pkg.pages?.[slug];
    if (!pageLoader) return null;

    const { default: snapshot } = await pageLoader();
    let tree = structuredClone(snapshot);

    const settings = tenant.templateSettings || {};
    // tree = mergeSettingsIntoNode(tree, settings);

    return tree;
  },

};
