module.exports = {
  apps: [{
    name: 'backend',
    script: './dist/app.js',
    cwd: 'backend'
  }, {
    name: 'frontend', 
    script: 'serve',
    args: ['-s', 'build', '-l', '3001'],
    cwd: 'frontend'
  }],

  deploy: {
    production: {
      user: process.env.DEPLOY_USER || 'user',
      host: process.env.DEPLOY_HOST || '158.160.195.220',
      ref: process.env.DEPLOY_REF || 'origin/master',
      repo: process.env.DEPLOY_REPO || 'git@github.com:ilia-kravtsov/nodejs-pm2-deploy-2.git', 
      path: process.env.DEPLOY_PATH || '/home/user/app',
      key: process.env.SSH_KEY || 'C:/Users/kravt/.ssh/vm_access/private_key',
      'pre-deploy': `scp ./*.env ${process.env.DEPLOY_USER || 'user'}@${process.env.DEPLOY_HOST || '158.160.195.220'}:${process.env.DEPLOY_PATH || '/home/user/app'}`,
      'post-deploy': `
        cd backend && npm i && npm run build &&
        cd ../frontend && npm i && npm run build &&
        pm2 startOrRestart ecosystem.config.js --env production
      `,
    },
  },
};