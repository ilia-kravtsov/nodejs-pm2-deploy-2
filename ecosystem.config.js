require('dotenv').config({ path: '.env.deploy' });

const {
  DEPLOY_USER,
  DEPLOY_HOST,
  DEPLOY_PATH,
  DEPLOY_REF,
  REPO,
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
      repo: REPO,
      path: DEPLOY_PATH,

      'pre-deploy': `mkdir -p ${DEPLOY_PATH}/shared && scp ./backend/.env ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/shared/.env`,

      'post-deploy': `
        cd backend && npm install && 
        cd ../frontend && npm install && npm run build &&
        pm2 reload ecosystem.config.js --env production
      `,
    },
  },
};
