let obj = {}
obj.action = 'update'
obj.data = {lng: 123, lat: 123}

function checkLocation(obj) {
	send('/location', obj).then(o => {
		console.log("Response", o.success)						
	});
}

async function send(url = '/api', obj = {}) {
	const csrf_token = document.querySelector('meta[name="_token"]').content;
	const res = await fetch(url, {
		method: 'POST',
		// mode: 'cors',
		// credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRF-Token': csrf_token
		},
		body: JSON.stringify(obj)
	});
	return res.json();
}