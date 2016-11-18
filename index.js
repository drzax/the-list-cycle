const tlm = require('twitter-list-manager');

const list = process.env.TWITTER_LIST || 'cycle';

var newMembers = tlm.correspondents(process.env.TWITTER_WINDOW || '1-month');
var oldMembers = tlm.listMembers(list);

Promise.all([newMembers, oldMembers]).then(([newMembers, oldMembers]) => {
		
	var adding, removing, keeping;
	
	adding = newMembers.filter(name => oldMembers.indexOf(name) === -1);
	removing = oldMembers.filter(name => newMembers.indexOf(name) === -1);
	keeping = oldMembers.filter(name => newMembers.indexOf(name) > -1);
	
	if (removing.length) {
		tlm.listRemove(list, removing).then(()=>console.log(`Removed: ${removing.join(', ')}`), err);
	} else {
		console.log('Nothing to remove.');
	}
	
	if (adding.length) {
		tlm.listAdd(list, adding).then(()=>console.log(`Added: ${adding.join(', ')}`), err);
	} else {
		console.log('Nothing to add.');
	}
	
	
}, err);

function err(err) {
	console.error(err);
}