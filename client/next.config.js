const withPlugins = require('next-compose-plugins');
const withCSS = require('@zeit/next-css')
const withOffline = require('next-offline')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
  })
const prod = process.env.NODE_ENV === 'production'
const nextConfig = {
    env: {
        API_URL: prod ? 'https://otog.cf' : 'http://localhost:8000'
    }
}
module.exports = withPlugins([
    [withCSS],
    [withOffline],
    [withBundleAnalyzer]
], nextConfig)