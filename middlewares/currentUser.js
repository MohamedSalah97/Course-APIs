const jwt = require('jsonwebtoken');

const currentUser = (req,res,next) =>{
  if(!req.session.jwt){
    return next();
  }

  try {
    const payload = jwt.verify(req.session.jwt , 'secrete');
    req.currentUser = payload;
  } catch (err) {
    console.log(err);
  }
  next()
};



module.exports = currentUser ;
