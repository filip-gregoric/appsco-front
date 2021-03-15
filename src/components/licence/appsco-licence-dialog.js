import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '../components/appsco-loader.js';
import '../components/appsco-form-error.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoLicenceDialog extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
                position: relative;
            }
            :host paper-dialog {
                width: 670px;
                top: 120px;
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
            :host .buttons paper-button[dialog-dismiss] {
                @apply --paper-dialog-dismiss-button;
            }

        </style>

        <paper-dialog id="dialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation" on-iron-overlay-opened="_onDialogOpened" on-iron-overlay-closed="_onDialogClosed">

            <h2>[[ _title ]]</h2>

            <appsco-loader active="[[ _loader ]]" loader-alt="Appsco is processing request" multi-color=""></appsco-loader>

            <paper-dialog-scrollable>
                <div class="dialog-container">

                    <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>
                    
                    <iron-form id="form" headers="[[ _headers ]]" on-iron-form-error="_onFormError" on-iron-form-presubmit="_onFormPresubmit" on-iron-form-response="_onFormResponse">
                        <form method="POST" action="[[ _licenceApi ]]">
                            <div class="input-container">
                                <paper-input
                                        id="productName"
                                        data-field=""
                                        label="Product name"
                                        name\$="[[ _formNamePrefix ]][productName]"
                                        value="[[ licence.product_name ]]">
                                </paper-input>
                            </div>

                            <div class="input-container">
                                <paper-input
                                        id="productKey"
                                        data-field=""
                                        label="Product key"
                                        name\$="[[ _formNamePrefix ]][productName]"
                                        value="[[ licence.product_key ]]">
                                </paper-input>
                            </div>

                            <div class="input-container">
                                <paper-textarea
                                        id="licenceKey"
                                        data-field=""
                                        label="Licence key"
                                        value="[[ licence.licence_key ]]"
                                        name\$="[[ _formNamePrefix ]][licenceKey]">
                                </paper-textarea>
                            </div>

                            <div class="input-container">
                                <paper-input
                                        id="publisher"
                                        data-field=""
                                        name\$="[[ _formNamePrefix ]][publisher]"
                                        label="Publisher"
                                        value="[[ licence.publisher ]]">
                                </paper-input>
                            </div>

                            <div class="input-container">
                                <paper-input
                                        id="supportEmail"
                                        type="email"
                                        data-field=""
                                        name\$="[[ _formNamePrefix ]][supportEmail]"
                                        label="Support email"
                                        value="[[ licence.support_email ]]"
                                        auto-validate=""
                                        error-message="Please type in correct email.">
                                </paper-input>                            <appsco-licence-form-fields></appsco-licence-form-fields>
                            </div>

                            <div class="input-container">
                                <paper-input
                                        id="website"
                                        data-field=""
                                        name\$="[[ _formNamePrefix ]][website]"
                                        pattern="https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&amp;//=]*)"
                                        error-message="Invalid Url"
                                        auto-validate=""
                                        label="Website"
                                        value="[[ licence.website ]]">
                                </paper-input>
                            </div>

                            <div class="input-container">
                                <paper-input
                                        id="numberOfLicences"
                                        data-field=""
                                        name\$="[[ _formNamePrefix ]][numberOfLicences]"
                                        label="Number of licences"
                                        value="[[ licence.number_of_licences ]]"
                                        auto-validate=""
                                        pattern="[0-9]*"
                                        error-message="Digits only!">
                                </paper-input>
                            </div>

                            <div class="input-container date-container">
                                <vaadin-date-picker
                                        id="licenceExpirationDate"
                                        data-field=""
                                        label="Licence expiration date"
                                        value="[[ formatDate(licence.licence_expiration_date) ]]"
                                        name\$="[[ _formNamePrefix ]][licenceExpirationDate]">
                                </vaadin-date-picker>
                            </div>

                            <div class="input-container">
                                <paper-textarea
                                        id="note"
                                        rows="3"
                                        data-field=""
                                        label="Note"
                                        value="[[ licence.note ]]"
                                        name\$="[[ _formNamePrefix ]][note]">
                                </paper-textarea>
                            </div>
                        </form>
                    </iron-form>
                </div>
            </paper-dialog-scrollable>

            <div class="buttons">
                <paper-button dialog-dismiss="">Cancel</paper-button>
                <paper-button autofocus="" on-tap="_submitForm">[[ _formSaveButtonText ]]</paper-button>
            </div>
        </paper-dialog>

        <iron-a11y-keys target="[[ _target ]]" keys="enter" on-keys-pressed="_onEnter">
        </iron-a11y-keys>
`;
    }

    static get is() { return 'appsco-licence-dialog'; }

    static get properties() {
        return {
            licence: {
                type: Object
            },

            companyLicencesApi: {
                type: String
            },

            apiErrors: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            _formNamePrefix: {
                type: String,
                value: 'licence'
            },

            _loader: {
                type: Boolean,
                value: false
            },

            _errorMessage: {
                type: String
            },

            _target: {
                type: Object
            },

            _licenceApi: {
                type: String,
                computed: 'computeLicenceApi(licence, companyLicencesApi)'
            },

            _formSaveButtonText: {
                type: String,
                computed: 'computeFormSaveButtonText(licence)'
            },

            _title: {
                type: String,
                computed: 'computeTitle(licence)'
            }
        };
    }

    ready() {
        super.ready();

        this._target = this.shadowRoot.getElementById('form');
    }

    open() {
        this.$.dialog.open();
    }

    close() {
        this.$.dialog.close();
    }

    toggle() {
        this.$.dialog.toggle();
    }

    setLicence(licence) {
        this.licence = licence;
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
    }

    _onDialogOpened() {
        this.$.productName.focus();
    }

    _onDialogClosed() {
        this._hideLoader();
        this._hideError();
        this._target.reset();
    }

    _onEnter() {
        this._submitForm();
    }

    _onFormPresubmit() {
        this.$.form.request.method = this.licence ? 'PATCH' : 'POST';
    }

    _submitForm() {
        this._hideError();

        if (!this._target.validate()) {
            return;
        }
        this._showLoader();
        this._target.submit();
    }



    _onFormError(event) {
        this._showError(this.apiErrors.getError(event.detail.request.response.code));
        this._hideLoader();
    }

    computeLicenceApi(licence, companyLicencesApi) {
        if(!companyLicencesApi) {
            return null;
        }
        return licence ? companyLicencesApi + '/' + licence.id : companyLicencesApi;
    }

    computeTitle(licence) {
        return licence ? 'Modify licence' : 'Add licence';
    }

    computeFormSaveButtonText(licence) {
        return licence ? 'Save' : 'Add';
    }

    _onFormResponse(event) {
        this.close();
        const eventName = this.licence ? 'licence-modified' : 'licence-added';
        this.dispatchEvent(
            new CustomEvent(eventName, {
                bubbles: true,
                composed: true,
                detail: {
                    licence: event.detail.response
                }
            })
        );
    }

    formatDate(dateString) {
        if(!dateString) {
            return null;
        }
        return dateString.split('T')[0]
    }
}
window.customElements.define(AppscoLicenceDialog.is, AppscoLicenceDialog);
