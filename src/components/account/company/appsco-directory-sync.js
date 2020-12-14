import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-ajax/iron-request.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import '../../components/appsco-loader.js';
import '../../components/appsco-form-error.js';
import '../../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoDirectorySync extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
                position: relative;
            }
            :host paper-dialog {
                width: 670px;
                top: 20vh;
                @apply --appsco-paper-dialog;
            }
            :host paper-dialog-scrollable > * {
                @apply --paper-dialog-scrollable-child;
            }
            :host appsco-loader {
                margin: 0 !important;
                padding: 0 !important;
            }
            :host .buttons paper-button {
                @apply --paper-dialog-button;
            }
            :host .buttons paper-button[dialog-confirm] {
                @apply --paper-dialog-confirm-button;
            }
            :host .buttons paper-button[dialog-dismiss] {
                @apply --paper-dialog-dismiss-button;
            }
            .link {
                color: var(--app-primary-color-dark);
            }
        </style>
        <paper-dialog id="dialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation" on-iron-overlay-closed="_onDialogClosed">

            <div class="header">
                <h2>Sync directory</h2>
            </div>

            <appsco-loader active="[[ _loader ]]" loader-alt="Appsco is syncing directory" multi-color=""></appsco-loader>

            <paper-dialog-scrollable>
                <div class="remove-container">

                    <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>

                    <template is="dom-if" if="[[ _supportLink ]]">
                        <a href="http://support.appsco.com/hc/en-gb" target="_blank" rel="noopener noreferrer" class="link">AppsCo support</a>
                    </template>
                    
                    <p>
                        Once sync is run selected users will trigger an event that will re run the provisioning. <br/>
                        Each rule in provisioning that is setup to track "AppsCoUser" object with "added" event will be affected.
                    </p>
                    <p>Please confirm directory sync.</p>

                </div>
            </paper-dialog-scrollable>

            <div class="buttons">
                <paper-button dialog-dismiss="">Cancel</paper-button>
                <paper-button autofocus="" on-tap="_onDirectorySyncAction">Sync</paper-button>
            </div>
        </paper-dialog>
`;
    }

    static get is() { return 'appsco-directory-sync'; }

    static get properties() {
        return {
            accounts: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            apiErrors: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            _account: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            companyApi: {
                type: String
            },

            _loader: {
                type: Boolean,
                value: false
            },

            _errorMessage: {
                type: String,
                value: ''
            },

            _supportLink: {
                type: Boolean,
                value: false
            }
        };
    }

    toggle() {
        this.$.dialog.open();
    }

    _close() {
        this.$.dialog.close();
    }

    _showLoader() {
        this._loader = true;
    }

    _hideLoader() {
        this._loader = false;
    }

    _showError(message) {
        this._errorMessage = message;
    }

    _hideError() {
        this._errorMessage = '';
        this._hideSupportLink();
    }

    _showSupportLink() {
        this._supportLink = true;
    }

    _hideSupportLink() {
        this._supportLink = false;
    }

    _onDialogClosed() {
        this._hideLoader();
        this._hideError();
        this.set('accounts', []);
    }

    _onDirectorySyncAction() {
        let roles = this.accounts,
            length = roles.length - 1,
            request = document.createElement('iron-request'),
            options = {
                url: this.companyApi + '/integrations/re-run',
                method: 'POST',
                handleAs: 'json',
                headers: this._headers
            },
            body = '';

        this._showLoader();

        for (let i = 0; i <= length; i++) {
            const next = (i === length) ? '' : '&';
            body += 'roles[]=' + encodeURIComponent(roles[i].self) + next;
        }

        options.body = body;

        request.send(options).then(function(request) {
            if (200 === request.status) {
                this.dispatchEvent(new CustomEvent('directory-synced', {
                    bubbles: true,
                    composed: true,
                    detail: body
                }));

                this._close();
            }

        }.bind(this), function() {
            const code = request.response.code;

            1494335470 === code ? this._showSupportLink() : this._hideSupportLink();
            this._showError(this.apiErrors.getError(code));
            this._hideLoader();
        }.bind(this));
    }
}
window.customElements.define(AppscoDirectorySync.is, AppscoDirectorySync);
