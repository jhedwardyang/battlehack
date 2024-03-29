var SupplierModel = require('../models/SupplierModel.js');
var DistributorModel = require('../models/DistributorModel.js');

var mongoose = require('mongoose');

var cluster = function(req, res){
	// connect to MongoDB
	if (!mongoose.connection.readyState){
    	mongoose.connect('mongodb://localhost/enjoy');
	}
	var db = mongoose.connection;

	DistributorModel.find( {} ).exec(function(err, t) {
		if(err) {
			console.log(err);
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.write(JSON.stringify(
				{
					success: false
				}
			));
			res.end();
			return;
		}

		var distributors = [];

		for(var i = 0; i < t.length; i++) {
			var temp = {};
			temp['name'] = t[i].companyname;
			temp['lat'] = t[i].lat;
			temp['lng'] = t[i].lng;
			temp['addr'] = t[i].companyaddress;

			distributors.push(temp);
		}

		SupplierModel.find( { active: true } ).exec(function(err, t) {
			if(err) {
				console.log(err);
				res.writeHead(200, { 'Content-Type': 'application/json' });
				res.write(JSON.stringify(
					{
						success: false
					}
				));
				res.end();
				return;
			}

			var activeSuppliers = [];

			for(var i = 0; i < t.length; i++) {
				var temp = {};
				temp['name'] = t[i].companyname;
				temp['lat'] = t[i].lat;
				temp['lng'] = t[i].lng;
				temp['addr'] = t[i].companyaddress;

				activeSuppliers.push(temp);
			}

			SupplierModel.find( { active: false } ).exec(function(err, t) {
				if(err) {
					console.log(err);
					res.writeHead(200, { 'Content-Type': 'application/json' });
					res.write(JSON.stringify(
						{
							success: false
						}
					));
					res.end();
					return;
				}

				var inactiveSuppliers = [];

				for(var i = 0; i < t.length; i++) {
					var temp = {};
					temp['name'] = t[i].companyname;
					temp['lat'] = t[i].lat;
					temp['lng'] = t[i].lng;
					temp['addr'] = t[i].companyaddress;

					inactiveSuppliers.push(temp);
				}

				var clusters = buildClusters(distributors, activeSuppliers, inactiveSuppliers);
				res.writeHead(200, { 'Content-Type': 'application/json' });
				res.write(JSON.stringify(
					clusters
				));

				var orderedCluster = orderCluster(cluster);

				res.end();
			});
		});
	});	
}

var buildClusters = function(dist, supp, inactive) {
	var clusters = {};

	clusters['banks'] = [];
	for (var i = 0; i < dist.length; i++) {
		clusters['banks'].push(dist[i]);
	}

	clusters['locations'] = {};
	clusters['locations']['routes'] = [];
	for (var i = 0; i < dist.length; i++){
		clusters['locations']['routes'][i] = [];
	}
	for (var i = 0; i < supp.length; i++) {
		var minDist = 999999999;
		var minInd = -1;
		
		for(var j = 0; j < dist.length; j++) {
			var cur = findDist(dist[j]['lat'], dist[j]['lng'], supp[i]['lat'], supp[i]['lng']);
			if(minDist > cur) {
				minDist = cur;
				minInd = j;
			}
		}

		clusters['locations']['routes'][minInd].push(supp[i]);
	}

	clusters['locations']['inactive'] = inactive;

	return clusters;
};

var orderCluster = function(orig) {
	for (var i = 0; i < orig['banks'].length; i++) {
		var set = orig['locations']['routes'][i];
		var chosenSet = [];
		var cur = orig['banks'][i];

		for (var j = 0; j < set.length; j++){
			var minInd = -1;
			var minVal = 999999999;

			for(var k = 0; k < set.length; k++){
				if(chosenSet.indexOf(k) >= 0) continue;

				if(minVal > findDist(set[k]['lat'], set[k]['lng'], cur['lat'], cur['lng'])) {
					minInd = k;
					minVal = findDist(set[k]['lat'], set[k]['lng'], cur['lat'], cur['lng']);
				}
			}

			for(var k = 0; k < set.length; k++){
				if(chosenSet.indexOf(k) >= 0) continue;

				var tolerance = 2;
				var base = findDist(set[minInd]['lat'], set[minInd]['lng'], cur['lat'], cur['lng']);

				var area = Math.abs(findArea(cur['lat'], cur['lng'], set[minInd]['lat'], set[minInd]['lng'], set[k]['lat'], set[k]['lng']));

				if(area > (base * base * tolerance)) minInd = k;
			}

			chosenSet.push(minInd);
			cur = set[minInd];
		}
	}
}


var findDist = function(x, y, xx, yy) {
	return Math.sqrt(((x - xx) * (x - xx)) + ((y - yy) * (y - yy)));
}

// technically 2 x area
var findArea = function(x, y, xx, yy, xxx, yyy) {
	return (x * yy) +
		   (xxx * y) +
		   (xx * yyy) -
		   (xxx * yy) -
		   (xx * y) -
		   (x * yyy);
}

exports.cluster = cluster;