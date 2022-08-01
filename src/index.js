const axios = require('axios').default;
const { endpoints } = require("./util/constants");

class API {
    constructor(APIToken = null) {
        if(APIToken !== null) this.token = `Bearer ${APIToken}`;
        else this.token = null;
    }

    /**
     * Get the id of a user account from the username
     * @param {string} username The username that you want to get the id of
     * @returns {string} the id of the username <returns null if no account>
     * @example api.usernameToUUID("Dream");
     */
    async usernameToUUID(username) {
        const url = `https://api.mojang.com/${endpoints.usernameToUUID(username)}`
        const data = await axios.get(url);
        const status = data.status;
        const d = data.data;

        switch (status) {
            case 200:
                return d.id;
            case 204:
                return null;
            case 400 || 429:
                throw new Error(`${d.error}: ${d.errorMessage}`);
        }
    }
}

module.exports = API;