/** @type {import('next').NextConfig} */
const webpack = require('webpack');
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
const isDev = process.env.NODE_ENV == "development";
const rewites =
  process.env.NODE_ENV == "development"
    ? {
        async rewrites() {
          return [
            {
              source: "/api/comment",
              destination: "http://127.0.0.1:8360/comment", // Proxy to Backend
            },
            {
              source: "/api/:path*",
              destination: "http://127.0.0.1:3000/api/:path*", // Proxy to Backend
            },
          ];
        },
      }
    : {};

const getAllowDomains = () => {
  const domainsInEnv = process.env.VAN_BLOG_ALLOW_DOMAINS || "";
  if (domainsInEnv && domainsInEnv != "") {
    const arr = domainsInEnv.split(",");
    return arr;
  } else {
    if (isDev) {
      return ["pic.mereith.com",'localhost','127.0.0.1'];
    }
    return [];
  }
};
const getCdnUrl = () => {
  if (isDev) {
    return {};
  }
  const UrlInEnv = process.env.VAN_BLOG_CDN_URL || "";
  if (UrlInEnv && UrlInEnv != "") {
    return { assetPrefix: UrlInEnv };
  } else {
    return {};
  }
};
const getBasePath = () => {
  if (isDev) {
    return {};
  }
  const BaseInEnv = process.env.VAN_BLOG_BASE_PATH || "";
  if (BaseInEnv && BaseInEnv != "") {
    return { basePath: BaseInEnv };
  } else {
    return {};
  }
};
const getBaseInEnv = () => {
  if (isDev) {
    return {};
  }
  const BaseInEnv = process.env.VAN_BLOG_BASE_PATH || "";
  if (BaseInEnv && BaseInEnv != "") {
    return BaseInEnv;
  } else {
    return "";
  }
};
module.exports = withBundleAnalyzer({
  webpack: (config) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.BaseInEnv': JSON.stringify(getBaseInEnv())
      })
    )
    return config;
  },
  reactStrictMode: true,
  output: "standalone",
  experimental: {
    largePageDataBytes: 1024 * 1024 * 10,
  },
  images: {
    domains: getAllowDomains(),
  },
  ...getBasePath(),
  ...getCdnUrl(),
  ...rewites,
});
