module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.energy-charts.info/:path*',
      },
    ];
  },
};