import { CollectionConfig } from 'payload';

export const Tenants: CollectionConfig = {
    slug: 'tenants',
    admin: {
        hidden: ({ user }) => user?.role !== 'super-admin',
    },
    access: {
        read: ({ req }) => {
            if (req.user?.roles?.includes['super-admin']) return true
            return {
                owner: { equals: req.user?.id },
            }
        },
        create: ({ req }) => {
            // allow super admin OR any authenticated user during onboarding
            return !!req.user
        },
        update: ({ req }) => {
            if (req.user?.roles?.includes['super-admin']) return true
            return {
                owner: { equals: req.user?.id },
            }
        },
        delete: ({ req }) => {
            if (req.user?.roles?.includes['super-admin']) return true
            return {
                owner: { equals: req.user?.id },
            }
        },
    },


    fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'slug', type: 'text', required: true, unique: true },
        { name: 'domain', type: 'text', required: false },
        { name: 'ownerEmail', type: 'email', required: false },
        { name: 'template', type: 'text', required: false }, // template id selected
        { name: 'templateVersion', type: 'text', required: false },
        { name: 'templateSettings', type: 'json', required: false },
        { name: 'onboardingCompleted', type: 'checkbox', defaultValue: false },
        {
            name: 'owner',
            type: 'relationship',
            relationTo: 'users',
            required: true,
        },

    ]
};
