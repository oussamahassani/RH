var jwtDecode = require('jwt-decode');

module.exports = (roles, passport, strategy, opts) => { 
    return function(req, res, next){
      var authHeader = req.headers.authorization;
      if (authHeader) {
        var token = authHeader.split(' ')[1];
        var decoded = jwtDecode(token);
        const hasPermission = roles.some(r=> decoded.permissions.includes(r))
        console.log(hasPermission);
        if(hasPermission){
          next();
        } else {
          res.status(401).json({success:false, msg :"Vous n'avez pas la permissions nécessaire"});
        }
      } else {
        res.sendStatus(401);
      }
  }
}     