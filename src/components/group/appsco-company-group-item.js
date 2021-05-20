import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-button/paper-button.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-media-query/iron-media-query.js';
import './appsco-company-group-image.js';
import { AppscoListItemBehavior } from '../components/appsco-list-item-behavior.js';
import '../components/appsco-list-item-styles.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoCompanyGroupItem extends mixinBehaviors([
    NeonAnimationRunnerBehavior,
    AppscoListItemBehavior,
    Appsco.HeadersMixin
], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-list-item-styles">
            :host([preview][activated]) {
                background-color: #e8e8e8;
            }
            :host([preview]) .item-title {                
                font-size: var(--group-item-preview-font-size, 14px);
                cursor: pointer;
            }
            :host .item-title {
                @apply --text-no-wrap;
            }
            :host([mobile-screen]) .item-additional-info {
                display: none;
            }
        </style>

        <iron-media-query query="(max-width: 600px)" query-matches="{{ mobileScreen }}"></iron-media-query>


        <iron-ajax id="getGroupRolesApiRequest" url="[[ _groupRolesApiUrl ]]" headers="[[ _headers ]]" on-error="_onGroupRolesError" on-response="_onGroupRolesResponse"></iron-ajax>

        <iron-ajax id="getGroupContactsApiRequest" url="[[ _groupContactsApiUrl ]]" headers="[[ _headers ]]" on-error="_onGroupContactsError" on-response="_onGroupContactsResponse"></iron-ajax>

        <iron-ajax id="getGroupResourcesApiRequest" url="[[ _groupResourcesApiUrl ]]" headers="[[ _headers ]]" on-error="_onGroupResourcesError" on-response="_onGroupResourcesResponse"></iron-ajax>

        <template is="dom-if" if="[[ preview ]]">
            <span class="info-label item-title">[[ item.name ]] 
                <template is="dom-if" if="[[ previewShowCountType ]]">
                    ([[ _previewCount ]])
                </template>
            </span>

        </template>

        <template is="dom-if" if="[[ !preview ]]">
            <div class="item">

                <template is="dom-if" if="[[ selectable ]]">
                    <div class="select-action" on-tap="_onSelectItemAction">
                        <appsco-company-group-image group="[[ item ]]"></appsco-company-group-image>

                        <div class="icon-action">
                            <div class="iron-action-inner">
                                <iron-icon icon="icons:check"></iron-icon>
                            </div>
                        </div>
                    </div>
                </template>

                <template is="dom-if" if="[[ !selectable ]]">
                    <appsco-company-group-image group="[[ item ]]"></appsco-company-group-image>
                </template>

                <div class="item-info item-basic-info">
                    <span class="info-label group-title">[[ item.name ]]</span>
                    <span class="info-value">Group</span>
                </div>

                <div class="item-info item-additional-info">
                    <div class="info">
                        <span class="info-label">Total resources:&nbsp;</span>
                        <span class="info-value">[[ _groupResourcesCount ]]</span>
                    </div>
                    <div class="info">
                        <span class="info-label">Total users:&nbsp;</span>
                        <span class="info-value">[[ _groupRolesCount ]]</span>
                    </div>
                    <div class="info">
                        <span class="info-label">Total contacts:&nbsp;</span>
                        <span class="info-value">[[ _groupContactsCount ]]</span>
                    </div>
                </div>

                <div class="actions">
                    <paper-button on-tap="_onRenameGroupAction">Rename</paper-button>
                    <paper-button on-tap="_onEditItemAction">Edit</paper-button>
                </div>
            </div>
        </template>
`;
    }

    static get is() { return 'appsco-company-group-item'; }

    static get properties() {
        return {
            preview: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            /**
             * Possible values: "resources", "contacts", "roles"
             */
            previewShowCountType: {
                type: String
            },

            _groupRolesApiUrl: {
                type: String,
                computed: '_computeGroupRolesApiUrl(item)'
            },

            _groupResourcesApiUrl: {
                type: String,
                computed: '_computeGroupResourcesApiUrl(item)'
            },

            _groupContactsApiUrl: {
                type: String,
                computed: '_computeGroupContactsApiUrl(item)'
            },

            _groupRolesCount: {
                type: Number,
                value: 0
            },

            _groupRolesLoaded: {
                type: Boolean,
                value: false
            },

            _groupResourcesCount: {
                type: Number,
                value: 0
            },

            _groupResourcesLoaded: {
                type: Boolean,
                value: false
            },

            _groupContactsCount: {
                type: Number,
                value: 0
            },

            _groupContactsLoaded: {
                type: Boolean,
                value: false
            },

            mobileScreen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            _previewCount: {
                type: String,
                computed: '_computePreviewCount(preview, previewShowCountType, _groupResourcesCount, _groupContactsCount, _groupRolesCount)'
            }
        };
    }

    static get observers() {
        return [
            '_listenForItemInfoLoad(_groupRolesLoaded, _groupResourcesLoaded, _groupContactsLoaded)',
            '_groupChanged(item)'
        ];
    }

    ready() {
        super.ready();

        afterNextRender(this, function() {
            this._addListeners();
        });
    }

    _addListeners() {
        this.addEventListener('tap', this._onItemAction);
    }

    recalculateTotals() {
        this.shadowRoot.getElementById('getGroupRolesApiRequest').generateRequest();
        this.shadowRoot.getElementById('getGroupContactsApiRequest').generateRequest();
        this.shadowRoot.getElementById('getGroupResourcesApiRequest').generateRequest();
    }

    increaseGroupRolesCount(count) {
        this._groupRolesCount += count;
    }

    decreaseGroupRolesCount(count) {
        this._groupRolesCount -= count;
    }

    _computeGroupRolesApiUrl(group) {
        return group.meta ? group.meta.company_roles : null;
    }

    _computeGroupResourcesApiUrl(group) {
        return group.meta ? group.meta.applications : null;
    }

    _computeGroupContactsApiUrl(group) {
        return group.meta ? group.meta.contacts : null;
    }

    _onGroupRolesError() {
        this._groupRolesCount = 0;
        this._groupRolesLoaded = true;
    }

    _onGroupContactsError() {
        this._groupContactsCount = 0;
        this._groupContactsLoaded = true;
    }

    _onGroupResourcesError() {
        this._groupResourcesCount = 0;
        this._groupResourcesLoaded = true;
    }

    _onGroupRolesResponse(event) {
        const response = event.detail.response;

        this._groupRolesCount = (response && response.meta) ? response.meta.total : 0;
        this._groupRolesLoaded = true;
    }

    _onGroupResourcesResponse(event) {
        const response = event.detail.response;

        this._groupResourcesCount = (response && response.meta) ? response.meta.total : 0;
        this._groupResourcesLoaded = true;
    }

    _onGroupContactsResponse(event) {
        const response = event.detail.response;

        this._groupContactsCount = (response && response.meta) ? response.meta.total : 0;
        this._groupContactsLoaded = true;
    }

    _listenForItemInfoLoad(rolesLoaded, resourcesLoaded, contactsLoaded) {
        if (this.noAutoDisplay && rolesLoaded && resourcesLoaded && contactsLoaded) {
            this._showItem();
        }
    }

    _onRenameGroupAction(event) {
        event.stopPropagation();
        this.dispatchEvent(new CustomEvent('group-rename', {
            bubbles: true,
            composed: true,
            detail: {
                group: this.item
            }
        }));
    }

    _computePreviewCount(preview, previewShowCountType) {
        if (!preview) {
            return '';
        }

        if ('resources' === previewShowCountType) {
            return this._groupResourcesCount;
        }

        if ('contacts' === previewShowCountType) {
            return this._groupContactsCount;
        }

        if ('roles' === previewShowCountType) {
            return this._groupRolesCount;
        }

        return '';
    }

    _groupChanged(group) {
        if (!group) {
            return;
        }

        if (Object.keys(group.meta.counts).length > 0) {
            this._groupContactsCount = group.meta.counts.contacts_count;
            this._groupResourcesCount = group.meta.counts.applications_count;
            this._groupRolesCount = group.meta.counts.users_count;
        }
    }
}
window.customElements.define(AppscoCompanyGroupItem.is, AppscoCompanyGroupItem);
