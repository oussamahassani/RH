const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');

const config = require('../config/database');
const conn = mongoose.createConnection(config.database, { useNewUrlParser: true,  useUnifiedTopology: false });





router.get('/toTable/:page/:limit/:sort/:query/:model/:fields',passport.authenticate('admin', {session: false}), function(req, res, next) {
    var schema = require('../../models/'+req.params.model);
    const mymodel = conn.model(req.params.model, schema);
    if(req.params.query != 'no-query')
    var query   = {$text: {$search : req.params.query}};
    else
    var query = {} ;
    const options = {
      page: req.params.page,
      limit: req.params.limit,
      sort:{ 'createdAt': req.params.sort },
      select : req.params.fields
    };
    mymodel.paginate(query, options, function(err, result) {
      if (err) return next(err);
      res.json(result);
    });
  });

  module.exports = router;