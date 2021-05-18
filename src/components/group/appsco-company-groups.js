import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-progress/paper-progress.js';
import './appsco-company-group-item.js';
import { AppscoListBehavior } from '../components/appsco-list-behavior.js';
import { AppscoListObserverBehavior } from '../components/appsco-list-observer-behavior.js';
import '../components/appsco-list-styles.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoCompanyGroups extends mixinBehaviors([
    AppscoListBehavior,
    AppscoListObserverBehavior,
    Appsco.HeadersMixin
], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-list-styles">
            :host appsco-company-group-item {
                width: 100%;
                margin: 0 0 10px 0;
                @apply --appsco-company-group-item;
            }
        </style>

        <iron-ajax id="getListApiRequest" url="[[ _listApi ]]" on-error="_onGetListError" on-response="_onGetListResponse" headers="[[ _headers ]]" debounce-duration="300"></iron-ajax>

        <div class="list-container">

            <paper-progress id="paperProgress" class="list-progress-bar" indeterminate=""></paper-progress>

            <template is="dom-if" if="[[ _shouldDisplayMessage ]]">
                <p class="message">[[ _message ]]</p>
            </template>

            <template is="dom-if" if="[[ !_listEmpty ]]">
                <div class="list">
                    <template is="dom-repeat" items="[[ _listItems ]]" on-dom-change="_onItemsDomChange">

                        <appsco-company-group-item
                            id="appscoListItem_[[ index ]]"
                            item="[[ item ]]"
                            type="[[ type ]]"
                            authorization-token="[[ authorizationToken ]]"
                            preview="[[ preview ]]"
                            preview-show-count-type="[[ previewShowCountType ]]"
                            selectable="[[ selectable ]]"
                            on-item="_onListItemAction"
                            on-select-item="_onSelectListItemAction">
                        </appsco-company-group-item>

                    </template>
                </div>
            </template>
        </div>

        <template is="dom-if" if="[[ !_listEmpty ]]">
            <div class="load-more-box" hidden\$="[[ !_loadMore ]]">
                <paper-progress id="loadMoreProgress" indeterminate=""></paper-progress>
                <paper-button class="load-more-action" on-tap="_onLoadMoreAction">Load More</paper-button>
            </div>
        </template>
`;
    }

    static get is() { return 'appsco-company-groups'; }

    static get properties() {
        return {
            preview: {
                type: Boolean,
                value: false
            },

            /**
             * Possible values: "resources", "contacts", "roles"
             */
            previewShowCountType: {
                type: String
            },

            hideMessages: {
                type: Boolean,
                value: false
            },

            _shouldDisplayMessage: {
                type: Boolean,
                computed: '_computeShouldDisplayMessage(_message, hideMessages)'
            },

            selectable: {
                type: Boolean,
                value: true
            }
        };
    }

    static get observers() {
        return [
            '_observeItems(_listItems)'
        ];
    }

    recalculateTotals(group) {
        const groups = JSON.parse(JSON.stringify(this._listItems));

        for (const idx in groups) {
            if (group.self === groups[idx].self) {
                this.shadowRoot.getElementById('appscoListItem_' + idx).recalculateTotals(group);
            }
        }
    }

    addGroupsCompanyRoles(groups, roles) {
        const length = groups.length;
        this.modifyItems(groups);
        for (let i = 0; i < length; i++) {
            this._increaseGroupRoleCount(groups[i], roles.length);
        }
    }

    removeGroupCompanyRoles(group, roles) {
        this._decreaseGroupRoleCount(group, roles.length);
    }

    _observeItems(items) {
        if (this.preview === false) {
            this.setObservableType('groups');
            this.populateItems(items);
        }
    }

    _increaseGroupRoleCount(group, count) {
        const groups = JSON.parse(JSON.stringify(this._listItems)),
            length = groups.length;

        for (let i = 0; i < length; i++) {
            if (group.self === groups[i].alias) {
                this.shadowRoot.getElementById('appscoListItem_' + i).increaseGroupRolesCount(count);
                break;
            }
        }
    }

    _decreaseGroupRoleCount(group, count) {
        const groups = JSON.parse(JSON.stringify(this._listItems)),
            length = groups.length;

        for (let i = 0; i < length; i++) {
            if (group.self === groups[i].self) {
                this.shadowRoot.getElementById('appscoListItem_' + i).decreaseGroupRolesCount(count);
                break;
            }
        }
    }

    _computeShouldDisplayMessage(message, hideMessages) {
        return message && !hideMessages;
    }
}
window.customElements.define(AppscoCompanyGroups.is, AppscoCompanyGroups);
