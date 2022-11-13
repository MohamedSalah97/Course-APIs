const express = require('express');

const requireAuth = (req,res,next)=>{
  if(!req.currentUser){
    return res.status(401).send({errors: [{msg: 'Not Authenticated'}]})
  }

  next();
}

module.exports = requireAuth ;
