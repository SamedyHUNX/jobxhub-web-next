import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  transpilePackages: ['@mdxeditor/editor'],
  /* config options here */
  output: 'standalone',
};

export default withNextIntl(nextConfig);
