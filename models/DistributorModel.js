var mongoose	=	require('mongoose'),
	Schema 		=	mongoose.Schema,
	ObjectId	=	Schema.ObjectId;

var DistributorSchema = new Schema({
	id        			: ObjectId,
	contactname      	: { type: String, required: true, trim: true },
	companyname      	: { type: String, required: true, trim: true },
	companyaddress     	: { type: String, required: true, trim: true },
	phonenumber      	: { type: String, required: true, trim: true },
	lat	 				: { type: Number, required: true },
	lng	 				: { type: Number, required: true },
	active				: { type: Boolean, default: true },
	created_on  		: { type : Date, default : Date.now },
	updated_on  		: { type : Date, default : Date.now }
});	

module.exports = mongoose.model('Distributor', DistributorSchema);
