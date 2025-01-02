module.exports = {
  apps: [
    {
      name: 'diplom-back',
      script: 'node dist/src/index.js',
      autorestart: true,
      watch: false,
    },
  ],
}
