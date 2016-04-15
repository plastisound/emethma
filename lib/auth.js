//var config                  = require('./config');
var passport                = require('passport');
var LocalStrategy           = require('passport-local').Strategy;
var BasicStrategy           = require('passport-http').BasicStrategy;
var ClientPasswordStrategy  = require('passport-oauth2-client-password').Strategy;
var FacebookStrategy        = require('passport-facebook').Strategy;
var BearerStrategy          = require('passport-http-bearer').Strategy;

var db = require('../models');

var UserModel               = db.usuario;
var ClientModel             = db.appClient;
var AccessTokenModel        = db.accessToken;
var RefreshTokenModel       = db.refreshToken;

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(id, done) {
    db['usuario'].find(id).then(function(user){
        if(user){
            done(null,user);
        }else{
            /*
            Users.findById(id, function(err,user){
                if(err) done(err);
                done(null,user);
            });
            */
        }
    });
});

// Usada para logeo Web
passport.use(new LocalStrategy({
        usernameField: 'correo',
        passwordField: 'password'
    },
    function(username, password, done) {
        UserModel.find({ where:{ correo: username } }).then(function(usuario) {
            //if (err) { return done(err); }
            if (!usuario) { return done(null, false); }
            if (usuario.hashedPassword != usuario.encryptPassword(password,usuario.salt) ) { return done(null, false); }

            return done(null, usuario.id);
        });
    }
));

// Facebook

passport.use(new FacebookStrategy({
        clientID: '412520052253954',
        clientSecret: '7bbd51100fcd275bbe1ea169828a08d3',
        callbackURL: "/auth/facebook/callback",
        profileFields: ['id','first_name','last_name','email','displayName', 'photos','location']
    },
    function(accessToken, refreshToken, profile, done) {
        console.log('PROFILE'.green);
        //console.log('accessToken: '+ accessToken);
        console.log(profile);

        var imagen = 'https://graph.facebook.com/'+profile._json.id+'/picture/picture?width=250&height=250';

        var data = {
            fb_id: profile._json.id,
            nombre: profile._json.first_name,
            apellidos: profile._json.last_name,
            correo: (profile._json.email) ? profile._json.email : null,
            img_perfil: imagen,
            estado: (profile._json.location) ? profile._json.location.name : null,
            is_active: 1
        };
        db['usuario'].findOrCreate({where:{correo:data['correo']}, defaults:data })
            .then(function(usuario, created) {
                //return done(null,false,{message:'Ocurrio un error carnalito'});
                if(!usuario) return done(null, false);
                if(usuario) return done(null, usuario.id);
            })
            .error(function(err){
               console.log(err);
            });
    }
));

passport.use(new BasicStrategy(
    function(username, password, done) {
        UserModel.find({ where:{ correo: username } }).then(function(usuario) {
            //if (err) { return done(err); }
            if (!usuario) { return done(null, false); }
            if (usuario.hashedPassword != usuario.encryptPassword(password,usuario.salt) ) { return done(null, false); }

            return done(null, usuario.id);
        });
    }
));

passport.use(new ClientPasswordStrategy(
    function(clientId, clientSecret, done) {
        console.log('ClientId: '+clientId);
        ClientModel.find({ where:{ clientId: clientId } }).then(function(client) {
            //if (err) { return done(err); }
            if (!client) { return done(null, false); }
            if (client.clientSecret != clientSecret) { return done(null, false); }

            return done(null, client);
        });
    }
));

passport.use(new
 BearerStrategy(
    function(accessToken, done) {
        AccessTokenModel.find({ where:{ token: accessToken } }).then(function(token) {
            //if (err) { return done(err); }
            if (!token) { return done(null, false); }

            if( Math.round((Date.now()-token.createdAt)/1000) > 3600 ) {

                AccessTokenModel.find({where:{token: accessToken} }).then(function(item){
                    item.destroy().then(function(affectedRows){ });
                });

                return done(null, false, { message: 'Token expired' });
            }

            UserModel.find(token.userId).then(function(user) {
                //if (err) { return done(err); }
                if (!user) { return done(null, false, { message: 'Unknown user' }); }

                var info = { scope: '*' };
                done(null, user, info);
            });
        });
    }
));