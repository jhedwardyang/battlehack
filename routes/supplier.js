var SupplierModel = require('../models/SupplierModel.js');
var mongoose = require('mongoose');
var request = require('request');

// log entry
var insert = function(req, res){
	// connect to MongoDB
	if (!mongoose.connection.readyState){
    	mongoose.connect('mongodb://localhost/enjoy');
	}
	var db = mongoose.connection;

	var contactname = req.body.contactname;
	var companyname = req.body.companyname;
	var companyaddress = req.body.companyaddress;
	var phonenumber = req.body.phonenumber;

	companyaddress = companyaddress.replace(" ", "+");
	companyaddress = companyaddress + ",Toronto,Ontario,Canada";

	request('http://ahri.walnutio.com/geocode.php?addr=' + companyaddress, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			body = JSON.parse(body);

			var lat = body.lat;
			var lng = body.lng;
			var addr = body.addr;

			var newSupplier = new SupplierModel({
				contactname: contactname,
				companyname: companyname,
				companyaddress: addr,
				phonenumber: "2267899264",
				lat: lat,
				lng: lng
			});

			newSupplier.save(function (err, result){
				res.writeHead(200, { 'Content-Type': 'application/json' });
				
				if(err){
					console.log(err);
					res.write(JSON.stringify(
						{
							success: false
						}
					));
				} else {
					console.log(result);
					res.write(JSON.stringify(
						{
							success: true
						}
					));
				}

				res.end();
			});
		}
	});
};

 // export functions
 exports.insert = insert;