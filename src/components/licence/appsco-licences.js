import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-progress/paper-progress.js';
import '@polymer/iron-collapse/iron-collapse.js';
import './appsco-licence-item.js';
import { AppscoListBehavior } from '../components/appsco-list-behavior.js';
import { AppscoListObserverBehavior } from '../components/appsco-list-observer-behavior.js';
import '../components/appsco-list-styles.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoLicences extends mixinBehaviors([
    AppscoListBehavior,
    AppscoListObserverBehavior
], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-list-styles">
            :host .text-title {
                margin: 20px 0 10px 0;
                font-size: 15px;
                cursor: pointer;
                display: inline-block;
            }
            :host .toggle-icon {
                transition: transform 0.2s linear;
                cursor: pointer;
            }
            :host .toggle-icon.opened {
                transform: rotate(-180deg);
                transition: transform 0.3s linear;
            }
            :host appsco-licence-item {
                width: 100%;
                margin: 0 0 10px 0;
                @apply --appsco-licence-item;
            }
            :host iron-collapse {
                width: 100%;
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
                    <template is="dom-repeat" items="[[ customers ]]">
                        <div class="text-title" on-tap="toggle" data-customer-alias\$="[[ item.customer.alias ]]">[[ item.customer.name ]] ([[ count(item.licences) ]])
                            <iron-icon icon="icons:expand-less" class="toggle-icon opened" data-customer-alias\$="[[ item.customer.alias ]]" id="icon-[[ item.customer.alias ]]"></iron-icon>
                        </div>
                        <iron-collapse opened id="collapse-[[ item.customer.alias ]]">
                            <template is="dom-repeat" items="[[ item.licences ]]">
                                <appsco-licence-item id="appscoListItem_[[ index ]]" item="[[ item ]]" type="[[ type ]]" selectable="[[ selectable ]]" on-item="_onListItemAction" on-select-item="_onSelectListItemAction"></appsco-licence-item>
                            </template>
                        </iron-collapse>
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

    static get is() { return 'appsco-licences'; }

    static get properties() {
        return {
            customers: {
                type: Array
            }
        };
    }

    static get observers() {
        return [
            '_observeItems(_listItems)',
            '_computeCustomers(_listItems)'
        ];
    }

    count(items) {
        if(!items) {
            return 0;
        }

        return items.length;
    }

    _computeCustomers() {
        const items = this._listItems;
        const customers = new Map();
        const length = items.length;
        const unassignedLicenses = [];
        for (let i = 0; i < length; i++) {
            let assignedTo = items[i].assigned_to;
            if(!assignedTo) {
                unassignedLicenses.push(items[i]);
                continue;
            }
            if(!customers.has(assignedTo.alias)) {
                customers.set(assignedTo.alias, {
                    customer: assignedTo,
                    licences: []
                })
            }
            const customer = customers.get(assignedTo.alias);
            customer.licences.push(items[i]);
        }

        if (unassignedLicenses.length > 0) {
           customers.set('unassigned', {
               customer: { alias: 'Unassigned', name: 'Unassigned'},
               licences: unassignedLicenses
           })
        }

        this.customers = Array.from(customers.values());
    }

    toggle(element) {
        const alias = element.target.dataset.customerAlias;
        if (!alias) {
            return;
        }

        const iconElement = this.shadowRoot.getElementById('icon-' + alias);
        const collapseElement = this.shadowRoot.getElementById('collapse-' + alias);

        collapseElement.toggle();
        iconElement.classList.toggle('opened');
    }

    _addItems(itemList) {
        this._listEmpty = false;

        itemList.forEach(function(el) {
            el.activated = false;
            el.selected = false;
        });

        this._listItems = this._listItems.concat(itemList);
        this.push('_allListItems', ...itemList);

        this.dispatchEvent(new CustomEvent('list-loaded', {
            bubbles: true,
            composed: true,
            detail: {
                items: itemList
            }
        }));

        this._hideProgressBar();
        this._hideLoadMoreProgressBar();
        this._setLoadMoreAction();
    }

    _observeItems(items) {
        this.setObservableType('licences');
        this.populateItems(items);
    }
}
window.customElements.define(AppscoLicences.is, AppscoLicences);
