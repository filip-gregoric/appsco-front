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

class AppscoCompanyRenameGroup extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
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

            <h2>Rename group</h2>

            <appsco-loader active="[[ _loader ]]" loader-alt="Appsco is processing request" multi-color=""></appsco-loader>

            <paper-dialog-scrollable>
                <div class="dialog-container">

                    <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>

                    <p>
                        Enter the group name and click "Rename" to rename it.
                    </p>

                    <div class="input-container">
                        <paper-input id="groupName" label="New group name" name="company_group[name]" required="" auto-validate="" error-message="Please enter group name."></paper-input>
                    </div>
                    <div class="input-container">
                        <paper-input id="groupDescription" label="New group description" name="company_group[description]" error-message="Please enter group description."></paper-input>
                    </div>
                </div>
            </paper-dialog-scrollable>

            <div class="buttons">
                <paper-button dialog-dismiss="">Cancel</paper-button>
                <paper-button autofocus="" on-tap="_renameGroupRequest">Rename</paper-button>
            </div>
        </paper-dialog>

        <iron-a11y-keys keys="enter" on-keys-pressed="_onEnter">
        </iron-a11y-keys>
`;
    }

    static get is() { return 'appsco-company-rename-group'; }

    static get properties() {
        return {
            renameGroupApi: {
                type: String,
                computed: '_computeRenameGroupApi(group)'
            },

            group: {
                type: Object,
                value: function () {
                    return {};
                },
                observer: '_onGroupChanged'
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
            }
        };
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
    }

    /**
     * Submits form on ENTER key using iron-a11y-keys component.
     *
     * @private
     */
    _onEnter() {
        this._renameGroupRequest();
    }

    _renameGroupRequest() {
        this._hideError();
        this._showLoader();

        const renameGroupRequest = document.createElement('iron-request');

        renameGroupRequest.send({
            url: this.renameGroupApi,
            method: 'PUT',
            handleAs: 'json',
            headers: this._headers,
            body: 'company_group[name]=' + encodeURIComponent(this.$.groupName.value) + '&company_group[description]=' + encodeURIComponent(this.$.groupDescription.value)
        }).then(function() {
            this.dispatchEvent(new CustomEvent('group-renamed', {
                bubbles: true,
                composed: true,
                detail: {
                    group: renameGroupRequest.response
                }
            }));
            this.$.dialog.close();
        }.bind(this), function(e) {
            this._hideLoader();
            this._showError(this.apiErrors.getError(renameGroupRequest.response.code));
        }.bind(this));
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

        this.dispatchEvent(new CustomEvent('group-renamed', {
            bubbles: true,
            composed: true,
            detail: {
                group: event.detail.response
            }
        }));
    }

    _computeRenameGroupApi(group) {
        return group ? group.self : null;
    }

    _onGroupChanged(group) {
        this.$.groupName.value = group ? group.name : '';
        this.$.groupDescription.value = group ? group.description : '';
    }

    setGroup(group) {
        this.group = group;
    }
}
window.customElements.define(AppscoCompanyRenameGroup.is, AppscoCompanyRenameGroup);
