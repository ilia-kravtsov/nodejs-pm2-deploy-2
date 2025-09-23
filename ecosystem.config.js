require('dotenv').config({ path: '.env.deploy' });

const {
  DEPLOY_USER,
  DEPLOY_HOST,
  DEPLOY_PATH,
  DEPLOY_REPO,
  DEPLOY_REF = 'origin/master',
  DEPLOY_SSH_KEY
} = process.env;

module.exports = {
  apps: [
    {
      name: 'backend',
      script: './dist/app.js',
      env_production: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'frontend',
      script: 'npx serve -s build -l 3000',
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],

  deploy: {
    production: {
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      ref: DEPLOY_REF,
      repo: DEPLOY_REPO,
      path: DEPLOY_PATH,
      ssh_options: 'StrictHostKeyChecking=no -i ~/.ssh/vm_access/private_key',
      'pre-deploy-local': `scp -i ~/.ssh/vm_access/private_key backend/.env ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/shared/.env`,
      'post-deploy': 'cd source/backend && npm install && npm run build && pm2 reload source/ecosystem.config.js --env production'
    },
  },
};