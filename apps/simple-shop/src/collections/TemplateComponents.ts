import { CollectionConfig } from 'payload';

export const TemplateComponents: CollectionConfig = {
    slug: 'templateComponents',
    admin: { useAsTitle: 'slug' },
    access: { read: () => true },
    fields: [
        { name: 'template', type: 'relationship', relationTo: 'templates', required: true },
        { name: 'slug', type: 'text', required: true },
        { name: 'props', type: 'json' },
        { name: 'style', type: 'json' },
        { name: 'restricted', type: 'checkbox' }
    ]
};

