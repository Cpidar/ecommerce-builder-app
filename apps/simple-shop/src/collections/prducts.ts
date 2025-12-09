import { CollectionConfig } from 'payload';

export const Products: CollectionConfig = {
    slug: 'products',
    admin: { useAsTitle: 'name' },
    fields: [
        { name: 'tenant', type: 'relationship', relationTo: 'tenants', required: true },
        { name: 'name', type: 'text', required: true },
        { name: 'slug', type: 'text', required: true, unique: true },
        { name: 'price', type: 'number', required: true },
        { name: 'description', type: 'textarea' },
        {
            name: 'images',
            type: 'array',
            fields: [{ name: 'src', type: 'text' }]
        },
        { name: 'templateVersion', type: 'text', required: false }
    ],
    hooks: {
        afterChange: [
            async ({ doc }) => {
                try {
                    if (!process.env.WORKER_REVALIDATE_URL) return;
                    await fetch(process.env.WORKER_REVALIDATE_URL, {
                        method: 'POST',
                        headers: { 'content-type': 'application/json' },
                        body: JSON.stringify({ type: 'product:updated', doc })
                    });
                } catch (err) {
                    console.error('products afterChange hook error', err);
                }
            }
        ]
    },
    access: {
        read: () => true
    }
};
