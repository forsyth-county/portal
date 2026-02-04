/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Content Security Policy headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://hcaptcha.com https://*.hcaptcha.com https://fonts.googleapis.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com",
              "img-src 'self' data: https: blob:",
              "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com",
              "connect-src 'self' https://api.web3forms.com https://hcaptcha.com https://*.hcaptcha.com",
              "frame-src 'self' https://hcaptcha.com https://*.hcaptcha.com",
              "frame-ancestors 'self'",
              "base-uri 'self'",
              "form-action 'self' https://api.web3forms.com",
            ].join('; '),
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },
  // Serve static files from games and utilities directories
  async rewrites() {
    return [
      {
        source: '/games/:path*',
        destination: '/games/:path*',
      },
      {
        source: '/utilities/:path*',
        destination: '/utilities/:path*',
      },
      {
        source: '/assets/:path*',
        destination: '/assets/:path*',
      },
    ]
  },
}

module.exports = nextConfig
