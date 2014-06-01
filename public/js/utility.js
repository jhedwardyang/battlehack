var ajaxGET = function(dest, data, onDone, onFail, onAlways){
	$.ajax({
		type: "GET",
		url: dest,
		data: data
	})
	.done(onDone)
	.fail(onFail)
	.always(onAlways);
};

var ajaxPOST = function(dest, data, onDone, onFail, onAlways){
	$.ajax({
		type: "POST",
		url: dest,
		data: data
	})
	.done(onDone)
	.fail(onFail)
	.always(onAlways);
};