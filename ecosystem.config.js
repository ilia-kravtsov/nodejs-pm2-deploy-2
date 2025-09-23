require('dotenv').config({ path: '.env.deploy' });

const {
  DEPLOY_USER,
  DEPLOY_HOST,
  DEPLOY_PATH,
  DEPLOY_REF,
  DEPLOY_REPO,
  DEPLOY_SSH_KEY,
} = process.env;

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
      'pre-deploy': `scp "./backend/.env" ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/shared/.env`,
      'post-deploy': `
        cd backend && npm install &&
        cd ../frontend && npm install && npm run build &&
        pm2 reload ecosystem.config.js --env production
      `,
    },
  },
};
