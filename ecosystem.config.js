require('dotenv').config({ path: '.env.deploy' });
const path = require('path');

const {
  DEPLOY_USER,
  DEPLOY_HOST,
  DEPLOY_PATH,
  DEPLOY_REF,
  DEPLOY_REPO,
  DEPLOY_SSH_KEY,
} = process.env;

const envPathForScp = path.posix.join(...__dirname.split(path.sep), 'backend/.env');

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
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      ref: DEPLOY_REF,
      repo: DEPLOY_REPO,
      path: DEPLOY_PATH,
      key: DEPLOY_SSH_KEY,
      'pre-deploy-local': `scp -i ${DEPLOY_SSH_KEY} ${envPathForScp} ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/shared/.env`,
      'post-deploy': `cd backend && npm ci && cd ../frontend && NODE_OPTIONS=--openssl-legacy-provider npm ci && NODE_OPTIONS=--openssl-legacy-provider npm run build && pm2 reload ecosystem.config.js --env production`,
    },
  },
};