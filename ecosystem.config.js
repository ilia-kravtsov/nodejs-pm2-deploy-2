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

const localEnvPath = path.posix.join('backend', '.env');
const remoteSharedEnvPath = path.posix.join(DEPLOY_PATH, 'shared', '.env');

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
      'pre-deploy-local': `scp -i ${DEPLOY_SSH_KEY} ${localEnvPath} ${DEPLOY_USER}@${DEPLOY_HOST}:${remoteSharedEnvPath}`,
      'post-deploy': `cd ${DEPLOY_PATH}/current/backend && npm install && cd ../frontend && NODE_OPTIONS=--openssl-legacy-provider npm install && NODE_OPTIONS=--openssl-legacy-provider npm run build && pm2 reload ${DEPLOY_PATH}/current/ecosystem.config.js --env production`,
    },
  },
};