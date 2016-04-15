exports.isAuthenticated = function (req, res, next){
    if(req.isAuthenticated()){
        next();
    }else{
        res.redirect("/login");
    }
}

var mobileAuth = function(req,res,next){
	return passport.authenticate('bearer', { session: false })(req,res,next);
};

exports.masterAuth = function(req,res,next){
	// Si usuario no esta logeado por web entonces llamar middleware de autentificación móvil
	if(req.isAuthenticated()){ return next(); }
	return mobileAuth(req,res,next);
}

exports.mobileAuth;