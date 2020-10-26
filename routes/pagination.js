const express = require('express');
const router = express.Router();
const passport = require('passport');



router.get('/toTable/:page/:limit/:sort/:query/:model/:fields', function(req, res, next) {
    console.log(req.params.query);
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
    global.App.clientModel[(req.subdomains[1])][req.params.model].paginate(query, options, function(err, result) {
      if (err) return next(err);
      res.json(result);
    });
  });

  module.exports = router;