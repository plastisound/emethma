var express = require('express');
var faker = require('faker');
// Body Parser
bodyParser = require('body-parser');

db = require('./models');
passport = require('passport');
oauth2 = require('./lib/oauth2');
cookieSession = require('cookie-session');

var app = express();

app.set('port', (process.env.PORT || 5003));
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname+'/views');

app.set('view engine','ejs');

/*
var net = require('net');
var port = 5000,                    // Datalogger port
host = '189.177.25.213';


//Create a TCP socket to read data from datalogger
var socket = net.createConnection(port, host);

socket.on('error', function(error) {
	console.log(error);
	console.log("Error Connecting");
});

socket.on('connect', function(connect) {

  console.log('connection established');

  socket.setEncoding('ascii');

});

socket.on('data', function(data) {

  console.log('DATA ' + socket.remoteAddress + ': ' + data);
  io.sockets.emit('livedata', { livedata: data });        //This is where data is being sent to html file 

});
*/

// Global Variables
app.locals._ciudad = [
	{id:'1', ciudad:'Aguascalientes'},
	{id:'2', ciudad : 'Baja California'},
	{id:'3', ciudad : 'Baja California Sur'},
	{id:'4', ciudad : 'Campeche'},
	{id:'5', ciudad : 'Coahuila de Zaragoza'},
	{id:'6', ciudad : 'Colima'},
	{id:'7', ciudad : 'Chiapas'},
	{id:'8', ciudad : 'Chihuahua'},
	{id:'9', ciudad : 'Distrito Federal'},
	{id:'10', ciudad : 'Durango'},
	{id:'11', ciudad : 'Guanajuato'},
	{id:'12', ciudad : 'Guerrero'},
	{id:'13', ciudad : 'Hidalgo'},
	{id:'14', ciudad : 'Jalisco'},
	{id:'15', ciudad : 'México'},
	{id:'16', ciudad : 'Michoacán de Ocampo'},
	{id:'17', ciudad : 'Morelos'},
	{id:'18', ciudad : 'Nayarit'},
	{id:'19', ciudad : 'Nuevo León'},
	{id:'20', ciudad : 'Oaxaca'},
	{id:'21', ciudad : 'Puebla'},
	{id:'22', ciudad : 'Querétaro'},
	{id:'23', ciudad : 'Quintana Roo'},
	{id:'24', ciudad : 'San Luis Potosí'},
	{id:'25', ciudad : 'Sinaloa'},
	{id:'26', ciudad : 'Sonora'},
	{id:'27', ciudad : 'Tabasco'},
	{id:'28', ciudad : 'Tamaulipas'},
	{id:'29', ciudad : 'Tlaxcala'},
	{id:'30', ciudad : 'Veracruz de Ignacio de la Llave'},
	{id:'31', ciudad : 'Yucatán'},
	{id:'32', ciudad : 'Zacatecas'}
];

app.locals._banco = [
	{id:'1', banco:'Banco de Avío'},
	{id:'2', banco : 'Banco Azteca'},
	{id:'3', banco : 'Banco del Bajío'},
	{id:'4', banco : 'Banca de Segundo Piso'},
	{id:'5', banco : 'Banca Mifel'},
	{id:'6', banco : 'Banco de Londres y México'},
	{id:'7', banco : 'Banco del Ahorro Nacional y Servicios Financieros'},
	{id:'8', banco : 'Banamex (Banco Nacional de México)'},
	{id:'9', banco : 'Banco Nacional de Obras y Servicios Públicos (México)'},
	{id:'10', banco : 'Grupo Financiero Banorte'},
	{id:'11', banco : 'Banregio'},
	{id:'12', banco : 'Bansí'},
	{id:'13', banco : 'Empresas de México'},
	{id:'14', banco : 'Financiera Rural (México)'},
	{id:'15', banco : 'Grupo Financiero Inbursa'},
	{id:'16', banco : 'Grupo Financiero Monex'},
	{id:'17', banco : 'HSBC México'},
	{id:'18', banco : 'Grupo Financiero Interacciones'},
	{id:'19', banco : 'Ixe'},
	{id:'20', banco : 'Banco Multiva'},
	{id:'21', banco : 'Grupo Financiero Multiva'},
	{id:'22', banco : 'Nacional Financiera (México)'},
	{id:'23', banco : 'Grupo Financiero Santander Serfín, S.A. de C.V.'},
	{id:'24', banco : 'Sociedad Financiera de Objeto Limitado'},
	{id:'25', banco : 'Sociedad Financiera de Objeto Múltiple'},
	{id:'26', banco : 'Sociedad Hipotecaria Federal, S.N.C.'},
	{id:'27', banco : 'Scotiabank México'},
	{id:'28', banco : 'IXE'}
];

/*
app.locals._banco = [
	{id:'29',banco:'AMERICAN EXPRESS'},
	{id:'30',banco:'BANAMEX'},
	{id:'31',banco:'BANCA MIFEL'},
	{id:'32',banco:'BANCEN'},
	{id:'33',banco:'BANCO ABC CAPITAL'},
	{id:'34',banco:'BANCO AFIRME'},
	{id:'35',banco:'BANCO AZTECA'},
	{id:'36',banco:'BANCO DEL BAJIO'},
	{id:'37',banco:'BANCO INBURSA'},
	{id:'38',banco:'BANCO INDUSTRIAL'},
	{id:'39',banco:'BANCO INTERACCIONES'},
	{id:'40',banco:'BANCO MULTIVA'},
	{id:'41',banco:'BANCOMEXT'},
	{id:'42',banco:'BANCOPPEL'},
	{id:'43',banco:'BANCRECER'},
	{id:'44',banco:'BANJERCITO'},
	{id:'45',banco:'BANOBRAS'},
	{id:'46',banco:'BANORTE'},
	{id:'47',banco:'BANPAIS'},
	{id:'48',banco:'BANREGIO'},
	{id:'49',banco:'BANRURAL'},
	{id:'50',banco:'BANSI'},
	{id:'51',banco:'BANXICO'},
	{id:'52',banco:'BBVA BANCOMER'},
	{id:'53',banco:'BOSTON'},
	{id:'54',banco:'CITIBANK'},
	{id:'55',banco:'CONFIA'},
	{id:'56',banco:'DRESDNER'},
	{id:'57',banco:'EDENRED'},
	{id:'58',banco:'ELEKTRA'},
	{id:'59',banco:'FMM CONSUMO S.A'},
	{id:'60',banco:'FONACOT'},
	{id:'61',banco:'HSBC'},
	{id:'62',banco:'IXE'},
	{id:'63',banco:'LIVERPOOL'},
	{id:'64',banco:'NAFINSA'},
	{id:'65',banco:'PALACIO DE HIERRO'},
	{id:'66',banco:'SANTANDER'},
	{id:'67',banco:'SCOTIA BANK INVERLAT'},
	{id:'68',banco:'SPIRA'},
	{id:'69',banco:'SURESTE'}
];
*/

// Transform to Global Var
_ciudad = app.locals._ciudad;
_banco = app.locals._banco;

// JSON Search
searchInJson = function(obj,searchField, searchVal){
	var results;
	for (var i=0 ; i < obj.length ; i++)
	{
	    if (obj[i][searchField] == searchVal) {
	        results = obj[i];
	    }
	}
	return results;
}

randomInt = function(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

app.use(cookieSession({
    keys: ['secret1']
}));

app.use(passport.initialize());
app.use(passport.session());

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded());

app.use(bodyParser.urlencoded({ extended: true }));

require('./lib/auth');
Auth = require('./lib/authorization');

app.get('/',/*Auth.isAuthenticated,*/function(req,res,net){
	// Get Rol
	db['usuario'].find(1).then(function(item){
		if(item['dataValues']['rol']==2){
			res.render('index',{titulo:'Emethma',myID:1});
		} else {
			res.redirect('/normal');
		}
	});
});

app.get('/normal',/*Auth.isAuthenticated,*/function(req,res,next){
	res.render('normal',{titulo:'Emethma',myID:req.user.id});
});

app.get('/login',function(req,res,net){
	res.render('login',{titulo:'Emethma'});
});

app.get('/logout',function(req,res,next){
	req.logout();
	res.redirect('/login');
});

/*app.post('/login',passport.authenticate('local',{successRedirect:'/', failureRedirect:'/login'}));*/

app.post('/login',function(req,res,net){
	res.redirect('/');
});

app.get('/gojs',function(req,res,net){
	res.render('gojs',{titulo:'Emethma'});
});

app.get('/tree',function(req,res,net){
	res.render('tree',{titulo:'Emethma'});
});

app.get('/api/getEstados',function(req,res,next){
	res.json(app.locals._ciudad);
});

app.get('/api/getBancos',function(req,res,next){
	res.json(app.locals._banco);
});

// API RESTFUL
app.get('/api/test',Auth.masterAuth, function(req,res,next){
	db['usuario'].all().then(function(items){
		res.json(items);
	});
});

app.post('/api/register', function(req,res,next){
	if(req.body){
		db['usuario'].create(req.body).then(function(i){ 
			res.json(i);
		});
	} else{
		res.send('Empty body');
	}
});

app.post('/api/createUser',function(req,res,next){
	delete req.query['createdAt'];
	delete req.query['updatedAt'];
	db['usuario'].find({where:{id:(req.query.id) ? req.query.id : ''}}).then(function(item){
		if(item){
			delete req.query['id'];
			item.update(req.query).then(function(i){
				console.log('QUE PASO');
				console.log(i);
				res.json(i);
			});
		}
		else{
			db['usuario'].create(req.query).then(function(i){
				res.json(i);
			});
		}
	});
});

var getUsers = function(id,callback){
	db['usuario'].all({where:{parentId:id} }).then(function(usuarios){
		callback(usuarios);
	});
};

app.get('/api/getUser',function(req,res,next){
	db['usuario'].find({where:{ id: req.query.id}}).then(function(items){
		res.json(items);
	});
});

var rootUsuario = function(){
  	return fakeData = {
  		id:1,
    	correo:'angel_fargot@hotmail.com',
    	nombres:'Angel',
    	apellidos:'Falkor',
    	password:'12345',
    	f_nacimiento:faker.date.past(),
		ciudad_origen:22,
		estado:'Queretaro',
		telefono:'4422006389',
		calle:faker.address.streetName(),
		colonia:faker.address.streetAddress(),
		no_ext:'22',
		no_int:'',
		cp:'76130',
		rfc:'RFCDGYVgHJJG22',
		curp:'CURPHFYNJB',
		banco:1,
		numeroCuenta:'4444444444',
		numeroTransferencia:'4444444444',
		parentId:null,
		directo_id:null,
		rol:2,
		children:[]
  	};
}

var fakeUsuario = function(id){
  	return fakeData = {
  		id:id,
    	correo:faker.internet.email(),
    	nombres:faker.name.findName(),
    	apellidos:faker.name.lastName(),
    	password:'12345',
    	f_nacimiento:faker.date.past(),
		ciudad_origen:22,
		estado:'Queretaro',
		telefono:faker.phone.phoneNumber(),
		calle:faker.address.streetName(),
		colonia:faker.address.streetAddress(),
		no_ext:'22',
		no_int:'',
		cp:'76138',
		rfc:'RFCDGYVgHJJG22',
		curp:'CURPHFYNJB',
		banco:1,
		numeroCuenta:'4444444444',
		numeroTransferencia:'4444444444',
		parentId:null,
		directo_id:null,
		rol:1,
		children:[]
  	};
}

var truncateUsuario = function(cb){
	var Promise = db.Sequelize.Promise;
	var destruir = [];
	db['usuario'].all().then(function(usuarios){
		if(usuarios){
			usuarios.some(function(usuario){
				destruir.push( usuario.destroy() );
			});
		}
	});
	Promise.all(destruir).done(function(p){
		cb(null);
	});
}; 

app.get('/api/makeRandomUsers',function(req,res,next) {
  var count = 10;
  truncateUsuario(function(){
  		req.logout();
  		var Promise = db.Sequelize.Promise;
		db['usuario'].create(rootUsuario()).then(function(usuario){
			var random = randomInt(1,4);
			var promiseUsuarios = [];
			for (var j = 0; j < random; j++) {
			  var userData = fakeUsuario();
			  userData['directo_id'] = usuario['id'];
			  userData['parentId'] = usuario['id'];
			  if(j>=3){
			    //userData[''];
			  } else {
			    
			  }
			  promiseUsuarios.push(db['usuario'].create(userData));
			}

			Promise.all(promiseUsuarios).done(function(p){
			  	db['usuario'].all({ hierarchy: true}).then(function(items){
					res.json(items);
				});
			});
	  	});
  	});
});

app.get('/api/makeRandomUsersJSON',function(req,res,next) {
	var count = 10;
	var arbol = [];
	arbol.push(rootUsuario());
	randomUsers(arbol,4,0);
	res.json(arbol);
});

var randomUsers = function(arbol,cant,i){
	if(cant>=0){
		var random = randomInt(1,4);
		var ai = 1;
		for (var j = 0; j < random; j++) {
			var userData = fakeUsuario(ai);
			ai++;
			//userData['directo_id'] = usuario['id'];
			//userData['parentId'] = usuario['id'];
			if(j>=2){
			  	arbol[i]['children'][0]['children'].push(userData);
			} else {
			  	arbol[i]['children'].push(userData);
			}
		}
		console.log(cant--);
		randomUsers(arbol,cant--);
	}
};

// Con modulo jerarquico 
app.get('/api/getUsers',function(req,res,next){
	db['usuario'].all({ hierarchy: true, include:[{model:db['usuario'],as:'asignados'},{model:db['usuario'],as:'directos'}] }).then(function(items){
		res.json(items);
	});
});


app.get('/api/searchUsers',function(req,res,next){
	// Saber Rol del usuario
	if(req.user){
		console.log('ROL');
		var rol = req.user['dataValues']['rol'];
		var user_id = req.user['dataValues']['id'];
		// Admin
		if(rol==2){
			db['usuario'].all({ include:[{model:db['usuario'], as:'asignado'}, {model:db['usuario'], as:'directo'}], hierarchy: false}).then(function(items){
				res.json(items);
			});
		}
		if((rol==null) || (rol==0)){
			console.log(user_id);
			db['usuario'].all({ include:[{model:db['usuario'], as:'asignado'}, {model:db['usuario'], as:'directo'}], where:{parentId:user_id}, hierarchy: false}).then(function(items){
				res.json(items);
			});
		}
		
	}
});

app.post('/api/removeUser',function(req,res,next){
	db['usuario'].find({where:{ id:req.query.id}}).then(function(item){ 
		item.destroy().then(function(destroyed){
			res.json(destroyed);
		});
	});
});

// For create ancestor sequelize hierarchy
sequelize.sync();


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});