require('dotenv').config({ path: '.env.deploy' });
const path = require('path');

const envPathForScp = path.join('backend', '.env');

module.exports = {
  apps: [
    {
      name: 'mesto-backend',
      script: './backend/dist/app.js',
    },
    {
      name: 'mesto-frontend',
      script: 'npx serve -s build',
      cwd: './frontend',
    },
  ],

  deploy: {
    production: {
      user: process.env.DEPLOY_USER,
      host: process.env.DEPLOY_HOST,
      ref: process.env.DEPLOY_REF,
      repo: process.env.DEPLOY_REPO,
      path: process.env.DEPLOY_PATH,
      key: process.env.DEPLOY_SSH_KEY,
      'pre-deploy-local': `scp -i ${process.env.DEPLOY_SSH_KEY} ${envPathForScp} ${process.env.DEPLOY_USER}@${process.env.DEPLOY_HOST}:${process.env.DEPLOY_PATH}/shared/.env`,
      'post-deploy': `cd backend && npm install && cd ../frontend && NODE_OPTIONS=--openssl-legacy-provider npm install && NODE_OPTIONS=--openssl-legacy-provider npm run build && pm2 reload ${process.env.DEPLOY_PATH}/current/ecosystem.config.js --env production`,
    },
  },
};