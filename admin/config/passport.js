const JwtStrategy = require('passport-jwt').Strategy ;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const config = require('./database');
const mongoose = require('mongoose');
const AdminUserSchema = require('../models/adminUsers');
const conn = mongoose.createConnection(config.database, { useNewUrlParser: true,  useUnifiedTopology: false });
const AdminUser = conn.model('AdminUsers', AdminUserSchema);

module.exports = function(passport, req){
    let opts = {} ;
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("XPRA");
    opts.secretOrKey = config.secret;
    console.log(opts.jwtFromRequest);
    passport.use('admin', new JwtStrategy(opts, (jwt_payload, done)=>{
        AdminUser.findById(jwt_payload._id, (err, user) => {
                if(err){
                    return done(err, false);
                }
                if(user){
                    return done(null,user);
                } else{
                    return done(null,false);
                }
        }) ;
    }));
}