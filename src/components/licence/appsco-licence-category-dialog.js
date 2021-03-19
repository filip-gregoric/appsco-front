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

class AppscoLicenceCategoryDialog extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
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
                        <form method="POST" action="[[ _licenceCategoryApi ]]">
                            <div class="input-container">
                                <paper-input
                                    id="name"
                                    data-field=""
                                    label="Name"
                                    name\$="[[ _formNamePrefix ]][name]"
                                    value="[[ category.name ]]">
                                </paper-input>
                            </div>

                            <div class="input-container">
                                <paper-input
                                    id="productKeys"
                                    data-field=""
                                    label="Product Keys (comma separated)"
                                    name\$="[[ _formNamePrefix ]][productKeys]"
                                    value="[[ productKeys ]]">
                                </paper-input>
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

    static get is() { return 'appsco-licence-category-dialog'; }

    static get properties() {
        return {
            category: {
                type: Object
            },

            productKeys: {
                type: String,
                computed: '_computeProductKeys(category)'
            },

            companyLicenceCategoriesApi: {
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
                value: 'licence_category'
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

            _licenceCategoryApi: {
                type: String,
                computed: 'computeLicenceCategoryApi(category, companyLicenceCategoriesApi)'
            },

            _formSaveButtonText: {
                type: String,
                computed: 'computeFormSaveButtonText(category)'
            },

            _title: {
                type: String,
                computed: 'computeTitle(category)'
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

    setCategory(category) {
        this.category = null;
        this.category = category;
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
        this.$.name.focus();
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
        this.$.form.request.method = this.category ? 'PATCH' : 'POST';
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

    computeLicenceCategoryApi(category, companyLicenceCategoriesApi) {
        if(!companyLicenceCategoriesApi) {
            return null;
        }
        return category ? companyLicenceCategoriesApi + '/' + category.id : companyLicenceCategoriesApi;
    }

    _computeProductKeys(category) {
        if(!category || !category.product_keys) {
            return '';
        }

        return category.product_keys.join(',');
    }

    computeTitle(category) {
        return category ? 'Modify category' : 'Add category';
    }

    computeFormSaveButtonText(category) {
        return category ? 'Save' : 'Add';
    }

    _onFormResponse(event) {
        this.close();
        const eventName = this.category ? 'category-modified' : 'category-added';
        this.dispatchEvent(
            new CustomEvent(eventName, {
                bubbles: true,
                composed: true,
                detail: {
                    category: event.detail.response
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
window.customElements.define(AppscoLicenceCategoryDialog.is, AppscoLicenceCategoryDialog);
