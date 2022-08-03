'use strict';

const axios = require('axios').default;
const { endpoints } = require("./util/constants");

class API {
    constructor(APIToken = null) {
        if(APIToken !== null) this.token = `Bearer ${APIToken}`;
        else this.token = null;
    }

    /**
     * @private
     */
    async questionsNeeded() {
        if(!this.hasToken) return console.error('No API token passed');

        const data = await axios.get('https://api.mojang.com/user/security/location', {
            headers: {
                Authorization: this.token
            }
        });
        const status = data.status;

        switch (status) {
            case 204:
                return false;
            case 401:
                return null;
            case 403:
                return true;
        }
    }

    /**
     * see if you need to send security answers
     *  - true: needed
     *  - false: not needed
     *  - null: invalid api token
     * @returns {boolean | null}
     */
    get securityQuestionsNeeded() {
        this.questionsNeeded();
    }

    /**
     * @private
     */
    get hasToken() {
        if(this.token == null) return false;
        else return true;
    }

    /**
     * Get the id of a user account from the username
     * @param {string} username The username that you want to get the id of
     * @returns {string} the id and name of the username <returns null if no account>
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
                return {
                    name: null,
                    id: null
                };
            case 400 || 429:
                throw new Error(`${d.error}: ${d.errorMessage}`);
        }
    }

    /**
     * Get the data from an account
     * @param {string} id the account id
     * @returns {import('../typings').profile} data from the account
     */
    async UUIDtoProfile(id) {
        if(id.includes('-')) id.split('-').join('');
        const url = `https://sessionserver.mojang.com/${endpoints.UUIDtoProfile(id)}`;
        const data = await axios.get(url);
        const status = data.status;
        const d = data.data;

        switch(status) {
            case 200:
                var buff = Buffer.from(d.properties[0].value, 'base64');
                return JSON.parse(buff.toString('utf8'));
            case 204:
                return null;
            case 400 || 429:
                throw new Error(`${d.error}: ${d.errorMessage}`);
        }
    }

    /**
     * Get the name history of an account
     * @param {string} id the account id
     * @returns {Array<import('../typings').history>} an array of names
     */
    async nameHistory(id) {
        if(id.includes('-')) id.split('-').join('');
        const url = `https://api.mojang.com/${endpoints.usernameHistory(id)}`;
        const data = await axios.get(url);
        const status = data.status;
        const d = data.data;

        switch(status) {
            case 200:
                return d;
            case 204:
                return null;
            case 400 || 429:
                throw new Error(`${d.error}: ${d.errorMessage}`);
        }
    }

    /**
     * Get the security questions for the account
     * @returns {Array<import('../typings').securityQuestions>} an array of questions
     */
    async getSecurityQuestions() {
        if(!this.hasToken) return console.error('No API token passed');
        const data = await axios.get('https://api.mojang.com/user/security/challenges', {
            headers: {
                Authorization: this.token
            }
        });
        const status = data.status;
        const d = data.data;

        switch (status) {
            case 200:
                return d;
            case 401:
                throw new Error(`${d.error}: ${d.errorMessage}`);
        }
    }

    /**
     * Send security questions to authorize the locations / IP address
     * @param {import('../typings').Arr3<import('../typings').postSecurityQuestions>} ans An array of answers
     * @returns {void}
     */
     async sendSecurityQuestions(ans) {
        if(!this.hasToken) return console.error('No API token passed');
        if(!Array.isArray(ans)) throw new Error('Answers not in an array of objects');
        const data = await axios.post('https://api.mojang.com/user/security/location', ans, {
            headers: {
                Authorization: this.token
            }
        });
        const status = data.status;
        const d = data?.data;

        switch (status) {
            case 204:
                return true;
            default:
                throw new Error(`${d.error}: ${d.errorMessage}`);
        }
    }
}

module.exports = API;