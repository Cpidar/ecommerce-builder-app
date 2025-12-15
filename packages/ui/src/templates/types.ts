import { TEMPLATE_INDEX } from "./registry";

// Template IDs
export type TemplateID = keyof typeof TEMPLATE_INDEX;

// Version IDs per template
export type VersionID<T extends TemplateID> =
  keyof (typeof TEMPLATE_INDEX)[T]["versions"];

// Package type for a given template+version
export type TemplatePackage<
  T extends TemplateID,
  V extends VersionID<T>
> = (typeof TEMPLATE_INDEX)[T]["versions"][V];

export type PageID<
  T extends TemplateID,
  V extends VersionID<T>
> = keyof TemplatePackage<T, V>['pages'];
