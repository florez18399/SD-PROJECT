const MongoClient = require('mongodb').MongoClient;
//-----------------------------------------------
//const url = 'mongodb://mongo:27017';
const url = 'mongodb://locahost:27017'
//const url = process.env.MONGO_HOST;
const dbName = 'project1'
//const dbName = process.env.DB_MONGO_NAME;

function connectDb(cb) {
    MongoClient.connect(url, function (err, client) {
        if (err) {
            throw new Error('Fallo al conectar con base de datos')
        } else {
            console.log("Connected successfully to server");
            //const db = client.db(dbName);
            cb(client);
        }
    });
}

module.exports = {
    insertDocuments : (nameCollection, document, callback) => {
        console.log('Insertando documentos...')
        connectDb((client) => {
            const db = client.db(dbName);
            const collection = db.collection(nameCollection);
            // Insert some documents
            collection.insertOne(document, function (err, result) {
                console.log("Inserted 1 document into the collection");
                callback(err, result);
                client.close();
            });
        })
    },
    findDocuments :  (nameCollection, callback) => {
        console.log('Buscando documentos...')
        connectDb((client) => {
            const db = client.db(dbName);
            const collection = db.collection(nameCollection);
            // Insert some documents
            collection.find({}).toArray(function (err, docs) {
                callback(err, docs);
                client.close();
            });
        })        
    }, 
    findGroupByCity : (callback) => {
        console.log('Buscando documentos agrupados por ciudad');
        connectDb((client) => {
            const db = client.db(dbName);
            const collection = db.collection('contagions');
            collection.aggregate( 
                [
                  { 
                      '$group': { 
                        '_id': "$city", 
                        'contagiados': { '$sum': 1 },
                        'entry': {  
                            '$push': {  
                                'name': '$name', 
                                'date': '$date_contagion' 
                            }
                        } 
                    }		
                  }
                ], function(err, cursor) {
                    cursor.toArray(function(err, documents) {
                        console.log(documents)
                        callback(err, documents);
                      });
                  }
        )})    
    }
}
/**
    db.contagions.aggregate([{ $group: { _id: '$city' , count: {$sum:1}, entry: {  $push: {  name: '$name',    date: '$date_contagion' } } } } ])
*/