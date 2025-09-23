module.exports = {
  apps: [{
    name: 'backend',
    script: './dist/app.js',
  }, {
    name: 'frontend',
    script: 'serve',
    args: ['-s', 'build', '-l', '3001'],
    cwd: 'frontend'
  }],

  deploy: {
    production: {
      user: 'user',
      host: '158.160.195.220', 
      key: 'C:/Users/kravt/.ssh/vm_access/private_key',
      ref: 'origin/master',
      repo: 'git@github.com:ilia-kravtsov/nodejs-pm2-deploy-2.git',
      path: '/home/user/app',
      'pre-deploy': `scp ./backend/.env user@158.160.195.220:/home/user/app/shared/backend/.env`,
      'post-deploy': `
        ln -sf /home/user/app/shared/backend/.env /home/user/app/current/backend/.env &&
        cd /home/user/app/current/backend && npm install && npm run build &&
        cd ../frontend && npm install && npm run build &&
        pm2 startOrRestart ecosystem.config.js --env production
      `,
    },
  },
};