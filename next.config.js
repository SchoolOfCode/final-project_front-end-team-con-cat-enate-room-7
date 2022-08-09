/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}
const withImages = require("next-images");
module.exports = withImages({
	esModule: true,
	fileExtensions: ["jpg", "jpeg", "png", "gif"],
	webpack(config, options) {
		return config;
	},
});

module.exports = nextConfig
