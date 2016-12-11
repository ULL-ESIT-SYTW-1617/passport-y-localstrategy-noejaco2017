"use strict";
var express = require('express');
var app = express();
var path = require('path');
var expressLayouts = require('express-ejs-layouts');
var exec = require('child_process').exec;
var passport = require('passport');
var session = require('express-session');
//var FacebookStrategy = require('passport-facebook').Strategy;
//var GithubStrategy = require('passport-github').Strategy;
var DropboxStrategy = require('passport-dropbox').Strategy;
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require("bcrypt-nodejs");
//const mongoose = require('mongoose');

//*********************************************************
var github = require('octonode');
var url=require('url');

//#################### LOCAL STRATEGY WITH DROPBOX
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'sesion', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());


//---
app.use('/public', express.static(__dirname+'/public'));

//---




// passport.use(new DropboxStrategy({
//     consumerKey:'uz18i71y7janvvs' ,//DROPBOX_APP_KEY,
//     consumerSecret:'hr3a1zqr7qoy2yy', //DROPBOX_APP_SECRET,
//     callbackURL: "http://localhost:8080/auth/dropbox/callback"
//   },
//   function(token, tokenSecret, profile, cb) {
//     console.log("token"+token);
//     console.log("tokensecret"+tokenSecret);
//     console.log("Profile"+profile);

//     User.findOrCreate({ dropboxId: profile.id }, function (err, user) {
//       return cb(err, user);
//     });
//   }
// ));


// app.get('/auth/dropbox',
//   passport.authenticate('dropbox'));

// app.get('/auth/dropbox/callback',
//   passport.authenticate('dropbox', { failureRedirect: '/login' }),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     res.redirect('/');
//   });



passport.serializeUser(function(user, done) {
    console.log("SERIALIZER USER"+user);
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    console.log("DESERIALIZER USER"+user);
  //  User.findById(id, function(err, user) {
      //console.log("USER"+user);
      done(null, user);
    //});
});


// passport.use(new LocalStrategy(function(username, password, done) {
//     // process.nextTick(function() {
//     //   // Auth Check Logic
//       console.log("LLEGAMOS A LA FUNCION LOCAL");
//       console.log("USERNAME"+username);
//       console.log("PASS"+password);
//     // });


//     User.findOne({
//         username: username
//     }, function(err, user) {
//         // This is how you handle error
//         if (err) return done(err);
//         // When user is not found
//         if (!user) return done(null, false);
//         // When password is not correct
//         if (!user.authenticate(password)) return done(null, false);
//         // When all things are good, we return the user
//         return done(null, user);
//     });
//   }));

// mongoose.connect('mongodb://localhost/lista', function(err, res) {
//       if(err) {
//           console.log('ERROR: connecting to Database. ' + err);
//   }});





passport.use(new LocalStrategy(function(username, password, done) {
process.nextTick(function() {
    //   // Auth Check Logic
      console.log("LLEGAMOS A LA FUNCION LOCAL");
    //   console.log("USERNAME"+username);
    //   console.log("PASS"+password);
    //    //console.log("USER"+User+"\n");
    //
    //   // Buscamos por el email para ver si existe
    //
    //     User.findOne({ 'email' :  username }, function(err, user) {
    //       console.log("Usuario dentro de findone: "+user);
    //       // console.log("Entramos a buscar usuario -> "+ user.email || '');
    //       //   console.log("Entramos a buscar usuario y su password en mongo es -> "+ user.password || '');
    //         if (err){
    //           console.log("Ha ocurrido un error");
    //             return done(err);
    //         }
    //         // check to see if theres already a user with that email
    //         if (!user) {
    //           // return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
    //           console.log("EL USUARIO NO EXISTE EN MONGO");
    //                 // else {
    //
    //               //   //Creamos un nuevo usuario
    //               //     var newUser = new User();
    //
    //
    //               //     newUser.email = username;
    //               //     newUser.password = newUser.generateHash(password);//Generamos la contraseña con bcryptnodejs
    //
    //               //     // save the user
    //               //     newUser.save(function(err) {
    //               //         if (err)
    //               //             throw err;
    //               //         return done(null, newUser);
    //               //     });
    //               // }
    //           return done(null,false);
    //
    //         }
    //         // var ra=  bcrypt.compareSync(password, user.password);;
    //         // console.log("RA"+ra);
    //         // console.log("PASSWORD "+password);
    //         if (!user.validPassword(password)) {
    //           console.log("LA CONTRASEÑA NO COINCIDE");
    //           return done(null, false);
    //         }
    //       console.log("EL USUARIO EXISTE Y TODO HA IDO CORRECTO");
    //       return done(null, user);
    //     });
    //
     });
}));


app.get('/',
  function(req, res) {
    console.log("RENDERIZO HOME "+ req.user);
    res.render('home', { user: req.user });
});

//DEVUELVE LA PAGINA
app.get('/login',
  function(req, res){
    console.log("RENDERIZO LOGIN");
    res.render('login');
});


app.get('/registro',
  function(req, res){
    res.render('registro');
});
//////////////////////////// AQUIIIIII  //////////////////////////////////////
// Obteniendo datos de registro
// var formulario = document.forms['form_registro'];
// var password_reg = formulario['password_reg'].value;
// var username_reg = formulario['username_reg'].value;

app.post('/registro', function(req, res, next){

  var pssw = req.body.password_reg;
  var name = req.body.username_reg;

  ////////////////////
  var newUser = new User();
  newUser.email = name;
  newUser.password = newUser.generateHash(pssw);//Generamos la contraseña con bcryptnodejs

  newUser.save(function(err) {
      if (err)
          throw err;
  });

  res.redirect('/login');
  ////////////////////
  // var hash = User.userSchema.methods.generateHash(pssw);
  // console.log("\n\n Hash GENERADO: "+hash)
  //   var user_prueba = new User({
  //       "email": name,
  //       "password": hash

  //   });

  // var user_reg = user_prueba.save(function (err) {
  //   if (err) { console.log(`Hubieron errores al guardar user:\n${err}`); return err; }
  //   console.log(`Usuario guardado desde REGISTRO: ${user_prueba}`);
  // });

  // Promise.all([user1], [user2]).then( function(value){
  //   console.log(util.inspect(value, {depth: null}));
  //   //mongoose.connection.close();
  // });
});

// app.post('/login',
//     passport.authenticate('local', {
//       successRedirect: '/',
//       failureRedirect: '/loginFailure',
//       failureFlash : true
//     })
// );

app.post('/login',
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    //console.log("USHARIOOO"+req.user);
    res.redirect('/');
  });

app.get('/loginFailure', function(req, res, next) {
    res.send('Failed to authenticate');
});

app.get('/login/password', function(req, res, next) {
    res.render('cambio_pass');
});

app.post('/login/password', function(req, res, next) {
  var new_pass = req.body.password_new;
  var new_pass_2 = req.body.password_new_2;
  var name = req.body.username;

  console.log("Estamos en /login/password:::\n");
  console.log("new_pass: " + new_pass);
  console.log("\nnew_pass_2: " + new_pass_2);
  console.log("\nNombre: " + name);

  if(new_pass == new_pass_2){

    User.findOne({'email': name}, function(err, user){
      // encripta ok
      var hash_2 = bcrypt.hashSync(new_pass);
      console.log("\n\nContraseña antigua: "+ user.password);
      console.log("\n\nContraseña antigua hasheada antes update: "+ hash_2);
      // var _id = user._id;
      // console.log("\n\nUser_id: "+_id);
      // var hash_2 = user.generateHash(new_pass);
      if (err){
        res.redirect('/err');
      }
      user.password = hash_2;
      user.save(function(err) {
        if (err) throw err;

        console.log("\n\nModificada contraseña: "+ user)
      });
  //     /// bueno///
  //     User.findOneAndUpdate({ username: name }, { password: hash_2 }, function(err, user) {
  // if (err) throw err;

  // // we have the updated user returned to us
  // console.log(user);
// });
/////////////
    //   User.db.lista_usuarios.update(
    //     {'_id': _id},
    //     {"$set":{'password': hash_2}});
    //     console.log("\n\nNueva CONTRASEÑA: "+ user.password);
    //     res.redirect('/login');
    // });
    // user.password = hash_2;
    // });
    });
    res.redirect('/login');

  }
     else

       res.redirect('/err');

});

// app.get('/loginSuccess', function(req, res, next) {
//   res.send('Successfully authenticated');
// });

app.get('/logout', function(req, res){
  console.log('logging out');
  req.logout();
  res.redirect('/');
});

app.get('/err', function(req, res){
  res.render('err');
});

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    console.log("RENDERIZO PROFILE");
    console.log("EMAIL"+req.user.email);
    //console.log("PASSW"+req.user.password);
    console.log("ID"+req.user._id);
    //res.render('profile', { user: req.user });
    res.render('profile',{id: req.user._id, username: req.user.email});
});
//app.get('/profile', passport.authenticationMiddleware(), renderProfile)



var port = process.env.PORT || 8080;
var ip = process.env.IP || '0.0.0.0';
var addr = `${ip}:${port}`;
//app.set('port', (process.env.PORT || 8080));



app.listen(port,ip,function(){
    console.log(`chat server listening at ${addr,ip}`);
});


// app.listen(app.get('port'), function() {
//   console.log("Node app is running at localhost:" + app.get('port'));
// });

module.exports = app;








// ///
// app.get('/gh-pages/index', function(req, res){
//   res.redirect('https://alu0100836059.gitbooks.io/apuntes_sytw_16_17/content/');
// });
//
// app.get('/auth/github',
//   passport.authenticate('github'));

  //function(req, res) {
    // No llegamos aquí
    // Aquí debemos comprobar si el usuario es miembro o no de la organización
    // y en función de eso dar acceso o no al libro.
    // GET /orgs/:org/members/:username

    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.


  //});
//////////////////////////////////////////////////////////////
// Organización a la que pertenece JacoboRG: demoMembership //
//////////////////////////////////////////////////////////////


// app.get('/auth/github/callback',
//   passport.authenticate('github', { failureRedirect: '/login' }),  function(req, res) {
//     console.log("CCACACACACACACACCACCACACACACCCACACACCAC");
//
//
//     //console.log("organizaciones: "+req.user.profile.username/orgs)
//     console.log("ID:"+req.user.profile.id);
//     console.log("TOKEEEEN"+req.user.accessToken)
//     console.log("VALOR HTTP"+req.user.profile._json.organizations_url);
//     console.log("USUARIO"+req.user.profile.username);
//
//     var client = github.client( {id: req.user.profile.id, secret: req.user.accessToken});
//     console.log("OBJECT CLIENT->"+ client);
//     console.log("CLIENT LOGIN"+client.login);
//
//
//     client.get('/users/'+req.user.profile.username+'/orgs', {}, function (err, status, body, headers) {
//         if(err)console.log("ERROR -> "+err);
//         console.log("HEAD -> "+headers);
//         console.log("BODY -> "+body); //json object
//
//         var i = 0;
//         while (i < body.length){
//           console.log(body[i].login);
//           if(body[i].login == 'DSI1516' || 'demoMembership'){
//           console.log("COINCIDE");
//           app.use(express.static(__dirname + '/gh-pages'));
//           res.redirect('/gh-pages/index')
//           //res.redirect('./gh-pages/*');
//         }else{
//           console.log("No COINICIDEN");
//           res.redirect('/err');
//         }
//         ++i;
//         }
//
//       });
//
//
//
//     var urle = req.user.profile._json.organizations_url;
//     var uri = url.parse(req.url);
//     console.log("URIIIIIIIIIIIIIIIIIIIII"+uri.pathname);
//     console.log("MOSTRANDO URL"+req.get(url+'/:org'));
//
//     //if(req.get('/orgs/req.user.organizations_url/members/req.user.login')){
//     // res.redirect('/users/' + req.user.username);
//
//     //res.redirect('/auth/github/callback');
//     //res.redirect('/');
//   //  }
//
//     // Successful authentication, redirect home.
//     //res.redirect('/err');
// });
//
// app.get('/profile',
//   require('connect-ensure-login').ensureLoggedIn(),
//   function(req, res){
//     console.log("RENDERIZO PROFILE");
//     console.log(req.user);
//     console.log("ID",req.user.profile.id);
//     console.log("_RAW",req.user.profile._raw);
//     res.render('profile', { id: req.user.profile.id,username:req.user.profile.username,user: req.user /*,displayName:*/});
//   });
//
//
// passport.use(new GithubStrategy({
//   clientID: '1f3b68617159ac9492c2',
//   clientSecret: 'f584e68426cfda58592977e598a99eea68966503',
//   callbackURL: 'http://localhost:8080/auth/github/callback'
// }, function(accessToken, refreshToken, profile, done){
//   console.log("ACCEDO A GITHUB PASSPORT");
//     console.log("accessToken"+accessToken);
//       console.log("refreshToken"+refreshToken);
//         console.log("profile"+profile.id);
//   //return done (null,profile);
//   // User.findOrCreate({ githubId: profile.id }, function (err, user) {
//   //   console.log("BUSCO USUARIOS");
//   //   console.log("accessToken"+accessToken);
//   //     console.log("refreshToken"+refreshToken);
//   //       console.log("profile"+profile);
//   //       console.log("DONE"+done);
//   //       console.log("USER"+user);
//   //     return cb(err, user);
//   //   });
//   done(null, {
//     accessToken: accessToken,
//     profile: profile
//   });
// }));




//
// Client ID
// 1f3b68617159ac9492c2
// Client Secret
// f584e68426cfda58592977e598a99eea68966503















//##################################################### OAUTH WITH GITHUB


// variable para acceder a nuestra confi de auth
// Areglar referencia a config/auth
// AQUI: var configAuth = './config/auth'
// configuracion estrategia facebook
// passport.use(new FacebookStrategy({
//     clientID: configAuth.facebookAuth.clientID,
//     clientSecret: configAuth.facebookAuth.clientSecret,
//     callbackURL: configAuth.facebookAuth.callbackURL
//   },



///////////////////////////////////////////////////////////////////////////
// passport.use(new FacebookStrategy({
//
//     callbackURL: 'http://localhost:8080/auth/facebook/callback'
//   },
//   function(accessToken, refreshToken, profile, cb) {
//     User.findOrCreate({ facebookId: profile.id }, function (err, user) {
//       return cb(err, user);
//     });
//   }
// ));

/////////////////////////////////////////////////////////////////////////////


// OAuthStrategy = require('passport-oauth').OAuthStrategy;
// Comprobar el nombre de la estrategia y su compatibilidad
// con la nueva versión de la API de github v3.0
// ------- Comentado por cambio hacia una autenticacion a
// ------- través de facebook API -------------------
// var Strategy = require('passport-github').Strategy;
//
// passport.use(new Strategy({
//     clientID: process.env.CLIENT_ID,
//     clientSecret: process.env.CLIENT_SECRET,
//     callbackURL: 'http://localhost:3000/login/github/return'
// },
// // Pasaremos aquí la referencia a nuestro token!?!?
// function(accessToken, refreshToken, profile, cb) {
//   return cb(null, profile);
// }));
//
// // Configurando sesión persistente
// passport.serializeUser(function(user, cb) {
//   cb(null, user);
// });
//
// passport.deserializeUser(function(obj, cb) {
//   cb(null, obj);
// });
//
//
//
//
// ###



// // ###
// // app.use(require('morgan')('combined'));
// app.use(require('cookie-parser')());
// app.use(require('body-parser').urlencoded({ extended: true }));
// app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
// // Inicializando passport y restaurando estado de autenticación si es que
// // existe alguno a través de session
// app.use(passport.initialize());
// app.use(passport.session());
// // ###
