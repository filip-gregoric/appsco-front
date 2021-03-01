import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import '../components/appsco-form-error.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoCustomerHandbookToggle extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
                @apply --appsco-customer-handbook-toggle;
            }
            :host paper-toggle-button {
                cursor: pointer;
            }
            :host .info {
                margin-top: 10px;
            }
        </style>

        <paper-toggle-button id="switch" checked\$="[[ customer.handbook ]]" on-change="_onSwitchChanged">Handbook activated by partner</paper-toggle-button>
        <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>

        <div class="info">
            <template is="dom-if" if="[[ _isHandbookActivated  ]]">
                <p>Handbook activated for customer by partner.</p>
            </template>

            <template is="dom-if" if="[[ !_isHandbookActivated  ]]">
                <p>Handbook can be activated for customer by partner.</p>

                <p>Once activating the handbook package customer will be able to use handbook in HR.</p>
            </template>
        </div>
`;
    }

    static get is() { return 'appsco-customer-handbook-toggle'; }

    static get properties() {
        return {
            customer: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            partner: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            apiErrors: {
                type: Array,
                value: function () {
                    return {};
                }
            },

            _isHandbookActivated: {
                type: Boolean,
                computed: '_computeIsHandbookActive(customer)'
            },

            _handbookPackageStateApi: {
                type: String,
                computed: '_computeHandbookPackageStateApi(customer)'
            },

            _errorMessage: {
                type: String
            }
        };
    }

    resetCustomer() {
        const customer = JSON.parse(JSON.stringify(this.customer));
        this.set('customer', {});
        this.set('customer', customer);
    }

    _showError(message) {
        this._errorMessage = message;
    }

    _hideError() {
        this._errorMessage = '';
    }

    _turnHandbookPackageOn() {
        this._callHandbookPackagesApi(1);
    }

    _turnHandbookPackageOff() {
        this._callHandbookPackagesApi(0);
    }

    _callHandbookPackagesApi(status) {
        const request = document.createElement('iron-request'),
            options = {
                url: this._handbookPackageStateApi,
                method: 'PUT',
                handleAs: 'json',
                headers: this._headers,
                body: 'form[handbook]=' + status
            };

        if (!this._handbookPackageStateApi || !this._headers) {
            this._showError(this.apiErrors.getError(404));
            return false;
        }

        request.send(options).then(function() {
            if (200 === request.status) {
                this.dispatchEvent(new CustomEvent('customer-handbook-state-changed', {
                    bubbles: true,
                    composed: true,
                    detail: {
                        customer: request.response.customer,
                        partner: request.response.partner
                    }
                }));
            }

        }.bind(this), function() {
            this._showError(this.apiErrors.getError(request.response.code));
            this.customer.handbook = !status;
        }.bind(this));
    }

    _onSwitchChanged(event) {
        event.target.checked ? this._turnHandbookPackageOn() : this._turnHandbookPackageOff();
    }

    _computeIsHandbookActive(customer) {
        return customer && customer.handbook == true;
    }

    _computeHandbookPackageStateApi(customer) {
        return customer ? (customer.self + '/handbook') : null;
    }
}
window.customElements.define(AppscoCustomerHandbookToggle.is, AppscoCustomerHandbookToggle);
