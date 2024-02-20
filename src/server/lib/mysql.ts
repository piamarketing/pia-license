import mysql from 'mysql';

const MYSQL_SERVER = '185.61.154.30';
const MYSQL_PORT = 3306;

const USER = 'pagcorlicenses_v2';
const PASSWORD = 'Severus2536**';
const DATABASE = 'pagcorlicenses_v2';

// Test connection
const connection = mysql.createConnection({
	host: MYSQL_SERVER,
	port: MYSQL_PORT,
	user: USER,
	password: PASSWORD,
	database: DATABASE,
});

connection.connect((err) => {
	if (err) {
		console.log(err);
		return;
	}
	console.log('Connected to MySQL');
});

export default connection;
