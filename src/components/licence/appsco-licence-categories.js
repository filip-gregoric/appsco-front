import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-progress/paper-progress.js';
import './appsco-licence-category-item.js';
import { AppscoListBehavior } from '../components/appsco-list-behavior.js';
import { AppscoListObserverBehavior } from '../components/appsco-list-observer-behavior.js';
import '../components/appsco-list-styles.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoLicenceCategories extends mixinBehaviors([
    AppscoListBehavior,
    AppscoListObserverBehavior
], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-list-styles">
            :host .list {
                padding-bottom: 4rem;
            }
            :host appsco-licence-category-item {
                margin: 0;
                padding: 5px;
                @apply --appsco-licence-category-item;
                flex-grow: 2;
            }
            :host [activated] {
                background-color: #e8e8e8;
            }
            :host .icon-options {
                opacity: 0;
                transition: opacity 0.1s linear;
            }
            :host .item-container:hover .icon-options, :host .item-container.show-options .icon-options {
                opacity: 1;
                transition: opacity 0.2s linear;
            }
            :host .flex {
                @apply --layout-flex;
            }
            :host .item-container {
                display: flex;
                justify-content: space-between;
                width: 100%;
                align-items: center;
                position: relative;
            }
            :host paper-material {
                @apply --paper-listbox;
            }
            :host .options {
                z-index: 10;
                overflow: auto;
                position: absolute;
                top: 32px;
                right: 0;
                background-color: white;
                min-width: 150px;
                display: none;
                box-shadow: var(--shadow-elevation-2dp_-_box-shadow);
            }
            :host paper-item {
                border-bottom: 1px solid rgba(0,0,0, 0.1);
                @apply --paper-font-caption;
                min-height: 32px;
            }
            :host paper-item:last-child {
                border-bottom: 0;
            }
            :host paper-item:hover {
                @apply --paper-item-hover;
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
                    <template is="dom-repeat" items="[[ _listItems ]]">
                        <div class="item-container">
                            <appsco-licence-category-item id="appscoListItem_[[ index ]]" item="[[ item ]]" type="[[ type ]]" selectable="" on-item="_onListItemAction" on-select-item="_onSelectListItemAction"></appsco-licence-category-item>
                            
                            <iron-icon id="iconOptions" class="icon-options" icon="icons:more-vert" on-tap="_toggleOptions"></iron-icon>
                            <paper-material id="options" class="options">
                                <paper-item on-tap="_onModify">Modify</paper-item>
                                <paper-item on-tap="_onRemove">Remove</paper-item>
                            </paper-material>                            
                        </div>
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

    static get is() { return 'appsco-licence-categories'; }

    static get observers() {
        return [
            '_observeItems(_listItems)'
        ];
    }

    _toggleOptions(event) {
        const options = event.target.parentElement.querySelector('paper-material');

        this.shadowRoot.querySelectorAll('paper-material.options').forEach(
            function(element) {
                if(options === element) {
                    return;
                }
                element.style.display = 'none';
            }
        )
        if (options.style.display !== 'block') {
            options.style.display = 'block';
            options.parentElement.classList.add('show-options');
            return;
        }

        options.style.display = 'none';
        options.parentElement.classList.remove('show-options');
    }

    _onModify(event) {
        const options = event.target.parentElement;
        options.style.display = 'none';
        const category = this.categoryFromOptions(options);

        this.dispatchEvent(new CustomEvent('modify-category', {
            bubbles: true,
            composed: true,
            detail: {
                category: category
            }
        }));
    }

    _onRemove(event) {
        const options = event.target.parentElement;
        options.style.display = 'none';
        const category = this.categoryFromOptions(options);

        this.dispatchEvent(new CustomEvent('remove-category', {
            bubbles: true,
            composed: true,
            detail: {
                category: category
            }
        }));
    }

    categoryFromOptions(options) {
        return options.parentElement.querySelector('appsco-licence-category-item').item;
    }

    _observeItems(items) {
        this.setObservableType('categories');
        this.populateItems(items);
    }
}
window.customElements.define(AppscoLicenceCategories.is, AppscoLicenceCategories);
