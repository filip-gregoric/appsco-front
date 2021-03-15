import '@polymer/polymer/polymer-legacy.js';
import '@polymer/neon-animation/neon-animated-pages.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import { NeonAnimatableBehavior } from '@polymer/neon-animation/neon-animatable-behavior.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '@polymer/paper-tabs/paper-tabs.js';
import '@polymer/paper-tabs/paper-tab.js';
import './components/components/appsco-copy.js';
import './components/page/appsco-content.js';
import './components/page/appsco-page-styles.js';
import './components/licence/appsco-licences.js';
import './components/licence/appsco-licence-image.js';
import './components/licence/appsco-licence-dialog.js';
import './components/licence/appsco-delete-licences.js';
import './components/components/appsco-search.js';
import { AppscoPageBehavior } from './components/components/appsco-page-behavior.js';
import './components/licence/appsco-licences-page-actions.js';
import './lib/mixins/appsco-page-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender, afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { AppscoListObserverBehavior } from './components/components/appsco-list-observer-behavior.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoLicencesPage extends mixinBehaviors([
    NeonAnimatableBehavior,
    AppscoPageBehavior,
    AppscoListObserverBehavior,
    Appsco.PageMixin,
    Appsco.HeadersMixin
], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-page-styles">
            :host {
                --item-basic-info: {
                    padding: 0 10px;
                };
            }
            .flex { display: flex; }
            .flex-space-around { justify-content: space-around; }
            .flex-space-between { justify-content: space-between; }
            .flex-align-center { align-items: center; }
            .flex-align-self-end { align-self: self-end; }
            :host div[resource] .resource-content {
                padding-top: 20px;
            }
            neon-animated-pages .iron-selected:not(.neon-animating) {
                position: relative; 
            }
            .info-content div[label] {
                color: var(--secondary-text-color);
                @apply --paper-font-body1;
            }
            .info-content div[content] {
                color: var(--primary-text-color);
                @apply --paper-font-subhead;
                font-size: 12px;
                line-height: 24px;
                display: block;
                min-height: auto;
                margin-bottom: 1rem;
            }
            .filters [activated] {
                background-color: #e8e8e8;
            }
            .filters > div > * {
                @apply --item-info-label;
                display: block;
                @apply --paper-font-common-base;
                font-size: 15px;
                padding: 2px 5px;
                overflow: hidden;
                cursor: pointer;
            }
            :host .filters > .info-label {
                cursor: pointer;
            }
            :host .filters span > iron-icon {
                width: 20px;
                height: 20px;
                margin-right: 6px;
                vertical-align: top;
            }
        </style>

        <iron-media-query query="(max-width: 992px)" query-matches="{{ screen992 }}"></iron-media-query>
        <iron-media-query query="(max-width: 800px)" query-matches="{{ tabletScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 600px)" query-matches="{{ mobileScreen }}"></iron-media-query>

        <appsco-content id="appscoContent" resource-active="">

            <div class="flex-vertical" resource="" slot="resource">
                <div class="resource-content filters">
                    <div>
                        <span on-tap="_onAllItemsTapped" activated filter="all"><iron-icon icon="icons:home"></iron-icon>All</span>
                        <span on-tap="_onOwnedItemsTapped" filter="owned"><iron-icon icon="social:person"></iron-icon>My licences</span>
                        <span on-tap="_onAssignedToItemsTapped" filter="assigned"><iron-icon icon="social:share"></iron-icon>Shared by partner</span>
                    </div>
                </div>
            </div>

            <div content="" slot="content">
                <div class="content-container">
                    <appsco-licences
                        id="appscoLicences"
                        name="licences"
                        type="licence"
                        size="100"
                        load-more=""
                        selectable=""
                        authorization-token="[[ authorizationToken ]]"
                        list-api="[[ licenceListApi ]]"
                        on-list-loaded="_onLicencesLoaded"
                        on-list-empty="_onLicencesEmptyLoad"
                        on-item="_onLicence"
                        on-edit-item="_onEditLicence"
                        on-select-item="_onSelectLicence"
                        on-observable-list-empty="_onObservableItemListChange"
                        on-observable-list-filled="_onObservableItemListChange">
                    </appsco-licences>
                </div>
            </div>

            <div class="flex-vertical" info="" slot="info">
                <div class="info-header flex-horizontal">
                    <appsco-licence-image></appsco-licence-image>
                    <span class="group-name flex">[[ licence.product_name ]]</span>
                </div>

                <div class="info-content flex-vertical">
                    
                    <div label="">Product name</div>
                    <div content="">
                        <div class="flex">
                            [[ displayNullableValue(licence.product_name) ]]
                        </div>
                    </div>
                    <div label="">Number of licences</div>
                    <div content="">
                        <div class="flex">
                            [[ displayNullableValue(licence.number_of_licences) ]]
                        </div>
                    </div>
                    <div label="">Licence key</div>
                    <div content="">
                        <div class="flex flex-space-between flex-align-center">
                            <template is="dom-if" if="[[ licence.licence_key ]]">
                                <div class="flex flex-align-self-end">
                                    ********************
                                </div>
                                <div>
                                    <appsco-copy value="[[ licence.licence_key ]]"></appsco-copy>
                                </div>
                            </template>
                            <template is="dom-if" if="[[ !licence.licence_key ]]">-</template>
                        </div>
                    </div>
                    <div label="">Licence expiration date</div>
                    <div content="">
                        <div class="flex">
                            <template is="dom-if" if="[[ licence.licence_expiration_date ]]">
                                [[ formatDate(licence.licence_expiration_date) ]]
                            </template>
                            <template is="dom-if" if="[[ !licence.licence_expiration_date ]]">-</template>
                        </div>
                    </div>
                    <div label="">Publisher</div>
                    <div content="">
                        <div class="flex">
                            [[ displayNullableValue(licence.publisher) ]]
                        </div>
                    </div>
                    <div label="">Support email</div>
                    <div content="">
                        <div class="flex">
                            [[ displayNullableValue(licence.support_email) ]]
                        </div>
                    </div>
                    <div label="">Website</div>
                    <div content="">
                        <div class="flex">
                            [[ displayNullableValue(licence.website) ]]
                        </div>
                    </div>
                    <div label="">Note</div>
                    <div content="">
                        <div class="flex">
                            [[ displayNullableValue(licence.note) ]]
                        </div>
                    </div>
                </div>
                <div class="info-actions flex-horizontal">
                    <paper-button class="button flex" on-tap="_onEditLicence">
                        Edit
                    </paper-button>
                </div>
            </div>

        </appsco-content>

        <appsco-licence-dialog
            id="appscoLicenceDialog"
            authorization-token="[[ authorizationToken ]]"
            company-licences-api="[[ companyLicencesApi ]]"
            api-errors="[[ apiErrors ]]"
            on-licence-added="_onLicenceAdded"
            on-licence-modified="_onLicenceModified">
        </appsco-licence-dialog>

        <appsco-delete-licences
            id="appscoLicencesDelete"
            authorization-token="[[ authorizationToken ]]"
            company-licences-api="[[ companyLicencesApi ]]"
            api-errors="[[ apiErrors ]]"
            on-licences-removed="_onDeletedLicences">
        </appsco-delete-licences>
`;
    }

    static get is() { return 'appsco-licences-page'; }

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

            licence: {
                type: Object
            },

            companyLicencesApi: {
                type: String,
                observer: '_companyLicenceListApiChanged'
            },

            licenceListApi: {
                type: String
            },

            companyLicencesExportApi: {
                type: String,
            },

            _licenceExists: {
                type: Boolean,
                computed: '_computeLicenceExistence(licence)'
            },

            _licencesLoaded: {
                type: Boolean,
                value: false
            },

            _pageReady: {
                type: Boolean,
                computed: '_computePageReadyState(_licencesLoaded)',
                observer: '_onPageReadyChanged'
            },

            pageLoaded: {
                type: Boolean,
                value: false
            },

            _page: {
                type: String,
                value: 'licences'
            },

            _infoShown: {
                type: Boolean,
                value: false
            },

            _selectedLicences: {
                type: Array
            },

            apiErrors: {
                type: Object
            }
        };
    }

    static get observers() {
        return [
            '_updateScreen(mobileScreen, tabletScreen, screen992)',
            '_hideFilters(mobileScreen)'
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
            if (this.mobileScreen) {
                this.updateStyles();
            }
        });

        afterNextRender(this, function() {
            this.set('_itemsComponent', this.$.appscoLicences);
            this._addListeners();
        });
    }

    _addListeners() {
        this.toolbar.addEventListener('add-licence', this._onAddLicence.bind(this));
        this.toolbar.addEventListener('search', this._onSearchLicences.bind(this));
        this.toolbar.addEventListener('search-clear', this._onSearchLicencesClear.bind(this));
        this.toolbar.addEventListener('select-all-licences', this._onSelectAllLicences.bind(this));
        this.toolbar.addEventListener('delete-licences', this._onDeleteLicences.bind(this));
        this.toolbar.addEventListener('export-licences', this._onExportLicencesAction.bind(this));
    }

    pageSelected() {
        this.reloadLicences();
    }

    _onAllItemsTapped() {
        this.showAll();
    }

    _onAssignedToItemsTapped() {
        this.showAssignedTo();
    }

    _onOwnedItemsTapped() {
        this.showOwned();
    }

    showAll() {
        this.activateFilter('all');
        this._changeLicenceListApi(this.companyLicencesApi);
    }

    showAssignedTo() {
        this.activateFilter('assigned');
        this._changeLicenceListApi(this.companyLicencesApi + '/assigned-to');
    }

    showOwned() {
        this.activateFilter('owned');
        this._changeLicenceListApi(this.companyLicencesApi + '/owned');
    }

    _changeLicenceListApi(newListApi) {
        if (this.licenceListApi === newListApi) {
            return;
        }
        this._licencesLoaded = false;
        this.licenceListApi = newListApi;
    }

    deactivateAllFilters() {
        this.shadowRoot.querySelectorAll('.filters [activated]')
            .forEach(item => item.removeAttribute('activated'));
    }

    activateFilter(filter) {
        this.deactivateAllFilters();
        const element = this.shadowRoot.querySelector('[filter="' + filter + '"]');
        if (element) {
            element.setAttribute('activated', '');
        }
    }

    _onObservableItemListChange(event, data) {
        if(data.type === this._page) {
            this.setObservableType('licence-page');
            this.populateItems(data.items);
        }
        event.stopPropagation();
    }

    _hideFilters(mobile) {
        if (mobile) {
            this.hideResource();
        }
    }

    hideResource() {
        this.$.appscoContent.hideSection('resource');
    }

    toggleInfo() {
        if (!this._licenceExists) {
            return;
        }

        this.$.appscoContent.toggleSection('info');
        this._infoShown = !this._infoShown;
        this.$.appscoLicences.deactivateItem(this.licence);
        this._setDefaultLicence();
    }

    hideInfo() {
        this.$.appscoContent.hideSection('info');
        this._infoShown = false;
    }

    toggleResource() {
        this.$.appscoContent.toggleSection('resource');
    }

    _setDefaultLicence() {
        this.licence = this.$.appscoLicences.getFirstItem();
    }

    addLicences(licences) {
        this.$.appscoLicences.addItems(licences);
    }

    modifyLicences(licences) {
        this.$.appscoLicences.modifyItems(licences);
    }

    removeLicences(licences) {
        this.$.appscoLicences.removeItems(licences);
        this._setDefaultLicence();
    }

    filterByTerm(term, page) {
        this.$.appscoLicences.filterByTerm(term);
    }

    getSelectedLicences() {
        return this.$.appscoLicences.getSelectedItems();
    }

    hideBulkActions() {
        this._hideBulkActions();
    }

    initializePage() {
        this._setDefaultLicence();
    }

    reloadLicences() {
        this._reloadLicences();
    }

    resetPage() {
        this._resetPageLists();
        this._resetFilter();
        this._resetPageActions();
        this.hideInfo();
    }

    _onExportLicencesAction() {
        const request = document.createElement('iron-request'),
            options = {
                url: this.companyLicencesExportApi,
                method: 'GET',
                handleAs: 'text',
                headers: this._headers
            };
        request.send(options).then(function(response) {
            const link = document.createElement('a');

            link.href = "data:application/octet-stream," + encodeURIComponent(response.response);
            link.setAttribute('download', 'licences.csv');
            document.body.appendChild(link);

            if (link.click) {
                link.click();
            }
            else if (document.createEvent) {
                const event = document.createEvent('MouseEvents');

                event.initEvent('click', true, true);
                link.dispatchEvent(event);
            }

            document.body.removeChild(link);
        });
    }

    _resetFilter () {}

    _resetPageActions() {
        this.toolbar.resetPageActions();
    }

    _resetPageLists() {
        this._deselectAllItems();
        this.$.appscoLicences.reset();
    }

    _computeLicenceExistence(licence) {
        return Object.keys(licence).length > 0;
    }

    _computePageReadyState(licences) {
        return licences;
    }

    _updateScreen() {
        this.updateStyles();
    }

    _reloadLicences() {
        this._licencesLoaded = false;
        this.$.appscoLicences.reloadItems();
    }

    _onLicencesLoaded() {
        this._licencesLoaded = true;
        this._setDefaultLicence();
    }

    _onLicencesEmptyLoad() {
        this._licencesLoaded = true;
    }

    _onPageReadyChanged(pageReady) {
        if (pageReady) {
            this._onPageLoaded();
        }
    }

    _onPageLoaded() {
        this.pageLoaded = true;
        this.dispatchEvent(new CustomEvent('page-loaded', { bubbles: true, composed: true }));
    }

    _onLicence(event) {
        if (event.detail.item.activated) {
            this._onViewInfo(event);
            return;
        }

        this.hideInfo();
        this._setDefaultLicence();
    }

    _onSelectLicence(event) {
        const selectedLicence = this.$.appscoLicences.getFirstSelectedItem();
        Object.keys(selectedLicence).length > 0 ?
            this._showBulkActions() :
            this._hideBulkActions();

        this._handleItemsSelectedState();
    }

    _showInfo() {
        if (!this._licenceExists) {
            return;
        }
        this.$.appscoContent.showSection('info');
        this._infoShown = true;
    }

    _handleInfo(licence) {
        this.licence = licence;

        if (!this._infoShown) {
            this._showInfo();
        }
    }

    _onViewInfo(event) {
        this._handleInfo(event.detail.item);
    }

    _onPageAnimationFinished() {
        this._resetPageActions();
        this._resetPageLists();
    }

    _searchLicences(term) {
        this._showProgressBar();
        this.filterByTerm(term);
    }

    _onSearchLicences(event) {
        this._searchLicences(event.detail.term);
    }

    _onSearchLicencesClear() {
        this._searchLicences('');
    }

    _onAddLicence() {
        const dialog = this.shadowRoot.getElementById('appscoLicenceDialog');
        dialog.licence = null;
        dialog.open();
    }

    _onLicenceAdded(event) {
        const licence = event.detail.licence;
        this.addLicences([ licence ]);
        this._notify('Licence for ' + licence.product_name + ' was successfully saved.');
    }

    _onLicenceModified(event) {
        const licence = event.detail.licence;
        this.modifyLicences([ licence ]);
        this._notify('Licence for ' + licence.product_name + ' was successfully saved.');
    }

    _onEditLicence(event) {
        const dialog = this.shadowRoot.getElementById('appscoLicenceDialog');
        dialog.setLicence(event.detail.item);
        dialog.open();
    }

    _onSelectAllLicences() {
        this.selectAllItems();
    }

    _onDeleteLicences() {
        const selectedLicences = this.getSelectedLicences();

        if (selectedLicences.length === 0) {
            this.hideBulkActions();
            return;
        }

        this._selectedLicences = selectedLicences;
        const dialog = this.shadowRoot.getElementById('appscoLicencesDelete');
        dialog.setLicences(selectedLicences);
        dialog.toggle();
    }

    _onDeletedLicences() {
        this.removeLicences(this._selectedLicences);
        this.hideBulkActions();
        this._notify('Selected licences were successfully removed from company.');
    }

    _onDeleteLicencesFailed() {
        this.selectedLicences = [];
        this._notify('An error occurred. Selected licences were not removed from company. Please try again.');
    }

    _companyLicenceListApiChanged(companyLicenceApi) {
        this.licenceListApi = companyLicenceApi;
    }

    displayNullableValue(value) {
        return value ? value : '-';
    }

    formatDate(dateString) {
        if(!dateString) {
            return null;
        }
        return dateString.split('T')[0]
    }
}
window.customElements.define(AppscoLicencesPage.is, AppscoLicencesPage);
