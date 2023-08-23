import sha256 from 'sha256'

// For username + password string hash, to keep it secure against rainbow tables.
const SALT = '8wKkBwLYJyjje'

// Hashes the username and password to be able to ensure againt unexpected
// changes in either for any of the separate logins but without storing both in redux.
export default (username, password) => sha256(username + password + SALT) as string
