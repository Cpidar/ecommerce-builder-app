import { CollectionConfig } from 'payload';

export const Templates: CollectionConfig = {
    slug: 'templates',
    admin: { useAsTitle: 'name' },
    access: { read: () => true },
    fields: [
        { name: 'slug', type: 'text', required: true, unique: true },
        { name: 'name', type: 'text', required: true },
        { name: 'version', type: 'text' },
        { name: 'snapshot', type: 'json', required: false }, // optional full snapshot stored
        { name: 'meta', type: 'json', required: false }
    ]
};

