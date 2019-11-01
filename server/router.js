const controllers = require('./controllers');
const middle = require('./middleware');

// configure routes
const router = (app) => {
  app.get('/login', middle.requireSecure, middle.requiresLogout, controllers.Account.loginPage);
  app.post('/login', middle.requireSecure, middle.requiresLogout, controllers.Account.login);
  app.get('/signup', middle.requireSecure, middle.requiresLogout, controllers.Account.signupPage);
  app.post('/signup', middle.requireSecure, middle.requiresLogout, controllers.Account.signup);
  app.get('/logout', middle.requiresLogin, controllers.Account.logout);
  app.get('/maker', middle.requiresLogin, controllers.Domo.makerPage);
  app.post('/maker', middle.requiresLogin, controllers.Domo.make);
  app.get('/', middle.requireSecure, middle.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
