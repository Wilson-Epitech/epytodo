let loggedUserEmail = '';

module.exports = {
  getLoggedUserEmail: () => loggedUserEmail,
  setLoggedUserEmail: (email) => { loggedUserEmail = email; }
};