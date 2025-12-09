import { CollectionConfig } from 'payload';

export const Pages: CollectionConfig = {
    slug: 'pages',
    admin: { useAsTitle: 'slug' },
    access: { read: () => true },
    fields: [
        { name: 'tenant', type: 'relationship', relationTo: 'tenants', required: true },
        { name: 'slug', type: 'text', required: true },
        { name: 'title', type: 'text' },
        { name: 'puckData', type: 'json', required: false }, // Puck JSON page snapshot
        { name: 'templateVersion', type: 'text', required: false },
        { name: 'published', type: 'checkbox', defaultValue: true }
    ],
    hooks: {
        afterChange: [
            async ({ doc }) => {
                if (!process.env.WORKER_REVALIDATE_URL) return;
                try {
                    await fetch(process.env.WORKER_REVALIDATE_URL, {
                        method: 'POST',
                        headers: { 'content-type': 'application/json' },
                        body: JSON.stringify({ type: 'page:updated', doc })
                    });
                } catch (e) { console.error('pages afterChange hook', e); }
            }
        ]
    }
};

