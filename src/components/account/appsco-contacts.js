import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-progress/paper-progress.js';
import './appsco-contact-item.js';
import { AppscoListBehavior } from '../components/appsco-list-behavior.js';
import { AppscoListObserverBehavior } from '../components/appsco-list-observer-behavior.js';
import '../components/appsco-list-styles.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoContacts extends mixinBehaviors([
    AppscoListBehavior,
    AppscoListObserverBehavior
], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-list-styles">
            :host appsco-contact-item {
                width: 100%;
                margin: 0 0 10px 0;
                @apply --appsco-contact-item;
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

                        <appsco-contact-item id="appscoListItem_[[ index ]]" item="[[ item ]]" type="[[ type ]]" selectable="[[ selectable ]]" on-item="_onListItemAction" on-select-item="_onSelectListItemAction"></appsco-contact-item>
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

    static get is() { return 'appsco-contacts'; }

    static get observers() {
        return [
            '_observeItems(_listItems)'
        ];
    }

    _observeItems(items) {
        this.setObservableType('contacts');
        this.populateItems(items);
    }

    filterByTerm(term) {
        this._filterTerm = term;
        this._filterByTerm();
    }

    _filterByTerm() {
        let filterApi = this.listApi + '?page=1&limit='+this.size+'&extended=1',
            filterTerm = this._filterTerm,
            filterTermPresent = (filterTerm && 3 <= filterTerm.length);

        this._hideMessage();
        this._showProgressBar();
        this._hideLoadMoreAction();
        this._clearListLoaders();
        this.set('_listItems', []);

        if (filterTermPresent) {
            filterApi += '&term=' + filterTerm;
        }

        this._getItems(filterApi).then(function(items) {
            const itemsLength = items.length,
                allListItems = JSON.parse(JSON.stringify(this._allListItems)),
                allLength = allListItems.length;

            if (0 === itemsLength) {
                this._handleEmptyLoad();
                this.dispatchEvent(new CustomEvent('filter-done', { bubbles: true, composed: true }));
                return false;
            }

            this._listEmpty = false;

            items.forEach(function(elem, index) {
                for (let i = 0; i < allLength; i++) {
                    const currentListItem = allListItems[i];

                    if (elem.self === currentListItem.self) {
                        this.push('_listItems', currentListItem);
                        this._listItems = JSON.parse(JSON.stringify(this._listItems));
                        break;
                    }
                    else {
                        if (i === allLength - 1) {
                            this.push('_listItems', elem);
                            this._listItems = JSON.parse(JSON.stringify(this._listItems));
                        }
                    }
                }

                if (index === itemsLength - 1) {
                    this._hideProgressBar();
                    this.dispatchEvent(new CustomEvent('filter-done', { bubbles: true, composed: true }));
                }
            }.bind(this));
        }.bind(this));
    }
}
window.customElements.define(AppscoContacts.is, AppscoContacts);
