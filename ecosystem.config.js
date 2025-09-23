module.exports = {
  apps: [
    {
      name: 'mesto-backend',
      script: './backend/dist/app.js',
      env_production: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'mesto-frontend',
      script: 'npx serve -s build',
      cwd: './frontend',
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],

  deploy: {
    production: {
      user: 'user',
      host: '158.160.195.220',
      ref: 'origin/master',
      repo: 'git@github.com:ilia-kravtsov/nodejs-pm2-deploy-2.git',
      path: '/home/user/mesto',
      key: '~/.ssh/vm_access/private_key',
      'pre-deploy-local': `scp backend/.env user@158.160.195.220:/home/user/mesto/shared/.env`,
      'post-deploy': `
        cd /home/user/mesto/current/backend &&
        npm install &&
        cd ../frontend &&
        NODE_OPTIONS=--openssl-legacy-provider npm install &&
        NODE_OPTIONS=--openssl-legacy-provider npm run build &&
        pm2 reload /home/user/mesto/current/ecosystem.config.js --env production
      `,
    },
  },
};