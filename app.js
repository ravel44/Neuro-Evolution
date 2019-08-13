const express = require('express');
const app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public")); // for the static files

app.get('/', (req, res) =>{
	res.render('play');
});

//---------------------------------------------------------------------------------------------------------------------------------------
app.listen(process.env.PORT || 3000, process.env.IP, ()=>{
	console.log("server listening on port 3000");
}); 
