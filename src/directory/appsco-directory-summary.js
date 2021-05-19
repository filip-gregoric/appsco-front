import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-styles/typography.js';
import '../components/components/appsco-loader.js';
import '../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoDirectorySummary extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                position: relative;
            }
            ul {
                list-style: none;
                margin: 0;
                padding-left: 0.5rem;
            }
            .invisible {
                visibility: hidden;
            }
            li {
                font-size: 13px;
            }
            paper-progress {
                width: 100%;
            }
        </style>

        <iron-ajax
            id="summaryRequest"
            url="[[ directorySummaryApi ]]"
            headers="[[ _headers ]]"
            auto=""
            on-error="_onSummaryRequestError"
            on-response="_onSummaryRequestResponse">
        </iron-ajax>
        <appsco-loader active\$="[[ _loading ]]" loader-alt="Appsco is loading directory summary" multi-color=""></appsco-loader>
        
        <ul class\$="[[ _listClass ]]">
            <li>Users: [[ userCount ]]</li>
            <li>Invitations: [[ invitationCount ]]</li>
        </ul>
`;
    }

    static get is() { return 'appsco-directory-summary'; }

    static get properties() {
        return {
            userCount: {
                type: Number
            },

            invitationCount: {
                type: Number
            },

            directorySummaryApi: {
                type: String
            },

            _loading: {
                type: Boolean,
                value: true
            },

            _listClass: {
                type: String,
                computed: '_computeListClass(_loading)'
            }
        };
    }

    reload() {
        this._loading = true;
        this.shadowRoot.getElementById('summaryRequest').generateRequest();
    }

    addInvitationCount(number) {
        this.invitationCount += number;
    }

    removeInvitationCount(number) {
        this.invitationCount -= number;

        if (this.invitationCount < 0) {
            this.invitationCount = 0;
        }
    }

    addUserCount(number) {
        this.userCount += number;
    }

    removeUserCount(number) {
        this.userCount -= number;

        if (this.userCount < 0) {
            this.userCount = 0;
        }
    }

    _onSummaryRequestError() {
        this.userCount = 0;
        this.invitationCount = 0;

        this._loading = false;
    }

    _onSummaryRequestResponse(event) {
        const response = event.detail.response;

        this.userCount = (response && response.user_count) ? response.user_count : 0;
        this.invitationCount = (response && response.invitation_count) ? response.invitation_count : 0;

        this._loading = false;
    }

    _computeListClass(loading) {
        return loading ? 'invisible' : '';
    }
}
window.customElements.define(AppscoDirectorySummary.is, AppscoDirectorySummary);
