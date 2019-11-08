const controllers = require('./controllers');
const middle = require('./middleware');

// configure routes
const router = (app) => {
  app.get('/login', middle.requiresSecure, middle.requiresLogout, controllers.Account.loginPage);
  app.post('/login', middle.requiresSecure, middle.requiresLogout, controllers.Account.login);
  app.get('/getDomos', middle.requiresLogin, controllers.Domo.getDomos);
  app.delete('/removeDomo', middle.requiresLogin, controllers.Domo.removeDomo);
  app.get('/getToken', middle.requiresSecure, controllers.Account.getToken);
  app.post('/signup', middle.requiresSecure, middle.requiresLogout, controllers.Account.signup);
  app.get('/logout', middle.requiresLogin, controllers.Account.logout);
  app.get('/maker', middle.requiresLogin, controllers.Domo.makerPage);
  app.post('/maker', middle.requiresLogin, controllers.Domo.make);
  app.get('/', middle.requiresSecure, middle.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
