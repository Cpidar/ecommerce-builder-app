import { db } from "@/lib/db"; // ZenStack

export async function POST(req: Request) {
    const event = await req.json();
    const { type, data } = event; // From better-auth hooks or manual

    if (type === "member.added") {
        const org = await db.organization.findUnique({ where: { id: data.organizationId } });
        if (!org?.medusaStoreId) return Response.json({ error: "No store" });

        // Call Medusa API to provision
        await fetch(`${process.env.MEDUSA_BACKEND_URL}/admin/users`, {
            method: "POST",
            headers: { Authorization: `Bearer ${org.medusaOAuthClientSecret}` }, // Use API key or JWT
            body: JSON.stringify({
                email: data.user.email,
                role: mapRole(data.role),
                store_id: org.medusaStoreId,
            }),
        });
    }

    // Similar for update/delete (remove access)
    if (type === "member.removed") {
        await fetch(`${process.env.MEDUSA_BACKEND_URL}/admin/users/${data.userId}`, { method: "DELETE" });
    }

    return Response.json({ success: true });
}

function mapRole(nextRole: string) {
    const mapping: Record<string, string> = {
        owner: "admin",
        admin: "developer",
        member: "member",
    };
    return mapping[nextRole] || "member";
}