import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-material/paper-material.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-image/iron-image.js';
import '@polymer/paper-card/paper-card.js';
import './components/page/appsco-content.js';
import './components/page/appsco-page-styles.js';
import './components/components/appsco-loader.js';
import './components/components/appsco-date-format.js';
import './components/components/appsco-price.js';
import './billing/appsco-billing-invoice.js';
import './billing/appsco-billing-page-actions.js';
import './upgrade/appsco-upgrade-action.js';
import './billing/appsco-subscription-cancel.js';
import './billing/appsco-credit-card.js';
import './billing/appsco-billing-send-invoice.js';
import './lib/mixins/appsco-headers-mixin.js';
import './lib/mixins/appsco-page-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender, afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoBillingPage extends mixinBehaviors([
    Appsco.HeadersMixin,
    Appsco.PageMixin
], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-page-styles">
            :host {
                --info-width: 300px;
                --resource-width: 300px;

                --paper-card: {
                    min-height: 150px;
                    box-sizing: border-box;
                    font-size: 14px;
                };
                --paper-card-content: {
                    min-height: 70px;
                    box-sizing: border-box;
                };
                --paper-card-actions: {
                    padding: 0;
                    border-color: var(--divider-color);
                    @apply --layout;
                    @apply --layout-center-justified;
                };
                --paper-card-header-text: {
                    @apply --page-paper-card-header-text;

                    font-size: 18px;
                    color: var(--primary-text-color);
                    border-bottom: 1px solid var(--divider-color);
                };
            }
            :host .icon-20 {
                width: 20px;
                height: 20px;
            }
            :host .paper-card-action {
                padding: 6px 10px;
                margin: 0;
                border-radius: 0;
                /*width: 100%;*/
                color: var(--primary-text-color);
                font-weight: 400;
            }
            :host .subscription-info {
                @apply --info-box;
                margin-bottom: 20px;
                font-size: 14px;
            }
            :host .cancel-subscription-action {
                color: var(--secondary-text-color);
                margin-top: 30px;
                font-size: 12px;
                font-weight: 400;
                text-decoration: underline;
            }
            :host div[resource] p {
                margin-bottom: 0;
                margin-top: 6px;
                font-size: 14px;
            }
            :host .resource-header {
                margin-bottom:20px;
                font-size:18px;
            }
            :host .credit-card-logo {
                width: auto;
                height: auto;
                max-height: 48px;
            }
            :host .flex-start {
                @apply --layout-start;
            }
            :host appsco-billing-invoice {
                margin-bottom: 5px;
            }
            :host .small {
                font-size:12px;
                margin-right: 10px;
            }
            :host .mt20 {
                margin-top: 20px;
            }
            :host .mt10 {
                margin-top: 10px;
            }
            :host .pr5 {
                padding-right: 5px;
            }
            :host .header {
                font-size: 18px;
                padding: 5px;
            }
            :host .upgrade {
                @apply --primary-button;
                display: inline-block;
            }
            :host .info-header {
                background-color: var(--brand-color);
                padding: 10px 0 5px 10px;
            }
            :host .info-content-container {
                height: calc(100% - 64px - 38px - 40px);
                position: relative;
            }
            :host .info-content {
                padding: 10px;
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
            }
            :host .border-bottom {
                border-bottom: 1px solid #dbdbdb;
            }
            :host .op3 {
                opacity: 0.6;
                font-size: 14px;
            }
            :host .item-quantity {
                text-align: right;
                width:45px;
                padding: 5px 20px 5px 5px;
            }
            :host .item-price {
                text-align: right;
                padding:5px;
            }
            :host .item-item {
                padding:5px 0 5px 5px;
            }
            :host .subscription-plan {
                min-width: 48%;
                margin-right: 10px;
            }
            :host .subscription-plan-label {
                opacity: 0.6;
                padding: 2px 5px 2px 0;
            }
            :host .per-user-label {
                margin-left: 4px;
            }
            :host .invoice-list {
                margin-top: 10px;
                position: relative;
            }
            .invoice-list-title {
                font-weight: 400;
                margin: 20px 0 0 0;
            }
            :host div[info] .close-info-icon {
                position: absolute;
                top: 5px;
                right: 0;
                padding: 0;
                color: #ffffff;
            }
            :host .plan-upcoming-invoice {
                min-height: 260px;
            }
            .message {
                @apply --info-message;
            }
            :host([medium-screen]) .subscription-plan {
                min-width: inherit;
                @apply --layout-flex;
            }
            :host([tablet-screen]) {
                --info-width: 100%;
                --resource-width: 240px;
            }
            :host([tablet-screen]) .plan-upcoming-invoice {
                @apply --layout-vertical;
            }
            :host([tablet-screen]) .subscription-plan {
                margin-right: 0;
                margin-bottom: 10px;
            }
            :host([tablet-screen]) .plan-upcoming-invoice paper-card{
                @apply --layout-flex-none;
                width: 100%;
            }
            :host([mobile-screen]) {
                --resource-width: 180px;
            }
        </style>

        <iron-ajax id="billingCCRequest" url="[[ _creditCardApi ]]" handle-as="json" headers="[[ _headers ]]" auto="" on-response="_handleCCResponse"></iron-ajax>

        <iron-ajax id="billingSubscriptionRequest" url="[[ _subscriptionApi ]]" handle-as="json" headers="[[ _headers ]]" auto="" on-response="_handleSubscriptionResponse"></iron-ajax>

        <iron-ajax id="billingPlansRequest" url="[[ _plansApi ]]" handle-as="json" headers="[[ _headers ]]" auto="" on-response="_handlePlansResponse"></iron-ajax>

        <iron-ajax id="upcomingInvoiceCall" url="[[ _upcomingInvoiceApi ]]" handle-as="json" headers="[[ _headers ]]" on-response="_handleUpcomingInvoiceResponse"></iron-ajax>
        <iron-ajax id="upcomingAppsCoOneInvoiceCall" url="[[ _upcomingAppsCoOneInvoiceApi ]]" handle-as="json" headers="[[ _headers ]]" on-response="_handleUpcomingAppscoOneInvoiceResponse"></iron-ajax>

        <iron-ajax id="invoiceListCall" url="[[ _invoiceListApi ]]" handle-as="json" headers="[[ _headers ]]" on-response="_handleInvoicesResponse"></iron-ajax>
        <iron-ajax id="invoiceListAppscoOneCall" url="[[ _invoiceListAppscoOneApi ]]" handle-as="json" headers="[[ _headers ]]" on-response="_handleInvoicesAppscoOneResponse"></iron-ajax>

        <iron-ajax id="activeIntegrationsRequest" url="[[ _activeIntegrationsApi ]]" auto=""  handle-as="json" headers="[[ _headers ]]" on-response="_handleActiveIntegrationsResponse"></iron-ajax>

        <iron-media-query query="(max-width: 1200px)" query-matches="{{ mediumScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 800px)" query-matches="{{ tabletScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 600px)" query-matches="{{ mobileScreen }}"></iron-media-query>

        <appsco-content id="appscoContent" resource-active="">

            <div class="flex-vertical" resource="" slot="resource">

                <div class="resource-header">
                    Payment Method
                </div>

                <div>
                    <appsco-loader active="[[ _ccLoader ]]" loader-alt="Appsco is loading payment method" multi-color=""></appsco-loader>

                    <template is="dom-if" if="[[ _paymentMethod ]]">
                        <img class="credit-card-logo" src="[[ _computedCCLogo ]]" alt="[[ _cc.brand ]]">

                        <div class="mt20">
                            <p>
                                [[ _cc.brand]] **** **** **** [[ _cc.last4 ]]
                            </p>
                            <p>
                                Expires [[ _cc.exp_month ]]/[[ _cc.exp_year  ]]
                            </p>
                            <p>
                                Cardholder: [[ _cc.name ]]
                            </p>
                        </div>
                    </template>

                    <template is="dom-if" if="[[ !_paymentMethod ]]">
                        <p class="message">
                            No payment method has been created yet.
                            Please go and add new one.
                        </p>
                    </template>
                </div>

                <div class="resource-actions flex-horizontal">
                    <template is="dom-if" if="[[ !_paymentMethod ]]">
                        <paper-button class="button secondary-button flex" on-tap="_onManageCreditCard">
                            Add payment method
                        </paper-button>
                    </template>

                    <template is="dom-if" if="[[ _paymentMethod ]]">
                        <paper-button class="button secondary-button flex" on-tap="_onManageCreditCard">
                            Change payment method
                        </paper-button>
                    </template>
                </div>

            </div>

            <div content="" slot="content">
                <div class="content-container">
                    <template is="dom-if" if="[[ _paymentMethodInfo ]]">
                        <div class="subscription-info">
                            Please add payment method before you subscribe to one of AppsCo packages.
                        </div>
                    </template>

                    <div class="plan-upcoming-invoice flex-horizontal flex-start">
                        
                            <paper-card heading="Appsco Workplace Subscription" class="subscription-plan">
                                <appsco-loader active="[[ _subscriptionLoader ]]" loader-alt="Appsco is loading subscription model" multi-color=""></appsco-loader>
                                <div class="card-content flex-vertical">
                                    <template is="dom-if" if="[[ _isSubscriptionFor(_subscription.plan.type, 'company') ]]">
                                        <div class="flex-horizontal">
                                            <span class="subscription-plan-label">Started on:</span>
                                            <appsco-date-format date="[[ _subscription.startedAt.date ]]"></appsco-date-format>
                                        </div>
                                        <div class="flex-horizontal">
                                            <span class="subscription-plan-label">Activity period:</span>
                                            <div>
                                                <appsco-date-format date="[[ _subscription.currentPeriodStart.date ]]"></appsco-date-format> /
                                                <appsco-date-format date="[[ _subscription.currentPeriodEnd.date ]]"></appsco-date-format>
                                            </div>
                                        </div>
                                        <div class="flex-horizontal">
                                            <span class="subscription-plan-label">Plan:</span>
                                            <span>[[ _subscription.plan.display_text ]]</span>
                                        </div>
                                        <div class="flex-horizontal">
                                            <span class="subscription-plan-label">Price:</span>
                                            <appsco-price price="[[ _subscription.plan.amount ]]" currency="[[ _subscription.plan.currency ]]"></appsco-price>
                                            <span class="per-user-label">per user</span>
                                        </div>
                                        <div class="flex-horizontal">
                                            <span class="subscription-plan-label">AppsCo Licences:</span>
                                            <span>[[ _subscription.quantity ]]</span>
                                        </div>
                                        <div class="flex-horizontal">
                                            <span class="subscription-plan-label">Status:</span>
                                            <span>[[ _subscription.status ]]</span>
                                        </div>
                                        
                                        <div class="flex-horizontal">
                                            <appsco-loader active="[[ _upcomingInvoiceLoader ]]" loader-alt="Appsco is loading subscription model" multi-color=""></appsco-loader>
                                            <div class="card-content flex-vertical">
                                                <hr/>
                                                <div class="flex-horizontal">
                                                    Your next automatic payment is scheduled for&nbsp;
                                                    <appsco-date-format date="[[ _upcomingInvoice.date.date ]]" options="{&quot;year&quot;: &quot;numeric&quot;, &quot;month&quot;: &quot;long&quot;, &quot;day&quot;: &quot;numeric&quot;}"></appsco-date-format>.
                                                </div>

                                                <div class="flex-horizontal">
                                                    Total amount:&nbsp;
                                                    <appsco-price price="[[ _upcomingInvoice.total ]]" currency="[[ _upcomingInvoice.currency ]]"></appsco-price>.
                                                </div>
                                            </div>
                                        </div>
                                    </template>

                                    <template is="dom-if" if="[[ !_isSubscriptionFor(_subscription.plan.type, 'company') ]]">
                                        <p class="message">Subscription plan hasn't been added yet. Please go and subscribe.</p>
                                    </template>
                                </div>

                                <div class="card-actions">
                                    <template is="dom-if" if="[[ _isSubscriptionFor(_subscription.plan.type, 'company') ]]">
                                        <paper-button on-tap="_onChangePlan" class="paper-card-action">Change Plan</paper-button>
                                        <paper-button class="paper-card-action" on-tap="_onCancelSubscription">Cancel subscription</paper-button>
                                    </template>

                                    <template is="dom-if" if="[[ !_isSubscriptionFor(_subscription.plan.type, 'company') ]]">
                                        <template is="dom-if" if="[[ _cc.brand ]]">
                                            <paper-button on-tap="_onChangePlan" class="paper-card-action">Subscribe</paper-button>
                                        </template>
                                        <template is="dom-if" if="[[ !_paymentMethod ]]">
                                            <paper-button class="paper-card-action" on-tap="_onManageCreditCard">
                                                Add payment method
                                            </paper-button>
                                        </template>
                                    </template>
                                </div>
                            </paper-card>

                            <paper-card heading="Appsco One Subscription" class="subscription-plan">
                                <appsco-loader active="[[ _subscriptionLoader ]]" loader-alt="Appsco is loading subscription model" multi-color=""></appsco-loader>
                                <div class="card-content flex-vertical">
                                    <template is="dom-if" if="[[ !_hasAppscoOneHrIntegration ]]">
                                        <p class="message">There is no integration between Appsco One and Appsco Workplace.</p>
                                        <p class="message">Integration can be added through Provisioning or contact your partner for the support.</p>
                                    </template>

                                    <template is="dom-if" if="[[ _hasAppscoOneHrIntegration ]]">
                                        <template is="dom-if" if="[[ _isSubscriptionFor(_subscriptionAppscoOneHr.plan.type, 'appscoone') ]]">
                                            <div class="flex-horizontal">
                                                <span class="subscription-plan-label">Started on:</span>
                                                <appsco-date-format date="[[ _subscriptionAppscoOneHr.startedAt.date ]]"></appsco-date-format>
                                            </div>
                                            <div class="flex-horizontal">
                                                <span class="subscription-plan-label">Activity period:</span>
                                                <div>
                                                    <appsco-date-format date="[[ _subscriptionAppscoOneHr.currentPeriodStart.date ]]"></appsco-date-format> /
                                                    <appsco-date-format date="[[ _subscriptionAppscoOneHr.currentPeriodEnd.date ]]"></appsco-date-format>
                                                </div>
                                            </div>
                                            <div class="flex-horizontal">
                                                <span class="subscription-plan-label">Plan:</span>
                                                <span>[[ _subscriptionAppscoOneHr.plan.display_text ]]</span>
                                            </div>
                                            <div class="flex-horizontal">
                                                <span class="subscription-plan-label">Price:</span>
                                                <appsco-price price="[[ _subscriptionAppscoOneHr.plan.amount ]]" currency="[[ _subscriptionAppscoOneHr.plan.currency ]]"></appsco-price>
                                                <span class="per-user-label">per user</span>
                                            </div>
                                            <div class="flex-horizontal">
                                                <span class="subscription-plan-label">AppsCo Licences:</span>
                                                <span>[[ _subscriptionAppscoOneHr.quantity ]]</span>
                                            </div>
                                            <div class="flex-horizontal">
                                                <span class="subscription-plan-label">Status:</span>
                                                <span>[[ _subscriptionAppscoOneHr.status ]]</span>
                                            </div>

                                            <div class="flex-horizontal">
                                                <appsco-loader active="[[ _upcomingInvoiceLoader ]]" loader-alt="Appsco is loading subscription model" multi-color=""></appsco-loader>
                                                <div class="card-content flex-vertical">
                                                    <hr/>
                                                    <div class="flex-horizontal">
                                                        Your next automatic payment is scheduled for&nbsp;
                                                        <appsco-date-format date="[[ _upcomingAppsCoOneInvoice.date.date ]]" options="{&quot;year&quot;: &quot;numeric&quot;, &quot;month&quot;: &quot;long&quot;, &quot;day&quot;: &quot;numeric&quot;}"></appsco-date-format>.
                                                    </div>

                                                    <div class="flex-horizontal">
                                                        Total amount:&nbsp;
                                                        <appsco-price price="[[ _upcomingAppsCoOneInvoice.total ]]" currency="[[ _upcomingAppsCoOneInvoice.currency ]]"></appsco-price>.
                                                    </div>
                                                </div>
                                            </div>
                                        </template>

                                        <template is="dom-if" if="[[ !_isSubscriptionFor(_subscriptionAppscoOneHr.plan.type, 'appscoone') ]]">
                                            <p class="message">Subscription plan hasn't been added yet. Please go and subscribe.</p>
                                        </template>
                                    </template>
                                </div>

                                <div class="card-actions">
                                    <template is="dom-if" if="[[ _hasAppscoOneHrIntegration ]]">
                                        <template is="dom-if" if="[[ _isSubscriptionFor(_subscriptionAppscoOneHr.plan.type, 'appscoone') ]]">
                                            <paper-button on-tap="_onChangeSubscriptionPlan" class="paper-card-action">Change Plan</paper-button>
                                            <paper-button class="paper-card-action" on-tap="_onCancelAppscoOneSubscription">Cancel subscription</paper-button>
                                        </template>

                                        <template is="dom-if" if="[[ !_isSubscriptionFor(_subscriptionAppscoOneHr.plan.type, 'appscoone') ]]">
                                            <template is="dom-if" if="[[ _cc.brand ]]">
                                                <paper-button on-tap="_onChangeSubscriptionPlan" class="paper-card-action">Subscribe</paper-button>
                                            </template>
                                            <template is="dom-if" if="[[ !_paymentMethod ]]">
                                                <paper-button class="paper-card-action" on-tap="_onManageCreditCard">
                                                    Add payment method
                                                </paper-button>
                                            </template>
                                        </template>
                                    </template>
                                </div>
                            </paper-card>
                    </div>

                    <template is="dom-if" if="[[ _hasInvoices ]]">
                        <div class="invoice-list flex-vertical">

                            <appsco-loader active="[[ _invoiceListLoader ]]" loader-alt="Appsco is loading invoices" multi-color=""></appsco-loader>

                            <h2 class="invoice-list-title">Invoice list</h2>

                            <template is="dom-if" if="[[ _invoicesExists ]]">
                                <template is="dom-repeat" items="[[ _invoices ]]">
                                    <appsco-billing-invoice id="invoiceItem_[[ index ]]" class="appsco-billing-invoice" invoice="[[ item ]]" on-tap="_onInvoiceAction"></appsco-billing-invoice>
                                </template>
                                <template is="dom-repeat" items="[[ _invoicesAppscoOne ]]">
                                    <appsco-billing-invoice id="invoiceItem_[[ index ]]" class="appsco-billing-invoice" invoice="[[ item ]]" on-tap="_onInvoiceAction"></appsco-billing-invoice>
                                </template>
                            </template>

                            <template is="dom-if" if="[[ !_invoicesExists ]]">
                                <p class="message">There are no invoices yet.</p>
                            </template>
                        </div>
                    </template>
                </div>
            </div>

            <div info="" class="flex-vertical" slot="info">
                <div class="info-header">
                    <appsco-brand logo="/images/appsco-logo-white.png" logo-width="118" logo-height="38">
                    </appsco-brand>

                    <paper-icon-button icon="icons:close" class="close-info-icon" on-tap="_onCloseInfoAction"></paper-icon-button>
                </div>

                <appsco-date-format class="small" date="[[ _selectedInvoice.date.date ]]" options="{&quot;year&quot;: &quot;numeric&quot;, &quot;month&quot;: &quot;long&quot;, &quot;day&quot;: &quot;numeric&quot;, &quot;hour&quot;: &quot;2-digit&quot;, &quot;minute&quot;: &quot;2-digit&quot;}"></appsco-date-format>

                <div class="info-content-container">
                    <div class="info-content">
                        <div class="flex-horizontal">
                            <span class="item-quantity small op3 border-bottom">Quantity</span>
                            <span class="item-item flex op3 border-bottom">Item</span>
                            <span class="item-price op3 border-bottom">Price</span>
                        </div>

                        <template is="dom-repeat" items="{{ _selectedInvoice.items }}">
                            <div class="flex-horizontal">
                                <template is="dom-if" if="[[ !item.quantity ]]">
                                    <span class="item-quantity border-bottom font12">&nbsp;</span>
                                </template>
                                <template is="dom-if" if="[[ item.quantity ]]">
                                    <span class="item-quantity border-bottom font12">[[ item.quantity ]]</span>
                                </template>    
                                <template is="dom-if" if="[[ _invoiceType(_selectedInvoice.type, 'company') ]]">
                                    <span class="flex item-item border-bottom font12">Licences</span>
                                </template>
                                <template is="dom-if" if="[[ _invoiceType(_selectedInvoice.type, 'appscoone') ]]">
                                    <template is="dom-if" if="[[ !item.quantity ]]">
                                        <span class="flex item-item border-bottom font12">Fixed Fee</span>
                                    </template>
                                    <template is="dom-if" if="[[ item.quantity ]]">
                                        <span class="flex item-item border-bottom font12">Licences</span>
                                    </template>
                                </template>
                                
                            <span class="item-price border-bottom font12">
                                <appsco-price price="[[ item.amount ]]" currency="[[ item.currency ]]"></appsco-price>
                            </span>
                            </div>
                        </template>

                        <div class="flex-horizontal">
                            <span class="item-quantity font12">&nbsp;</span>
                            <span class="flex item-item font12">Tax</span>
                            <span class="item-price font12">[[ _selectedInvoice.tax ]]</span>
                        </div>
                        <div class="flex-horizontal">
                            <span class="item-quantity font12  border-bottom">&nbsp;</span>
                            <span class="flex item-item font12  border-bottom">Tax Percent</span>
                            <span class="item-price font12  border-bottom">[[ _selectedInvoice.tax_percent ]]</span>
                        </div>
                        <div class="flex-horizontal">
                            <span class="item-quantity font12">&nbsp;</span>
                            <span class="flex item-item font12"><strong>Total</strong></span>
                        <span class="item-price font12"><strong>
                            <appsco-price price="[[ _selectedInvoice.total ]]" currency="[[ _selectedInvoice.currency ]]"></appsco-price>
                        </strong></span>
                        </div>

                        <div class="flex-vertical mt20">
                            <span class="font12">Invoice ID</span>
                            <span class="font12">[[ _selectedInvoice.id ]]</span>
                        </div>
                        <div class="flex-vertical mt20">
                            <span class="font12">Invoice for</span>
                            <span class="font12">
                                <template is="dom-if" if="[[ _invoiceType(_selectedInvoice.type, 'company') ]]">
                                    Appsco Workplace
                                </template>
                                <template is="dom-if" if="[[ _invoiceType(_selectedInvoice.type, 'appscoone') ]]">
                                    Appsco One
                                </template>
                            </span>
                        </div>

                        <div class="flex-vertical mt10">
                            <span class="font12">Purchased from</span>
                            <span class="font12">AppsCo Inc.</span>
                            <span class="font12">911 Washington Avenue</span>
                            <span class="font12">Suite 848</span>
                            <span class="font12">St. Louis, MO 63101</span>
                            <span class="font12">United States</span>
                        </div>
                    </div>
                </div>

                <div class="info-actions flex-horizontal">
                    <paper-button class="button flex" on-tap="_onSendInvoice">
                        Send invoice
                    </paper-button>
                </div>
            </div>
        </appsco-content>

        <appsco-credit-card id="appscoCreditCard" authorization-token="[[ authorizationToken ]]" company-api="[[ companyApi ]]">
        </appsco-credit-card>

        <appsco-upgrade-action id="appscoUpgradeAction" authorization-token="[[ authorizationToken ]]" company-api="[[ companyApi ]]">
        </appsco-upgrade-action>

        <appsco-subscription-cancel id="appscoSubscriptionCancel" authorization-token="[[ authorizationToken ]]" company-api="[[ companyApi ]]">
        </appsco-subscription-cancel>

        <appsco-billing-send-invoice id="appscoBillingSendInvoice" company="[[ currentCompany ]]" authorization-token="[[ authorizationToken ]]" company-api="[[ companyApi ]]" on-invoice-sent="_onInvoiceSent">
        </appsco-billing-send-invoice>
`;
    }

    static get is() { return 'appsco-billing-page'; }

    static get properties() {
        return {
            account: {
                type: Object,
                value: function () {
                    return {};
                },
                notify: true
            },

            currentCompany: {
                type: Object
            },

            companyApi: {
                type: String
            },

            _subscriptionApi: {
                type: String,
                computed: '_computeSubscriptionApi(companyApi)'
            },

            _plansApi: {
                type: String,
                computed: '_computePlansApi(companyApi)'
            },

            _creditCardApi: {
                type: String,
                computed: '_computeCreditCardApi(companyApi)'
            },

            _subscription: {
                type: Object,
                value: function () {
                    return {};
                },
                observer: '_onSubscriptionChanged'
            },

            _subscriptionAppscoOneHr: {
                type: Object,
                value: function () {
                    return {};
                },
                observer: '_onSubscriptionChanged'
            },

            _upcomingInvoiceApi: {
                type: String,
                computed: '_computeUpcomingInvoiceApi(companyApi, _subscription)'
            },

            _upcomingAppsCoOneInvoiceApi: {
                type: String,
                computed: '_computeUpcomingInvoiceApi(companyApi, _subscriptionAppscoOneHr)'
            },

            _invoiceListApi: {
                type: String,
                computed: '_computeInvoiceListApi(companyApi, _subscription)'
            },

            _invoiceListAppscoOneApi: {
                type: String,
                computed: '_computeInvoiceListApi(companyApi, _subscriptionAppscoOneHr)'
            },

            _activeIntegrationsApi: {
                type: String,
                computed: '_computeActiveIntegrationsApi(companyApi)'
            },

            _trialPeriod: {
                type: Boolean,
                computed: '_computeTrialPeriod(account, _subscription)'
            },

            _plans: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _appscoOneHr: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _cc: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            _upcomingInvoice: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            _upcomingAppsCoOneInvoice: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            _paymentMethod: {
                type: Boolean,
                computed: '_computePaymentMethod(_cc)'
            },

            _paymentMethodInfo: {
                type: Boolean,
                value: false
            },

            _invoices: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _invoicesAppscoOne: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _hasInvoices: {
                type: Boolean,
                value: false,
                computed: '_computeHasInvoices(_subscription, _subscriptionAppscoOneHr)'
            },

            _hasAppscoOneHrIntegration: {
                type: Boolean,
                value: false
            },

            _invoicesExists: {
                type: Boolean,
                value: false
            },

            _selectedInvoice: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            _selectedIndex: {
                type: Number,
                value: -1
            },

            _cancelSubscription: {
                type: Boolean,
                value: false
            },

            _ccLoader: {
                type: Boolean,
                value: true
            },

            _subscriptionLoader: {
                type: Boolean,
                value: true
            },

            _upcomingInvoiceLoader: {
                type: Boolean,
                value: true
            },

            _invoiceListLoader: {
                type: Boolean,
                value: true
            },

            mediumScreen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            tabletScreen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            mobileScreen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            pageLoaded: {
                type: Boolean,
                value: false
            },

            _computedCCLogo: {
                type: String,
                computed: '_computeCCLogo(_cc)'
            }
        };
    }

    static get observers() {
        return [
            '_updateScreen(mediumScreen, tabletScreen, mobileScreen)'
        ];
    }

    ready() {
        super.ready();

        this.pageLoaded = false;

        beforeNextRender(this, function() {
            if (this.mobileScreen || this.tabletScreen || this.mediumScreen) {
                this.updateStyles();
            }
        });

        afterNextRender(this, function() {
            this._pageLoaded();
            this._addListeners();
        });
    }

    _addListeners() {
        this.toolbar.addEventListener('resource-section', this.toggleResource.bind(this));
    }

    pageSelected() {
        this.resetPage();
        this.$.activeIntegrationsRequest.generateRequest();
        this.$.billingCCRequest.generateRequest();
        this.$.billingPlansRequest.generateRequest();
        this.reloadSubscription();
    }

    resetPage() {
        this._onCloseInfoAction();
        this.set('_subscription', {});
        this.set('subscriptionAppscoOneHr', {});
        this.set('_cc', {});
        this.set('_upcomingInvoice', {});
        this.set('_upcomingAppsCoOneInvoice', {});
        this.set('_selectedInvoice', {});
        this.set('_invoices', []);
        this.set('_invoicesAppscoOne', []);
        this._paymentMethodInfo = false;
        this._invoicesExists = false;
        this._cancelSubscription = false;
    }

    _updateScreen(medium, tablet, mobile) {
        this.updateStyles();

        if (mobile) {
            this.$.appscoContent.hideSection('resource');
        }
        else if(!this.$.appscoContent.resourceActive) {
            this.$.appscoContent.showSection('resource');
        }
    }

    _computeSubscriptionApi(companyApi) {
        return companyApi ? companyApi + '/billing/subscriptions' : null;
    }

    _computePlansApi(companyApi) {
        return companyApi ? companyApi + '/billing/plans' : null;
    }

    _computeCreditCardApi(companyApi) {
        return companyApi ? companyApi + '/billing/cc' : null;
    }

    _computeUpcomingInvoiceApi(companyApi, subscription) {
        if(!subscription.id) {
            return null;
        }
        return companyApi && subscription && subscription.id ? companyApi + '/billing/invoice/upcoming/' + subscription.id : null;
    }

    _computeInvoiceListApi(companyApi, subscription) {
        if(!subscription.id) {
            return null;
        }
        return companyApi ? companyApi + '/billing/invoice/list/' + subscription.id : null;
    }

    _computeActiveIntegrationsApi(companyApi) {
        return companyApi ? companyApi + '/integrations/active' : null;
    }

    _computeTrialPeriod(account, subscription) {
        return (account.company && account.company.remaining_trial_period > 0 && !subscription.plan);
    }

    _computePaymentMethod(cc) {
        for (const key in cc) {
            return true;
        }
        return false;
    }

    _pageLoaded() {
        this.pageLoaded = true;
        this.dispatchEvent(new CustomEvent('page-loaded', { bubbles: true, composed: true }));
    }

    setCreditCard(cc) {
        this._paymentMethodInfo = false;
        this._ccLoader = true;
        this.set('_cc', cc);

        setTimeout(function() {
            this._ccLoader = false;
        }.bind(this), 1000);
    }

    reloadSubscription() {
        this._subscriptionLoader = true;
        this.$.billingSubscriptionRequest.generateRequest();
    }

    toggleResource() {
        this.$.appscoContent.toggleSection('resource');
    }

    _onSubscriptionChanged(subscription) {
        for (const key in subscription) {
            this._loadUpcomingInvoice();
            this._loadInvoiceList();

            return false;
        }
    }

    _handleCCResponse(event) {
        const response = event.detail.response;

        if (null == response || 0 === response.length) {
            this.set('_cc', {});
            this._paymentMethodInfo = true;
            this._ccLoader = false;
            return false;
        }

        this.set('_cc', response);
        this._paymentMethodInfo = false;
        this._ccLoader = false;
    }

    _computeCCLogo(cc) {
        let logoUrl = '/images/cc/';

        if (cc.brand) {
            if (cc.brand === 'American Express') {
                logoUrl += 'amex.png';
            }
            else {
                logoUrl += cc.brand.toLowerCase().replace(' ', '_') + '.png';
            }
        }
        else {
            logoUrl += 'unknown.png';
        }

        return logoUrl;
    }

    _handleSubscriptionResponse(e) {
        if (null == e.detail.response) {
            return;
        }

        const subscriptions = e.detail.response;
        let activeSubscription = '';
        let activeSubscriptionAppscoOneHr = '';

        subscriptions.forEach(function(element) {
            if (element.type === 'company' && element.status === 'active') {
                this._subscription = activeSubscription = element;
            }
            if (element.type === 'appscoone' && element.status === 'active') {
                this._subscriptionAppscoOneHr = activeSubscriptionAppscoOneHr = element;
            }
        }.bind(this));

        if (!activeSubscription) {
            this._subscription = {};
            this._cancelSubscription = false;
        }
        if (!activeSubscriptionAppscoOneHr) {
            this._subscriptionAppscoOneHr = {};
            this._cancelSubscription = false;
        }

        this._subscriptionLoader = false;
    }

    _isSubscriptionFor(planType, subscriptionType) {
        return planType === subscriptionType;
    }

    _handlePlansResponse (e) {
        if(null == e.detail.response) {
            return;
        }

        const response = e.detail.response,
            plans = [],
            appscoOneHr = [];

        response.forEach(function (element) {
            if (element.type === 'company') {
                plans.push(element);
            }
            if (element.type === 'appscoone') {
                appscoOneHr.push(element);
            }
        }.bind(this));
        this._plans = plans;
        this._appscoOneHr = appscoOneHr;
    }

    _loadUpcomingInvoice() {
        this._upcomingInvoiceLoader = true;
        this.$.upcomingInvoiceCall.generateRequest();
        this.$.upcomingAppsCoOneInvoiceCall.generateRequest();
    }

    _handleUpcomingInvoiceResponse(e) {
        this._upcomingInvoiceLoader = false;
        if (null == e.detail.response) {
            return;
        }

        this._upcomingInvoice = e.detail.response;
    }

    _handleUpcomingAppscoOneInvoiceResponse(e) {
        this._upcomingInvoiceLoader = false;
        if (null == e.detail.response) {
            return;
        }

        this._upcomingAppsCoOneInvoice = e.detail.response;
    }

    _computeHasInvoices(subscription, subscriptionAppscoOneHr) {
        return subscription.id || subscriptionAppscoOneHr.id;
    }

    _loadInvoiceList() {
        this._invoicesExists = false;
        this._invoiceListLoader = true;
        if(this._subscription.id) {
            this.$.invoiceListCall.generateRequest();
        } else {
            this.$.invoiceListAppscoOneCall.generateRequest();
        }
    }

    _handleInvoicesResponse(event) {
        const response = event.detail.response;

        let invoices = this._invoices.filter(function(item) {
            return item.type !== 'company'
        });

        this.set('_invoices', invoices);

        if (null == response) {
            this._invoiceListLoader = false;
            return false;
        }

        if (response.length > 0) {
            this._invoicesExists = true;

            response.forEach(function(el, index) {
                if (0 === index) {
                    this.lastInvoice = el;
                }
                el.type='company';

                this.push('_invoices', el);
                if (index === response.length - 1) {
                    this._invoiceListLoader = false;
                }

            }.bind(this));
            this.$.invoiceListAppscoOneCall.generateRequest();
        }
        else {
            this._invoiceListLoader = false;
        }
    }

    _handleActiveIntegrationsResponse(e) {
        const response = e.detail.response;
        this._hasAppscoOneHrIntegration = false;
        e.detail.response.active_integrations.forEach((integration) => {
            if(integration.kind === 'pst' && integration.integration.alias == 13) {
                this._hasAppscoOneHrIntegration = true;
            }
        });
    }

    _handleInvoicesAppscoOneResponse(event) {
        const response = event.detail.response;

        let invoices = this._invoices.filter(function(item) {
            return item.type !== 'appscoone'
        });

        this.set('_invoices', invoices);

        if (null == response) {
            this._invoiceListLoader = false;
            return false;
        }

        if (response.length > 0) {
            this._invoicesExists = true;

            response.forEach(function(el, index) {
                if (0 === index) {
                    this.lastInvoice = el;
                }
                el.type='appscoone';

                this.push('_invoices', el);

                if (index === response.length - 1) {
                    this._invoiceListLoader = false;
                }

            }.bind(this));
        }
        else {
            this._invoiceListLoader = false;
        }
    }

    _invoiceType(selectedType, type) {
        return selectedType === type;
    }

    _onInvoiceAction(event) {
        const selectedInvoice = event.model.item;

        if (selectedInvoice.id != this._selectedInvoice.id) {
            this._selectedInvoice = selectedInvoice;

            if (this._selectedIndex !== -1) {
                this.shadowRoot.getElementById('invoiceItem_' + this._selectedIndex).deselect();
            }

            this._selectedIndex = event.model.index;

            this.shadowRoot.getElementById('invoiceItem_' + this._selectedIndex).select();

            if (!this._infoShown) {
                this._showInfo();
            }
        }
        else {
            this._onCloseInfoAction();
        }
    }

    _onCloseInfoAction() {
        this._hideInfo();
        this._deselectInvoice();
    }

    _deselectInvoice() {
        this._hideInfo();
        this.set('_selectedInvoice', {});

        if (this.shadowRoot.getElementById('invoiceItem_' + this._selectedIndex)) {
            this.shadowRoot.getElementById('invoiceItem_' + this._selectedIndex).deselect();
        }

        this._selectedIndex = -1;
    }

    _showInfo() {
        this.$.appscoContent.showSection('info');
        this._infoShown = true;
    }

    _hideInfo() {
        this.$.appscoContent.hideSection('info');
        this._infoShown = false;
    }

    _onChangeSubscriptionPlan() {
        const dialog = this.shadowRoot.getElementById('appscoUpgradeAction');
        dialog.setSubscription(this._subscriptionAppscoOneHr);
        dialog.setPlans(this._appscoOneHr);
        dialog.initializePage();
        dialog.toggle();
    }

    _onChangePlan() {
        const dialog = this.shadowRoot.getElementById('appscoUpgradeAction');
        dialog.setSubscription(this._subscription);
        dialog.setPlans(this._plans);
        dialog.initializePage();
        dialog.toggle();
    }

    _onCancelSubscription() {
        const dialog = this.shadowRoot.getElementById('appscoSubscriptionCancel');
        dialog.setSubscription(this._subscription);
        dialog.toggle();
    }

    _onCancelAppscoOneSubscription() {
        const dialog = this.shadowRoot.getElementById('appscoSubscriptionCancel');
        dialog.setSubscription(this._subscriptionAppscoOneHr);
        dialog.toggle();
    }

    _onSendInvoice() {
        const dialog = this.shadowRoot.getElementById('appscoBillingSendInvoice');
        dialog.setInvoice(this._selectedInvoice);
        dialog.setSubscription(this._subscription);
        dialog.toggle();
    }

    _onInvoiceSent(event) {
        this._notify('Invoice has been sent to ' + event.detail.sentTo + '.');
    }

    _onManageCreditCard() {
        this.shadowRoot.getElementById('appscoCreditCard').toggle();
    }
}
window.customElements.define(AppscoBillingPage.is, AppscoBillingPage);
