import { CollectionConfig } from 'payload';

const Tenants: CollectionConfig = {
    slug: 'tenants',
    admin: { useAsTitle: 'name' },
    access: { read: () => true },
    fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'slug', type: 'text', required: true, unique: true },
        { name: 'domain', type: 'text', required: false },
        { name: 'ownerEmail', type: 'email', required: false },
        { name: 'template', type: 'text', required: false }, // template id selected
        { name: 'templateVersion', type: 'text', required: false },
        { name: 'templateSettings', type: 'json', required: false },
        { name: 'onboardingCompleted', type: 'checkbox', defaultValue: false }
    ]
};

export default Tenants;
