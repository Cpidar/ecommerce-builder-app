import { admins, anyone } from '@/access/roles'
import { CollectionConfig } from 'payload'

const getTenantForPage = 
export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    group: 'Design',
    useAsTitle: 'title',
    defaultColumns: ['title', 'handle', 'createdAt', 'updatedAt'],
  },
  access: {
    read: anyone,
    create: admins,
    update: admins,
    delete: admins,
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          defaultValue: 'New Page',
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'handle',
          type: 'text',
          required: true,
          defaultValue: 'new-page',
        },
      ],
    },

    {
      name: 'page',
      type: 'json',
      required: true,
      admin: {
        components: {
          Field: async (props) => {
            const tenant = await getT
          },
        },
      },
    },
  ],
}
