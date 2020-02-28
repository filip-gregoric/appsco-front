import '@polymer/polymer/polymer-legacy.js';
if (!window.Appsco) {
    window.Appsco = {};
}

Appsco.HeadersMixin = {
    properties: {
        /**
         * Authorization token.
         */
        authorizationToken: {
            type: String
        },

        /**
         * Computed headers.
         * It contains authorization token.
         */
        _headers: {
            type: Object,
            computed: '_computeHeaders(authorizationToken)'
        },

        _authorizationHeaders: {
            type: Object,
            computed: '_computeAuthorizationHeaders(authorizationToken)'
        }
    },
    /**
     * Computes authorization headers.
     *
     * @param {Object} authorizationToken
     * @returns {{ Authorization: string }}
     * @private
     */
    _computeHeaders: function (authorizationToken) {
        return {
            'Authorization': 'token ' + authorizationToken,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    },

    _computeAuthorizationHeaders: function (authorizationToken) {
        return { 'Authorization': 'token ' + authorizationToken };
    }
};
