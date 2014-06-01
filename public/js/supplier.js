$(document).ready(function(){
	$("#submit").click(function(){
		console.log("clicked");
		var contactname = $("#contactname").val();
		var companyname = $("#companyname").val();
		var companyaddress = $("#companyaddress").val();
		var phonenumber = $("#phonenumber").val();

		ajaxPOST("../supplier/new",
				 {
				 	contactname: contactname,
				 	companyname: companyname,
				 	companyaddress: companyaddress,
				 	phonenumber: phonenumber
				 },
				 function(res) { console.log(res); },
				 function(err) { console.log(err); },
				 function() {});
	});	
});