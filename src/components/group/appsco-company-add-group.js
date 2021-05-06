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

class AppscoCompanyAddGroup extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
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

            <h2>Create group</h2>

            <appsco-loader active="[[ _loader ]]" loader-alt="Appsco is processing request" multi-color=""></appsco-loader>

            <paper-dialog-scrollable>
                <div class="dialog-container">

                    <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>

                    <p>
                        Enter the group name and click "ADD" to create it.
                    </p>

                    <iron-form id="form" headers="[[ _headers ]]" on-iron-form-error="_onFormError" on-iron-form-response="_onFormResponse">
                        <form method="POST" action="[[ companyGroupsApi ]]">
                            <div class="input-container">
                                <paper-input id="groupName" label="New group name" name="company_group[name]" required="" auto-validate="" error-message="Please enter group name."></paper-input>
                            </div>
                            <div class="input-container">
                                <paper-input id="groupDescription" label="New group description" name="company_group[description]" auto-validate="" error-message="Please enter group description."></paper-input>
                            </div>
                        </form>
                    </iron-form>
                </div>
            </paper-dialog-scrollable>

            <div class="buttons">
                <paper-button dialog-dismiss="">Cancel</paper-button>
                <paper-button autofocus="" on-tap="_submitForm">Add</paper-button>
            </div>
        </paper-dialog>

        <iron-a11y-keys target="[[ _target ]]" keys="enter" on-keys-pressed="_onEnter">
        </iron-a11y-keys>
`;
    }

    static get is() { return 'appsco-company-add-group'; }

    static get properties() {
        return {
            companyGroupsApi: {
                type: String
            },

            apiErrors: {
                type: Object,
                value: function () {
                    return {};
                }
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
            }
        };
    }

    ready() {
        super.ready();

        this._target = this.$.form;
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
        this.$.groupName.focus();
    }

    _onDialogClosed() {
        this._hideLoader();
        this._hideError();
        this._target.reset();
    }

    /**
     * Submits form on ENTER key using iron-a11y-keys component.
     *
     * @private
     */
    _onEnter() {
        this._submitForm();
    }

    _submitForm() {
        this._hideError();

        if (this._target.validate()) {
            this._showLoader();
            this._target.submit();
        }
    }

    _onFormError(event) {
        this._showError(this.apiErrors.getError(event.detail.request.response.code));
        this._hideLoader();
    }

    /**
     * Called after group has been added.
     *
     * @param {Object} event
     * @private
     */
    _onFormResponse(event) {
        this.close();
        this.dispatchEvent(new CustomEvent('group-added', {
            bubbles: true,
            composed: true,
            detail: {
                group: event.detail.response
            }
        }));
    }
}
window.customElements.define(AppscoCompanyAddGroup.is, AppscoCompanyAddGroup);
