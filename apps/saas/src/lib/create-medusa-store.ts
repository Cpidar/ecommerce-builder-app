"use server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "./db";

export async function createOrganizationAndStore({ name, slug }: { name: string; slug: string }) {
  const reqHeaders = await headers();

  const sessionResult = await auth.api.getSession({
    headers: reqHeaders,
  }); // Ensure owner

  if (!sessionResult) throw new Error("Unauthorized");

  // Get Medusa owner user that created in authentication process
  const medusa_user_id = await getMedusaOwnerUser({ email: sessionResult.user.email }).then(user => user?.id);

  // Create organization in Better-Auth
  const org = await auth.api.createOrganization({ body: { name, slug } });

  if (!org) throw new Error("Failed to create organization");

  // Provision Medusa Store
  const store = await provisionMedusaStore(org.id, name, medusa_user_id);

  // Create OAuth client (as before)
  const client = await auth.api.adminCreateOAuthClient({
    body: {
      redirect_uris: [`${process.env.MEDUSA_ADMIN_URL}/auth/callback`], // Medusa callback
      scope: "openid profile email offline_access org:read",
      metadata: { reference_id: org.id }, // Tie to org
      skip_consent: true, // For trusted Medusa
      enable_end_session: true,
      token_endpoint_auth_method: "client_secret_basic",
    },
  });

  // Update organization with store link
  await db.organization.update({
    where: { id: org.id },
    data: {
      medusaStoreId: store.id,
      medusaStoreUrl: `${process.env.MEDUSA_ADMIN_URL}/${store.id}`, // Optional
      medusaOAuthClientSecret: client.clientSecret as string, // If using API keys for store access
    },
  });


  return org;
}

async function provisionMedusaStore(orgId: string, storeName: string, medusa_user_id?: string) {
  // Call custom Medusa API route (secure with admin key)
    const token = await getPlatformAdminJwt(); // Implement: login or static API token

  const response = await fetch(
    `${process.env.MEDUSA_BACKEND_URL}/admin/stores/regular`,
    {
      method: "POST",
      headers: { Authorization: `Basic ${token}` }, // Platform admin key
      body: JSON.stringify({
        name: storeName,
        // this tell to medusa-marketplace-plugin that the user created before and we just need to link the store to the user
        user_id: medusa_user_id,
        metadata: { org_id: orgId },
        supported_currencies: [{ currency_code: "irr", is_default: true }],
      })
    }
  ).then(res => res.json());

  return response.data.store;
}

async function getMedusaOwnerUser({ email }: { email: string }) {
  // Use platform super admin JWT/API key for auth
  const token = await getPlatformAdminJwt(); // Implement: login or static API token

  const response = await fetch(
    `${process.env.MEDUSA_BACKEND_URL}/admin/users?email=${encodeURIComponent(email)}`,
    { headers: { Authorization: `Basic ${token}` } }
  ).then(res => res.json());

  return response.users[0]; // { id: medusa_user_id, ... }
}

// Helper: Obtain platform super admin JWT (cache or static)
async function getPlatformAdminJwt() {
  // Option 1: Static API token (recommended for provisioning)
  return process.env.MEDUSA_SUPER_ADMIN_API_TOKEN; // Generated once via Medusa super admin

  // Option 2: Dynamic login (if no API token)
  // Note: this token must be used as "Bearer <token>" NOT "Basic <token>"
  // const res = await axios.post(`${process.env.MEDUSA_BACKEND_URL}/auth/admin/emailpass/login`, {
  //   email: process.env.PLATFORM_ADMIN_EMAIL,
  //   password: process.env.PLATFORM_ADMIN_PASSWORD,
  // });
  // return res.data.token;
}