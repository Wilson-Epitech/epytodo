let loggedUserEmail = '';
let loggedUserId = '';

module.exports = {
  getLoggedUserEmail: () => loggedUserEmail,
  setLoggedUserEmail: (email) => { loggedUserEmail = email; },
  getLoggedUserId: () => loggedUserId,
  setLoggedUserId: (id) => { loggedUserId = id; },
};