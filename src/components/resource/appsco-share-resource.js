import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-ajax/iron-request.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/neon-animation/neon-animated-pages.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import '@polymer/paper-tabs/paper-tabs.js';
import '@polymer/paper-tabs/paper-tab.js';
import '../components/appsco-loader.js';
import '../components/appsco-form-error.js';
import '../components/appsco-search.js';
import '../account/appsco-accounts.js';
import '../account/appsco-contacts.js';
import './appsco-account-list-item.js';
import '../group/appsco-company-groups.js';
import '../group/appsco-group-list-item.js';
import '../components/appsco-list-item-styles.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { NeonAnimatableBehavior } from '@polymer/neon-animation/neon-animatable-behavior.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoShareResource extends mixinBehaviors([Appsco.HeadersMixin, NeonAnimatableBehavior], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-list-item-styles">
            :host {
                display: block;
                position: relative;

                --paper-tab: {
                    width: 50%;
                    font-size: 16px;
                    font-weight: normal;
                };

                --paper-dropdown-menu-icon: {
                    color: var(--primary-text-color);
                    width: 22px;
                    height: 22px;
                };

                --paper-checkbox-unchecked-color: var(--secondary-text-color);
                --paper-checkbox-checked-color: var(--secondary-text-color);
                --paper-checkbox-size: 22px;
            }
            :host paper-dialog {
                width: 670px;
                top: 120px;
                @apply --appsco-paper-dialog;
            }
            :host paper-dialog-scrollable > * {
                @apply --paper-dialog-scrollable-child;
            }
            :host neon-animated-pages > * {
                @apply --neon-animated-pages;
            }
            :host neon-animated-pages > .iron-selected {
                position: relative;
            }
            :host paper-progress {
                width: 100%;
            }
            :host appsco-loader {
                margin: 0 !important;
                padding: 0 !important;
            }
            :host appsco-form-error {
                box-sizing: border-box;
                margin-top: 0 !important;
            }
            .dialog-container {
                padding-bottom: 20px;
            }
            paper-tabs {
                height: 32px;
                @apply --layout-flex-none;
            }
            .paper-tabs-pages {
                @apply --paper-tabs-pages;
                margin-top: 0;
            }
            :host .filter-container {
                @apply --layout-horizontal;
                @apply --layout-center;
            }
            :host appsco-search {
                @apply --layout-flex;
            }
            :host .filter-accounts appsco-search {
                margin-right: 20px;
            }
            paper-dropdown-menu {
                @apply --layou-flex-none;
                width: 150px;
                position: relative;
                top: 11px;

                --paper-input-container-input: {
                    font-size: 14px;
                    cursor: pointer;
                };
            }
            :host .item-info {
                padding: 0;
            }
            :host .info-value {
                font-size: 14px;
            }
            :host .item-type {
                text-transform: capitalize;
            }
            :host table {
                width: 100%;
                border-collapse: collapse;
            }
            :host table thead tr th {
                text-align: left;
                font-size: 16px;
                font-weight: normal;
                padding: 10px 4px;
                border-bottom: 1px solid var(--divider-color);
            }
            :host table thead tr th:first-of-type {
                width: 40px;
            }
            :host table thead tr th:last-of-type {
                width: 60px;
            }
            :host table tbody tr td {
                padding: 10px 4px 0;
            }
            :host paper-checkbox {
                width: 22px;
                margin: 0 auto 0 4px;
            }
            :host paper-checkbox::shadow paper-ripple {
                width: 200% !important;
                height: 200% !important;
                top: -50% !important;
                left: -50% !important;
            }
            :host .message {
                @apply --info-message;
            }
            :host .selected-info {
                font-size: 12px;
                color: var(--secondary-text-color);
            }
            :host .buttons neon-animated-pages {
                position: absolute;
                top: 0;
                left: 24px;
                bottom: 0;
                margin: auto;
                height: 20px;
            }
            :host .buttons neon-animated-pages .tab-content {
                margin: 0;
            }
            :host .buttons paper-button {
                @apply --paper-dialog-button;
            }
            :host .buttons paper-button[dialog-dismiss] {
                @apply --paper-dialog-dismiss-button;
            }
            :host *[hidden] {
                display: none;
            }
        </style>

        <appsco-accounts hidden="" id="appscoRoles" type="account" size="25" authorization-token="[[ authorizationToken ]]" list-api="[[ getRolesApi ]]" no-auto-load="" on-list-loaded="_onAccountsLoadFinished" on-filter-done="_onAccountsFilterLoadFinished" on-list-empty="_onAccountsLoadFinished"></appsco-accounts>

        <appsco-contacts hidden="" id="appscoContacts" type="contact" size="25" authorization-token="[[ authorizationToken ]]" list-api="[[ getContactsApi ]]" no-auto-load="" on-list-loaded="_onContactsLoadFinished" on-list-empty="_onContactsLoadFinished" on-filter-done="_onContactsFilterLoadFinished"></appsco-contacts>

        <appsco-company-groups hidden="" id="appscoGroups" type="group" size="25" authorization-token="[[ authorizationToken ]]" list-api="[[ getGroupsApi ]]" no-auto-load="" on-list-loaded="_onGroupsLoadFinished" on-list-empty="_onGroupsLoadFinished"></appsco-company-groups>

        <paper-dialog id="dialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation" on-iron-overlay-opened="_onDialogOpened" on-iron-overlay-closed="_onDialogClosed">

            <h2>Share resources</h2>

            <appsco-loader active="[[ _shareLoader ]]" loader-alt="Appsco is processing request" multi-color=""></appsco-loader>

            <div class="error-container">
                <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>
            </div>

            <paper-tabs id="paperTabs" selected="{{ _selectedTab }}">
                <paper-tab name="users-and-contacts">Users and Contacts</paper-tab>
                <paper-tab name="groups">Groups</paper-tab>
            </paper-tabs>

            <div>
                <neon-animated-pages selected="{{ _selectedTab }}" entry-animation="fade-in-animation" exit-animation="fade-out-animation" class="paper-tabs-pages">

                    <div name="users-and-contacts" class="tab-content users-and-contacts">
                        <div class="filter-container filter-accounts">
                            <appsco-search id="appscoSearchAccounts" label="Search for accounts" float-label="" on-search="_onSearchAccounts" on-search-clear="_onSearchAccountsClear"></appsco-search>

                            <paper-dropdown-menu horizontal-align="left" no-label-float="" on-iron-activate="_onAccountTypeSelected" on-iron-overlay-opened="_onInnerIronOverlay" on-iron-overlay-closed="_onInnerIronOverlay">
                                <paper-listbox id="accountTypeList" class="dropdown-content" selected="0" slot="dropdown-content">
                                    <template is="dom-repeat" items="[[ _accountTypeList ]]">
                                        <paper-item value\$="[[ item.value ]]" name\$="[[ item.name ]]">
                                            [[ item.name ]]
                                        </paper-item>
                                    </template>
                                </paper-listbox>
                            </paper-dropdown-menu>
                        </div>
                    </div>

                    <div name="groups" class="tab-content groups">
                        <div class="filter-container">
                            <appsco-search id="appscoSearchGroups" float-label="" label="Search for groups" on-search="_onSearchGroups" on-search-clear="_onSearchGroupsClear"></appsco-search>
                        </div>
                    </div>
                </neon-animated-pages>
            </div>

            <paper-dialog-scrollable>

                <neon-animated-pages selected="{{ _selectedTab }}" entry-animation="fade-in-animation" exit-animation="fade-out-animation" class="paper-tabs-pages">

                    <div name="users-and-contacts" class="tab-content users-and-contacts">
                        <div class="dialog-container">
                            <paper-progress id="accountListProgress" indeterminate=""></paper-progress>
                            <table>
                                <thead>
                                <tr>
                                    <th>
                                        <paper-checkbox on-tap="_onBulkSelect" checked\$="[[ _bulkSelectAccount ]]"></paper-checkbox>
                                    </th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Type</th>
                                </tr>
                                </thead>

                                <tbody>
                                <template is="dom-repeat" items="[[ _accountList ]]">
                                    <tr>
                                        <td>
                                            <appsco-account-list-item item="[[ item ]]" on-select-item="_onAccountListItemSelectChanged"></appsco-account-list-item>
                                        </td>

                                        <td>
                                            <div class="item-info">
                                                <span class="info-value">[[ item.display_name ]]</span>
                                            </div>
                                        </td>

                                        <td>
                                            <div class="item-info">
                                                <span class="info-value">[[ item.email ]]</span>
                                            </div>
                                        </td>

                                        <td>
                                            <div class="item-info">
                                                <span class="info-value item-type">[[ item.type ]]</span>
                                            </div>
                                        </td>
                                    </tr>
                                </template>
                                </tbody>
                            </table>

                            <template is="dom-if" if="[[ _message ]]">
                                <p class="message">
                                    [[ _message ]]
                                </p>
                            </template>
                        </div>
                    </div>

                    <div name="groups" class="tab-content groups">
                        <div class="dialog-container">
                            <paper-progress id="groupListProgress" indeterminate=""></paper-progress>
                            <table>
                                <thead>
                                    <tr>
                                        <th>
                                        <paper-checkbox on-tap="_onBulkSelect" checked\$="[[ _bulkSelectGroup ]]"></paper-checkbox>
                                        </th>
                                        <th>Name</th>
                                        <th>Type</th>
                                    </tr>
                                </thead>

                                <tbody>
                                <template is="dom-repeat" items="[[ _groupList ]]" rendered-item-count="{{ renderedCount }}">
                                    <tr>
                                        <td>
                                            <appsco-group-list-item item="[[ item ]]" on-select-item="_onGroupListItemSelectAction"></appsco-group-list-item>
                                        </td>
                                        <td>
                                            <div class="item-info">
                                                <span class="info-value">[[ item.name ]]</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="item-info">
                                                <span class="info-value item-type">[[ item.type ]]</span>
                                            </div>
                                        </td>
                                    </tr>
                                </template>

                                <template is="dom-if" if="{{ !renderedCount }}">
                                    <tr>
                                        <td colspan="3">
                                            <p class="message">There are no available groups.</p>
                                        </td>
                                    </tr>
                                </template>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </neon-animated-pages>
            </paper-dialog-scrollable>

            <div class="buttons">
                <neon-animated-pages selected="{{ _selectedTab }}" entry-animation="fade-in-animation" exit-animation="fade-out-animation" class="paper-tabs-pages">

                    <div name="users-and-contacts" class="tab-content users-and-contacts">
                        <div class="selected-info">
                            Selected [[ _numberOfSelectedAccounts ]] out of [[ _accountsCount ]]
                        </div>
                    </div>

                    <div name="groups" class="tab-content groups">
                        <div class="selected-info">
                            Selected [[ _numberOfSelectedGroups ]] out of [[ _groupListCount ]]
                        </div>
                    </div>
                </neon-animated-pages>
                
                <template is="dom-if" if="{{ !_selectedTab }}">
                    <paper-button on-tap="_onLoadMoreAction" id="loadMoreActionBtn">Load More</paper-button>    
                </template>
                <paper-button dialog-dismiss="">Cancel</paper-button>
                <paper-button autofocus="" on-tap="_onShareResourcesAction" id="shareResourceConfirmShareButton">Share</paper-button>
            </div>
        </paper-dialog>
`;
    }

    static get is() { return 'appsco-share-resource'; }

    static get properties() {
        return {
            getRolesApi: {
                type: String
            },

            getContactsApi: {
                type: String
            },

            resources: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            apiErrors: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            _accountTypeList: {
                type: Array,
                value: function () {
                    return [
                        {
                            name: 'All',
                            value: 'all'
                        },
                        {
                            name: 'Users',
                            value: 'user'
                        },
                        {
                            name: 'Contacts',
                            value: 'contact'
                        }];
                }
            },

            _selectedTab: {
                type: Number,
                value: 0
            },

            _resourcesSharedToAccounts: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _resourcesSharedToGroups: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _accountList: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _accountListAll: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _groupList: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _groupListAll: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _message: {
                type: String
            },

            _selectedAccounts: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _selectedGroups: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _shareLoader: {
                type: Boolean,
                value: false
            },

            _rolesLoaded: {
                type: Boolean,
                value: false
            },

            _contactsLoaded: {
                type: Boolean,
                value: false
            },

            _componentReady: {
                type: Boolean,
                value: false
            },

            _bulkSelectAccount: {
                type: Boolean,
                value: false
            },

            _bulkSelectGroup: {
                type: Boolean,
                value: false
            },

            _ssoResourceExists: {
                type: Boolean,
                value: false
            },

            _accountsCount: {
                type: Number,
                value: 0
            },

            _groupListCount: {
                type: Number,
                value: 0
            },

            _numberOfSelectedAccounts: {
                type: Number,
                value: 0
            },

            _numberOfSelectedGroups: {
                type: Number,
                value: 0
            },

            _filterTerm: {
                type: String,
                value: ''
            },

            _filterType: {
                type: String,
                value: 'all'
            }
        };
    }

    static get observers() {
        return [
            '_computeItemsLoaded(_contactsLoaded, _rolesLoaded)',
            '_setAccountList(_rolesLoaded, _contactsLoaded)',
            '_onSSOResourceExistsChanged(_ssoResourceExists, _accountList)'
        ];
    }

    toggle() {
        this.$.dialog.toggle();
    }

    close() {
        this.$.dialog.close();
    }

    _computeItemsLoaded(contactsLoaded, rolesLoaded) {
        this.dispatchEvent(new CustomEvent('share-items-loaded-changed', {
            bubbles: true,
            composed: true,
            detail: {
                loaded: contactsLoaded && rolesLoaded
            }
        }));
    }

    setResources(resources) {
        this.resources = resources;
    }

    _reset() {
        this.$.appscoSearchAccounts.reset();
        this.$.appscoSearchGroups.reset();
        this.$.accountTypeList.selected = 0;
        this.set('_accountList', []);
        this.set('_accountListAll', []);
        this.set('_selectedAccounts', []);
        this.set('_resourcesSharedToAccounts', []);
        this.set('_groupList', []);
        this.set('_groupListAll', []);
        this.set('_selectedGroups', []);
        this.set('_resourcesSharedToGroups', []);
        this.set('resources', []);
        this._componentReady = false;
        this._rolesLoaded = false;
        this._contactsLoaded = false;
        this._filterTerm = '';
        this._filterType = 'all';
        this._numberOfSelectedAccounts = 0;
        this._numberOfSelectedGroups = 0;
        this._accountsCount = 0;
        this._groupListCount = 0;
        this._ssoResourceExists = false;
        this._bulkSelectAccount = false;
        this._bulkSelectGroup = false;
        this._selectedTab = 0;
        this._hideLoader();
        this._hideError();
        this._hideMessage();
        this._enableContactTypeFilter();
    }

    _showLoader() {
        this._shareLoader = true;
    }

    _hideLoader() {
        this._shareLoader = false;
    }

    _showError(message) {
        this._errorMessage = message;
    }

    _hideError() {
        this._errorMessage = '';
    }

    _showMessage(message) {
        this._message = message;
    }

    _hideMessage() {
        this._message = '';
    }

    _showAccountListProgress() {
        this.$.accountListProgress.hidden = false;
    }

    _hideAccountListProgress() {
        setTimeout(function() {
            this.$.accountListProgress.hidden = true;
        }.bind(this), 500);
    }

    _showGroupListProgress() {
        this.$.groupListProgress.hidden = false;
    }

    _hideGroupListProgress() {
        setTimeout(function() {
            this.$.groupListProgress.hidden = true;
        }.bind(this), 500);
    }

    _onDialogOpened() {
        this.$.appscoSearchAccounts.setup();
        this.$.appscoSearchGroups.setup();
        this.shadowRoot.getElementById('appscoRoles').reloadItems();
        this.shadowRoot.getElementById('appscoContacts').reloadItems();
        this.shadowRoot.getElementById('appscoGroups').reloadItems();
        this._componentReady = true;
        this._setAvailableAccounts();
    }

    _onDialogClosed() {
        this._reset();
    }

    _onSSOResourceExistsChanged(exists, accounts) {
        if (exists && 0 < accounts.length) {
            this._hideContacts();
            this._disableContactTypeFilter();
        }
    }

    _onAccountsLoadFinished(e) {
        if(e && e.detail && e.detail.items) {
            e.detail.items.forEach(function (item) {
                item.account.type = 'user';
                this.push('_accountList', item.account);
                this._accountsCount++;
            }.bind(this));
        }

        if(this._loadMoreCounter) {
            this.shadowRoot.getElementById('loadMoreActionBtn').disabled = false;
        }
        this._loadMoreCounter = false;
        this._rolesLoaded = true;
    }

    _onContactsLoadFinished(e) {
        if(e && e.detail && e.detail.items) {
            e.detail.items.forEach(function (item) {
                item.account.type = 'contact';
                this.push('_accountList', item.account);
                this._accountsCount++;
            }.bind(this));
        }
        if(this._loadMoreCounter) {
            this.shadowRoot.getElementById('loadMoreActionBtn').disabled = false;
        }
        this._loadMoreCounter = false;
        this._contactsLoaded = true;
    }

    _setAccountList(rolesLoaded, contactsLoaded) {
        const listItems = [];

        this._showAccountListProgress();

        this.set('_accountList', []);
        this.set('_accountListAll', []);

        if (rolesLoaded && contactsLoaded) {
            const rolesComponent = this.shadowRoot.getElementById('appscoRoles'),
                roles = rolesComponent.getAllItems(),
                contactsComponents = this.shadowRoot.getElementById('appscoContacts'),
                contacts = contactsComponents.getAllItems();

            roles.forEach(function(role, index) {
                role.account.type = 'user';
                role.account.selected = false;
                listItems.push(role.account);
            }.bind(this));

            contacts.forEach(function(contact, index) {
                contact.account.type = 'contact';
                contact.account.selected = false;
                listItems.push(contact.account);
            }.bind(this));
        }

        this.set('_accountList', listItems);
        this.set('_accountListAll', listItems);
        this._accountsCount = this._accountList.length;
        this._setAvailableAccounts();
        this._hideAccountListProgress();
    }

    _setAvailableAccounts() {
        const resources = this.resources,
            length = resources.length;

        this._ssoResourceExists = false;

        for (let i = 0; i < length; i++) {
            if (['saml', 'saml_dropbox', 'saml_office_365'].indexOf(resources[i].auth_type) !== -1) {
                this._ssoResourceExists = true;
                break;
            }
        }
    }

    _hideContacts() {
        const list = JSON.parse(JSON.stringify(this._accountList)),
            length = list.length;

        this.set('_accountList', []);

        for (let i = 0; i < length; i++) {
            if ('user' === list[i].type) {
                this.push('_accountList', list[i]);
            }
        }
    }

    _enableContactTypeFilter() {
        const items = this.$.accountTypeList.items,
            length = items.length;

        for (let i = 0; i < length; i++) {
            if ('contact' === items[i].getAttribute('value')) {
                items[i].disabled = false;
            }
        }
    }

    _disableContactTypeFilter() {
        const items = this.$.accountTypeList.items,
            length = items.length;

        for (let i = 0; i < length; i++) {
            if ('contact' === items[i].getAttribute('value')) {
                items[i].disabled = true;
            }
        }
    }

    _onBulkSelect() {
        this._hideError();

        if (this._componentReady) {
            switch (this._selectedTab) {
                case 0:
                    this._bulkSelectAccount = !this._bulkSelectAccount;
                    this._bulkSelectAccount ? this._selectAllAccounts() : this._deselectAllAccounts();
                    break;

                case 1:
                    this._bulkSelectGroup = !this._bulkSelectGroup;
                    this._bulkSelectGroup ? this._selectAllGroups() : this._deselectAllGroups();
            }
        }
    }

    _selectAllAccounts() {
        const list = JSON.parse(JSON.stringify(this._accountList)),
            length = list.length,
            listAll = JSON.parse(JSON.stringify(this._accountListAll)),
            lengthAll = listAll.length;

        for (let i = 0; i < length; i++) {
            list[i].selected = true;

            for (let j = 0; j < lengthAll; j++) {
                if (listAll[j].self === list[i].self) {
                    listAll[j].selected = true;
                }
            }
        }

        this.set('_accountList', []);
        this.set('_accountList', list);

        this.set('_accountListAll', []);
        this.set('_accountListAll', listAll);

        this._recalculateInfoAccount();
    }

    _deselectAllAccounts() {
        const list = JSON.parse(JSON.stringify(this._accountList)),
            length = list.length,
            listAll = JSON.parse(JSON.stringify(this._accountListAll)),
            lengthAll = listAll.length;

        for (let i = 0; i < length; i++) {
            list[i].selected = false;

            for (let j = 0; j < lengthAll; j++) {
                if (listAll[j].self === list[i].self) {
                    listAll[j].selected = false;
                }
            }
        }

        this.set('_accountList', []);
        this.set('_accountList', list);

        this.set('_accountListAll', []);
        this.set('_accountListAll', listAll);

        this.set('_bulkSelectAccount', false);

        this._recalculateInfoAccount();
    }

    _selectAllGroups() {
        const list = JSON.parse(JSON.stringify(this._groupList)),
            length = list.length,
            listAll = JSON.parse(JSON.stringify(this._groupListAll)),
            lengthAll = listAll.length;

        for (let i = 0; i < length; i++) {
            list[i].selected = true;

            for (let j = 0; j < lengthAll; j++) {
                if (listAll[j].self === list[i].self) {
                    listAll[j].selected = true;
                }
            }
        }

        this.set('_groupList', []);
        this.set('_groupList', list);

        this.set('_groupListAll', []);
        this.set('_groupListAll', listAll);

        this._recalculateInfoGroup();
    }

    _deselectAllGroups() {
        const list = JSON.parse(JSON.stringify(this._groupList)),
            length = list.length,
            listAll = JSON.parse(JSON.stringify(this._groupListAll)),
            lengthAll = listAll.length;

        for (let i = 0; i < length; i++) {
            list[i].selected = false;

            for (let j = 0; j < lengthAll; j++) {
                if (listAll[j].self === list[i].self) {
                    listAll[j].selected = false;
                }
            }
        }

        this.set('_groupList', []);
        this.set('_groupList', list);

        this.set('_groupListAll', []);
        this.set('_groupListAll', listAll);

        this._recalculateInfoGroup();
    }

    _onAccountListItemSelectChanged(event) {
        const item = event.detail.item,
            listAll = JSON.parse(JSON.stringify(this._accountListAll)),
            lengthAll = listAll.length;

        if (!item.selected) {
            this._bulkSelectAccount = false;
        }

        for (let j = 0; j < lengthAll; j++) {
            if (listAll[j].self === item.self) {
                listAll[j].selected = item.selected;
            }
        }

        this.set('_accountListAll', []);
        this.set('_accountListAll', listAll);

        this._recalculateInfoAccount();
        this._setBulkSelectStatusAccount();
        this._hideError();
    }

    _onGroupListItemSelectAction(event) {
        const item = event.detail.item,
            listAll = JSON.parse(JSON.stringify(this._groupListAll)),
            lengthAll = listAll.length;

        if (!item.selected) {
            this._bulkSelectGroup = false;
        }

        for (let j = 0; j < lengthAll; j++) {
            if (listAll[j].self === item.self) {
                listAll[j].selected = item.selected;
            }
        }

        this.set('_groupListAll', []);
        this.set('_groupListAll', listAll);

        this._recalculateInfoGroup();
        this._setBulkSelectStatusGroup();
        this._hideError();
    }

    _recalculateInfoAccount() {
        const list = this._accountListAll,
            length = list.length;

        this._numberOfSelectedAccounts = 0;

        for (let i = 0; i < length; i++) {
            if (list[i].selected) {
                this._numberOfSelectedAccounts++;
            }
        }
    }

    _recalculateInfoGroup() {
        const list = this._groupListAll,
            length = list.length;

        this._numberOfSelectedGroups = 0;

        for (let i = 0; i < length; i++) {
            if (list[i].selected) {
                this._numberOfSelectedGroups++;
            }
        }
    }

    _setBulkSelectStatusAccount() {
        this._bulkSelectAccount = (this._numberOfSelectedAccounts === this._accountListAll.length);
    }

    _setBulkSelectStatusGroup() {
        this._bulkSelectGroup = (this._numberOfSelectedGroups === this._groupListAll.length);
    }

    _onSearchAccounts(event) {
        const searchValue = event.detail.term,
            searchLength = searchValue.length;
        this.filterCount = 0;

        this._filterTerm = searchValue;

        if (searchLength < 3) {
            this._filterTerm = '';
        }
        if(this._filterTerm !== '') {
            this.filterCount = 0;
            this._deselectAllAccounts();
            this.shadowRoot.getElementById('appscoRoles').reset();
            this.shadowRoot.getElementById('appscoContacts').reset();
            this.shadowRoot.getElementById('appscoRoles').filterByTerm(this._filterTerm);
            this.shadowRoot.getElementById('appscoContacts').filterByTerm(this._filterTerm);
        }
        if(this._filterTerm === '' && searchLength === 0) {
            this._deselectAllAccounts();
            this.filterCount = 0;
            this.shadowRoot.getElementById('appscoRoles').reset();
            this.shadowRoot.getElementById('appscoContacts').reset();
            this.shadowRoot.getElementById('appscoRoles').filterByTerm(this._filterTerm);
            this.shadowRoot.getElementById('appscoContacts').filterByTerm(this._filterTerm);
        }
    }

    _onAccountsFilterLoadFinished() {
        this.filterCount++;
        if(this.filterCount === 2) {
            this._setAccountList(true, true);
        }
    }

    _onContactsFilterLoadFinished() {
        this.filterCount++;
        if(this.filterCount === 2) {
            this._setAccountList(true, true);
        }
    }

    _onSearchAccountsClear() {
        this._filterTerm = '';
        this._filterAccountList();
    }

    _onAccountTypeSelected(event) {
        this._filterType = event.detail.item.getAttribute('value');
        this._filterAccountList();
        this._setBulkSelectStatusAccount();
    }

    _filterAccountList() {
        const listAll = JSON.parse(JSON.stringify(this._accountListAll)),
            lengthAll = listAll.length,
            term = decodeURIComponent(this._filterTerm.toLowerCase()),
            type = this._filterType;

        this._hideMessage();
        this.set('_accountList', []);

        if ('all' === type) {
            if (term) {
                for (let i = 0; i < lengthAll; i++) {
                    if ((-1 !== listAll[i].name.toLowerCase().indexOf(term.toLowerCase())) ||
                        (-1 !== listAll[i].email.toLowerCase().indexOf(term))) {
                        this.push('_accountList', listAll[i]);
                    }
                }
            }
            else {
                this.set('_accountList', listAll);
            }
        }
        else {
            if (term) {
                for (let i = 0; i < lengthAll; i++) {
                    if ((type === listAll[i].type) &&
                        ((-1 !== listAll[i].name.toLowerCase().indexOf(term)) ||
                            (-1 !== listAll[i].email.toLowerCase().indexOf(term)))) {
                        this.push('_accountList', listAll[i]);
                    }
                }
            }
            else {
                for (let i = 0; i < lengthAll; i++) {
                    if (type === listAll[i].type) {
                        this.push('_accountList', listAll[i]);
                    }
                }
            }
        }

        this._setAvailableAccounts();

        if (0 === this._accountList.length) {
            this._showMessage('There are no accounts available according to selected filters.');
        }
    }

    _onGroupsLoadFinished(event) {
        const listItems = event.detail && event.detail.items ? event.detail.items : [];

        this._showGroupListProgress();

        this.set('_groupList', []);
        this.set('_groupListAll', []);

        if (0 === listItems.length) {
            this._hideGroupListProgress();
            return false;
        }

        listItems.forEach(function(item) {
            item.selected = false;
            item.type = 'group';
        }.bind(this));

        this.set('_groupList', listItems);
        this.set('_groupListAll', listItems);
        this._groupListCount = this._groupList.length;
        this._hideGroupListProgress();
    }

    _searchGroups(term) {
        const searchValue = term.toLowerCase(),
            searchLength = searchValue.length,
            listAll = JSON.parse(JSON.stringify(this._groupListAll)),
            lengthAll = listAll.length;

        this.set('_groupList', []);

        if (searchLength < 2) {
            this.set('_groupList', listAll);
        }
        else {
            for (let i = 0; i < lengthAll; i++) {
                if ((-1 !== listAll[i].name.toLowerCase().indexOf(searchValue))) {
                    this.push('_groupList', listAll[i]);
                }
            }
        }
    }

    _onSearchGroups(event) {
        this._searchGroups(event.detail.term);
    }

    _onSearchGroupsClear() {
        this._searchGroups('');
    }

    _resourcesShareToAccountsFinished() {
        this.dispatchEvent(new CustomEvent('resources-shared', {
            bubbles: true,
            composed: true,
            detail: {
                resources: this._resourcesSharedToAccounts
            }
        }));
    }

    _resourcesShareToGroupsFinished() {
        this.dispatchEvent(new CustomEvent('groups-added-to-resources', {
            bubbles: true,
            composed: true,
            detail: {
                groups: this._selectedGroups,
                items: this._resourcesSharedToGroups,
                resourceType: 'resource'
            }
        }));

        this.close();
    }

    _shareToAccounts(application) {
        return new Promise(function(resolve, reject) {
            const accounts = this._selectedAccounts,
                length = accounts.length - 1,
                request = document.createElement('iron-request'),
                options = {
                    url: application.self + '/share',
                    method: 'POST',
                    handleAs: 'json',
                    headers: this._headers
                };
            let body = '';

            for (let i = 0; i <= length; i++) {
                let next = (i === length) ? '' : '&';
                body += 'accounts[]=' + encodeURIComponent(accounts[i].self) + next;
            }

            options.body = body;

            request.send(options).then(function() {
                resolve(request.response);
            }.bind(this), function() {
                reject(this.apiErrors.getError(request.response.code));
            }.bind(this));
        }.bind(this));
    }

    _shareToGroups(application) {
        return new Promise(function(resolve, reject) {
            const groups = this._selectedGroups,
                length = groups.length - 1,
                request = document.createElement('iron-request'),
                options = {
                    url: application.self + '/groups',
                    method: 'POST',
                    handleAs: 'json',
                    headers: this._headers
                };
            let body = '';

            for (let i = 0; i <= length; i++) {
                let next = (i === length) ? '' : '&';
                body += 'groups[]=' + encodeURIComponent(groups[i].meta.self) + next;
            }

            options.body = body;

            request.send(options).then(function() {
                resolve(request.response);
            }.bind(this), function() {
                reject(this.apiErrors.getError(request.response.code));
            }.bind(this));
        }.bind(this));
    }

    _onLoadMoreAction() {
        this.shadowRoot.getElementById('loadMoreActionBtn').disabled = true;
        this._loadMoreCounter = true;
        switch(parseInt(this.$.accountTypeList.selected)) {
            case 0:
                this.shadowRoot.getElementById('appscoRoles')._onLoadMoreAction();
                this.shadowRoot.getElementById('appscoContacts')._onLoadMoreAction();
                break;
            case 1:
                this.shadowRoot.getElementById('appscoRoles')._onLoadMoreAction();
                break;
            case 2:
                this.shadowRoot.getElementById('appscoContacts')._onLoadMoreAction();
                break;
        }
    }

    _onShareResourcesAction() {
        const accountList = JSON.parse(JSON.stringify(this._accountListAll)),
            accountListLength = accountList.length,
            groupList = JSON.parse(JSON.stringify(this._groupListAll)),
            groupListLength = groupList.length;

        this.set('_selectedAccounts', []);
        this.set('_selectedGroups', []);

        for (let i = 0; i < accountListLength; i++) {
            if (accountList[i].selected) {
                this._selectedAccounts.push(accountList[i]);
            }
        }

        for (let i = 0; i < groupListLength; i++) {
            if (groupList[i].selected) {
                this._selectedGroups.push(groupList[i]);
            }
        }

        if ((0 === this._selectedAccounts.length) && (0 === this._selectedGroups.length)) {
            this._showError('Please add at least one user or group to share resources to.');
            return false;
        }

        this._showLoader();

        if (0 < this._selectedAccounts.length) {
            this._shareResourcesToAccountsAction();
        }
        else {
            this._shareResourcesToGroupsAction();
        }
    }

    _shareResourcesToAccountsAction() {
        const resources = this.resources,
            length = resources.length - 1;

        resources.forEach(function(resource, index) {
            this._shareToAccounts(resource).then(function(resource) {
                this.push('_resourcesSharedToAccounts', resource);

                if (index === length) {
                    this._resourcesShareToAccountsFinished();

                    if (0 < this._selectedGroups.length) {
                        this._shareResourcesToGroupsAction();
                    }
                    else {
                        this.close();
                    }
                }
            }.bind(this), function(message) {
                this._showError(message);
                this._hideLoader();
                return false;
            }.bind(this));
        }.bind(this));
    }

    _shareResourcesToGroupsAction() {
        const resources = this.resources,
            length = resources.length - 1;

        resources.forEach(function(resource, index) {
            this._shareToGroups(resource).then(function(resource) {
                this.push('_resourcesSharedToGroups', resource);

                if (index === length) {
                    this._resourcesShareToGroupsFinished();
                }
            }.bind(this), function(message) {
                this._showError(message);
                this._hideLoader();
                return false;
            }.bind(this));
        }.bind(this));
    }

    _onInnerIronOverlay(event) {
        event.stopPropagation();
    }
}
window.customElements.define(AppscoShareResource.is, AppscoShareResource);
