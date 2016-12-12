var fs = require('fs');
var path = require('path');
var child = require("child_process");
var fs_extended = require('fs-extended');
var prompt = require("prompt");
var heroku = require('heroku-client');





function initialize(directorio) {


    console.log("\n============ Generando tarea gulp ============")
    console.log("\nEspere mientras el proceso termina ...")

    var contenido = `gulp.task("push-heroku" ,function(){
            var heroku = require("gitbook-start-heroku-localstrategy-noejaco17");
            heroku.deploy();
     });`;
    //  fs.copyFile(path.join(__dirname,'..','book.json'),"./" + directorio + "/book.json",function(err){
    //       if(err)
    //       console.log(err);
    //     });
    //Copia el server.js
    fs_extended.copyFile(path.join(process.cwd(),'node_modules','gitbook-start-heroku-localstrategy-noejaco17','app.js'),path.join(process.cwd()+"/"+directorio, 'app.js'),function(err){
        if(err)
        console.log(err);
     });

      fs.copyDir(path.join(process.cwd(),'node_modules','gitbook-start-heroku-localstrategy-noejaco17','views'),path.join(process.cwd()+"/"+directorio, 'views'),function(err){
        if(err)
        console.log(err);
     });
     fs.copyDir(path.join(process.cwd(),'node_modules','gitbook-start-heroku-localstrategy-noejaco17','public'),path.join(process.cwd()+"/"+directorio, 'public'),function(err){
       if(err)
       console.log(err);
    });

    //  fs.copyDir(path.join(process.cwd(),'node_modules','gitbook-start-heroku-token-oauth-noejaco17','public'),path.join(process.cwd(), 'public'),function(err){
    //     if(err)
    //     console.log(err);
    //  });

    //añadimos la tarea
    fs.writeFileSync(path.resolve(process.cwd()+"/"+directorio,'gulpfile.js'), contenido,  {'flag':'a'},  function(err) {
        if (err) {
            return console.error(err);
        }


    });
    fs_extended.copyFile(path.join(process.cwd(),'node_modules','gitbook-start-heroku-localstrategy-noejaco17','Procfile'),path.join(process.cwd()+"/"+directorio, 'Procfile'),function(err){
        if(err)
        console.log(err);
     });

    datos_usuario_token(directorio);

};


//

//
function deploy() {



    console.log("Comenzando el deploy en HEROKU");



    child.exec('git add --all ; git commit -m "first push heroku"; git push heroku master;', function(error, stdout, stderr){
        if(error)
          console.log(error)
        console.log(stderr);
        console.log(stdout);
      });



};


function datos_usuario_token(directorio){
     //pedimos por pantall el nombre de la app y el token
      var git = require('simple-git')(path.join(process.cwd()));
      //console.log("hfhfhfhfhf   " + path.join(process.cwd()));
       prompt.get([{
              name: 'nombre_app',
              required: true
            },{
              name: 'token_app',
              required: true
            },{
                name: 'token_dropbox',
                require: true
            },{
                name: 'fich_dropbox',
                require: true

            }], function (err, result) {
            //
            // Log the results.
            //
            console.log('  nombre: ' + result.nombre_app);
            console.log('  token: ' + result.token_app);
            console.log('  token de dropbox: ' + result.token_dropbox);
            console.log('  fichero de config de dropbox: ' + result.fich_dropbox);
            // console.log('  secret_client: ' + result.secret_client);
            // console.log('  organizacion ' + result.organizacion);

            //variable con el contenido de config.json
            var heroku_config = '{\n "Heroku":{\n\t"nombre_app": "'+result.nombre_app+'",\n\t "token_app": "'+result.token_app+'"\n\t}\n}';
            var dropbox_config = '{\n "Config":{\n\t"token_dropbox": "'+result.token_dropbox+'",\n\t "ruta_dropbox": "'+result.fich_dropbox+'"\n\t}\n}';


            fs.mkdirSync(path.join(process.cwd(), ".token_heroku"));
            fs.writeFileSync(path.join(process.cwd(),".token_heroku","token.json"),heroku_config);
            fs.writeFileSync(path.join(process.cwd()+"/"+directorio,".dropbox.json"),dropbox_config);

            var token = require(path.join(process.cwd(), ".token_heroku","token.json"));

            var her = new heroku({ token : token.Heroku.token_app });

                her.post('/apps', {body: {name: token.Heroku.nombre_app}} ).then(app => {

                    //git.init().addRemote('heroku', result.repositorio).add('.').commit('Primer commit').push('heroku','master');



                });

          });

}

module.exports = {
  initialize,
  deploy
}
