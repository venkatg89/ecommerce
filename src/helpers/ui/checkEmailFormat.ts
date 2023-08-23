/* From: https://emailregex.com */

/* eslint-disable max-len */
/* eslint-disable no-useless-escape */
// Since regex is staight form this source - we don't wish to change it in any way.
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
/* eslint-disable no-useless-escape */
/* eslint-enable max-len */

export default string => EMAIL_REGEX.test(string)
