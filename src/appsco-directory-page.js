import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-tabs/paper-tabs.js';
import '@polymer/paper-tabs/paper-tab.js';
import '@polymer/neon-animation/neon-animated-pages.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-media-query/iron-media-query.js';
import './components/page/appsco-content.js';
import './components/page/appsco-page-styles.js';
import './components/account/appsco-accounts.js';
import './components/account/appsco-account-details.js';
import './components/account/appsco-account-security.js';
import './components/account/appsco-account-log.js';
import './components/orgunit/appsco-orgunit-tree.js';
import './components/account/appsco-invitations.js';
import './components/components/appsco-search.js';
import './components/group/appsco-company-groups.js';
import './components/account/appsco-account-image.js';
import { AppscoPageBehavior } from './components/components/appsco-page-behavior.js';
import { AppscoListObserverBehavior } from './components/components/appsco-list-observer-behavior.js';
import './directory/appsco-directory-page-actions.js';
import './components/orgunit/appsco-orgunit-modify.js';
import './components/orgunit/appsco-orgunit-remove.js';
import './components/account/company/appsco-account-remove.js';
import './components/account/company/appsco-directory-sync.js';
import './directory/appsco-directory-add-account.js';
import './directory/appsco-import-accounts.js';
import './components/notifications/appsco-send-notification.js';
import './components/account/company/appsco-account-orgunit.js';
import './components/group/appsco-resource-add-groups.js';
import './upgrade/appsco-upgrade-action.js';
import './components/account/appsco-invitation-remove.js';
import './lib/mixins/appsco-headers-mixin.js';
import './lib/mixins/appsco-page-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender, afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { NeonAnimatableBehavior } from '@polymer/neon-animation/neon-animatable-behavior.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoDirectoryPage extends mixinBehaviors([
    NeonAnimatableBehavior,
    AppscoPageBehavior,
    AppscoListObserverBehavior,
    Appsco.HeadersMixin,
    Appsco.PageMixin
], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-page-styles">
            :host {
                --appsco-list-item-message: {
                    font-size: 14px;
                    @apply --paper-font-common-nowrap;
                };

                --account-log-appsco-list-item: {
                    padding-top: 14px;
                    padding-bottom: 8px;
                };

                --account-details-label: {
                    font-size: 12px;
                };
                --account-details-value: {
                    font-size: 14px;
                };

                --appsco-account-log-container: {
                     padding-top: 0;
                 };
            }
            :host .resource-content {
                height: 100%;
            }
            appsco-account-security {
                --security-score: {
                    width: 32px;
                    height: 32px;
                    font-size: 14px;
                };
            }
            paper-tabs {
                height: 32px;
                @apply --layout-flex-none;
            }
            .paper-tabs-pages {
                @apply --paper-tabs-pages;
            }
            .tab-content {
                margin-top: 20px;
                @apply --paper-tabs-content-style;
            }
            appsco-company-groups {
                margin-top: 20px;

                --appsco-company-group-item: {
                    padding: 4px;
                    margin-bottom: 5px;
                };
            }
            appsco-account-image {
                --account-image: {
                    width: 32px;
                    height: 32px;
                    margin-right: 5px;
                };

                --account-initials-background-color: var(--body-background-color-darker);
                --account-initials-font-size: 14px;
            }
            :host .account-name {
                @apply --paper-font-subhead;
                @apply --paper-font-common-nowrap;
                font-size: 18px;
            }
            :host([mobile-screen]) {
                --resource-width: 100%;
            }
            :host([screen992]) {
                --account-basic-info: {
                     width: 140px;
                 };
                --account-basic-info-values: {
                     width: 140px;
                 };

                --account-auth-type-info: {
                     width: 140px;
                 };
                --account-auth-type-info-values: {
                     width: 140px;
                 };
            }
        </style>

        <iron-media-query query="(max-width: 992px)" query-matches="{{ screen992 }}"></iron-media-query>
        <iron-media-query query="(max-width: 800px)" query-matches="{{ tabletScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 600px)" query-matches="{{ mobileScreen }}"></iron-media-query>

        <iron-ajax auto="" url="[[ companyOrgunitsApi ]]" headers="[[ _headers ]]" handle-as="json" on-response="_onOrgunitsResponse"></iron-ajax>

        <iron-ajax id="getDomainsCall" auto="" url="[[ domainsApi ]]" headers="[[ _headers ]]" on-response="_onDomainResponse"></iron-ajax>

        <iron-ajax id="companySubscriptionInfo" url="[[ companySubscriptionApi ]]" headers="[[ _headers ]]" handle-as="json" auto="" on-response="_onSubscriptionResponse"></iron-ajax>

        <appsco-content id="appscoContent" resource-active="">

            <div class="flex-vertical" resource="" slot="resource">
                <div class="resource-content flex-vertical">
                    <paper-tabs id="paperTabs" selected="{{ _selectedFilter }}">
                        <paper-tab name="organization-units">Organization units</paper-tab>
                        <paper-tab name="groups">Groups</paper-tab>
                    </paper-tabs>

                    <neon-animated-pages selected="{{ _selectedFilter }}" entry-animation="fade-in-animation" exit-animation="fade-out-animation" class="paper-tabs-pages">

                        <div name="organization-units" class="tab-content organization-units">
                            <appsco-orgunit-tree id="appscoOrgunitTree" org-units="[[ _orgUnits ]]" on-add-orgunit="_onAddOrgunit" on-modify-orgunit="_onModifyOrgunit" on-remove-orgunit="_onRemoveOrgunit" on-selected="_onOrgunitSelected"></appsco-orgunit-tree>
                        </div>

                        <div name="groups" class="tab-content groups">
                            <appsco-search id="appscoSearch" label="Search groups" on-search="_onSearchGroups" on-search-clear="_onSearchGroupsClear"></appsco-search>

                            <appsco-company-groups id="appscoCompanyGroups" list-api="[[ groupsApi ]]" authorization-token="[[ authorizationToken ]]" size="100" type="group" preview="" selectable="" on-item="_onGroupSelected"></appsco-company-groups>
                        </div>

                    </neon-animated-pages>
                </div>
            </div>

            <div content="" slot="content">
                <div class="content-container">

                    <appsco-invitations hidden\$="[[ !_invitationsVisible ]]" id="appscoInvitations" size="100" authorization-token="[[ authorizationToken ]]" invitations-api="[[ companyInvitationsApi ]]" on-remove="_onRemoveInvitation" on-loaded="_onInvitationsLoaded" on-empty-load="_onInvitationsEmptyLoad" on-invitation-resent="_onInvitationResent" on-observable-list-empty="_onObservableItemListChange" on-observable-list-filled="_onObservableItemListChange"></appsco-invitations>

                    <appsco-accounts hidden\$="[[ !_accountsVisible ]]" id="appscoAccounts" type="account" size="100" load-more="" selectable="" authorization-token="[[ authorizationToken ]]" list-api="[[ companyDirectoryRolesApi ]]" on-item="_onAccountAction" on-select-item="_onAccountSelectAction" on-edit-item="_onAccountEditAction" on-list-loaded="_onAccountsLoaded" on-list-empty="_onAccountsEmptyLoad" on-observable-list-empty="_onObservableItemListChange" on-observable-list-filled="_onObservableItemListChange"></appsco-accounts>
                </div>
            </div>

            <div class="flex-vertical" info="" slot="info">
                <div class="info-header flex-horizontal">
                    <appsco-account-image account="[[ role.account ]]"></appsco-account-image>
                    <span class="account-name flex">[[ role.account.name ]]</span>
                    <appsco-account-security role="[[ role ]]"></appsco-account-security>
                </div>

                <div class="info-content flex-vertical">

                    <paper-tabs id="paperTabs" selected="{{ _selectedTab }}">
                        <paper-tab name="info">Info</paper-tab>
                        <paper-tab name="log">Log</paper-tab>
                    </paper-tabs>

                    <neon-animated-pages selected="{{ _selectedTab }}" entry-animation="fade-in-animation" exit-animation="fade-out-animation" class="paper-tabs-pages">

                        <div name="info" class="tab-content details">
                            <appsco-account-details account="[[ role.account ]]"></appsco-account-details>

                        </div>

                        <div name="log" class="tab-content log">
                            <appsco-account-log id="accountLog" log-api="[[ role.meta.log ]]" authorization-token="[[ authorizationToken ]]" size="5" short-view=""></appsco-account-log>
                        </div>

                    </neon-animated-pages>

                </div>

                <div class="info-actions flex-horizontal">
                    <paper-button class="button flex" on-tap="_onAccountInfoEdit">
                        Edit
                    </paper-button>
                </div>
            </div>
        </appsco-content>

        <appsco-account-remove id="appscoAccountsRemove" accounts="[[ selectedAccounts ]]" authorization-token="[[ authorizationToken ]]" company-api="[[ companyApi ]]" api-errors="[[ apiErrors ]]" on-accounts-removed="_onAccountsRemoved">
        </appsco-account-remove>
        
        <appsco-directory-sync id="appscoDirectorySync" accounts="[[ selectedAccounts ]]" authorization-token="[[ authorizationToken ]]" company-api="[[ companyApi ]]" api-errors="[[ apiErrors ]]" on-directory-synced="_onDirectorySynced">
        </appsco-directory-sync>

        <appsco-directory-add-account id="appscoDirectoryAccountAdd" authorization-token="[[ authorizationToken ]]" add-company-role-api="[[ companyDirectoryRolesApi]]" add-invitation-api="[[ companyInvitationsApi ]]" api-errors="[[ apiErrors ]]" on-company-role-created="_onCompanyRoleCreated" on-invitation-created="_onInvitationCreated">
        </appsco-directory-add-account>

        <appsco-import-accounts id="appscoDirectoryImportAccounts" authorization-token="[[ authorizationToken ]]" import-api="[[ companyImportAccountsApi ]]" domain="[[ domain ]]" on-import-finished="_onAccountImportFinished">
        </appsco-import-accounts>

        <appsco-orgunit-modify id="appscoOrgunitModify" on-orgunit-added="_onOrgunitAdded" on-orgunit-modified="_onOrgunitModified" authorization-token="[[ authorizationToken ]]">
        </appsco-orgunit-modify>

        <appsco-orgunit-remove id="appscoOrgunitRemove" on-orgunit-removed="_onOrgunitRemoved" authorization-token="[[ authorizationToken ]]">
        </appsco-orgunit-remove>

        <appsco-send-notification id="appscoSendNotification" authorization-token="[[ authorizationToken ]]" company-notifications-api="[[ companyNotificationsApi ]]" get-roles-api="[[ companyDirectoryRolesApi ]]" get-contacts-api="[[ companyContactsApi ]]" api-errors="[[ apiErrors ]]" on-notification-sent="_onNotificationSent">
        </appsco-send-notification>

        <appsco-account-orgunit id="appscoAccountOrgunit" authorization-token="[[ authorizationToken ]]" company-orgunits-api="[[ companyOrgunitsApi ]]" accounts="[[ selectedAccounts ]]">
        </appsco-account-orgunit>


        <appsco-resource-add-groups id="appscoShareToGroupDialog" authorization-token="[[ authorizationToken ]]" groups-api="[[ groupsApi ]]">
        </appsco-resource-add-groups>

        <appsco-upgrade-action id="appscoUpgradeAction" authorization-token="[[ authorizationToken ]]" company-api="[[ companyApi ]]">
        </appsco-upgrade-action>

        <appsco-invitation-remove id="appscoInvitationRemove" authorization-token="[[ authorizationToken ]]" on-invitation-removed="_onInvitationRemoved" on-invitation-already-removed="_onInvitationAlreadyRemoved">
        </appsco-invitation-remove>
`;
    }

    static get is() { return 'appsco-directory-page'; }

    static get properties() {
        return {
            selectedAccounts: {
                type: Array,
                value: function () {
                    return [];
                },
                notify: true
            },

            _orgUnits: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _bulkActions: {
                type: Boolean,
                value: false,
                notify: true
            },

            _infoShown: {
                type: Boolean,
                value: false
            },

            _selectedTab: {
                type: Number
            },

            companySubscriptionApi: {
                type: String
            },

            domainsApi: {
                type: String
            },

            groupsApi: {
                type: String
            },

            companyInvitationsApi: {
                type: String
            },

            companyDirectoryRolesApi: {
                type: String
            },

            companyOrgunitsApi: {
                type: String
            },

            companyRolesApi: {
                type: String
            },

            companyNotificationsApi: {
                type: String
            },

            companyContactsApi: {
                type: String
            },

            companyImportAccountsApi: {
                type: String
            },

            companyApi: {
                type: String
            },

            subscription: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            subscriptionLoaded: {
                type: Boolean,
                value: false
            },

            _roles: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            role: {
                type: Object,
                value: function () {
                    return {};
                },
                observer: '_onRoleChange'
            },

            domain: {
                type: String
            },

            _accountSelectAction: {
                type: Number,
                value: 0
            },

            _accountsLoaded: {
                type: Boolean,
                value: false
            },

            _invitationsLoaded: {
                type: Boolean,
                value: false
            },

            _domainsLoaded: {
                type: Boolean,
                value: false
            },

            _verifiedDomain: {
                type: Boolean,
                value: true
            },

            _verifiedDomains: {
                type: Number,
                value: 0
            },

            _pageReady: {
                type: Boolean,
                computed: '_computePageReadyState(_accountsLoaded, _invitationsLoaded, _domainsLoaded, subscriptionLoaded)',
                observer: '_onPageReadyChanged'
            },

            _subscriptionLimitInfoHandled: {
                type: Boolean,
                value: false,
                observer: '_onSubscriptionLimitInfoHandled'
            },

            _selectedFilter: {
                type: Number,
                value: 0,
                observer: '_onSelectedFilterChanged'
            },

            _accountsVisible: {
                type: Boolean,
                value: true
            },

            _invitationsVisible: {
                type: Boolean,
                value: false
            },

            mobileScreen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            tabletScreen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            screen992: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            animationConfig: {
                type: Object
            },

            pageLoaded: {
                type: Boolean,
                value: false
            },

            apiErrors: {
                type: Object
            },

            toolbar: {
                type: Object
            }
        };
    }

    static get observers() {
        return [
            '_updateScreen(mobileScreen, tabletScreen, screen992)',
            '_hideFilters(mobileScreen)'
        ];
    }

    ready() {
        super.ready();

        this.pageLoaded = false;
        this.animationConfig = {
            'entry': {
                name: 'fade-in-animation',
                node: this,
                timing: {
                    duration: 300
                }
            },
            'exit': {
                name: 'fade-out-animation',
                node: this,
                timing: {
                    duration: 200
                }
            }
        };

        beforeNextRender(this, function() {
            if (this.mobileScreen || this.tabletScreen || this.screen992) {
                this.updateStyles();
            }
        });

        afterNextRender(this, function() {
            this.set('_itemsComponent', this.shadowRoot.getElementById('appscoAccounts'));
            this._addListeners();
        });
    }

    _addListeners() {
        this.toolbar.addEventListener('add-account', this._onCompanyAddAccount.bind(this));
        this.toolbar.addEventListener('search', this._onSearchAccounts.bind(this));
        this.toolbar.addEventListener('search-clear', this._onSearchAccountsClear.bind(this));
        this.toolbar.addEventListener('filter-roles', this._onFilterRoles.bind(this));
        this.toolbar.addEventListener('send-notification', this._onSendNotificationToCompanyRoles.bind(this));
        this.toolbar.addEventListener('orgunits', this._onAddAccountsToOrgunit.bind(this));
        this.toolbar.addEventListener('remove', this._onRemoveAccounts.bind(this));
        this.toolbar.addEventListener('sync-users', this._onDirectorySync.bind(this));
        this.toolbar.addEventListener('select-all-company-roles', this._onSelectAllCompanyRolesAction.bind(this));
        this.toolbar.addEventListener('import-accounts', this._onCompanyImportAccounts.bind(this));
        this.toolbar.addEventListener('add-groups-to-company-roles', this._onAddGroupsToCompanyRoles.bind(this));
        this.toolbar.addEventListener('upgrade', this._fireUpgrade.bind(this));
    }

    initializePage() {
        this.setDefaultAccount();
    }

    _onObservableItemListChange(event, data) {
        if((data.type === 'accounts' && this._accountsVisible) || (data.type === 'invitations' && this._invitationsVisible)) {
            this.setObservableType('account-page');
            this.populateItems(data.items);
        }
        event.stopPropagation();
    }

    _hideFilters(mobile) {
        if (mobile) {
            this.hideResource();
        }
    }

    hideResource() {
        this.$.appscoContent.hideSection('resource');
    }

    _updateScreen() {
        this.updateStyles();
    }

    _computePageReadyState(accounts, invitations, domains, subscriptionLoaded) {
        const ready = (accounts && invitations && domains);

        for (const key in this.subscription) {
            return ready && subscriptionLoaded;
        }

        return ready;
    }

    _onPageReadyChanged(pageReady) {
        if (pageReady) {
            this._pageLoaded();
            this._handleSubscriptionLimitReachedInfo();
        }
    }

    _onSelectedFilterChanged(newValue, oldValue) {
        if (undefined !== oldValue) {
            this.resetPage();
        }
    }

    _resetFilters() {
        this.$.appscoCompanyGroups.reset();
        this.$.appscoOrgunitTree.reset();
    }

    _resetTypeFilter() {
        this.toolbar.resetTypeFilter();
    }

    _onSubscriptionLimitInfoHandled(handled) {
        if (handled) {
            this._evaluateDomainVerification();
        }
    }

    _pageLoaded() {
        this.pageLoaded = true;
        this.dispatchEvent(new CustomEvent('page-loaded', { bubbles: true, composed: true }));
    }

    hideInfo() {
        this.$.appscoContent.hideSection('info');
        this._infoShown = false;
    }

    toggleInfo() {
        this.$.appscoContent.toggleSection('info');
        this._infoShown = !this._infoShown;

        if (this._infoShown) {
            this._selectedTab = 0;
        }
        else {
            this.shadowRoot.getElementById('appscoAccounts').deactivateItem(this.role);
            this.setDefaultAccount();
        }
    }

    toggleResource() {
        this.$.appscoContent.toggleSection('resource');
    }

    pageSelected () {
        this._showAccounts();
        this._hideInvitations();
        this.reloadInvitations();
        this.reloadAccounts();
    }

    reloadAccounts() {
        this._accountsLoaded = false;
        this.shadowRoot.getElementById('appscoAccounts').reloadItems();
    }

    setSubscription(subscription) {
        this.subscription = subscription;
        this.subscriptionLoaded = true;
    }

    addGroup(group) {
        this.$.appscoCompanyGroups.addItems([group]);
    }

    removeGroup(group) {
        this.removeGroups([group]);
    }

    modifyGroups(groups) {
        this.$.appscoCompanyGroups.modifyItems(groups);
    }

    removeGroups(groups) {
        this.$.appscoCompanyGroups.removeItems(groups);
    }

    resetPage() {
        this.set('selectedAccounts', []);
        this._resetPageLists();
        this._resetFilters();
        this.toolbar.resetPageActions();
        this.hideInfo();
    }

    _resetPageActions() {
        this.toolbar.resetPageActions();
    }

    _resetPageLists() {
        this._deselectAllItems();
        this.shadowRoot.getElementById('appscoAccounts').reset();
        this.shadowRoot.getElementById('appscoInvitations').reset();
    }

    _onRoleChange(role) {
        if (role && role.meta && role.meta.log) {
            this._loadLog();
        }
    }

    _loadLog() {
        this.$.accountLog.loadLog();
    }

    _onInvitationsLoaded() {
        this._invitationsLoaded = true;
    }

    _onInvitationsEmptyLoad() {
        this._invitationsLoaded = true;
    }

    _onRemoveInvitation(event) {
        const dialog = this.shadowRoot.getElementById('appscoInvitationRemove');
        dialog.setInvitation(event.detail.invitation);
        dialog.open();
    }

    _onAccountsLoaded() {
        this._accountsLoaded = true;
        this.setDefaultAccount();
    }

    _onAccountsEmptyLoad() {
        this._accountsLoaded = true;
    }

    _showInfo() {
        this.$.appscoContent.showSection('info');
        this._infoShown = true;
        this._selectedTab = 0;
    }

    _handleAccountInfo(role) {
        this.set('role', role);

        if (!this._infoShown) {
            this._showInfo();
        }
    }

    _onViewInfo(event) {
        this._handleAccountInfo(event.detail.item);
    }

    setDefaultAccount() {
        this.set('role', this.shadowRoot.getElementById('appscoAccounts').getFirstItem());
    }

    _onAccountEditAction(event) {
        const role = event.detail.item;

        this.set('role', role);
        this.dispatchEvent(new CustomEvent('edit-account', {
            bubbles: true,
            composed: true,
            detail: {
                role: role
            }
        }));
    }

    _onAccountAction(event) {
        if (event.detail.item.activated) {
            this._onViewInfo(event);
        }
        else {
            this.hideInfo();
            this.setDefaultAccount();
        }
    }

    _onAccountSelectAction(event) {
        const account = event.detail.item;

        clearTimeout(this._accountSelectAction);

        this._accountSelectAction = setTimeout(function() {
            if (account.selected) {
                this._showBulkActions();
            }
            else {
                const selectedAccount = this.shadowRoot.getElementById('appscoAccounts').getFirstSelectedItem();
                for (const key in selectedAccount) {
                    return false;
                }

                this._hideBulkActions();
            }
        }.bind(this), 10);

        this._handleItemsSelectedState();
    }

    _onAccountInfoEdit() {
        this.dispatchEvent(new CustomEvent('info-edit-account', {
            bubbles: true,
            composed: true,
            detail: {
                role: this.role
            }
        }));
    }

    _onOrgunitsResponse(event) {
        if(null == event.detail.response) {
            return;
        }

        this._orgUnits = event.detail.response.orgunits;
    }

    _onDomainResponse(event) {
        const status = event.detail.status,
            response = event.detail.response;

        if (200 === status && response) {
            this._verifiedDomains = response.verified;
            this._domainsLoaded = true;
            this._evaluateDomainVerification();
        }
    }

    _handleSubscriptionLimitReachedInfo() {
        const subscription = this.subscription,
            licencesTotal = subscription.quantity,
            accountsTotal = this.shadowRoot.getElementById('appscoAccounts').getTotalCount() + this.shadowRoot.getElementById('appscoInvitations').getTotalCount();

        if (licencesTotal <= accountsTotal) {
            this._showSubscriptionLimitReachedInfo(subscription);
        }
        else {
            this._hideSubscriptionLimitReachedInfo();
        }

        this._subscriptionLimitInfoHandled = true;
    }

    _evaluateSubscriptionLicences() {
        if (this._pageReady) {
            this._handleSubscriptionLimitReachedInfo();
        }
    }

    evaluateSubscriptionLicences() {
        this._evaluateSubscriptionLicences();
    }

    evaluateDomainVerification(config) {
        if (config.added && config.domain.verified) {
            this._verifiedDomains++;
        }
        else if (config.removed && config.domain.verified) {
            if (0 < this._verifiedDomains) {
                this._verifiedDomains--;
            }
        }

        this._evaluateDomainVerification();
    }

    _evaluateDomainVerification() {
        (0 === this._verifiedDomains) ? this._showDomainNotVerifiedInfo() : this._hideDomainNotVerifiedInfo();
    }

    _showSubscriptionLimitReachedInfo(subscription) {
        this.toolbar.showSubscriptionLimitReachedInfo(subscription);
    }

    _hideSubscriptionLimitReachedInfo() {
        this.toolbar.hideSubscriptionLimitReachedInfo();
    }

    _showDomainNotVerifiedInfo() {
        this._verifiedDomain = false;
        this.toolbar.showDomainNotVerifiedInfo();
    }

    _hideDomainNotVerifiedInfo() {
        this._verifiedDomain = true;
        this.toolbar.hideDomainNotVerifiedInfo();
    }

    hideDomainNotVerifiedInfo() {
        if (!this._verifiedDomain) {
            this._hideDomainNotVerifiedInfo();
        }
    }

    addOrgunit(orgunit) {
        this.$.appscoOrgunitTree.addOrgunit(orgunit);
    }

    modifyOrgunit(orgunit) {
        this.$.appscoOrgunitTree.setOrgunit(orgunit);
        this.shadowRoot.getElementById('appscoAccounts').setOrgunit(orgunit);
    }

    removeOrgunit(orgunit) {
        this.$.appscoOrgunitTree.removeOrgunit(orgunit);
    }

    addInvitations(invitations) {
        this.shadowRoot.getElementById('appscoInvitations').addInvitations(invitations);
        this._evaluateSubscriptionLicences();
    }

    removeInvitations(invitations) {
        this.shadowRoot.getElementById('appscoInvitations').removeInvitations(invitations);
        this._evaluateSubscriptionLicences();
    }

    reloadInvitations() {
        this._invitationsLoaded = false;
        this.shadowRoot.getElementById('appscoInvitations').reloadInvitations();
    }

    addAccounts(accounts) {
        this.shadowRoot.getElementById('appscoAccounts').addItems(accounts);
        this._evaluateSubscriptionLicences();
    }

    updateAccount(account) {
        this.shadowRoot.getElementById('appscoAccounts').updateAccount(account);
    }

    modifyAccounts(accounts) {
        this.shadowRoot.getElementById('appscoAccounts').modifyItems(accounts);
    }

    removeAccounts(accounts) {
        this.shadowRoot.getElementById('appscoAccounts').removeItems(accounts);
        this.setDefaultAccount();
        this._evaluateSubscriptionLicences();
    }

    getSelectedAccounts() {
        return this.shadowRoot.getElementById('appscoAccounts').getSelectedItems();
    }

    filterDirectoryResourcesByTerm(term) {
        this.shadowRoot.getElementById('appscoInvitations').filterByTerm(term);
        this.shadowRoot.getElementById('appscoAccounts').filterByTerm(term);
    }

    filterAccounts(filter) {
        this._resetFilters();

        switch (filter) {
            case 'all':
            case 'managed':
            case 'unmanaged':
                this._hideInvitations();
                this._showAccounts();
                this.shadowRoot.getElementById('appscoAccounts').filterByType(filter);
                break;
            case 'invitations':
                this._invitationsLoaded = false;
                this._hideAccounts();
                this._showInvitations();
                this.shadowRoot.getElementById('appscoInvitations').filterInvitations();
                break;
            default:
                return false;
        }
    }

    _showAccounts() {
        this._accountsVisible = true;
    }

    _hideAccounts() {
        this._accountsVisible = false;
    }

    _showInvitations() {
        this._invitationsVisible = true;
    }

    _hideInvitations() {
        this._invitationsVisible = false;
    }

    _onOrgunitSelected(event) {
        this.shadowRoot.getElementById('appscoAccounts').filterByOrgunit(event.detail);
        this._resetTypeFilter();
    }

    _searchGroups(term) {
        this.$.appscoCompanyGroups.filterByTerm(term);
    }

    _onSearchGroups(event) {
        this._searchGroups(event.detail.term);
    }

    _onSearchGroupsClear() {
        this.$.appscoSearch.reset();
        this._searchGroups('');
    }

    _loadCompanyRolesForGroup(group) {
        this.shadowRoot.getElementById('appscoAccounts').filterByGroup(group);
    }

    _onGroupSelected(event) {
        this._loadCompanyRolesForGroup(event.detail.item);
        this._resetTypeFilter();
    }

    _onSubscriptionResponse(event) {
        const status = event.detail.status,
            subscriptions = event.detail.response;

        if (200 === status && subscriptions) {
            subscriptions.forEach(function(element) {
                if (element.type === 'company' && element.status === 'active') {
                    this.dispatchEvent(new CustomEvent('company-subscription-loaded', {
                        bubbles: true,
                        composed: true,
                        detail: {
                            subscription: element
                        }
                    }));
                }
            }.bind(this));
        }
    }

    _onCompanyAddAccount() {
        this.shadowRoot.getElementById('appscoDirectoryAccountAdd').toggle();
    }

    _onInvitationCreated(event) {
        const invitation = event.detail.invitation;
        this.addInvitations([invitation]);
        this._notify('Invitation for account ' + invitation.email + ' was successfully created and can be found under invitations.');
    }

    _onCompanyRoleCreated(event) {
        this.addAccounts([event.detail.role]);
        this._notify('Account ' + event.detail.role.account.email + ' was successfully added.');
    }

    _searchAccounts(term) {
        this._showProgressBar();
        this.filterDirectoryResourcesByTerm(term);
    }

    _onSearchAccounts(event) {
        this._searchAccounts(event.detail.term);
    }

    _onSearchAccountsClear() {
        this._searchAccounts('');
    }

    _onFilterRoles(event) {
        const filter = event.detail.filter;

        this._showProgressBar();
        this.filterAccounts(filter);
    }

    _onSendNotificationToCompanyRoles() {
        const dialog = this.shadowRoot.getElementById('appscoSendNotification');
        dialog.setFilterType('user');
        dialog.toggle();

        this._hideProgressBar();
    }

    _onNotificationSent(event) {
        this._notify('Notification successfully sent to '+ event.detail.counter +' accounts.');
    }

    _onAddAccountsToOrgunit() {
        const selectedAccounts = this.getSelectedAccounts();
        if (selectedAccounts.length > 0) {
            this.set('selectedAccounts', selectedAccounts);
            this.shadowRoot.getElementById('appscoAccountOrgunit').toggle();
        }
        else {
            this._hideBulkActions();
        }
    }

    _onRemoveAccounts() {
        const selectedAccounts = this.getSelectedAccounts();

        if (selectedAccounts.length > 0) {
            this.set('selectedAccounts', selectedAccounts);
            this.shadowRoot.getElementById('appscoAccountsRemove').toggle();
        }
        else {
            this._hideBulkActions()
        }
    }

    _onDirectorySync() {
        const selectedAccounts = this.getSelectedAccounts();

        if (selectedAccounts.length > 0) {
            this.set('selectedAccounts', selectedAccounts);
            this.shadowRoot.getElementById('appscoDirectorySync').toggle();
        }
        else {
            this._hideBulkActions()
        }
    }

    _onAccountsRemoved(event) {
        this.removeAccounts(event.detail.accounts);
        this._hideBulkActions();
        this.set('selectedAccounts', []);
        this._notify('Selected accounts were successfully removed from company.');
    }

    _onDirectorySynced(event) {
        this._hideBulkActions();
        this.set('selectedAccounts', []);
        this._deselectAllItems();
        this.shadowRoot.getElementById('appscoAccounts').deselectAllItems();
        this._notify('Selected accounts are in sync process.');
    }

    _onCompanyImportAccounts() {
        this.shadowRoot.getElementById('appscoDirectoryImportAccounts').toggle();
    }

    _onAccountImportFinished(event) {
        const response = event.detail.response;
        let message = response.numberOfRoles + ' accounts imported out of ' + response.total + '.'
            + ' Number of invitations created: ' + response.numberOfInvitations + '.'
            + ' Number of failed imports: ' + response.numberOfFailed + '.';

        if (0 < response.numberOfRoles) {
            this.reloadAccounts();
        }

        if (0 < response.numberOfInvitations) {
            this.reloadInvitations();
        }

        if (response.maxSubscriptionSizeReached) {
            this._showSubscriptionLimitReachedInfo(this._subscription);
        }

        this._notify(message, true);
    }

    _onSelectAllCompanyRolesAction() {
        this.selectAllItems();
    }

    _onAddGroupsToCompanyRoles() {
        const selectedRoles = this.getSelectedAccounts();

        if (selectedRoles.length > 0) {
            const dialog = this.shadowRoot.getElementById('appscoShareToGroupDialog');
            dialog.setItems(selectedRoles);
            dialog.setType('role');
            dialog.open();
        }
    }

    _onInvitationResent(event) {
        this._notify('Invitation for account ' + event.detail.invitation.email + ' has been sent.');
    }

    _onAddOrgunit(event) {
        const orgunitAddDialog = this.shadowRoot.getElementById('appscoOrgunitModify');

        orgunitAddDialog.parent = event.detail.orgUnit;
        orgunitAddDialog.orgUnit = {};
        orgunitAddDialog.open();
    }

    _onOrgunitAdded(event) {
        const orgunit = event.detail.orgUnit;
        this.addOrgunit(orgunit);
        this._notify('Organization unit ' + orgunit.name + ' successfully added.');
    }

    _onModifyOrgunit(event) {
        const orgunitModifyDialog = this.shadowRoot.getElementById('appscoOrgunitModify');

        orgunitModifyDialog.parent = {};
        orgunitModifyDialog.orgUnit = event.detail.orgUnit;
        orgunitModifyDialog.open();
    }

    _onOrgunitModified(event) {
        const orgunit = event.detail.orgUnit;
        this.modifyOrgunit(orgunit);
        this._notify('Organization unit ' + orgunit.name + ' successfully modified.');
    }

    _onRemoveOrgunit(event) {
        const orgunitRemoveDialog = this.shadowRoot.getElementById('appscoOrgunitRemove');

        orgunitRemoveDialog.orgUnit = event.detail.orgUnit;
        orgunitRemoveDialog.open();
    }

    _onOrgunitRemoved(event) {
        const orgunit = event.detail.orgUnit;
        this.removeOrgunit(orgunit);
        this._notify('Organization unit ' + orgunit.name + ' successfully removed.');
    }

    _fireUpgrade(event) {
        const dialog = this.shadowRoot.getElementById('appscoUpgradeAction');
        dialog.setSubscription(event.detail.subscription);
        dialog.setPlans(event.detail.plans);
        dialog.initializePage();
        dialog.toggle();
    }

    _onInvitationRemoved(event) {
        const invitation = event.detail.invitation;
        this.removeInvitations([invitation]);
        this._notify('Invitation for account ' + invitation.email + ' has been removed.');
    }

    _onInvitationAlreadyRemoved(event) {
        const invitation = event.detail.invitation;
        this.removeInvitations([invitation]);
        this._notify('Invitation for account ' + invitation.email + ' has already been removed.');
    }
}
window.customElements.define(AppscoDirectoryPage.is, AppscoDirectoryPage);
