import '@polymer/polymer/polymer-legacy.js';
import '@polymer/neon-animation/neon-animated-pages.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/social-icons.js';
import './components/page/appsco-content.js';
import './components/page/appsco-manage-page-styles.js';
import './components/components/appsco-date-format.js';
import './components/group/appsco-manage-group-components-page.js';
import './components/group/appsco-group-roles-page.js';
import './components/group/appsco-group-contacts-page.js';
import './components/group/appsco-group-resources-page.js';
import './components/group/appsco-group-image-settings.js';
import './components/group/appsco-manage-group-page-actions.js';
import './components/group/appsco-company-remove-group.js';
import './components/group/appsco-group-add-resource.js';
import './components/group/appsco-resource-remove-from-group.js';
import './lib/mixins/appsco-headers-mixin.js';
import './lib/mixins/appsco-page-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender, afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { NeonAnimatableBehavior } from '@polymer/neon-animation/neon-animatable-behavior.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoManageGroupPage extends mixinBehaviors([
    NeonAnimatableBehavior,
    Appsco.HeadersMixin,
    Appsco.PageMixin
], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-manage-page-styles">
            :host div[resource] {
                height: calc(100% - 32px - 20px);
            }
            .group-icon {
                width: 96px;
                height: 96px;
                margin-left: auto;
                margin-right: auto;
                background-color: var(--brand-color);
                border-radius: 50%;
                position: relative;
            }
            .group-icon iron-icon {
                width: 48px;
                height: 48px;
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                margin: auto;

                --iron-icon-fill-color: #ffffff;
            }
            .group-info {
                margin-top: 10px;
                font-size: 14px;
            }
            .group-info p {
                margin: 4px 0;
                @apply --text-wrap-break;
            }
        </style>

        <iron-media-query query="(max-width: 1200px)" query-matches="{{ mediumScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 800px)" query-matches="{{ tabletScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 600px)" query-matches="{{ mobileScreen }}"></iron-media-query>

        <iron-ajax id="ironAjaxGetGroup" headers="[[ _headers ]]" on-error="_onGetGroupError" on-response="_onGetGroupResponse"></iron-ajax>

        <appsco-content id="appscoContent" resource-active="">

            <div class="flex-vertical" resource="" slot="resource">

                <div class="resource-header">
                    <appsco-group-image-settings
                        id="appscoGroupImageSettings"
                        group="[[ group ]]"
                        authorization-token="[[ authorizationToken ]]"
                        image-settings-api="[[ _groupImageSettingsApi ]]">
                    </appsco-group-image-settings>
                </div>

                <div class="resource-content group-info">
                    <p>[[ group.name ]]</p>
                    <p>
                        Created at:
                        <appsco-date-format date="[[ group.createdAt.date ]]" options="{&quot;year&quot;: &quot;numeric&quot;, &quot;month&quot;: &quot;long&quot;, &quot;day&quot;: &quot;numeric&quot;, &quot;hour&quot;: &quot;2-digit&quot;, &quot;minute&quot;: &quot;2-digit&quot;}"></appsco-date-format>
                    </p>
                </div>

                <div class="resource-actions flex-horizontal">
                    <paper-button class="button danger-button flex" on-tap="_onRemoveGroupAction">
                        Remove
                    </paper-button>
                </div>

            </div>

            <div content="" slot="content">
                <div class="content-container">
                    <neon-animated-pages class="flex" selected="{{ _selected }}" attr-for-selected="name">

                        <appsco-manage-group-components-page id="appscoManageGroupComponentsPage" name="appsco-group-components-page" group="[[ group ]]" group-roles-api="[[ _groupRolesApi ]]" group-contacts-api="[[ _groupContactsApi ]]" group-resources-api="[[ _groupResourcesApi ]]" authorization-token="[[ authorizationToken ]]" on-group-roles-loaded="_onPageLoaded" on-empty-load="_onPageLoaded" on-manage-group-roles="_onManageGroupRoles" on-manage-group-contacts="_onManageGroupContacts" on-manage-group-resources="_onManageGroupResources">
                        </appsco-manage-group-components-page>

                        <appsco-group-roles-page id="appscoGroupRolesPage" name="appsco-group-roles-page" group="[[ group ]]" group-roles-api="[[ _groupRolesApi ]]" authorization-token="[[ authorizationToken ]]" on-add-item-to-group-event="_onAddItemToGroupAction" on-remove-company-role-from-group="_onRemoveCompanyRoleFromGroup" on-back="_onResourceBack">
                        </appsco-group-roles-page>

                        <appsco-group-contacts-page id="appscoGroupContactsPage" name="appsco-group-contacts-page" group="[[ group ]]" group-contacts-api="[[ _groupContactsApi ]]" authorization-token="[[ authorizationToken ]]" on-add-item-to-group-event="_onAddItemToGroupAction" on-remove-company-contact-from-group="_onRemoveCompanyContactFromGroup" on-back="_onResourceBack">
                        </appsco-group-contacts-page>

                        <appsco-group-resources-page id="appscoGroupResourcesPage" name="appsco-group-resources-page" group="[[ group ]]" group-resources-api="[[ _groupResourcesApi ]]" authorization-token="[[ authorizationToken ]]" on-add-item-to-group-event="_onAddItemToGroupAction" on-remove-company-resource-from-group="_onRemoveCompanyResourceFromGroup" on-back="_onResourceBack">
                        </appsco-group-resources-page>

                    </neon-animated-pages>
                </div>

            </div>
        </appsco-content>

        <appsco-company-remove-group id="appscoCompanyRemoveGroup" authorization-token="[[ authorizationToken ]]" api-errors="[[ apiErrors ]]">
        </appsco-company-remove-group>

        <appsco-resource-remove-from-group id="appscoResourceRemoveFromGroup" authorization-token="[[ authorizationToken ]]" api-errors="[[ apiErrors ]]">
        </appsco-resource-remove-from-group>

        <appsco-group-add-resource id="appscoGroupAddResource" group="[[ group ]]" authorization-token="[[ authorizationToken ]]">
        </appsco-group-add-resource>
`;
    }

    static get is() { return 'appsco-manage-group-page'; }

    static get properties() {
        return {
            route: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            group: {
                type: Object,
                value: function () {
                    return {};
                },
                notify: true,
                observer: '_onGroupChanged'
            },

            groupApi: {
                type: String,
                observer: '_onGroupApiChanged'
            },

            companyApplicationsApi: {
                type: String
            },

            companyRolesApi: {
                type: String
            },

            companyContactsApi: {
                type: String
            },

            _groupRolesApi: {
                type: String,
                computed: '_computeGroupRoleApi(group)'
            },

            _groupContactsApi: {
                type: String,
                computed: '_computeGroupContactApi(group)'
            },

            _groupResourcesApi: {
                type: String,
                computed: '_computeGroupResourcesApi(group)'
            },

            _groupImageSettingsApi: {
                type: String,
                computed: '_computeGroupImageSettingsApi(group)'
            },

            apiErrors: {
                type: Object
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

            /**
             * Selected page.
             * It has value of component's 'name' attribute.
             */
            _selected: {
                type: String,
                value: 'appsco-group-components-page',
                notify: true
            },

            animationConfig: {
                type: Object
            },

            pageLoaded: {
                type: Boolean,
                value: false
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
            if (this.mobileScreen || this.tabletScreen || this.mediumScreen) {
                this.updateStyles();
            }
        });

        afterNextRender(this, function() {
            this._getGroup();
            this._addListeners();
        });
    }

    _addListeners() {
        this.toolbar.addEventListener('resource-section', this.toggleResource.bind(this));
    }

    reloadPage() {
        this.$.appscoManageGroupComponentsPage.loadPage();
        this.$.appscoGroupRolesPage.loadPage();
    }

    addGroupItems(groups, items, resourceType) {
        const length = groups.length;

        for (let i = 0; i < length; i++) {
            if (this.group.alias === groups[i].alias) {
                this._addGroupItems(items, resourceType);
                break;
            }
        }
    }

    removeGroupItems(group, items, resourceType) {
        if (this.group.alias === group.alias) {
            this._removeGroupItems(items, resourceType);
        }
    }

    toggleResource() {
        this.$.appscoContent.toggleSection('resource');
    }

    resetPage() {
        this._showComponentsPage();
    }

    _updateScreen(medium, tablet, mobile) {
        this.updateStyles();

        if (mobile) {
            this.$.appscoContent.hideSection('resource');
        }
        else if (!this.$.appscoContent.resourceActive) {
            this.$.appscoContent.showSection('resource');
        }
    }

    _computeGroupRoleApi(group) {
        return group.meta ? group.meta.company_roles + '?extended=1' : null;
    }

    _computeGroupContactApi(group) {
        return group.meta ? group.meta.contacts + '?extended=1' : null;
    }

    _computeGroupResourcesApi(group) {
        return group.meta ? group.meta.applications + '?extended=1' : null;
    }

    _computeGroupImageSettingsApi(group) {
        return group.meta ? group.meta.self + '/image' : null;
    }

    _onPageLoaded() {
        this.pageLoaded = true;
        this.dispatchEvent(new CustomEvent('page-loaded', { bubbles: true, composed: true }));
    }

    _showComponentsPage() {
        this._selected = 'appsco-group-components-page';
    }

    _showGroupRolesPage() {
        this._selected = 'appsco-group-roles-page';
    }

    _showGroupContactsPage() {
        this._selected = 'appsco-group-contacts-page';
    }

    _showGroupResourcesPage() {
        this._selected = 'appsco-group-resources-page';
    }

    _addGroupRoles(roles) {
        this.$.appscoManageGroupComponentsPage.addGroupRoles(roles);
        this.$.appscoGroupRolesPage.addGroupItems(roles);
    }

    _removeGroupRoles(roles) {
        this.$.appscoManageGroupComponentsPage.removeGroupRoles(roles);
        this.$.appscoGroupRolesPage.removeGroupItems(roles);
    }

    _addGroupContacts(contacts) {
        this.$.appscoManageGroupComponentsPage.addGroupContacts(contacts);
        this.$.appscoGroupContactsPage.addGroupItems(contacts);
    }

    _addGroupResources(resources) {
        this.$.appscoManageGroupComponentsPage.addGroupResources(resources);
        this.$.appscoGroupResourcesPage.addGroupItems(resources);
    }

    _removeGroupContacts(contacts) {
        this.$.appscoManageGroupComponentsPage.removeGroupContacts(contacts);
        this.$.appscoGroupContactsPage.removeGroupItems(contacts);
    }

    _removeGroupResources(resources) {
        this.$.appscoManageGroupComponentsPage.removeGroupResources(resources);
        this.$.appscoGroupResourcesPage.removeGroupItems(resources);
    }

    _addGroupItems(items, resourceType) {
        switch (resourceType) {
            case 'resource':
                this._addGroupResources(items);
                break;
            case 'role':
                this._addGroupRoles(items);
                break;
            case 'contact':
                this._addGroupContacts(items);
                break;
            default:
                return false;
        }
    }

    _removeGroupItems(items, resourceType) {
        switch (resourceType) {
            case 'resource':
                this._removeGroupResources(items);
                break;
            case 'role':
                this._removeGroupRoles(items);
                break;
            case 'contact':
                this._removeGroupContacts(items);
                break;
            default:
                return false;
        }
    }

    _onResourceBack() {
        this._showComponentsPage();
    }

    _onGroupApiChanged() {
        this._getGroup();
    }

    _onGroupChanged(group) {
        for (const key in group) {
            this.reloadPage();
            break;
        }
    }

    _getGroup() {
        if (!this.group.self && this.groupApi && this._headers) {
            const groupApi = this.groupApi + this.route.path,
                getGroupRequest = this.$.ironAjaxGetGroup;

            if (getGroupRequest.lastRequest) {
                getGroupRequest.lastRequest.abort();
            }

            getGroupRequest.url = groupApi;
            getGroupRequest.generateRequest();
        }
    }

    _onGetGroupResponse(event) {
        if (200 === event.detail.status && event.detail.response) {
            this.set('group', event.detail.response);
        }
    }

    _onGetGroupError(event) {
        if (!event.detail.request.aborted) {
            this.dispatchEvent(new CustomEvent('page-error', { bubbles: true, composed: true }));
        }
    }

    _onRemoveGroupAction() {
        const dialog = this.shadowRoot.getElementById('appscoCompanyRemoveGroup');
        dialog.setGroup(this.group);
        dialog.open();
    }

    _onManageGroupRoles() {
        this._showGroupRolesPage();
    }

    _onManageGroupContacts() {
        this._showGroupContactsPage();
    }

    _onManageGroupResources() {
        this._showGroupResourcesPage();
    }

    _onRemoveCompanyRoleFromGroup(event) {
        this._removeResourceFromGroup(event.detail.group, event.detail.role, 'role');
    }

    _onRemoveCompanyContactFromGroup(event) {
        this._removeResourceFromGroup(event.detail.group, event.detail.contact, 'contact');
    }

    _onRemoveCompanyResourceFromGroup(event) {
        this._removeResourceFromGroup(event.detail.group, event.detail.resource, 'resource');
    }

    _removeResourceFromGroup(group, item, type) {
        const dialog = this.shadowRoot.getElementById('appscoResourceRemoveFromGroup');
        dialog.setGroup(group);
        dialog.setItem(item);
        dialog.setType(type);
        dialog.open();
    }

    _onAddItemToGroupAction(event) {
        const dialog = this.shadowRoot.getElementById('appscoGroupAddResource'),
            resourceType = event.detail.resourceType;

        dialog.setType(resourceType);

        switch (resourceType) {
            case 'resource':
                dialog.setListItemsApi(this.companyApplicationsApi);
                break;

            case 'role':
                dialog.setListItemsApi(this.companyRolesApi);
                break;

            case 'contact':
                dialog.setListItemsApi(this.companyContactsApi);
                break;

            default:
                return false;
        }

        dialog.open();
    }
}
window.customElements.define(AppscoManageGroupPage.is, AppscoManageGroupPage);
