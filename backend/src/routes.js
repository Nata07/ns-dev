const {Router} = require('express');

const routes = Router();

routes.get('/');

routes.post('/devs', (req, res) => {
  console.log(req.body);
});
 module.exports = routes;