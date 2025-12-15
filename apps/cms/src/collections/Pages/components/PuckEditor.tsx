'use client'

import { Puck } from '@measured/puck'
import { useField, useForm, useTheme } from '@payloadcms/ui'
import '@measured/puck/puck.css'
import './PuckEditor.scss'
import './dark-mode.css'
import { useEffect, useState } from 'react'
import { TemplateService } from '@/lib/templateService'
import { JSONFieldServerProps } from 'payload'
import { getCollectionIDType } from '@/utils/getCollectionIDType'
import { getTenantFromCookie } from '@payloadcms/plugin-multi-tenant/utilities'
import { Tenant } from '@/payload-types'

const initialData = {}

const PuckEditor: React.FC<any> = ({
  tenant,
  handle: slug,
}: {
  tenant: Tenant
  handle: string
}) => {
  const { value, setValue } = useField<any>({ path: 'snapshot' })
  const { theme } = useTheme()
  const { value: title, setValue: setTitle } = useField<any>({
    path: 'title',
  })
  const { value: handle, setValue: setHandle } = useField<any>({
    path: 'handle',
  })
  const [config, setConfig] = useState({})

  // 2️⃣ load template package based on tenant.template + tenant.templateVersion
  useEffect(() => {
    async function loadCfg() {
      if (!tenant) return
      const cfg = await TemplateService.getPuckConfig(tenant)
      const pageSnapshot = TemplateService.getDefaultPageSnapshot(tenant, slug)
      setConfig(cfg)
      setValue(pageSnapshot)
    }
    loadCfg()
  }, [tenant])

  if (!config) return <div>Loading Puck Editor…</div>

  const { submit } = useForm()
  const save = () => {
    submit()
  }
  const onChange = (data: any) => {
    setValue(data)
    if (data.root?.props?.title !== title) {
      setTitle(data.root?.props?.title)
    }
    if (data.root?.props?.handle !== slug) {
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
