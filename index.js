const correspondents = require("./lib/correspondents");
const listAdd = require("./lib/list-add");
const listRemove = require("./lib/list-remove");
const listMembers = require("./lib/list-members");
const list = process.env.TWITTER_LIST || "cycle";

var newMembers = correspondents(process.env.TWITTER_WINDOW || "1-month");
var oldMembers = listMembers(list);

Promise.all([newMembers, oldMembers]).then(([newMembers, oldMembers]) => {
  const adding = newMembers.filter(name => oldMembers.indexOf(name) === -1);
  const removing = oldMembers.filter(name => newMembers.indexOf(name) === -1);
  // const keeping = oldMembers.filter(name => newMembers.indexOf(name) > -1);

  if (removing.length) {
    listRemove(list, removing).then(
      () => console.log(`Removed: ${removing.join(", ")}`),
      err
    );
  } else {
    console.log("Nothing to remove.");
  }

  if (adding.length) {
    listAdd(list, adding).then(
      () => console.log(`Added: ${adding.join(", ")}`),
      err
    );
  } else {
    console.log("Nothing to add.");
  }
}, err);

function err(err) {
  console.error(err);
}
