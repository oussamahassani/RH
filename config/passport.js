const JwtStrategy = require('passport-jwt').Strategy ;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const config = require('./database');

module.exports = function(passport, req){
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("XPRS");
    opts.secretOrKey = config.secret ;
    passport.use('jwt', new JwtStrategy(opts, (jwt_payload, done)=>{
        global.App.clientModel[jwt_payload.subdomain].User.findById(jwt_payload._id, (err, user) => {
                if(err){
                    return done(err, false);
                }
                if(user){
                    return done(null,user);
                }
                else{
                    global.App.clientModel[jwt_payload.subdomain].Client.findById(jwt_payload._id, (err, client) => {
                        if(err){
                            return done(err, false);
                        }
                        if(client){
                            return done(null,client);
                        }
                        else{
                            return done(null,false);
                        }
                  }) ;
                }
                next();
        }) ;
    }));
}
