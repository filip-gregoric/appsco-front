import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-progress/paper-progress.js';
import '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/slide-from-left-animation.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-styles/typography.js';
import './appsco-company-resource-item.js';
import { AppscoListBehavior } from '../../components/appsco-list-behavior.js';
import '../../components/appsco-list-styles.js';
import { AppscoListObserverBehavior } from '../../components/appsco-list-observer-behavior.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status";
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoCompanyResources extends mixinBehaviors([
    AppscoListBehavior,
    AppscoListObserverBehavior
], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-list-styles"></style>

        <style>
            :host appsco-company-resource-item {
                @apply --appsco-company-resource-item;
            }
            :host([display-grid]) appsco-company-resource-item {
                width: auto;
                margin: 0 10px 10px 0;
                position: relative;
                @apply --appsco-company-resource-item;
            }
            :host .info-total {
                margin-bottom: 10px;
            }
            :host .total {
                @apply --paper-font-caption;
                color: var(--secondary-text-color);
            }
        </style>

        <iron-ajax id="getListApiRequest" url="[[ _listApi ]]" on-error="_onError" on-response="_onGetListResponse" headers="[[ _headers ]]"></iron-ajax>
        
        <div class="list-container">

            <paper-progress id="paperProgress" class="list-progress-bar" indeterminate=""></paper-progress>

            <template is="dom-if" if="[[ _message ]]">
                <p class="message">[[ _message ]]</p>
            </template>

            <template is="dom-if" if="[[ !_listEmpty ]]">
                <div class="info-total" hidden\$="[[ !_totalListItems ]]">
                    <span class="total">Total resources: [[ _totalListItems ]]</span>
                </div>

                <div class="list">
                    <template is="dom-repeat" items="[[ _listItems ]]" initial-count="20">

                        <appsco-company-resource-item id="appscoListItem_[[ index ]]" item="[[ item ]]" type="[[ type ]]" selectable="[[ selectable ]]" resource-admin="[[ resourceAdmin ]]" display-grid\$="[[ displayGrid ]]" on-item="_onListItemAction" on-select-item="_onSelectListItemAction"></appsco-company-resource-item>

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

    static get is() { return 'appsco-company-resources'; }

    static get properties() {
        return {
            resourceAdmin: {
                type: Boolean,
                value: false
            },

            displayStyle: {
                type: String,
                value: 'list',
                observer: '_displayStyleChanged'
            },

            displayGrid: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            }
        };
    }

    static get observers() {
        return [
            '_observeItems(_listItems)'
        ];
    }

    _addItems(itemList) {
        this._listEmpty = false;

        itemList.forEach(function(el) {
            el.activated = false;
            el.selected = false;
        });

        this.push('_listItems', ...itemList);
        this.push('_allListItems', ...itemList);

        afterNextRender(this, function() {
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
        );
    }

    _observeItems(items) {
        this.setObservableType('resources');
        this.populateItems(items);
    }

    _displayStyleChanged(newValue) {
        this.displayGrid = (newValue === 'grid');
    }

    setDisplayStyle(displayStyle) {
        this.displayStyle = displayStyle;
    }

    _onError(response) {
        if (response.detail.request.status === 403) {
            this.dispatchEvent(new CustomEvent('load-forbidden', { bubbles: true, composed: true }));
        }
        this._onGetListError(response);
    }
}
window.customElements.define(AppscoCompanyResources.is, AppscoCompanyResources);
