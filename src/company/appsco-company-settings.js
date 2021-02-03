import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/iron-ajax/iron-request.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import '../components/components/appsco-loader.js';
import '../components/components/appsco-form-error.js';
import '../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoCompanySettings extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
                position: relative;
                @apply --appsco-company-settings;
            }
            paper-toggle-button {
                cursor: pointer;
            }
            :host .info {
                margin-bottom: 0;
            }
            :host .info + .info {
                margin-top: 0;
            }
            :host .info-between {
                margin-top: 20px;
            }
            .mt-30 {
                margin-top: 30px;
            }
            .toggle-button-container paper-toggle-button {
                margin-top: 10px;
            }
            :host .submit-button {
                margin: 20px 0 0 0;
                @apply --form-action;
            }
            :host #allowPersonalDashboard {
                margin-top: 10px;
            }
            :host a.link {
                color: var(--app-primary-color-dark);
                text-decoration: none;
                color: #0b97c4;
            }
        </style>

        <appsco-loader active="[[ _loader ]]" loader-alt="Appsco is processing request" multi-color=""></appsco-loader>

        <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>

        <p class="info">
            Company name is used to distinguish company resources from users personal resources.
            It is used in branding and can be displayed in login screen along with company logo.
        </p>

        <iron-form id="form" headers="[[ _headers ]]" on-iron-form-presubmit="_onFormPresubmit" on-iron-form-error="_onFormError" on-iron-form-response="_onFormResponse" on-keyup="_onKeyUp">
            <form method="POST" action="[[ settingsApi ]]">
                <paper-input id="companyName" label="Company name" char-counter="" maxlength="35" value="[[ _format(company.name) ]]" name="company_settings[name]" required="" auto-validate="" error-message="Please type in company name."></paper-input>
                <paper-input id="companyNumber" label="Company number" char-counter="" maxlength="50" value="[[ company.number ]]" name="company_settings[number]" error-message="Please type in company number."></paper-input>
                <p class="info info-between">
                    Company contact email will be displayed in user profile section and used for contact purposes.
                </p>

                <paper-input id="contactEmail" type="email" label="Contact email" value="[[ company.contact_email ]]" name="company_settings[contactEmail]" required="" auto-validate="" error-message="Please type in correct email."></paper-input>

                <paper-input id="billingEmail" type="email" label="Billing email" value="[[ company.billing_email ]]" name="company_settings[billingEmail]" required="" auto-validate="" error-message="Please type in correct email."></paper-input>

                <div class="toggle-button-container mt-30">
                    <paper-toggle-button name="company_settings[sendEmailToAdminOnNewDevice]" id="newDeviceInfoAdminEmail" checked\$="[[ company.mail_admin_on_new_device ]]" on-change="_mailAdminOnNewDeviceChanged">
                        Send email notification to system admin when managed users log in from a new device
                    </paper-toggle-button>
                    <paper-toggle-button name="company_settings[disableCopyPassword]" id="disableCopyButtonOnResources" checked\$="[[ company.disable_resource_copy_button ]]" on-change="_disableResourceCopyButtonChanged">
                        Disable copy password option on all company resources.
                    </paper-toggle-button>
                    <paper-toggle-button name="company_settings[sendEmailToAdminOnNewUser]" id="newUserInfoAdminEmail" checked\$="[[ company.mail_admin_on_new_user ]]" on-change="_mailAdminOnNewUserChanged">
                        Send email notification to admins when user/contact invite is accepted.
                    </paper-toggle-button>
                    <template is="dom-if" if="[[ _showAdminEmailField ]]">
                        <paper-input id="sendEmailToAdminOnNewDevice" label="Admin email" name="company_settings[newDeviceInfoAdminEmail]" value="[[ company.notify_admin_email ]]" on-keyup="_onKeyUp"></paper-input>
                    </template>
                </div>
            </form>
        </iron-form>

        <div class="toggle-button-container mt-30">
            <p class="info">
                Policy settings have moved to company policies page.
                To access them please use <a href="/policies" rel="noopener noreferrer" class="link">policies page</a>
            </p>
        </div>

        <paper-button id="companySettingsSaveBtn" class="submit-button" on-tap="_onSaveAction">Save</paper-button>

        <iron-a11y-keys target="[[ _target ]]" keys="enter" on-keys-pressed="_onEnterAction"></iron-a11y-keys>
`;
    }

    static get is() { return 'appsco-company-settings'; }

    static get properties() {
        return {
            company: {
                type: Object,
                value: function () {
                    return {};
                },
                observer: '_onCompanyChanged'
            },

            settingsApi: {
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
            },

            _emailAdminOnNewDevice: {
                type: Boolean,
                value: false
            },

            _emailAdminOnNewUser: {
                type: Boolean,
                value: false
            },

            _disableResourcePasswordCopy: {
                type: Boolean,
                value: false
            },

            _showAdminEmailField: {
                type: Boolean,
                computed: '_computeShowAdminEmailField(_emailAdminOnNewDevice, _emailAdminOnNewUser)'
            }
        };
    }

    ready() {
        super.ready();

        this._target = this;
    }

    _format(name) {
        return name ? name.substring(0, 35) : '';
    }

    _onCompanyChanged() {
        this.$.contactEmail.invalid = false;
        this.$.billingEmail.invalid = false;
        this._emailAdminOnNewDevice = this.company ? this.company.mail_admin_on_new_device : false;
        this._emailAdminOnNewUser = this.company ? this.company.mail_admin_on_new_user : false;
        this._disableResourcePasswordCopy = this.company ? this.company.disable_resource_copy_button : false;
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

    _submitSettingsForm() {
        this.$.form.submit();
    }

    _onEnterAction(event) {
        event.stopPropagation();
        this._onSaveAction();
    }

    _onSaveAction() {
        this._submitSettingsForm();
    }

    _onFormPresubmit() {
        this._showLoader();
        this.$.form.request.method = 'PUT';
    }

    _onFormError(event) {
        this._showError(this.apiErrors.getError(event.detail.request.response.code));
        this._hideLoader();
    }

    _onFormResponse(event) {;
        this.$.contactEmail.invalid = false;
        this.$.billingEmail.invalid = false;

        this._hideLoader();

        this.dispatchEvent(new CustomEvent('company-settings-changed', {
            bubbles: true,
            composed: true,
            detail: {
                company: event.detail.response
            }
        }));

        if (this._2faChangedToEnable) {
            this._reloadPage();
        }
    }

    _onKeyUp(event) {
        if (13 !== event.keyCode) {
            this._hideError();
            event.target.invalid = false;
        }
    }

    _reloadPage() {
        window.location.reload(true);
    }

    _mailAdminOnNewUserChanged() {
        this._emailAdminOnNewUser = this.$.newUserInfoAdminEmail.checked;
    }

    _mailAdminOnNewDeviceChanged() {
        this._emailAdminOnNewDevice = this.$.newDeviceInfoAdminEmail.checked;
    }

    _disableResourceCopyButtonChanged() {
        this._disableResourcePasswordCopy = this.$.disableCopyButtonOnResources.checked;
    }

    _computeShowAdminEmailField(_emailAdminOnNewDevice, _emailAdminOnNewUser) {
        return _emailAdminOnNewDevice || _emailAdminOnNewUser;
    }

    setup() {
        this.$.companyName.focus();
    }

    reset() {
        const company = JSON.parse(JSON.stringify(this.company));

        this.company = {};
        this.company = company;

        this._hideError();
        this.$.contactEmail.invalid = false;
        this.$.billingEmail.invalid = false;
    }
}
window.customElements.define(AppscoCompanySettings.is, AppscoCompanySettings);
