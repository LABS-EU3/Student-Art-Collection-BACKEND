const server = require("./api/routes/index")

const db = require('./config/db');


const Port = process.env.PORT || 4000


// eslint-disable-next-line no-console
db()
	.then(() => {
		console.log('database is connected')
	})
	.catch((err) => {
		console.log(err);
	});



server.listen(Port, () => console.log(`Server running on port ${Port}`));
