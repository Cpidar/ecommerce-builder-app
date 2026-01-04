import type { NextConfig } from 'next'
import '@/env/client-env'

const nextConfig: NextConfig = {
  typedRoutes: true,
   async rewrites() {
    return [
      {
        source: "/api/auth/.well-known/oauth-authorization-server",
        destination: "/api/auth/oauth-authorization-server",
      },
            {
        source: "/api/auth/.well-known/openid-configuration",
        destination: "/api/auth/openid-configuration",
      },
    ];
  },

}

export default nextConfig
