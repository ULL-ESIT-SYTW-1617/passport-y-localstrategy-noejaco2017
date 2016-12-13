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
var fs = require('fs');
var Dropbox = require('dropbox');
var node_dropbox = require("node-dropbox");
//*********************************************************
var github = require('octonode');
var url=require('url');
var config = require(path.resolve(process.cwd(),".dropbox.json"));

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



//var datos_dropbox= require(path.resolve(process.cwd(),".dropbox.json"));



passport.use(new LocalStrategy(function(username, password, cb, err) {
    process.nextTick(function() {
    //   // Auth Check Logic
      console.log("LLEGAMOS A LA FUNCION LOCAL");
      console.log("NOMBRE"+username+"PASS"+password);
      //Generamos en la app de dropbox el fichero que hemos pasado anteriormente por parametros
      // fs.readFile(path.join(process.cwd(),'usuarios.json'), (err, data) => {
      //           if(err) throw err;
      //           var dbx = new Dropbox({ accessToken: config.Config.token_dropbox });
      //           dbx.filesUpload({path: '/'+config.Config.ruta_dropbox+'.json', contents: data})
      //   		.then(function(response){
      //           console.log("fichero subido correctamente"+response);
	    //            return response;
      //   		}).catch(function(err){
      //   			console.log("No se ha subido correctamente la bd al dropbox. Error:"+err);
      //   			throw err;
      //   		  })
      //       });

            //console.log("PATH"+datos_dropbox);

            //var api = node_dropbox.api(config.Config.token_dropbox);
            var api = node_dropbox.api(config.Config.token_dropbox);

            //
            // api.account('/'+datos_dropbox.Config.ruta_dropbox+'.json',function(err, res, body) {
	          //      console.log("\n\n BODY    ->"+body);
            // });




            api.getFile('/'+config.Config.ruta_dropbox+'.json', (err,response,body) => {

              console.log("BODY"+body+"RESPONS"+response)
              //console.log("B"+body.length);
              ////////////////////////////////////////////////////////////////////////////BIDY PROBLEM
              console.log("body lenght"+body.lenght);

              var existe = false;
              var j;
              var hash;

              for(var i=0; i< body.length;i++){
                 if(username === body[i].usuario){
                   console.log("LLega a user"+username);
                   existe = true;
                   console.log(existe);
                   j = i;
                   console.log("i"+i)
                 }
               }

                if(!existe){
                console.log("No existe");
                  return cb(null,false);
                }
                var pass_encriptada = bcrypt.compareSync(password, body[j].pass);
                if(pass_encriptada){
                    return cb(null, username);
                }else{
                   return cb(null,false);
               }
           });
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

   var pass = req.body.password_reg;
   var user = req.body.username_reg;

console.log("registro pass"+pass);
console.log("name"+user);
  var existe= false;
  var j;




  // var user = req.query.username;
  // var pass = req.query.password;

  var hash = bcrypt.hashSync(pass);


  var new_user_bbdd_dropbox = `[
                    {
                    "usuario":"`+user+`",
                    "pass": "`+hash+`"
                    }
                    ]`;




  console.log("Contraseñaa cifrada!!!!!!!!!!  "+ hash);
 var api = node_dropbox.api(config.Config.token_dropbox);
  api.getFile('/'+config.Config.ruta_dropbox+'.json', (err,response,body) => {
      console.log("entro a buscar fichero");
      console.log("res"+response);
      console.log("body"+body);
        for(var i=0; i<body.length;i++){
           if(user === body[i].usuario){
              body[i].pass = hash;
           }
         }
        console.log("FUERA FOR");



        var contenido= JSON.stringify(body,null,' ');
        contenido = contenido.concat(new_user_bbdd_dropbox);
        //console.log("CONTNEIDO"+contenido)

      api.removeFile('/'+config.Config .ruta_dropbox+'.json', function(err, response, body){
        console.log("FICHERO DROP TOKEN"+config);
        console.log("config_token"+config.Config.token_dropbox);
        var  dbx = new Dropbox({ accessToken: config.Config.token_dropbox });
        dbx.filesUpload({path: '/'+config.Config.ruta_dropbox+'.json', contents: contenido});
        res.redirect('/')
      })
    });

});

// app.post('/login',
//     passport.authenticate('local', {
//       successRedirect: '/',
//       failureRedirect: '/loginFailure',
//       failureFlash : true
//     })
// );

app.post('/login',
  passport.authenticate('local', { failureRedirect: '/err' }),
  function(req, res) {
    console.log("LOG DESPUES DE AYTENTICAR");
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

  var existe= false;
    var j;

    var user = req.query.username;
    var pass = req.query.password;
    var contenido;

    var hash = bcrypt.hashSync(pass);
    //var pass_encritada = bcrypt.compareSync(pass, hash);
    //console.log("Usuario!!!!!!!!!!!!!!!  "+ user );
   // console.log("Contraseñaa!!!!!!!!!!  "+ hash);

    api.getFile('/'+config.ruta_dropbox+'.json', (err,response,body) => {

          for(var i=0; i<body.length;i++){
             if(user === body[i].usuario){
                body[i].pass = hash;
             }
           }
          console.log(body)
          contenido= JSON.stringify(body,null,' ');
          console.log(contenido)

        api.removeFile('/'+config.ruta_dropbox+'.json', function(err, response, body){

          var  dbx = new Dropbox({ accessToken: config.token_dropbox });
          dbx.filesUpload({path: '/'+config.ruta_dropbox+'.json', contents: contenido});
          res.redirect('/')
        })
      });

  // var new_pass = req.body.password_new;
  // var new_pass_2 = req.body.password_new_2;
  // var name = req.body.username;
  //
  // console.log("Estamos en /login/password:::\n");
  // console.log("new_pass: " + new_pass);
  // console.log("\nnew_pass_2: " + new_pass_2);
  // console.log("\nNombre: " + name);
  //
  // if(new_pass == new_pass_2){
  //
  //   User.findOne({'email': name}, function(err, user){
  //     // encripta ok
  //     var hash_2 = bcrypt.hashSync(new_pass);
  //     console.log("\n\nContraseña antigua: "+ user.password);
  //     console.log("\n\nContraseña antigua hasheada antes update: "+ hash_2);
  //     // var _id = user._id;
  //     // console.log("\n\nUser_id: "+_id);
  //     // var hash_2 = user.generateHash(new_pass);
  //     if (err){
  //       res.redirect('/err');
  //     }
  //     user.password = hash_2;
  //     user.save(function(err) {
  //       if (err) throw err;
  //
  //       console.log("\n\nModificada contraseña: "+ user)
  //     });
  //
  //   });
  //   res.redirect('/login');
  //
  // }
  //    else
  //
  //      res.redirect('/err');

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
app.post('/cambio_pass',function(req,res,next){
  var existe= false;
  var j;

  var user = req.query.username;
  var pass = req.query.password;


  var hash = bcrypt.hashSync(pass);
  //var pass_encritada = bcrypt.compareSync(pass, hash);
  //console.log("Usuario!!!!!!!!!!!!!!!  "+ user );
 // console.log("Contraseñaa!!!!!!!!!!  "+ hash);

  api.getFile('/'+config.Config.ruta_dropbox+'.json', (err,response,body) => {

        for(var i=0; i<body.length;i++){
           if(user === body[i].usuario){
              body[i].pass = hash;
           }
         }
        console.log(body)
        var json= JSON.stringify(body,null,' ');
        console.log(json);

      api.removeFile('/'+config.config.ruta_dropbox+'.json', function(err, response, body){

        var  dbx = new Dropbox({ accessToken: config.Config.token_dropbox });
        dbx.filesUpload({path: '/'+config.Config.ruta_dropbox+'.json', contents: contenido});
        res.redirect('/')
      })
    });
});


var port = process.env.PORT || 8080;
var ip = process.env.IP || '0.0.0.0';
var addr = `${ip}:${port}`;
//app.set('port', (process.env.PORT || 8080));



app.listen(port,ip,function(){
    console.log(`chat server listening at ${port}`);
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
