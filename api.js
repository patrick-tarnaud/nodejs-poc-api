// npm install --save express
// npm install --save body-parser
// npm install --save mangoose
let express = require('express'); 
let bodyParser = require("body-parser"); 
let mongoose = require('mongoose')

/**
 * DB
 */

// création base MongoDB sur mLab
// db : mongodb://<dbuser>:<dbpassword>@ds151012.mlab.com:51012/photosdb

let connectionDb = 

mongoose.connect(connectionDb, { useNewUrlParser: true } )

let db = mongoose.connection
db.on('error', () => {  
		console.log('Erreur lors de la connexion à la base')
})
db.once('open',  () => {
    console.log("Connexion à la base OK"); 
})

let photoSchema = mongoose.Schema( { 
	file: String,
	date: Date,
	localisation: String,
	title: String,
	description: String,
	exif: String,
	keywords: String
})

let Photo = mongoose.model('photo', photoSchema)

/**
 * API
 */

let hostname = 'localhost'; 
let port = 3000; 
let app = express(); 

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let myRouter = express.Router(); 

myRouter.route('/').all(function(req,res){ 
	res.json({message : "Photos API ", methode : req.method});
});

/* GET /photos */
myRouter.route('/photos').get( (req,res) => {
	Photo.find((err, photos) => {
		if (err){
			res.send(err); 
		}
		console.log('Lecture de toutes les photos')
		res.json(photos);
	})
})

/* POST /photos */
myRouter.route('/photos').post( (req,res) => { 
	let photo = new Photo()

	photo.file = req.body.file
	photo.date = req.body.date,
	photo.localisation = req.body.localisation
	photo.title = req.body.title
	photo.description = req.body.description
	photo.exif = req.body.exif
	photo.keywords = req.body.keywords

	photo.save( (err) => {
		if(err) {
			res.send(err)
		}
		res.send('Création de la photo ' + photo.file)
	})

})

/* GET /photos/id */
myRouter.route('/photos/:id')
.get((req,res) => { 
	Photo.findById(req.params.id, (err, photo) => {
		if(err) {
			res.send(err)
		}
		res.json(photo)
		console.log("Lecture de la photo n°" + req.params.id);		
	})
})

/* PUT /photos/id */
myRouter.route('/photos/:id')
.put((req, res) => {
	Photo.findById(req.params.id, (err, photo) => {
		if(err) {
			res.send(err)
		}

		photo.file = req.body.file
		photo.date = req.body.date
		photo.localisation = req.body.localisation
		photo.title = req.body.title
		photo.description = req.body.description
		photo.exif = req.body.exif
		photo.keywords = req.body.keywords

		photo.save(photo, (err) => {
			if(err) {
				res.send(err)
			}
			console.log("Modification photo n°" + req.params.id)
			res.json(photo)
		})
	})
})

/* DELETE /photos/id */
myRouter.route('/photos/:id')
.delete((req, res) => {
	Photo.remove({ _id : req.params.id }, (err) => {
		if (err) {
			res.send(err)
		}
		console.log('Suppression photo n°'+ req.params.id)
		res.send('Suppression de la photo ' + req.params.id)
	})
})

app.use(myRouter);  
 
app.listen(port, hostname, function(){
	console.log("Serveur démarré sur http://"+ hostname +":"+port)
});
 