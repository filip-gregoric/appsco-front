import '@polymer/polymer/polymer-legacy.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import './../../lib/mixins/appsco-headers-mixin.js';
import '@polymer/neon-animation/animations/cascaded-animation.js';
import '@polymer/neon-animation/animations/slide-from-left-animation.js';

/**
 * @polymerBehavior
 */
export const AppscoListBehavior = [
    NeonAnimationRunnerBehavior,
    Appsco.HeadersMixin, {
    properties: {

        type: {
            type: String,
            value: ''
        },

        listApi: {
            type: String
        },

        size: {
            type: Number,
            value: 10
        },

        loadMore: {
            type: Boolean,
            value: false
        },

        apiErrors: {
            type: Object,
            value: function() {
                return {};
            }
        },

        selectable: {
            type: Boolean,
            value: false
        },

        _sort: {
            type: Object,
            value: function() {
                return {};
            }
        },

        _listApi: {
            type: String,
            computed: '_computeListApi(listApi, size, _sort)',
            observer: '_onListApiChanged'
        },

        _nextListPageApi: {
            type: String
        },

        _searchListApi: {
            type: String,
            computed: '_computeSearchListApi(listApi, _filterTerm, _sort)'
        },

        _typeDisplay: {
            type: String,
            computed: '_computeTypeDisplay(type)'
        },

        _loadMore: {
            type: Boolean,
            value: false
        },

        _listItems: {
            type: Array,
            value: function () {
                return [];
            },
            notify: true
        },

        _allListItems: {
            type: Array,
            value: function () {
                return [];
            }
        },

        _searchedListItems: {
            type: Array,
            value: function () {
                return [];
            }
        },

        _listEmpty: {
            type: Boolean,
            value: false
        },

        _message: {
            type: String,
            value: ''
        },

        _totalListItems: {
            type: Number,
            value: 0
        },

        _renderedIndex: {
            type: Number,
            value: -1
        },

        _filterTerm: {
            type: String,
            value: ''
        },

        minSearchTermLength: {
            type: Number,
            value: 2
        },

        _filterOrgunit: {
            type: Object,
            value: function() {
                return {};
            }
        },

        _filterGroup: {
            type: Object,
            value: function() {
                return {};
            }
        },

        _filterType: {
            type: String,
            value: ''
        },

        _listLoaders: {
            type: Array,
            value: function() {
                return [];
            }
        },

        noAutoLoad: {
            type: Boolean,
            value: false
        },

        animationConfig: {
            value: function() {
                return {
                    'entry': {
                        name: 'cascaded-animation',
                        animation: 'slide-from-left-animation',
                        nodes: [],
                        nodeDelay: 50,
                        timing: {
                            duration: 300
                        }
                    }
                }
            }
        }
    },

    reset: function() {
        if (0 < this._allListItems.length) {
            this._hideMessage();
            this.set('_listItems', JSON.parse(JSON.stringify(this._allListItems)));
        }

        this.resetAllItems();
        this._listEmpty = false;
        this.set('_searchedListItems', []);
        this._filterTerm = '';
        this._filterOrgunit = {};
        this._filterGroup = {};
        this._filterType = '';
    },

    reloadItems: function() {
        this._setListApiRequestUrl(this._listApi);
        this._loadItems();
    },

    getFirstItem: function() {
        return (0 < this._listItems.length) ? this._listItems[0] : {};
    },

    getAllItems: function() {
        return this._listItems;
    },

    getFirstSelectedItem: function() {
        const items = JSON.parse(JSON.stringify(this._listItems)),
            length = items.length;

        for (let i = 0; i < length; i++) {
            if (items[i].selected) {
                return items[i];
            }
        }

        return {};
    },

    getSelectedItems: function() {
        const listItems = JSON.parse(JSON.stringify(this._listItems)),
            length = listItems.length,
            allListItems = JSON.parse(JSON.stringify(this._allListItems)),
            allLength = allListItems.length,
            selectedItems = [];

        for (let i = 0; i < length; i++) {
            if (listItems[i].selected) {
                selectedItems.push(listItems[i]);
            }
        }

        for (let j = 0; j < allLength; j++) {
            if (allListItems[j].selected) {
                selectedItems.push(allListItems[j]);
            }
        }

        return this._removeDuplicatesFromArray(selectedItems, 'self');
    },

    getTotalCount: function() {
        return this._totalListItems;
    },

    getCurrentCount: function() {
        return this._listItems.length;
    },

    addItems: function(items) {
        const length = items.length,
            currentItems = JSON.parse(JSON.stringify(this._listItems)),
            allListItems = JSON.parse(JSON.stringify(this._allListItems)),
            allLength = allListItems.length;

        this._listEmpty = false;
        this._renderedIndex = length - 1;
        this._hideMessage();

        for (let i = 0; i < length; i++) {
            const item = items[i];

            if (0 === allLength) {
                item.activated = false;
                item.selected = false;
                currentItems.push(item);
                allListItems.push(item);
                this._totalListItems++;
            }
            else {
                for (let j = 0; j < allLength; j++) {
                    if (allListItems[j].self === item.self) {
                        break;
                    }
                    else if (j === allLength - 1) {
                        item.activated = false;
                        item.selected = false;
                        currentItems.unshift(item);
                        allListItems.unshift(item);
                        this._totalListItems++;
                    }
                }
            }
        }

        this.set('_listItems', []);
        this.set('_listItems', currentItems);

        this.set('_allListItems', []);
        this.set('_allListItems', allListItems);
    },

    modifyItems: function(items) {
        const currentItems = JSON.parse(JSON.stringify(this._listItems)),
            length = currentItems.length,
            allListItems = JSON.parse(JSON.stringify(this._allListItems)),
            allLength = allListItems.length,
            lengthModify = items.length;

        for (let i = 0; i < lengthModify; i++) {
            const item = items[i];

            for (let j = 0; j < length; j++) {
                if (item.self === currentItems[j].self) {
                    currentItems[j] = item;
                    break;
                }
            }

            for (let k = 0; k < allLength; k++) {
                if (item.self === allListItems[k].self) {
                    item.activated = allListItems[k].activated;
                    item.selected = allListItems[k].selected;
                    allListItems[k] = item;
                    break;
                }
            }
        }

        this.set('_listItems', []);
        this.set('_listItems', currentItems);

        this.set('_allListItems', []);
        this.set('_allListItems', allListItems);
    },

    removeItems: function(items) {
        const currentItems = JSON.parse(JSON.stringify(this._listItems)),
            length = currentItems.length,
            allListItems = JSON.parse(JSON.stringify(this._allListItems)),
            allLength = allListItems.length,
            lengthModify = items.length;

        for (let i = 0; i < lengthModify; i++) {
            const item = items[i];

            for (let j = 0; j < length; j++) {
                if (item.self === currentItems[j].self) {
                    currentItems.splice(j, 1);
                    j--;
                    break;
                }
            }

            for (let k = 0; k < allLength; k++) {
                if (item.self === allListItems[k].self) {
                    allListItems.splice(k, 1);
                    k--;
                    break;
                }
            }

            this._totalListItems--;
        }


        this.set('_listItems', []);
        this.set('_listItems', currentItems);

        this.set('_allListItems', []);
        this.set('_allListItems', allListItems);

        this.dispatchEvent(new CustomEvent('items-removed', {
            bubbles: true,
            composed: true,
            detail: {
                items: items
            }
        }));

        if (0 === this._listItems.length) {
            this._showMessage('You have removed all ' + this._typeDisplay + 's from company.');
            this._handleEmptyLoad();
        }
    },

    deactivateItem: function(item) {
        const items = JSON.parse(JSON.stringify(this._listItems)),
            length = items.length,
            allListItems = JSON.parse(JSON.stringify(this._allListItems)),
            allLength = allListItems.length;

        for (let i = 0; i < length; i++) {
            if (item.self === items[i].self) {
                items[i].activated = false;
                break;
            }
        }

        for (let j = 0; j < allLength; j++) {
            if (item.self === allListItems[j].self) {
                allListItems[j].activated = false;
                break;
            }
        }

        this.set('_listItems', []);
        this.set('_listItems', items);

        this.set('_allListItems', []);
        this.set('_allListItems', allListItems);
    },

    selectAllItems: function() {
        const items = JSON.parse(JSON.stringify(this._listItems)),
            length = items.length,
            allListItems = JSON.parse(JSON.stringify(this._allListItems)),
            allLength = allListItems.length;

        for (let i = 0; i < length; i++) {
            items[i].selected = true;
        }

        for (let j = 0; j < allLength; j++) {
            allListItems[j].selected = true;
        }

        this.set('_listItems', []);
        this.set('_listItems', items);

        this.set('_allListItems', []);
        this.set('_allListItems', allListItems);
    },

    deselectAllItems: function() {
        const items = JSON.parse(JSON.stringify(this._listItems)),
            length = items.length,
            allListItems = JSON.parse(JSON.stringify(this._allListItems)),
            allLength = allListItems.length;

        for (let i = 0; i < length; i++) {
            items[i].selected = false;
        }

        for (let j = 0; j < allLength; j++) {
            allListItems[j].selected = false;
        }

        this.set('_listItems', []);
        this.set('_listItems', items);

        this.set('_allListItems', []);
        this.set('_allListItems', allListItems);
    },

    resetAllItems: function() {
        const items = JSON.parse(JSON.stringify(this._listItems)),
            length = items.length,
            allListItems = JSON.parse(JSON.stringify(this._allListItems)),
            allLength = allListItems.length;

        for (let i = 0; i < length; i++) {
            items[i].activated = false;
            items[i].selected = false;
        }

        for (let j = 0; j < allLength; j++) {
            allListItems[j].activated = false;
            allListItems[j].selected = false;
        }

        this.set('_listItems', []);
        this.set('_listItems', items);

        this.set('_allListItems', []);
        this.set('_allListItems', allListItems);
    },

    resetGroupFilter: function() {
        this._filterGroup = {};
    },

    setOrgunit: function(orgunit) {
        const items = JSON.parse(JSON.stringify(this._listItems)),
            length = items.length,
            allListItems = JSON.parse(JSON.stringify(this._allListItems)),
            allLength = allListItems.length;

        for (let i = 0; i < length; i++) {
            const orgunits = items[i].org_units,
                length = orgunits.length;

            for (let j = 0; j < length; j++) {

                if (orgunit.alias === orgunits[j].alias) {
                    items[i].org_units[j].name = orgunit.name;
                    break;
                }
            }
        }

        for (let j = 0; j < allLength; j++) {
            const orgunits = allListItems[j].org_units,
                length = orgunits.length;

            for (let k = 0; k < length; k++) {
                if (orgunit.alias === orgunits[k].alias) {
                    allListItems[j].org_units[k].name = orgunit.name;
                    break;
                }
            }
        }

        this.set('_listItems', []);
        this.set('_listItems', items);

        this.set('_allListItems', []);
        this.set('_allListItems', allListItems);
    },

    filterByTerm: function(term) {
        this._filterTerm = term;
        this._filterByTerm();
    },

    filterByOrgunit: function(orgunitData) {
        this._filterOrgunit = orgunitData;
        this._filterByOrgunit();
    },

    filterByGroup: function(group) {
        this._filterGroup = group;
        this._filterByGroup();
    },

    setSort: function(sort) {
        for (const key in sort) {
            if (sort[key] !== this._sort[key]) {
                this.set('_sort', sort);
                break;
            }
        }
    },

    _computeListApi: function(listApi, size, sort) {
        return (listApi && size) ?
            ((listApi + '?page=1&extended=1&limit=' + size) +
            ((sort && sort.orderBy && 'undefined' !== typeof sort.ascending) ?
                ('&order_by=' + sort.orderBy + '&ascending=' + (sort.ascending ? 1 : 0)) :
                '')) :
            null;
    },

    _computeSearchListApi: function(listApi, term, sort) {
        return listApi ?
            ((listApi + '?page=1&limit=100&extended=1&term=' + term) +
            ((sort && sort.orderBy && 'undefined' !== typeof sort.ascending) ?
                ('&order_by=' + sort.orderBy + '&ascending=' + (sort.ascending ? 1 : 0)) :
                '')) :
            null;
    },

    _computeNextPageListApi: function(nextPageApi, size, sort) {
        return (nextPageApi && size) ?
            ((nextPageApi + '&limit=' + size) +
            ((sort && sort.orderBy && 'undefined' !== typeof sort.ascending) ?
                ('&order_by=' + sort.orderBy + '&ascending=' + (sort.ascending ? 1 : 0)) :
                '')) :
            null;
    },

    _computeTypeDisplay: function(type) {
        switch (type) {
            case 'integration-rule':
                return 'integration rule';
            case 'integration-webhook':
                return 'integration web hook';
            case 'integration-template':
                return 'integration template';
            case 'policy':
                return 'policie';
            case 'access-on-boarding-user':
                return 'unresolved access on-boarding event';
            case 'policy-report':
                return 'broken policie';
            default:
                return type;
        }
    },

    _setLoadMoreAction: function() {
        this._loadMore = (this.loadMore && this._allListItems.length < this._totalListItems);
    },

    _hideLoadMoreAction: function() {
        this._loadMore = false;
    },

    _showProgressBar: function() {
        this.dispatchEvent(new CustomEvent('show-page-progress-bar', { bubbles: true, composed: true }));
        if(!this.shadowRoot) return;
        if (this.shadowRoot.getElementById('paperProgress')) {
            this.shadowRoot.getElementById('paperProgress').hidden = false;
        }
    },

    _hideProgressBar: function() {
        if (this.shadowRoot.getElementById('paperProgress')) {
            setTimeout(function() {
                this.shadowRoot.getElementById('paperProgress').hidden = true;
            }.bind(this), 300);
        }
    },

    _showLoadMoreProgressBar: function() {
        if (this.shadowRoot.getElementById('loadMoreProgress')) {
            this.shadowRoot.getElementById('loadMoreProgress').hidden = false;
        }
    },

    _hideLoadMoreProgressBar: function() {
        if (this.shadowRoot.getElementById('loadMoreProgress')) {
            setTimeout(function() {
                this.shadowRoot.getElementById('loadMoreProgress').hidden = true;
            }.bind(this), 300);
        }
    },

    _showMessage: function(message) {
        this._message = message;
    },

    _hideMessage: function() {
        this._message = '';
    },

    _setListApiRequestUrl: function(url) {
        this.$.getListApiRequest.url = url;
    },

    _abortPreviousRequest: function() {
        const getListApiRequest = this.$.getListApiRequest;

        if (getListApiRequest.lastRequest) {
            getListApiRequest.lastRequest.abort();
        }
    },

    _generateNewRequest: function() {
        this._abortPreviousRequest();
        this.$.getListApiRequest.generateRequest();
    },

    _clearListItems: function() {
        this._clearListLoaders();
        this.set('_allListItems', []);
        this.set('_listItems', []);
    },

    _clearListLoaders: function() {
        for (const idx in this._listLoaders) {
            clearTimeout(this._listLoaders[idx]);
        }

        this.set('_listLoaders', []);
    },

    _handleEmptyLoad: function() {
        this._hideProgressBar();
        this._hideLoadMoreProgressBar();
        this._listEmpty = true;

        this.dispatchEvent(new CustomEvent('list-empty', { bubbles: true, composed: true }));
    },

    _loadItems: function() {
        this._clearListItems();
        this._showProgressBar();
        this._hideLoadMoreAction();
        this._generateNewRequest();
    },

    _removeDuplicatesFromArray: function(arr, prop) {
        const length = arr.length,
            obj = {},
            resultArray = [];

        for (let i = 0; i < length; i++) {
            if (!obj[arr[i][prop]]) {
                obj[arr[i][prop]] = arr[i];
            }
        }

        for (const key in obj) {
            resultArray.push(obj[key]);
        }

        return resultArray;
    },

    _onListApiChanged: function(listApi) {
        if (listApi && !this.noAutoLoad) {
            this._loadItems();
        }
    },

    _onLoadMoreAction: function() {
        this._showLoadMoreProgressBar();
        this._setListApiRequestUrl(this._nextListPageApi);
        this._generateNewRequest();
    },

    _onGetListError: function(event) {
        if (!event.detail.request.aborted) {
            if(this.apiErrors && this.apiErrors.getError) {
                this._showMessage(this.apiErrors.getError(404));
            }
        }

        this._totalListItems = 0;
        this._handleEmptyLoad();
    },

    _onGetListResponse: function(event) {
        const response = event.detail.response,
            meta = response && response.meta ? response.meta : {};

        let itemList;

        switch (this.type) {
            case 'resource':
                itemList = response.applications ? response.applications : [];
                break;
            case 'account':
            case 'policy-report':
                itemList = response.company_roles ? response.company_roles : [];
                break;
            case 'contact':
                itemList = response.contacts ? response.contacts : [];
                break;
            case 'licence':
                itemList = response.licences ? response.licences : [];
                break;
            case 'group':
                itemList = response.company_groups ? response.company_groups : [];
                break;
            case 'customer':
                itemList = response.customers ? response.customers : [];
                break;
            case 'integration':
                itemList = response.active_integrations ? response.active_integrations : [];
                break;
            case 'integration-rule':
                itemList = response.integration_recipes ? response.integration_recipes : [];
                break;
            case 'oauth-applications':
                itemList = response.applications ? response.applications : [];
                break;
            case 'integration-webhook':
                itemList = response.web_hooks ? response.web_hooks : [];
                break;
            case 'integration-template':
                itemList = response.templates ? response.templates : [];
                break;
            case 'certificate':
                itemList = response.certificates ? response.certificates : [];
                break;
            case 'folder':
                itemList = response.groups ? response.groups : [];
                break;
            case 'policy':
                itemList = response.policies ? response.policies : [];
                break;
            case 'access-on-boarding-user':
                itemList = response.items ? response.items : [];
                break;
            default:
                itemList = [];
        }

        this._loadMore ? this._clearListLoaders() : this._clearListItems();

        if (itemList) {
            this._hideMessage();
            this._totalListItems = meta.total;
            this._nextListPageApi = this._computeNextPageListApi(meta.next, this.size, this._sort);

            if (0 === meta.total) {
                this._showMessage('There are no ' + this._typeDisplay +
                    's ' +
                    (('certificate' === this.type) ? ' for the application.' : ' in company.')
                );
                this._handleEmptyLoad();
                return false;
            }

            if (itemList && itemList.length > 0) {
                var itemListCount = itemList.length - 1;

                this._listEmpty = false;

                itemList.forEach(function(el, index) {
                    this._listLoaders.push(setTimeout(function() {
                        el.activated = false;
                        el.selected = false;
                        var items = JSON.parse(JSON.stringify(this._listItems));
                        this._listItems = [];
                        items.push(el);
                        this._listItems = items;

                        this.push('_allListItems', el);

                        if (index === itemListCount) {
                            this._hideProgressBar();
                            this._hideLoadMoreProgressBar();
                            this._setLoadMoreAction();

                            this.dispatchEvent(new CustomEvent('list-loaded', {
                                bubbles: true,
                                composed: true,
                                detail: {
                                    items: itemList
                                }
                            }));
                        }
                    }.bind(this), (index + 1) * 30 ));
                }.bind(this));
            }
            else {
                (itemList && !itemList.length) ?
                    this._showMessage('There are no ' + this._typeDisplay +
                        's ' +
                        (('certificate' === this.type) ? ' for the application.' : ' in company.')
                    ) :
                    this._showMessage('We couldn\'t load ' + this._typeDisplay + 's at the moment. Please contact AppsCo support.');

                this._hideLoadMoreAction();
                this._handleEmptyLoad();
            }
        }
    },

    _onListItemAction: function(event) {
        const items = JSON.parse(JSON.stringify(this._listItems)),
            length = items.length,
            allListItems = JSON.parse(JSON.stringify(this._allListItems)),
            allLength = allListItems.length,
            selectedListItem = event.detail.item;

        for (let i = 0; i < length; i++) {
            items[i].activated =
                (selectedListItem.self === items[i].self) ?
                    selectedListItem.activated : false;
        }

        for (let j = 0; j < allLength; j++) {
            allListItems[j].activated =
                (selectedListItem.self === allListItems[j].self) ?
                    selectedListItem.activated : false;
        }

        this.set('_listItems', []);
        this.set('_listItems', items);

        this.set('_allListItems', []);
        this.set('_allListItems', allListItems);
    },

    _onSelectListItemAction: function(event) {
        const items = JSON.parse(JSON.stringify(this._listItems)),
            length = items.length,
            allListItems = JSON.parse(JSON.stringify(this._allListItems)),
            allLength = allListItems.length,
            selectedListItem = event.detail.item;

        for (let i = 0; i < length; i++) {
            if (selectedListItem.self === items[i].self) {
                items[i].selected = selectedListItem.selected;
                break;
            }
        }

        for (let j = 0; j < allLength; j++) {
            if (selectedListItem.self === allListItems[j].self) {
                allListItems[j].selected = selectedListItem.selected;
                break;
            }
        }

        this.set('_listItems', []);
        this.set('_listItems', items);

        this.set('_allListItems', []);
        this.set('_allListItems', allListItems);
    },

    _setSearchListItemsResult: function() {
        this._listEmpty = (0 === this._searchedListItems.length);

        if (this._listEmpty) {
            this._showMessage('There are no ' + this._typeDisplay + 's with asked term.');
        }
        else {
            this.set('_listItems', this._searchedListItems);
            this._hideLoadMoreAction();
            this._hideMessage();
        }
    },

    _getItems: function(url) {
        let headers = this.getHeaders(this.authorizationToken);
        return new Promise(function(resolve, reject) {
            const request = document.createElement('iron-request'),
                options = {
                    url: url,
                    method: 'GET',
                    handleAs: 'json',
                    headers: headers
                };

            request.send(options).then(function() {
                if (request.response) {
                    switch (this.type) {
                        case 'resource':
                            resolve(request.response.applications);
                            break;
                        case 'account':
                        case 'policy-report':
                            resolve(request.response.company_roles);
                            break;
                        case 'licence':
                            resolve(request.response.licences);
                            break;
                        case 'contact':
                            resolve(request.response.contacts);
                            break;
                        case 'group':
                            resolve(request.response.company_groups);
                            break;
                        case 'customer':
                            resolve(request.response.customers);
                            break;
                        case 'integration':
                            resolve(request.response.active_integrations);
                            break;
                        case 'integration-rule':
                            resolve(request.response.integration_recipes);
                            break;
                        case 'integration-webhook':
                            resolve(request.response.web_hooks);
                            break;
                        case 'integration-template':
                            resolve(request.response.templates);
                            break;
                        case 'certificate':
                            resolve(request.response.certificates);
                            break;
                        case 'folder':
                            resolve(request.response.groups);
                            break;
                        case 'policy':
                            resolve(request.response.policies);
                            break;
                        case 'access-on-boarding-user':
                            resolve(request.response.items);
                            break;
                        default:
                            reject('Something went wrong. Please contact AppsCo support.');
                    }
                }

            }.bind(this), function() {
                reject(request.response.message);
            });
        }.bind(this));
    },

    _getFilterItemsByGroupApi: function(group) {
        let url = '';

        switch (this.type) {
            case 'resource':
                url = group.meta.applications;
                break;
            case 'account':
                url = group.meta.company_roles;
                break;
            case 'contact':
                url = group.meta.contacts;
                break;
            case 'group':
                url = group.meta.company_groups;
                break;
            case 'customer':
                url = group.meta.customers;
                break;
            default:
                return null;
        }

        return this._computeListApi(url, this.size, this._sort);
    },

    _filterByGroup: function() {
        const group = this._filterGroup,
            allListItems = JSON.parse(JSON.stringify(this._allListItems)),
            allLength = allListItems.length,
            filterTermLength = this._filterTerm.length;

        this._hideMessage();
        this._showProgressBar();
        this._hideLoadMoreAction();
        this._clearListLoaders();
        this.set('_listItems', []);

        if (!group.activated) {
            this._listEmpty = false;

            if (this._filterTerm && filterTermLength >= this.minSearchTermLength) {
                const searchedListItems = this._searchedListItems,
                    searchedListItemsLength = searchedListItems.length;

                for (let i = 0; i < searchedListItemsLength; i++) {
                    const searchedListItem = searchedListItems[i];

                    for (let j = 0; j < allLength; j++) {
                        const item = allListItems[j];

                        if (searchedListItem.self === item.self) {
                            this.push('_listItems', item);
                            this._listItems = JSON.parse(JSON.stringify(this._listItems));
                            break;
                        }
                    }
                }

                if (0 === this._listItems.length) {
                    this._showMessage('There are no ' + this._typeDisplay + 's with asked term.');
                    this._handleEmptyLoad();
                }
            }
            else {
                this.set('_listItems', allListItems);
                this._setLoadMoreAction();
            }

            this.set('_filterGroup', {});
            this.dispatchEvent(new CustomEvent('filter-done', { bubbles: true, composed: true }));
            return false;
        }

        this._getItems(this._getFilterItemsByGroupApi(group)).then(function(items) {
            const itemsLength = items.length,
                searchedListItems = this._searchedListItems,
                searchedListItemsLength = searchedListItems.length,
                responseListItems = [];

            if (0 === itemsLength) {
                this._showMessage('There are no ' + this._typeDisplay + 's in ' + group.name + ' group.');
                this._handleEmptyLoad();
                return false;
            }

            this._listEmpty = false;

            if (this._filterTerm && filterTermLength >= this.minSearchTermLength) {
                items.forEach(function(item, index) {
                    for (let i = 0; i < searchedListItemsLength; i++) {
                        const searchedListItem = searchedListItems[i];

                        for (let j = 0; j < allLength; j++) {
                            const aItem = allListItems[j];

                            if (searchedListItem.self === item.self && searchedListItem.self === aItem.self) {
                                responseListItems.push(aItem);
                                break;
                            }
                        }
                    }

                    if (index === itemsLength - 1) {
                        this._hideProgressBar();
                    }

                }.bind(this));

                const responseListItemsLength = responseListItems.length;

                if (0 === responseListItemsLength) {
                    this._showMessage('There are no ' + this._typeDisplay + 's with asked term in ' + group.name + ' group.');
                    this._handleEmptyLoad();
                    return false;
                }

                for (let k = 0; k < responseListItemsLength; k++) {
                    const responseListItem = responseListItems[k],
                        groups = responseListItem.groups,
                        groupsLength = groups.length;

                    for (let j = 0; j < groupsLength; j++) {
                        if (groups[j].alias === group.alias) {
                            this.push('_listItems', responseListItem);
                            this._listItems = JSON.parse(JSON.stringify(this._listItems));
                            break;
                        }
                    }

                    if (k === responseListItemsLength - 1) {
                        this._hideProgressBar();
                    }
                }
            }
            else {
                items.forEach(function(item, index) {
                    for (let i = 0; i < allLength; i++) {
                        const currentListItem = allListItems[i];

                        if (item.self === currentListItem.self) {
                            this.push('_listItems', currentListItem);
                            this._listItems = JSON.parse(JSON.stringify(this._listItems));
                            break;
                        }
                        else {
                            if (i === allLength - 1) {
                                this.push('_listItems', item);
                                this._listItems = JSON.parse(JSON.stringify(this._listItems));
                            }
                        }
                    }

                    if (index === itemsLength - 1) {
                        this._hideProgressBar();
                    }
                }.bind(this));
            }
            this.dispatchEvent(new CustomEvent('filter-done', { bubbles: true, composed: true }));
        }.bind(this));
    },

    _filterByTerm: function() {
        const term = this._filterTerm,
            length = this._allListItems.length,
            filterOrgunit = this._filterOrgunit,
            filterGroup = this._filterGroup,
            filterType = this._filterType;

        if (term.length < this.minSearchTermLength) {
            this.set('_searchedListItems', []);

            if (filterOrgunit.selected) {
                this._filterByOrgunit();
            }
            else if (filterGroup.activated) {
                this._filterByGroup();
            }
            else if (filterType) {
                this._filterByType();
            }
            else {
                this._hideMessage();
                this._listEmpty = false;
                this.set('_listItems', JSON.parse(JSON.stringify(this._allListItems)));
                this._setLoadMoreAction();
            }

            this.dispatchEvent(new CustomEvent('filter-done', { bubbles: true, composed: true }));
            return false;
        }

        this._showProgressBar();
        this._hideLoadMoreAction();

        this._getItems(this._searchListApi).then(function(items) {
            const itemsLength = items.length;

            this.set('_searchedListItems', items);
            this._setSearchListItemsResult();

            if (this._listEmpty) {
                this.set('_searchedListItems', []);
                this.set('_listItems', []);
                this.dispatchEvent(new CustomEvent('filter-done', { bubbles: true, composed: true }));
                return false;
            }

            if (filterOrgunit.selected) {
                this._filterByOrgunit();
            }
            else if (filterGroup.activated) {
                this._filterByGroup();
            }
            else if (filterType) {
                this._filterByType();
            }
            else {
                this.set('_listItems', []);

                items.forEach(function(elem, index) {

                    for (let i = 0; i < length; i++) {
                        const item = this._allListItems[i];

                        if (elem.self === item.self) {
                            this.push('_listItems', item);
                            this._listItems = JSON.parse(JSON.stringify(this._listItems));
                            break;
                        }
                        else {
                            if (i === length - 1) {
                                this.push('_listItems', elem);
                                this._listItems = JSON.parse(JSON.stringify(this._listItems));
                            }
                        }
                    }

                    if (index === itemsLength - 1) {
                        this._hideProgressBar();
                    }

                }.bind(this));
            }
            this.dispatchEvent(new CustomEvent('filter-done', { bubbles: true, composed: true }));
        }.bind(this));
    },

    _filterByOrgunit: function() {
        const filterOrgunit = this._filterOrgunit,
            orgunit = filterOrgunit.orgUnit,
            selected = filterOrgunit.selected,
            allListItems = JSON.parse(JSON.stringify(this._allListItems)),
            allLength = allListItems.length,
            filterTermLength = this._filterTerm.length;

        this._showProgressBar();
        this._hideMessage();
        this._listEmpty = false;
        this.set('_listItems', []);

        if (!selected) {
            this._setLoadMoreAction();

            if (this._filterTerm && filterTermLength >= this.minSearchTermLength) {
                let searchedListItems = this._searchedListItems,
                    searchedListItemsLength = searchedListItems.length;

                for (let i = 0; i < searchedListItemsLength; i++) {
                    const searchedListItem = searchedListItems[i];

                    for (let j = 0; j < allLength; j++) {
                        const res = allListItems[j];

                        if (searchedListItem.self === res.self) {
                            this.push('_listItems', allListItems[j]);
                            this._listItems = JSON.parse(JSON.stringify(this._listItems));
                            break;
                        }
                    }
                }

                if (0 === this._listItems.length) {
                    this._showMessage('There are no ' + this._typeDisplay + 's with asked term.');
                    this._handleEmptyLoad();
                }
            }
            else {
                this.set('_listItems', allListItems);
            }

            this.set('_filterOrgunit', {});
            this.dispatchEvent(new CustomEvent('filter-done', { bubbles: true, composed: true }));
        }
        else {
            const searchedListItemsLength = this._searchedListItems.length,
                listItemsWithSelectedOrgunit = [];

            this._hideLoadMoreAction();

            for (let i = 0; i < allLength; i++) {
                const item = this._allListItems[i],
                    orgunits = item.org_units,
                    orgunitsLength = orgunits.length;

                for (let j = 0; j < orgunitsLength; j++) {
                    if (orgunits[j].alias === orgunit.alias) {
                        listItemsWithSelectedOrgunit.push(item);
                        break;
                    }
                }
                if (i === allLength -1) {
                    this._hideProgressBar();
                }
            }

            if (this._filterTerm && filterTermLength >= this.minSearchTermLength) {
                const searchedListItems = this._searchedListItems,
                    responseListItems = [];

                for (let i = 0; i < searchedListItemsLength; i++) {
                    const item = searchedListItems[i];

                    for (let j = 0; j < allLength; j++) {
                        const res = allListItems[j];

                        if (item.self === res.self) {
                            responseListItems.push(res);
                            break;
                        }
                        else {
                            if (j === allLength - 1) {
                                responseListItems.push(item);
                            }
                        }
                    }
                }

                const responseListItemsLength = responseListItems.length;

                for (let k = 0; k < responseListItemsLength; k++) {
                    const item = responseListItems[k],
                        orgunits = item.org_units,
                        orgunitsLength = orgunits.length;

                    for (let j = 0; j < orgunitsLength; j++) {
                        if (orgunits[j].alias === orgunit.alias) {
                            this.push('_listItems', item);
                            this._listItems = JSON.parse(JSON.stringify(this._listItems));
                            break;
                        }

                    }

                    if (k === responseListItemsLength -1) {
                        this._hideProgressBar();
                    }
                }
            }
            else {
                this.set('_listItems', listItemsWithSelectedOrgunit);
            }

            if (0 === this._listItems.length) {
                (0 < listItemsWithSelectedOrgunit.length) ?
                    this._showMessage('There are no ' + this._typeDisplay + 's with asked term in ' + orgunit.name +' organization unit.') :
                    this._showMessage('There are no ' + this._typeDisplay + 's in ' + orgunit.name +' organization unit.');

                this._handleEmptyLoad();
            }

            this.dispatchEvent(new CustomEvent('filter-done', { bubbles: true, composed: true }));
        }
    },

    _onItemsDomChange: function() {
        const index = this._renderedIndex;

        if (-1 !== index && this.company) {
            this.animationConfig.entry.nodes = [];

            for (let i = 0; i <= index; i++) {
                const addedItem = this.shadowRoot.getElementById('appscoListItem_' + i);
                this.animationConfig.entry.nodes.push(addedItem);
            }

            this.playAnimation('entry');

            this._renderedIndex = -1;
        }
    }
}];
