'use client'

import { Puck } from '@measured/puck'
import { useField, useForm, useTheme } from '@payloadcms/ui'
import '@measured/puck/puck.css'
import './PuckEditor.scss'
import './dark-mode.css'
import { useEffect, useState } from 'react'
import dynamic from "next/dynamic";
import { TemplateService } from "@/lib/templateService";

const initialData = {}

const PuckEditor = () => {
  const { value, setValue } = useField<any>({ path: 'page' })
  const { theme } = useTheme()
  const { value: title, setValue: setTitle } = useField<any>({
    path: 'title',
  })
  const { value: handle, setValue: setHandle } = useField<any>({
    path: 'handle',
  })
  const [tenant, setTenant] = useState(null);
  const [config, setConfig] = useState(null);


  // 1️⃣ get tenant from auth session (Payload REST API to /users/me)
  useEffect(() => {
    async function resolveTenant() {
      const res = await fetch("/api/users/me", { credentials: "include" });
      const user = await res.json();

      // assume user has tenant field or organization reference
      if (user?.tenant) {
        const tenantRes = await fetch(`/api/tenants/${user.tenant}`);
        const t = await tenantRes.json();
        setTenant(t);
      }
    }

    resolveTenant();
  }, []);

  // 2️⃣ load template package based on tenant.template + tenant.templateVersion
  useEffect(() => {
    async function loadCfg() {
      if (!tenant) return;
      const cfg = await TemplateService.getPuckConfig(tenant);
      setConfig(cfg);
    }
    loadCfg();
  }, [tenant]);

  if (!config) return <div>Loading Puck Editor…</div>;

  const { submit } = useForm()
  const save = () => {
    submit()
  }
  const onChange = (data: any) => {
    setValue(data)
    if (data.root?.props?.title !== title) {
      setTitle(data.root?.props?.title)
    }
    if (data.root?.props?.handle !== handle) {
      setHandle(data.root?.props?.handle)
    }
  }
  return (
    <div
      className={`twp h-screen w-full overflow-auto ${theme === 'dark' ? 'dark' : ''}`}
      data-theme={theme}
    >
      <Puck
        config={config}
        data={value || initialData}
        onPublish={save}
        onChange={onChange}
        overrides={{
          headerActions: () => <></>,
        }}
      />
    </div>
  )
}

export default PuckEditor
