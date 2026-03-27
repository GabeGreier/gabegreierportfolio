import type { NextConfig } from "next";

const imageHostnames = new Set(["images.unsplash.com"]);

try {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl) {
    imageHostnames.add(new URL(supabaseUrl).hostname);
  }
} catch {
  // Keep config resilient if NEXT_PUBLIC_SUPABASE_URL is malformed.
}

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.gabrielgreier.ca"
          }
        ],
        destination: "https://gabrielgreier.ca/:path*",
        permanent: true
      }
    ];
  },
  experimental: {
    serverActions: {
      // Keep action payload limit above the storage cap to account for multipart overhead.
      bodySizeLimit: "20mb"
    }
  },
  images: {
    unoptimized: true,
    remotePatterns: Array.from(imageHostnames).map((hostname) => ({
      protocol: "https",
      hostname,
      pathname: "/**"
    }))
  }
};

export default nextConfig;
