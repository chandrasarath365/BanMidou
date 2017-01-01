express = require('express');
https = require('https'),  
request = require('request');
var app = express();
port = Number(process.env.PORT || 5000);
var city,text,temp,temperature;
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
var speech;
ddg = require('ddg');
options = {
        "useragent": "My duckduckgo app",
        "no_redirects": "1",
        "no_html": "0",
}

app.post('/webhook', function (req, res) {
if(req.body.result.action == "weather"){
	console.log("weather request");
	weather(req,res);
	console.log("hello");
}
else if(req.body.result.action == "duck"){
	console.log("in ddg");
	str = req.body.result.resolvedQuery;
	console.log(str);	
	if(str.includes("tell me about "))
		str = str.replace("tell me about","");
	console.log(str);
	ddg.query(str, options, function(err, data){
	console.log("yea ... ");
   	console.log(data.AbstractText);
	link = "\n\nfor more info refer : \n\n" + data.AbstractURL;
	if(data.AbstractText!="")
	sendMessage(data.AbstractText + link,res);
	else 
	sendMessage("no info available",res);
	
});
} 

});

function weather(req,res){
	baseurl = "api.openweathermap.org/data/2.5/weather?q=";
	city = req.body.result.parameters["geo-city"];
	if(city == null)
		return ;
	else{
	urlQuery = baseurl+city+"&units=metric&appid=2a50a876284147f4c8e58ae96e610bc6";
	request({
	    url: urlQuery,
	    json: true
	}, function (error, response, body) {
	console.log("error");
	console.log(urlQuery);
    	if (!error && response.statusCode === 200)
	 {
		console.log("just kidding");
		if(body.query.results!=null){ 
			city = body['name'];
			text = body.weather.description;
			temp = body.main.temp;
			temperature =  "degrees celcius";
			speech1 = "Today in " + city + ": " + text + ", the temperature is " + temp + " " + temperature;
			console.log(speech);	
			sendMessage(speech1,res);	
   	        }
	}
	});
	}	
}
function sendMessage(text,res){
	res.writeHead(200, {"Content-Type": "application/json"});
	var json = JSON.stringify({ 
	speech : text, 
        displayText : text, 
        source : "item"
  	});
   	res.end(json);		
	console.log("chik chika");	 
}
app.listen(port);
