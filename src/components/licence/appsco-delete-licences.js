import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-ajax/iron-request.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import '../components/appsco-loader.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoDeleteLicences extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
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
            :host .buttons paper-button {
                @apply --paper-dialog-button;
            }
            :host .buttons paper-button[dialog-confirm] {
                @apply --paper-dialog-confirm-button;
            }
            :host .buttons paper-button[dialog-dismiss] {
                @apply --paper-dialog-dismiss-button;
            }
        </style>
        <paper-dialog id="dialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation">

            <div class="header">
                <h2>Delete licences</h2>
            </div>

            <paper-dialog-scrollable>
                <div class="remove-container">

                    <appsco-loader active="[[ _loader ]]" loader-alt="Appsco is processing request" multi-color=""></appsco-loader>

                    <p>Please confirm deleting of selected licences.</p>

                </div>
            </paper-dialog-scrollable>

            <div class="buttons">
                <paper-button dialog-dismiss="">Cancel</paper-button>
                <paper-button dialog-confirm="" autofocus="" on-tap="_onDeleteAction">Delete</paper-button>
            </div>
        </paper-dialog>
`;
    }

    static get is() { return 'appsco-delete-licences'; }

    static get properties() {
        return {
            licences: {
                type: Array
            },

            companyLicencesApi: {
                type: String
            },

            _loader: {
                type: Boolean,
                value: false
            }
        };
    }

    toggle() {
        this.$.dialog.toggle();
    }

    setLicences(licences) {
        this.licences = licences;
    }

    _onDeleteAction() {
        const appRequest = document.createElement('iron-request');
        const options = {
                url: this.companyLicencesApi,
                method: 'DELETE',
                handleAs: 'json',
                headers: this._headers,
                body: this.licences.map((item) => 'licences[]=' + item.id).join('&')
            };
        this._loader = true;

        appRequest.send(options).then(function(request) {
            this.$.dialog.close();

            if (200 === request.status) {
                this.dispatchEvent(new CustomEvent('licences-removed', {
                    bubbles: true,
                    composed: true,
                    detail: {
                        groups: request.response.licences
                    }
                }));
            }
            else {
                this.dispatchEvent(new CustomEvent('licences-remove-failed', { bubbles: true, composed: true }));
            }

            this.set('licences', []);
            this._loader = false;
        }.bind(this));
    }
}
window.customElements.define(AppscoDeleteLicences.is, AppscoDeleteLicences);
