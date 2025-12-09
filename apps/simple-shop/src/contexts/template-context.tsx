"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { TemplateService } from "@/lib/templateService";
import { useAuth } from "./auth-context";

export const TemplateContext = createContext(null);

export function TemplateProvider({ children }) {
  const [tenant, setTenant] = useState(null);
  const [puckConfig, setPuckConfig] = useState(null);
  const { user } = useAuth()

  async function initialize() {
    if (!user?.tenant) return;

    const t = await fetch(`/api/tenants/${user.tenant}`).then(r => r.json());
    setTenant(t);

    const cfg = await TemplateService.getPuckConfig(t);
    setPuckConfig(cfg);
  }

  useEffect(() => { initialize(); }, []);

  return (
    <TemplateContext.Provider value={{
      tenant,
      puckConfig,
      getDefaultPageSnapshot: (slug) => TemplateService.getDefaultPageSnapshot(tenant, slug),
      reload: initialize,
    }}>
      {children}
    </TemplateContext.Provider>
  );
}

export function useTemplate() {
  return useContext(TemplateContext);
}
