import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-progress/paper-progress.js';
import './appsco-customer-item.js';
import { AppscoListBehavior } from '../components/appsco-list-behavior.js';
import '../components/appsco-list-styles.js';
import { AppscoListObserverBehavior } from '../components/appsco-list-observer-behavior.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoCustomers extends mixinBehaviors([
    AppscoListBehavior,
    AppscoListObserverBehavior
], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-list-styles">
            :host appsco-customer-item {
                width: 100%;
                margin: 0 0 10px 0;
                @apply --appsco-customer-item;
            }
        </style>

        <iron-ajax id="getListApiRequest" url="[[ _listApi ]]" on-error="_onGetListError" on-response="_onGetListResponse" headers="[[ _headers ]]" debounce-duration="300"></iron-ajax>

        <div class="list-container">

            <paper-progress id="paperProgress" class="list-progress-bar" indeterminate=""></paper-progress>

            <template is="dom-if" if="[[ _message ]]">
                <p class="message">[[ _message ]]</p>
            </template>

            <template is="dom-if" if="[[ !_listEmpty ]]">
                <div class="list">
                    <template is="dom-repeat" items="[[ _listItems ]]" on-dom-change="_onItemsDomChange">

                        <appsco-customer-item id="appscoListItem_[[ index ]]" item="[[ item ]]" type="[[ type ]]" list-api="[[ listApi ]]" authorization-token="[[ authorizationToken ]]" selectable="[[ selectable ]]" preview="[[ preview ]]" on-item="_onListItemAction" on-select-item="_onSelectListItemAction"></appsco-customer-item>

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

    static get is() { return 'appsco-customers'; }

    static get properties() {
        return {
            preview: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },
        }
    }

    static get observers() {
        return [
            '_observeItems(_listItems)'
        ];
    }

    reloadInfo(group) {
        const groups = JSON.parse(JSON.stringify(this._listItems));

        for (let idx in groups) {
            if (group.self === groups[idx].self) {
                this.shadowRoot.getElementById('appscoListItem_' + idx).reloadInfo(group);
            }
        }
    }

    _observeItems(items) {
        this.setObservableType('customers');
        this.populateItems(items);
    }
}
window.customElements.define(AppscoCustomers.is, AppscoCustomers);
