import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '@polymer/iron-image/iron-image.js';
import './appsco-dropdown.js';
import '../account/appsco-account-image.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender, beforeNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoAccountInfo extends PolymerElement {
    static get template() {
        return html`
        <style include="iron-flex iron-flex-alignment">
            :host {
                min-width: 32px;
                font-size: 14px;
                position: relative;
                display: inline-block;

            @apply --appsco-account-info;
            }
            :host([display-name]) .account-info.hidden {
                display: inline;
            }
            :host([display-name]) iron-icon.hidden {
                display: inline-flex;
            }
            :host([display-name]) appsco-dropdown {
                top: 30px;
                right: -10px;
            }
            :host paper-button {
            @apply --paper-font-button;
                max-width: 110px;
                height: 26px;
                padding: 0 6px;
                line-height: 26px;
                font-size: 12px;
                margin: 0;
                text-align: center;
                display: block;
            }
            :host .truncate {
            @apply --paper-font-common-nowrap;
                display: block;
            }
            :host .account-holder:after {
                clear: both;
            }
            :host .user-holder {
                height: 34px;
                line-height: 34px;
                font-size: 16px;
                cursor: pointer;

            @apply --appsco-account-info-user-holder;
            }
            appsco-account-image {
                --account-image: {
                    width: 32px;
                    height: 32px;
                    @apply --appsco-account-info-account-img;
                };
                --account-initials-font-size: 14px;
            }
            appsco-account-image.active-account-image {
                --account-image: {
                    width: 64px;
                    height: 64px;
                };
                --account-initials-font-size: 18px;
            }
            :host .account-info {
                margin: 0 0 0 10px;
                overflow: hidden;
            }
            :host .user-holder .account-info {
                float: left;
                max-width: 200px;
            }
            :host .my-account-button {
                background-color: var(--primary-button-background-color, #00b4ff);
                color: #ffffff;
            }
            :host .gray-button {
                color: var(--secondary-text-color);
            }
            :host .link-button {
                text-decoration: none;
                color: var(--secondary-text-color);
            }
            :host .add-account-button {
                background-color: var(--default-button-background-color, #f8f8f8);
                border: 1px solid var(--divider-color);
            }
            :host appsco-dropdown {
                top: 35px;
                right: -6px;

            @apply --appsco-account-info-dropdown;
            }
            :host appsco-dropdown .info {
                font-size: 11px;
                background-color: var(--account-info-background-color, #edf9ff);
                color: var(--secondary-text-color);

            @apply --appsco-account-info-box;
            }
            :host appsco-dropdown .actions {
                background-color: var(--light-background-color, #f5f5f5);
            }
            :host appsco-dropdown .info {
                padding: 6px 20px;
            }
            :host appsco-dropdown .actions {
                padding: 10px 20px;
            }
            :host appsco-dropdown .account .info-lead {
                font-size: 14px;
                line-height: 14px;
                margin: 0;
                display: block;
            }
            :host appsco-dropdown .account .info-additional {
                font-size: 12px;
                line-height: 12px;
                padding-top: 2px;
            }
            :host appsco-dropdown .active-account {
                padding: 20px;
                background-color: var(--hover-background-color, #ffffff);
                border-top-left-radius: 4px;
                border-top-right-radius: 4px;
            }
            :host .active-account .account-info {
                margin-top: 2px;
            }
            :host .end-justified {
            @apply --layout-end-justified;
            }
            :host([mobile]) appsco-dropdown {
                top: 35px;
                right: -5px;
            }
            :host([mobile]) .hidden-xs {
                display: none;
            }
        </style>

        <iron-media-query query="(max-width: 600px)" query-matches="{{ mobile }}"></iron-media-query>

        <div class="account-holder" hidden\$="[[ !_accountExists }}">

            <div id="triggerDropdown" class="user-holder layout horizontal center" on-tap="_toggleDropdown">

                <appsco-account-image account="[[ account ]]"></appsco-account-image>

                <template is="dom-if" if="{{ displayName }}">
                    <span class="account-info truncate hidden-xs">[[ account.name ]]</span>

                    <iron-icon icon="arrow-drop-down" class="hidden-xs"></iron-icon>
                </template>
            </div>
            
            <template is="dom-if" if="[[ _dropDownEnabled ]]">
                <appsco-dropdown id="accountInfoDropdown" trigger="[[ _triggerDropdown ]]" data-info\$="[[ info ]]">

                    <template is="dom-if" if="[[ info ]]">
                        <div class="info">
                            [[ info ]]
                        </div>
                    </template>
    
                    <div class="account-holder layout vertical">
                        <div class="active-account account layout horizontal">
                            <appsco-account-image account="[[ account ]]" class="active-account-image"></appsco-account-image>
    
                            <div class="account-info layout vertical">
    
                                <template is="dom-if" if="[[ account.first_name ]]">
                                    <span class="info-lead truncate">[[ account.name ]]</span>
                                </template>
    
                                <span class="info-additional truncate">[[ account.email ]]</span>
    
                                <div class="layout vertical end-justified flex">
                                    <paper-button class="my-account-button" on-tap="_onAccountSettingsAction">
                                        My Account
                                    </paper-button>
                                </div>
                            </div>
                        </div>
                    </div>
    
                    <div class="actions layout horizontal">
                        <div class="flex">
                            <paper-button class="gray-button add-account-button" on-tap="_onAddAccountAction" disabled="">
                                Add Account
                            </paper-button>
                        </div>
    
                        <div>
                            <a href="[[ logoutApi ]]" class="link-button" tabindex="-1" target="_self">
                                <paper-button class="gray-button" on-tap="_onLogoutAccountAction">
                                    Logout
                                </paper-button>
                            </a>
                        </div>
                    </div>
                </appsco-dropdown>
            </template>
        </div>
`;
    }

    static get is() { return 'appsco-account-info'; }

    static get properties() {
        return {
            mobile: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            /**
             * Active account from AppsCo dashboard.
             */
            account: {
                type: Object,
                observer: '_accountChanged'
            },

            _accountExists: {
                type: Boolean,
                value: false
            },

            /**
             * Info related to active account.
             */
            info: {
                type: String
            },

            /**
             * Indicates if account info should display account name or not.
             */
            displayName: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            logoutApi: {
                type: String
            },

            _dropDownEnabled: {
                type: Boolean,
                value: false
            }
        };
    }

    static get observers() {
        return [
            '_checkAccountInfo(info, _dropDownEnabled)'
        ];
    }

    ready() {
        super.ready();

        this._triggerDropdown = this.shadowRoot.getElementById('triggerDropdown');

        beforeNextRender(this, function() {
            this._checkIfAccountExists();
        });
    }

    _checkIfAccountExists() {
        const account = this.account;

        if (account) {
            for (const key in account) {
                this._accountExists = true;
                break;
            }
        }
        else {
            this._accountExists = false;
        }
    }

    _checkAccountInfo(info, dropDownEnabled) {
        if (!dropDownEnabled) {
            return;
        }

        setTimeout(function() {
            const accountInfoDropdown = this.shadowRoot.getElementById('accountInfoDropdown');

            const style = info && info.trim() !== '' ?
                {'--dropdown-caret-background-color': 'var(--info-background-color, #edf9ff);'} :
                {'--dropdown-caret-background-color': 'unset'}
            ;

            accountInfoDropdown.updateStyles(style);
        }.bind(this));
    }

    _accountChanged() {
        this._checkIfAccountExists();
        if(this.account.company) {
            this.info = "This account is managed by " + this.account.company.name;
        }
    }

    _toggleDropdown() {
        this._dropDownEnabled = true;
        afterNextRender(this, () => this.shadowRoot.getElementById('accountInfoDropdown').toggle());
    }

    _onAccountSettingsAction() {
        this.dispatchEvent(new CustomEvent('account-settings', {
            bubbles: true,
            composed: true,
            detail: {
                account: this.account
            }
        }));
        this._toggleDropdown();
    }

    _onAddAccountAction() {
        this.dispatchEvent(new CustomEvent('account-add', { bubbles: true, composed: true }));
    }

    _onLogoutAccountAction() {
        this.dispatchEvent(new CustomEvent('account-logout', {
            bubbles: true,
            composed: true,
            detail: {
                account: this.account
            }
        }));

        this._toggleDropdown();
    }
}
window.customElements.define(AppscoAccountInfo.is, AppscoAccountInfo);
