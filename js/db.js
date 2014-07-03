var db = window.openDatabase("CandyDB", "1","My candy store database",1024);

function initDatabase() {							 
	db.transaction(function (tx) {  
	   tx.executeSql('CREATE TABLE IF NOT EXISTS GLOBALS (id unique, key, value)');
	   tx.executeSql('CREATE TABLE IF NOT EXISTS LEVEL (id unique, number, seconds, points, difficulty)');
	   // TODO Mirar a ver si la base de datos está creada o no y rellenarla con los datos
	   tx.executeSql('INSERT INTO GLOBALS (id, key, value) VALUES (1, "level", 1)'); 
	   tx.executeSql('INSERT INTO GLOBALS (id, key, value) VALUES (2, "language", "es")'); 
	   tx.executeSql('INSERT INTO LEVEL (id, number, seconds, points, difficulty) VALUES (1, 1, 60, 100, 1)'); 
	   tx.executeSql('INSERT INTO LEVEL (id, number, seconds, points, difficulty) VALUES (2, 2, 30, 200, 1)'); 
	   tx.executeSql('INSERT INTO LEVEL (id, number, seconds, points, difficulty) VALUES (3, 3, 20, 300, 1)'); 
	   tx.executeSql('INSERT INTO LEVEL (id, number, seconds, points, difficulty) VALUES (4, 4, 15, 400, 1)'); 
	   // User, password, etc
	   
	});
}

function getGlobalValue(key, callbackFunction) {	
	db.readTransaction(function(tx) {
		tx.executeSql("SELECT value FROM GLOBALS WHERE key = ?", [key] ,
			function(tx, results) {					
				callbackFunction(results.rows.item(0).value);
			}, function (tx, e) {
				console.log(e.message);
			}
		);
	});
}

function dbGetLevelInfo(level, callbackFunction) {	
	db.readTransaction(function(tx) {
		tx.executeSql("SELECT * FROM LEVEL WHERE number = ?", [level] ,
			function(tx, results) {					
				callbackFunction(results.rows.item(0));
			}, function (tx, e) {
				console.log(e.message);
			}
		);
	});
}

function updateGlobalValue(key, value, callbackFunction) {
	db.transaction(function(tx) {
		tx.executeSql("UPDATE GLOBALS set value = ? WHERE key = ?", [value, key] ,
			function(tx, results) {					
				callbackFunction();
			}, function (tx, e) {
				console.log(e.message);
			}
		);
	});
}