import { TEMPLATE_INDEX } from "@repo/ui/templates/index.js";
import { TemplateID, TemplatePackage, VersionID } from "@repo/ui/templates/types.js";

export async function loadTemplatePackage<
  T extends TemplateID,
  V extends VersionID<T>
>(
  template: T,
  version: V
): Promise<TemplatePackage<T, V>> {
  // narrow intermediate object (helps TS)
  const versions = TEMPLATE_INDEX[template].versions as (typeof TEMPLATE_INDEX)[T]["versions"];
  return versions[version];
}

