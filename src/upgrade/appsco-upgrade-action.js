import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-styles/shadow.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-radio-group/paper-radio-group.js';
import '@polymer/paper-radio-button/paper-radio-button.js';
import '@polymer/iron-image/iron-image.js';
import '@polymer/iron-ajax/iron-request.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import '../components/components/appsco-loader.js';
import '../components/components/appsco-form-error.js';
import '../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoUpgradeAction extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
                position: relative;
                @apply --appsco-upgrade-action;
                --paper-radio-button-checked-color: var(--app-primary-color-dark);
            }
            :host paper-dialog {
                width: 670px;
                top: 120px;
                @apply --appsco-paper-dialog;
            }
            :host paper-dialog-scrollable > * {
                @apply --paper-dialog-scrollable-child;
            }
            :host paper-input {
                --paper-input-container-label: {
                    left: 4px;
                };
            }
            :host appsco-loader {
                margin: 0 !important;
                padding: 0 !important;
            }
            :host .num-of-subscriptions {
                min-width: 220px;
            }
            :host .message {
                margin: 0;
                color: var(--secondary-text-color);
                font-style: italic;
                @apply --paper-font-body2;
            }
            :host .buttons paper-button {
                @apply --paper-dialog-button;
            }
            :host .buttons paper-button[dialog-dismiss] {
                @apply --paper-dialog-dismiss-button;
            }
            :host .info {
                margin: 0;
            }
            :host .mt {
                margin-top: 15px;
            }
            :host .flex-horizontal {
                @apply --layout-horizontal;
            }
            :host .flex-vertical {
                @apply --layout-vertical;
            }
            :host .flex-wrap {
                @apply --layout-wrap;
            }
            :host .flex-center {
                @apply --layout-center;
            }
            :host .flex{
                @apply --layout-flex;
            }
            :host .baseline {
                @apply --layout-self-end;
                padding-bottom: 10px;
                text-align: center;
            }
            :host .text-center {
                text-align: center;
            }
            :host .op6 {
                opacity: 0.6;
            }
            :host .savings {
                color: var(--app-primary-color);
            }
            :host .hidden {
                display:none;
            }
            :host .price-plan-item {
                border-bottom: 1px solid var(--divider-color);
                min-width: 50%;
                padding-left: 0;
                padding-right: 0;
            }
        </style>

        <iron-ajax id="getPublicKeyCall" auto="" url="[[ _publicKeyApi ]]" method="GET" headers="[[ _headers ]]" handle-as="json" on-response="_handlePublicKeyResponse">
        </iron-ajax>

        <paper-dialog id="dialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation" on-iron-overlay-opened="_onDialogOpened" on-iron-overlay-closed="_onDialogClosed">

            <h2>AppsCo Business Subscription</h2>

            <appsco-loader active="[[ _purchaseLoader ]]" loader-alt="Appsco is processing request" multi-color=""></appsco-loader>

            <paper-dialog-scrollable>
                <div class="dialog-container">
                    <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>

                    <div>
                        <p class="info">
                            AppsCo business provides yearly and monthly subscription plans.
                            During subscription period you can always cancel, upgrade or downgrade subscription.
                            When changing plans or quantities, we will optionally prorate the price we charge
                            next month to make up for any price changes.
                            If you cancel subscription it will still remain active until subscription period end.
                        </p>
                        <div class="flex-vertical flex-center text-center">
                            <paper-input allowed-pattern="\\d+" class="num-of-subscriptions text-center" id="quantity" label="Number of subscriptions" name="subscription[numUsers]" error-message="Please enter number of subscriptions." auto-validate="" on-keyup="_reCalculateAllPlans"></paper-input>
                            <div style="width:100%">
                                <paper-radio-group selected="[[ _selectedPlan ]]" class="flex-horizontal flex-wrap" id="subscriptionPlan">
                                    <template is="dom-repeat" items="[[ _plans ]]">
                                        <paper-radio-button name="[[ item.id ]]" class="flex hidden" value="[[ item.id ]]">[[ item.displayText ]]</paper-radio-button>
                                        <div class="flex-vertical price-plan-item">
                                            <div class="flex">
                                                <input type="radio" name="packages" value="[[ item.id ]]" id="plan-[[ item.id ]]" on-tap="_onPlanChange"
                                                    checked="{{ _isSelectedPlan(item.id) }}"
                                                >
                                                <label for="plan-[[ item.id ]]">[[ item.displayText ]] / [[ item.interval ]]</label>                                            
                                            </div>
                                            
                                            <div class="flex">
                                                <br/>
                                                <appsco-price price="{{ _reCalculate(item) }}" currency="[[ item.currency ]]"></appsco-price>&nbsp;/&nbsp;[[ item.interval ]]
                                                <br>
                                                <span class="op6">
                                                    <appsco-price price="[[ item.amount ]]" currency="[[ item.currency ]]"></appsco-price>
                                                    &nbsp;per user / [[ item.interval ]]</span>
                                                <br>
                                                <template is="dom-if" if="[[ item.flatFee ]]">
                                                    <span class="op6">
                                                    <appsco-price price="[[ item.flatFee ]]" currency="[[ item.currency ]]"></appsco-price>
                                                    &nbsp; / [[ item.interval ]]</span>
                                                    <br>
                                                </template>
                                                <template is="dom-if" if="[[ _isPlanYearly(item) ]]">
                                                    <span class="savings">20% Savings</span>
                                                </template>
                                                <template is="dom-if" if="[[ !_isPlanYearly(item) ]]">
                                                    <span class="savings">&nbsp;</span>
                                                </template>
                                            </div>
                                        </div>
                                    </template>
                                </paper-radio-group>
                            </div>
                            <paper-input class="coupon-code text-center" id="couponCode" label="Coupon code" name="subscription[coupon]"></paper-input>
                        </div>
                    </div>
                </div>
            </paper-dialog-scrollable>

            <div class="buttons">
                <paper-button dialog-dismiss="">Cancel</paper-button>
                <paper-button autofocus="" on-tap="_onPurchaseAction" id="purchaseButton">Purchase</paper-button>
            </div>
        </paper-dialog>
`;
    }

    static get is() { return 'appsco-upgrade-action'; }

    static get properties() {
        return {
            companyApi: {
                type: String
            },

            /**
             * Indicates if add application loader should be displayed or not.
             */
            _purchaseLoader: {
                type: Boolean,
                value: false
            },

            _subscriptionYear: {
                type: Number,
                value: 0
            },

            _subscriptionMonth: {
                type: Number,
                value: 0
            },

            _subscription: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            _plans: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _currency: {
                type: Number,
                value: 0
            },

            _selectedPlan: {
                type: String,
                value: ''
            },

            _stripePublicKey: {
                type: String,
                value: ''
            },

            _publicKeyApi: {
                type: String,
                computed: '_computePublicKeyApi(companyApi)'
            }
        };
    }
    _isSelectedPlan(id) {
        return this._selectedPlan === id;
    }
    _onPlanChange(e) {
        this.$.subscriptionPlan.selected = e.model.item.id;
    }

    _computePublicKeyApi(companyApi) {
        return companyApi + '/billing/pk';
    }

    _handlePublicKeyResponse(event) {
        if (!event.detail.response) {
            return;
        }
        this._stripePublicKey = event.detail.response.stripePublicKey;
    }

    initializePage () {
        this._preselectPlan();
    }

    setSubscription (subscription) {
        this._subscription = subscription;
    }

    setPlans (plans) {
        this._plans = plans;
    }

    _preselectPlan () {
        if (this._subscription && this._subscription.plan) {
            this.set('_selectedPlan', this._subscription.plan.id);
        } else {
            this.set('_selectedPlan', this._getFirstPlan());
        }
        this.$.subscriptionPlan.selected = this._selectedPlan;
    }

    _getFirstPlan() {
        return this._plans && this._plans.length > 0 ? this._plans[0].id : '';
    }

    _reCalculate(plan) {
        let amount = this.$.quantity && this.$.quantity.value ? plan.amount * this.$.quantity.value : plan.amount + (plan.flatFee ? plan.flatFee : 0);
        if(this.$.quantity.value && plan.flatFee) {
            amount += plan.flatFee;
        }


        return amount;
    }

    toggle() {
        this.$.dialog.toggle();
    }

    _onDialogOpened() {
        this.$.quantity.focus();
    }

    _onDialogClosed() {
        this._purchaseLoader = false;
        this._errorMessage = '';
        this.$.quantity.value = '';
        this.$.quantity.invalid = false;
    }

    _onSelectedPlanChanged(selectedPlan) {
        this.$.subscriptionPlan.selected = selectedPlan;
    }

    _onPurchaseAction() {
        const subscriptionsInput = this.$.quantity;

        if (subscriptionsInput.value.length === 0) {
            subscriptionsInput.invalid = true;
            subscriptionsInput.focus();
            return false;
        }

        let url, method = '';
        if (this._subscription.id !== undefined) {
            url = this.companyApi + '/billing/subscriptions/' + this._subscription.id;
            method = 'PUT';
        } else {
            url = this.companyApi + '/billing/subscriptions';
            method = 'POST';
        }

        let request = document.createElement('iron-request'),
            options = {
                url: url,
                method: method,
                handleAs: 'json',
                headers: this._headers
            },
            body = encodeURIComponent(this.$.quantity.name) +
                '=' +
                encodeURIComponent(this.$.quantity.value) +
                '&' +
                encodeURIComponent('subscription[period]') +
                "=" +
                encodeURIComponent(this.$.subscriptionPlan.selectedItem.value);
        if (this.$.couponCode.value) {
            body +=
                '&' +
                encodeURIComponent(this.$.couponCode.name) +
                "=" +
                encodeURIComponent(this.$.couponCode.value)
            ;
        }

        this._purchaseLoader = true;

        options.body = body;

        request.send(options).then(
            function(request) {
                if (request.response.requires_action) {
                    const stripe = Stripe(this._stripePublicKey);
                    const elements = stripe.elements();

                    stripe.handleCardPayment(request.response.client_secret).then(function(result) {
                        if (result.error) {
                            this._errorMessage = 'An error occurred';
                            this._purchaseLoader = false;
                        } else {
                            this._paymentCompleted(request.response);
                        }
                    }.bind(this));
                    return;
                }

                this._paymentCompleted(request.response);
            }.bind(this),
            function() {
                this._errorMessage = request.response.message;
                this._purchaseLoader = false;
            }.bind(this)
        );
    }

    _reCalculateAllPlans() {
        const plansList = JSON.parse(JSON.stringify(this._plans));
        this.set('_plans', []);
        this.set('_plans', plansList);
        this.set('_selectedPlan', this.$.subscriptionPlan.selected);
    }

    _isPlanYearly(plan) {
        return plan &&  'year' === plan.interval;
    }

    _paymentCompleted(response) {
        if(true !== response.requires_action) {
            this.$.dialog.close();
            this.dispatchEvent(new CustomEvent('subscription-changed', {
                bubbles: true,
                composed: true,
                detail: {
                    subscription: response
                }
            }));
            this._purchaseLoader = false;
            return;
        }
        const request = document.createElement('iron-request'),
            options = {
                url: response.on_confirm,
                method: 'POST',
                handleAs: 'json',
                headers: this._headers
            };
        request.send(options).then(function() {
            this.$.dialog.close();
            this.dispatchEvent(new CustomEvent('subscription-changed', {
                bubbles: true,
                composed: true,
                detail: {
                    subscription: response
                }
            }));
            this._purchaseLoader = false;
        }.bind(this));
    }
}
window.customElements.define(AppscoUpgradeAction.is, AppscoUpgradeAction);
