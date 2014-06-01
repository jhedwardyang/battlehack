var persist = 1;

var test = function(req, res){
	var data = req.body.data;
	console.log(data);

	console.log(persist);
	persist ++;

	res.writeHead(200, { 'Content-Type': 'application/json' });

	res.write(JSON.stringify(
		{
			response: "some_response"
		}
	));

	res.end();
}

exports.test = test;