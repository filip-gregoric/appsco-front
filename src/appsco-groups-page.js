import '@polymer/polymer/polymer-legacy.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/neon-animation/neon-animated-pages.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import { NeonAnimatableBehavior } from '@polymer/neon-animation/neon-animatable-behavior.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-media-query/iron-media-query.js';
import './components/page/appsco-content.js';
import './components/page/appsco-page-styles.js';
import './components/components/appsco-search.js';
import './components/group/appsco-company-groups.js';
import './components/group/appsco-company-group-roles.js';
import './components/group/appsco-company-group-resources.js';
import './components/group/appsco-company-group-contacts.js';
import './components/group/appsco-company-group-image.js';
import { AppscoPageBehavior } from './components/components/appsco-page-behavior.js';
import { AppscoListObserverBehavior } from './components/components/appsco-list-observer-behavior.js';
import './components/group/appsco-groups-page-actions.js';
import './components/group/appsco-company-remove-group.js';
import './components/group/appsco-company-add-group.js';
import './components/group/appsco-company-rename-group.js';
import './components/group/appsco-delete-groups.js';
import './components/group/appsco-company-group-notification-dialog.js';
import './lib/mixins/appsco-page-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender, afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';

class AppscoGroupsPage extends mixinBehaviors([
    NeonAnimatableBehavior,
    AppscoPageBehavior,
    AppscoListObserverBehavior,
    Appsco.PageMixin
], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-page-styles">
            :host {
                --group-role-initials-background-color: var(--body-background-color-darker);
                --group-contact-initials-background-color: var(--body-background-color-darker);

                --item-basic-info: {
                    padding: 0 10px;
                };
            }
            :host .info-content > * {
                height: 78px;
            }
            :host .group-items {
                @apply --layout-flex-none;
            }
            appsco-company-group-image {
                --group-image-preview: {
                    width: 32px;
                    height: 32px;
                    margin-right: 5px;
                };

                --group-image-background-color: var(--body-background-color-darker);
            }
            :host .info-header .group-name {
                @apply --paper-font-subhead;
                font-size: 18px;
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
            appsco-company-groups {
                --appsco-company-group-item: {
                    padding: 4px;
                    margin-bottom: 5px;
                };
            }
        </style>

        <iron-media-query query="(max-width: 992px)" query-matches="{{ screen992 }}"></iron-media-query>
        <iron-media-query query="(max-width: 800px)" query-matches="{{ tabletScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 600px)" query-matches="{{ mobileScreen }}"></iron-media-query>

        <appsco-content id="appscoContent">
            <div content="" slot="content">
                <div class="content-container">
                    <appsco-company-groups id="appscoGroups" type="group" list-api="[[ groupsApi ]]" authorization-token="[[ authorizationToken ]]" size="100" on-list-loaded="_onGroupsLoaded" on-list-empty="_onGroupsEmptyLoad" on-item="_onGroupAction" selectable="" on-select-item="_onSelectGroupAction" on-observable-list-empty="_onObservableItemListChange" on-observable-list-filled="_onObservableItemListChange" on-group-rename="_onRenameGroupAction">
                    </appsco-company-groups>
                </div>
            </div>

            <div class="flex-vertical" info="" slot="info">
                <div class="info-header flex-horizontal">
                    <appsco-company-group-image group="[[ group ]]" preview=""></appsco-company-group-image>
                    <span class="group-name flex">[[ group.name ]]</span>
                </div>

                <div class="info-content flex-vertical">
                    <appsco-company-group-resources id="appscoCompanyGroupResources" class="group-items" authorization-token="[[ authorizationToken ]]" list-api="[[ _groupResourcesApi ]]" size="5" group="[[ group ]]" load-more="" preview=""></appsco-company-group-resources>

                    <appsco-company-group-roles id="appscoCompanyGroupRoles" class="group-items" authorization-token="[[ authorizationToken ]]" list-api="[[ _groupRolesApi ]]" size="5" load-more="" preview="" auto-load-active=""></appsco-company-group-roles>

                    <appsco-company-group-contacts id="appscoCompanyGroupContacts" class="group-items" authorization-token="[[ authorizationToken ]]" list-api="[[ _groupContactsApi ]]" size="5" group="[[ group ]]" load-more="" preview=""></appsco-company-group-contacts>
                </div>

                <div class="info-actions flex-horizontal">
                    <paper-button class="button flex" on-tap="_onGroupInfoEdit">
                        Edit
                    </paper-button>
                </div>
            </div>
        </appsco-content>

        <appsco-company-add-group
            id="appscoCompanyAddGroup"
            authorization-token="[[ authorizationToken ]]"
            company-groups-api="[[ groupsApi ]]"            
            api-errors="[[ apiErrors ]]">
        </appsco-company-add-group>

        <appsco-delete-groups
            id="appscoGroupsRemove"
            groups="[[ _selectedGroups ]]"
            company-api="[[ companyApi ]]"
            authorization-token="[[ authorizationToken ]]"
            on-groups-removed="_onRemovedGroups"
            on-groups-remove-failed="_onGroupsRemoveFailed">
        </appsco-delete-groups>

        <appsco-company-remove-group id="appscoCompanyRemoveGroup" authorization-token="[[ authorizationToken ]]" api-errors="[[ apiErrors ]]" on-group-removed="_onGroupRemoved">
        </appsco-company-remove-group>

        <appsco-company-group-notification-dialog id="appscoNotifyGroup" authorization-token="[[ authorizationToken ]]" company-groups-api="[[ groupsApi ]]" company-notifications-api="[[ companyNotificationsApi ]]" on-groups-loaded="_hideProgressBar" on-notification-sent="_onNotificationSent">
        </appsco-company-group-notification-dialog>

        <appsco-company-rename-group
            id="appscoCompanyRenameGroup"
            authorization-token="[[ authorizationToken ]]"
            company-groups-api="[[ groupsApi ]]"
            api-errors="[[ apiErrors ]]"
            on-group-renamed="_onGroupRenamed">
        </appsco-company-rename-group>
`;
    }

    static get is() { return 'appsco-groups-page'; }

    static get properties() {
        return {
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

            group: {
                type: Object,
                value: function() {
                    return {}
                }
            },

            _selectedGroups: {
                type: Array,
                value: function() {
                    return [];
                }
            },

            authorizationToken: {
                type: String,
                value: ''
            },

            groupsApi: {
                type: String
            },

            companyApi: {
                type: String
            },

            companyNotificationsApi: {
                type: String
            },

            _groupExists: {
                type: Boolean,
                computed: '_computeGroupExistence(group)'
            },

            _groupsLoaded: {
                type: Boolean,
                value: false
            },

            _pageReady: {
                type: Boolean,
                computed: '_computePageReadyState(_groupsLoaded)',
                observer: '_onPageReadyChanged'
            },

            pageLoaded: {
                type: Boolean,
                value: false
            },

            _infoShown: {
                type: Boolean,
                value: false
            },

            _groupRolesApi: {
                type: String,
                computed: '_computeGroupRolesApi(group)'
            },

            _groupContactsApi: {
                type: String,
                computed: '_computeGroupContactsApi(group)'
            },

            _groupResourcesApi: {
                type: String,
                computed: '_computeGroupResourcesApi(group)'
            },

            apiErrors: {
                type: Object
            }
        };
    }

    static get observers() {
        return [ '_updateScreen(mobileScreen, tabletScreen, screen992)' ];
    }

    ready() {
        super.ready();

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
            this.set('_itemsComponent', this.$.appscoGroups);
        });

        afterNextRender(this, function() {
            this._addListeners();
        });
    }

    _addListeners() {
        this.toolbar.addEventListener('search', this._onSearchGroupAction.bind(this));
        this.toolbar.addEventListener('search-clear', this._onSearchGroupClear.bind(this));
        this.toolbar.addEventListener('add-company-group', this._onAddGroupAction.bind(this));
        this.toolbar.addEventListener('remove-groups', this._onRemoveGroupsAction.bind(this));
        this.toolbar.addEventListener('select-all-groups', this._onSelectAllGroupsAction.bind(this));
        this.toolbar.addEventListener('notify-groups', this._onNotifyGroupsAction.bind(this));
    }

    initializePage() {}

    toggleInfo() {
        if (this._groupExists) {
            this.$.appscoContent.toggleSection('info');
            this._infoShown = !this._infoShown;

            if (!this._infoShown) {
                this.$.appscoGroups.deactivateItem(this.group);
                this._setDefaultGroup();
            }
        }
    }

    hideInfo() {
        this.$.appscoContent.hideSection('info');
        this._infoShown = false;
    }

    toggleResource() {
        this.$.appscoContent.toggleSection('resource');
    }

    setDefaultGroup() {
        this._setDefaultGroup();
    }

    _setDefaultGroup() {
        this.set('group', this.$.appscoGroups.getFirstItem());
    }

    addGroup(group) {
        this.$.appscoGroups.addItems([group]);
        this._setDefaultGroup();
    }

    removeGroup(group) {
        this.$.appscoGroups.removeItems([group]);
        this._setDefaultGroup();
    }

    reloadGroups() {
        this._groupsLoaded = false;
        this.$.appscoGroups.reloadItems();
    }

    filterByTerm(term) {
        this.$.appscoGroups.filterByTerm(term);
    }

    getSelectedGroups() {
        return this.$.appscoGroups.getSelectedItems();
    }

    removeGroupItems(group, items, resourceType) {
        if (this.group.alias === group.alias) {
            this._removeGroupItems(items, resourceType);
            this._recalculateTotals(group);
        }
    }

    recalculateTotals(groups, type) {
        this._recalculateTotalsForDefaultGroup(type);

        for (const idx in groups) {
            this._recalculateTotals(groups[idx]);
        }
    }

    resetGroupSelection() {
        this.$.appscoGroups.reset();
    }

    pageSelected() {
        this.reloadGroups();
    }

    resetPage() {
        this._resetPageActions();
        this._resetPageLists();
        this.hideInfo();
    }

    _onGroupsLoaded() {
        this._groupsLoaded = true;
        this._setDefaultGroup();
    }

    _onGroupsEmptyLoad() {
        this._groupsLoaded = true;
    }

    _onObservableItemListChange(event, data) {
        if(data.type === 'groups') {
            this.setObservableType('groups-page');
            this.populateItems(data.items);
        }
        event.stopPropagation();
    }

    _recalculateTotalsForDefaultGroup(type) {
        switch (type) {
            case 'resource':
                this.$.appscoCompanyGroupResources.reloadResources();
                break;
            case 'account':
                this.$.appscoCompanyGroupRoles.reloadRoles();
                break;
            case 'contact':
                this.$.appscoCompanyGroupContacts.reloadContacts();
                break;
            default:
                return false;
        }
    }

    _recalculateTotals(group) {
        this.$.appscoGroups.recalculateTotals(group);
    }

    _resetPageActions() {
        this._hideBulkActions();
        this.toolbar.resetPageActions();
    }

    _resetPageLists(page) {
        this._deselectAllItems();
        this.filterByTerm('', page);
        this.$.appscoGroups.resetAllItems();
    }

    _computeAccount(group) {
        return group.account ? group.account : {};
    }

    _computeGroupExistence(group) {
        for (const key in group) {
            return true;
        }

        return false;
    }

    _computePageReadyState(groups) {
        return groups;
    }

    _computeGroupRolesApi(group) {
        return group.meta ? group.meta.company_roles + '?extended=1' : null;
    }

    _computeGroupContactsApi(group) {
        return group.meta ? group.meta.contacts + '?extended=1' : null;
    }

    _computeGroupResourcesApi(group) {
        return group.meta ? group.meta.applications + '?extended=1' : null;
    }

    _updateScreen() {
        this.updateStyles();
    }

    _onPageReadyChanged() {
        this._onPageLoaded();
    }

    _onPageLoaded() {
        this.pageLoaded = true;
        this.dispatchEvent(new CustomEvent('page-loaded', { bubbles: true, composed: true }));
    }

    _onGroupAction(event) {
        if (event.detail.item.activated) {
            this._onViewInfo(event);
        }
        else {
            this.hideInfo();
            this._setDefaultGroup();
        }
    }

    _onSelectGroupAction(event) {
        const group = event.detail.item;

        clearTimeout(this._groupSelectAction);

        this._groupSelectAction = setTimeout(function() {
            if (group.selected) {
                this._showBulkActions();
            }
            else {
                const selectedGroup = this.$.appscoGroups.getFirstSelectedItem();
                for (const key in selectedGroup) {
                    return false;
                }

                this._hideBulkActions();
            }
        }.bind(this), 10);

        this._handleItemsSelectedState();
    }

    _onGroupInfoEdit() {
        this.dispatchEvent(new CustomEvent('info-edit-group', { bubbles: true, composed: true, detail: { item: this.group } }));
    }

    _showInfo() {
        if (this._groupExists) {
            this.$.appscoContent.showSection('info');
            this._infoShown = true;
        }
    }

    _handleInfo(group) {
        this.set('group', group);

        if (!this._infoShown) {
            this._showInfo();
        }
    }

    _onViewInfo(event) {
        this._handleInfo(event.detail.item);
    }

    _removeGroupRoles(roles) {
        this.$.appscoCompanyGroupRoles.removeGroupItems(roles);
    }

    _removeGroupContacts(contacts) {
        this.$.appscoCompanyGroupContacts.removeGroupItems(contacts);
    }

    _removeGroupResources(resources) {
        this.$.appscoCompanyGroupResources.removeGroupItems(resources);
    }

    _removeGroupItems(items, resourceType) {
        switch (resourceType) {
            case 'resource':
                this._removeGroupResources(items);
                break;

            case 'account':
                this._removeGroupRoles(items);
                break;

            case 'contact':
                this._removeGroupContacts(items);
                break;

            default:
                return false;
        }
    }

    removeGroups(groups) {
        this.$.appscoGroups.removeItems(groups);
    }

    modifyGroups(groups) {
        this.$.appscoGroups.modifyItems(groups);
    }

    _onPageAnimationFinished(event) {
        this._resetPageActions();
        this._resetPageLists(event.detail.fromPage.getAttribute('name'));
    }

    _onSearchGroupAction(event) {
        this._showProgressBar();
        this.filterByTerm(event.detail.term);
    }

    _onSearchGroupClear() {
        this.filterByTerm('');
    }

    _onAddGroupAction() {
        this.shadowRoot.getElementById('appscoCompanyAddGroup').open();
    }

    _onRenameGroupAction(event) {
        const groupModal = this.shadowRoot.getElementById('appscoCompanyRenameGroup');
        groupModal.setGroup(event.detail.group);
        groupModal.open();
    }

    _onGroupRenamed(event) {
        const group = event.detail.group;

        this.reloadGroups();
        this._hideProgressBar();
        this._notify('Group ' + group.name + ' was successfully saved.');
    }

    _onRemoveGroupsAction() {
        const selectedGroups = this.getSelectedGroups();

        if (0 === selectedGroups.length) {
            this._hideBulkActions();
            return;
        }

        const dialog = this.shadowRoot.getElementById('appscoGroupsRemove');
        this.set('_selectedGroups', selectedGroups);
        dialog.toggle();
    }

    _onRemovedGroups() {
        this.removeGroups(this._selectedGroups);
        this._hideBulkActions();
        this._notify('Selected groups were successfully removed from company.');
    }

    _onGroupsRemoveFailed() {
        this.set('_selectedGroups', []);
        this._notify('An error occurred. Selected groups were not removed from company. Please try again.');
    }

    _onSelectAllGroupsAction() {
        this.selectAllItems();
    }

    _onNotifyGroupsAction() {
        this.shadowRoot.getElementById('appscoNotifyGroup').toggle();
        this._hideProgressBar();
    }

    _onNotificationSent(event) {
        this._notify('Notification successfully sent to '+ event.detail.counter +' accounts.');
        this._hideProgressBar();
    }
}
customElements.define(AppscoGroupsPage.is, AppscoGroupsPage);
