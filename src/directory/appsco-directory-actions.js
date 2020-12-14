import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/social-icons.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-tooltip/paper-tooltip.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/cascaded-animation.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import './appsco-info-dropdown.js';
import '../components/components/appsco-search.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoDirectoryActions extends mixinBehaviors([NeonAnimationRunnerBehavior], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: inline-block;
                position: relative;
                margin-right: -10px;
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --layout-end-justified;
                @apply --appsco-directory-actions;

                --paper-dropdown-menu-button: {
                    display: block;
                    padding: 0 0 0 8px;
                    @apply --accounts-actions-paper-dropdown-menu-button;
                };
            }
            paper-icon-button {
                color: var(--account-action-icon-color);
                --paper-icon-button-ink-color: var(--account-action-icon-color);
            }
            appsco-search {
                max-width: 200px;
            }
            paper-dropdown-menu {
                width: 150px;
                --paper-input-container-underline: {
                    display: none;
                };
                --paper-input-container-underline-focus: {
                    display: none;
                };
                --paper-dropdown-menu-ripple: {
                    display: none;
                };
                --paper-input-container-input: {
                    vertical-align: middle;
                    cursor: pointer;
                    @apply --accounts-actions-paper-dropdown-menu-input;
                };
            }
            :host paper-listbox {
                min-width: 150px;
                max-width: 230px;
                overflow: hidden;
                @apply --paper-listbox;
            }
            :host paper-item {
                min-height: 40px;
                font-size: 14px;
                cursor: pointer;
                color: var(--primary-text-color);
            }
            :host paper-item:hover {
                @apply --paper-item-hover;
            }
            :host .action {
                margin-right: 10px;
                position: relative;
                @apply --layout-vertical;
                @apply --layout-center;
                @apply --directory-action;
            }
            :host .bulk-action {
                display: none;
            }
            :host([bulk-actions]) .bulk-action {
                display: flex;
            }
            :host .bulk-action[hidden] {
                display: none !important;
            }
            :host .flex-none {
                @apply --layout-flex-none;
            }
            :host paper-icon-button::shadow paper-ripple {
                width: 150%;
                height: 150%;
                top: -25%;
                left: -25%;
            }
            :host paper-tooltip {
                top: 100% !important;
                font-weight: 500;
                min-width: 100px;
                text-align: center;
                @apply --application-actions-tooltip;
            }
            .info-icon {
                --iron-icon-fill-color: var(--info-icon-color, var(--paper-orange-300));
            }
            :host .info {
                margin: 0;
            }
            :host .emphasis {
                font-weight: 600;
            }
        </style>

        <div class="action action-search flex-none">
            <appsco-search id="appscoSearch" label="Search accounts"></appsco-search>
        </div>

        <div class="action flex-none">
            <paper-dropdown-menu horizontal-align="right" no-label-float="" on-iron-activate="_onFilterAction">
                <paper-listbox id="filterList" class="dropdown-content" selected="0" slot="dropdown-content">
                    <template is="dom-repeat" items="[[ _filterItems ]]">
                        <paper-item value\$="[[ item.value ]]" name\$="[[ item.name ]]">[[ item.name ]]</paper-item>
                    </template>
                </paper-listbox>
            </paper-dropdown-menu>
        </div>

        <div class="action bulk-action flex-none">
            <paper-icon-button id="addToGroupAction" icon="social:group-add" alt="Add to group" on-tap="_onAddToGroupAction"></paper-icon-button>
            <paper-tooltip for="addToGroupAction" position="bottom">Add to group</paper-tooltip>
        </div>

        <div class="action bulk-action flex-none">
            <paper-icon-button id="organizationUnitsAction" icon="icons:group-work" alt="Organization units" on-tap="_onOrganizationUnitsAction"></paper-icon-button>
            <paper-tooltip for="organizationUnitsAction" position="bottom">Organization units</paper-tooltip>
        </div>

        <div class="action bulk-action flex-none">
            <paper-icon-button id="removeAction" icon="icons:delete" alt="Delete applications" on-tap="_onRemoveAction"></paper-icon-button>
            <paper-tooltip for="removeAction" position="bottom">Remove</paper-tooltip>
        </div>

        <div class="action bulk-action flex-none">
            <paper-icon-button id="syncUsersAction" icon="icons:cached" alt="Sync users" on-tap="_onSyncUsersAction"></paper-icon-button>
            <paper-tooltip for="syncUsersAction" position="bottom">Sync users</paper-tooltip>
        </div>

        <template is="dom-if" if="[[ _subscriptionInfo ]]">
            <div class="action flex-none">
                <paper-icon-button id="infoAction" class="info-icon" icon="icons:info" alt="Show info" on-tap="_onToggleSubscriptionInfo"></paper-icon-button>
            </div>

            <appsco-info-dropdown id="appscoSubscriptionInfoDropdown" action-label="Upgrade" on-info-action="_onSubscriptionInfoAction">

                <div content="" slot="content">
                    <p class="info">Maximum number of
                        <span class="emphasis">[[ _subscription.quantity ]] AppsCo licences</span> have been reached.</p>
                    <p class="info">Please upgrade subscription in order to add more accounts.</p>
                </div>

            </appsco-info-dropdown>
        </template>

        <template is="dom-if" if="[[ _domainInfo ]]">
            <div class="action flex-none">
                <paper-icon-button id="infoAction" class="info-icon" icon="icons:info" alt="Show info" on-tap="_onToggleDomainInfo"></paper-icon-button>
            </div>

            <appsco-info-dropdown id="appscoDomainInfoDropdown" action-label="Manage domains" on-info-action="_onDomainInfoAction">

                <div content="" slot="content">
                    <p class="info">
                        You do not have any managed domains registered in AppsCo.
                    </p>
                    <p class="info">Please verify at least one domain in order to be able to manage user profiles.</p>
                </div>

            </appsco-info-dropdown>
        </template>

        <div class="action bulk-select-all flex-none">
            <paper-icon-button id="selectAllAction" icon="icons:done-all" alt="Select all" on-tap="_onSelectAllAction"></paper-icon-button>
            <paper-tooltip for="selectAllAction" position="bottom">Select all</paper-tooltip>
        </div>

        <div class="action flex-none">
            <paper-icon-button id="addAccountAction" icon="social:person-add" alt="Add accounts" on-tap="_onAddAccountAction"></paper-icon-button>
            <paper-tooltip for="addAccountAction" position="bottom">Add account</paper-tooltip>
        </div>

        <div class="action flex-none">
            <paper-icon-button id="importAccountsAction" icon="icons:folder-shared" alt="Import accounts" on-tap="_onImportAccountsAction"></paper-icon-button>
            <paper-tooltip for="importAccountsAction" position="bottom">Import accounts</paper-tooltip>
        </div>

        <div class="action flex-none">
            <paper-icon-button id="sendNotificationAction" icon="social:notifications" alt="Send notification" on-tap="_onSendNotificationAction"></paper-icon-button>
            <paper-tooltip for="sendNotificationAction" position="bottom">Send notification</paper-tooltip>
        </div>
`;
    }

    static get is() { return 'appsco-directory-actions'; }

    static get properties() {
        return {
            /**
             * Indicates if bulk actions for applications are visible or not.
             * Used to show / hide bulk actions.
             */
            bulkActions: {
                type: Boolean,
                value: false,
                observer: '_onBulkActionsChanged'
            },

            _bulkSelectAll: {
                type: Boolean,
                value: true,
                observer: '_onBulkSelectAllChanged'
            },

            _filterItems: {
                type: Array,
                value: function () {
                    return [
                        {
                            name: 'All users',
                            value: 'all'
                        },
                        {
                            name: 'Managed users',
                            value: 'managed'
                        },
                        {
                            name: 'Unmanaged users',
                            value: 'unmanaged'
                        },
                        {
                            name: 'Invitations',
                            value: 'invitations'
                        }];
                }
            },

            _selectedAll: {
                type: Boolean,
                value: false
            },

            _subscriptionInfo: {
                type: Boolean,
                value: false
            },

            _domainInfo: {
                type: Boolean,
                value: false
            },

            _subscription: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            animationConfig: {
                type: Object
            }
        };
    }

    ready() {
        super.ready();

        this.animationConfig = {
            'entry': {
                name: 'cascaded-animation',
                animation: 'fade-in-animation',
                nodes: [],
                nodeDelay: 50,
                timing: {
                    duration: 300
                }
            },
            'exit': {
                name: 'cascaded-animation',
                animation: 'fade-out-animation',
                nodes: [],
                nodeDelay: 0,
                timing: {
                    duration: 200
                }
            }
        };

        afterNextRender(this, function () {
            this._addListeners();
        });
    }

    _addListeners() {
        this.addEventListener('neon-animation-finish', this._onNeonAnimationFinish);
    }

    _selected(e) {
        this.dispatchEvent(new CustomEvent('group-selected', {
            bubbles: true,
            composed: true,
            detail: {
                id: e.detail.item.getAttribute('value'),
                name: e.detail.item.getAttribute('name')
            }
        }));
    }

    _onAddAccountAction() {
        this.dispatchEvent(new CustomEvent('add-account', { bubbles: true, composed: true }));
    }

    _onImportAccountsAction() {
        this.dispatchEvent(new CustomEvent('import-accounts', { bubbles: true, composed: true }));
    }

    _onRemoveAction() {
        this.dispatchEvent(new CustomEvent('remove', { bubbles: true, composed: true }));
    }

    _onSyncUsersAction() {
        this.dispatchEvent(new CustomEvent('sync-users', { bubbles: true, composed: true }));
    }

    _onSelectAllAction() {
        this.dispatchEvent(new CustomEvent('select-all-company-roles', { bubbles: true, composed: true }));
    }

    _onAddToGroupAction() {
        this.dispatchEvent(new CustomEvent('add-groups-to-company-roles', { bubbles: true, composed: true }));
    }

    _onOrganizationUnitsAction() {
        this.dispatchEvent(new CustomEvent('orgunits', { bubbles: true, composed: true }));
    }

    _onSendNotificationAction() {
        this.dispatchEvent(new CustomEvent('send-notification', { bubbles: true, composed: true }));
    }

    _onSearchIcon() {
        this.dispatchEvent(new CustomEvent('search-icon', { bubbles: true, composed: true }));
    }

    _onFilterAction(event) {
        this.dispatchEvent(new CustomEvent('filter-roles', {
            bubbles: true,
            composed: true,
            detail: {
                filter: event.detail.item.getAttribute('value'),
                name: event.detail.item.getAttribute('name')
            }
        }));
    }

    focusSearch() {
        this.$.appscoSearch.setup();
    }

    _onBulkActionsChanged() {
        var bulkActions = dom(this.root).querySelectorAll('.bulk-action');

        if (this.animationConfig) {
            this.animationConfig.entry.nodes = bulkActions;
            this.animationConfig.exit.nodes = bulkActions;
        }

        if (this.bulkActions) {
            var length = bulkActions.length;

            for (var i = 0; i < length; i++) {
                bulkActions[i].style.display = 'flex';
            }
            this.playAnimation('entry');
        }
        else {
            this.playAnimation('exit');
        }
    }

    showBulkActions() {
        this.bulkActions = true;
    }

    hideBulkActions() {
        this.bulkActions = false;
    }

    showBulkSelectAll() {
        this._bulkSelectAll = true;
    }

    hideBulkSelectAll() {
        this._bulkSelectAll = false;
    }

    _onBulkSelectAllChanged () {
        var bulkSelectAll = dom(this.root).querySelectorAll('.bulk-select-all');
        if (this._bulkSelectAll) {
            bulkSelectAll[0].style.display = 'block';
        }else {
            bulkSelectAll[0].style.display = 'none';
        }
    }

    showSubscriptionLimitReachedInfo(subscription) {
        this._subscription = subscription;
        this._subscriptionInfo = true;
    }

    hideSubscriptionLimitReachedInfo() {
        this._subscriptionInfo = false;
    }

    showDomainNotVerifiedInfo() {
        this._domainInfo = true;
    }

    hideDomainNotVerifiedInfo() {
        this._domainInfo = false;
    }

    _onToggleSubscriptionInfo(event) {
        this.shadowRoot.getElementById('appscoSubscriptionInfoDropdown').toggle(event.target);
    }

    _onToggleDomainInfo(event) {
        this.shadowRoot.getElementById('appscoDomainInfoDropdown').toggle(event.target);
    }

    _onSubscriptionInfoAction() {
        this.dispatchEvent(new CustomEvent('upgrade', { bubbles: true, composed: true }));
    }

    _onDomainInfoAction() {
        this.dispatchEvent(new CustomEvent('manage-domains', { bubbles: true, composed: true }));
    }

    _onNeonAnimationFinish() {
        if (!this.bulkActions) {
            var bulkActions = dom(this.root).querySelectorAll('.bulk-action'),
                length = bulkActions.length;

            for (var i = 0; i < length; i++) {
                bulkActions[i].style.display = 'none';
            }
        }
    }

    _resetFilter() {
        this.shadowRoot.getElementById('filterList').selected = 0;
    }

    reset() {
        this.$.appscoSearch.reset();
        this._resetFilter();
        this.hideBulkActions();
    }

    resetTypeFilter() {
        this._resetFilter();
    }
}
window.customElements.define(AppscoDirectoryActions.is, AppscoDirectoryActions);
