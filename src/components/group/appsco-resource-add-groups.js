import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-styles/shadow.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-image/iron-image.js';
import '@polymer/iron-ajax/iron-request.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import '../components/appsco-loader.js';
import '../components/appsco-form-error.js';
import '../components/appsco-search.js';
import './appsco-group-card.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoResourceAddGroups extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
                position: relative;
            }
            :host paper-dialog {
                width: 670px;
                top: 20vh;
                @apply --appsco-paper-dialog;
            }
            :host paper-dialog-scrollable > * {
                @apply --paper-dialog-scrollable-child;
            }
            :host .dialog-loader {
                margin: 0 !important;
                padding: 0 !important;
            }
            appsco-search {
                margin-bottom: 10px;
            }
            .dialog-container {
                padding-bottom: 20px;
            }
            .group-list {
                @apply --layout-horizontal;
                @apply --layout-wrap;
                padding: 2px;
                margin-right: -8px;
            }
            appsco-group-card {
                margin-right: 6px;
                margin-bottom: 6px;
            }
            .selected-group {
                --group-card: {
                    padding-right: 10px;
                    width: 136px;
                };
            }
            :host .message {
                margin: 0;
                color: var(--secondary-text-color);
                font-style: italic;
                @apply --paper-font-body2;
                @apply --info-message;
            }
            :host .buttons paper-button {
                @apply --paper-dialog-button;
            }
            :host .buttons paper-button[dialog-confirm] {
                @apply --paper-dialog-confirm-button;
            }
            :host .buttons paper-button[dialog-dismiss] {
                @apply --paper-dialog-dismiss-button;
            }
            .link-button {
                padding: 0;
                margin: 0 0 0 5px;
                min-width: initial;
                @apply --link-button;
            }
        </style>

        <paper-dialog id="dialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation" on-iron-overlay-opened="_onDialogOpened" on-iron-overlay-closed="_onDialogClosed">

            <h2>[[ _computedTitle ]]</h2>

            <appsco-loader class="dialog-loader" active="[[ _dialogLoader ]]" loader-alt="Appsco is processing request" multi-color=""></appsco-loader>

            <paper-dialog-scrollable>
                <div class="dialog-container">

                    <div class="group-list">

                        <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>

                        <template is="dom-repeat" items="[[ _selectedGroups ]]">
                            <appsco-group-card class="selected-group" group="[[ item ]]" remove-action="" on-selected="_onRemoveSelectedGroup"></appsco-group-card>
                        </template>
                    </div>

                    <appsco-search id="appscoSearch" label="Search groups" float-label="" on-search="_onSearch" on-search-clear="_onSearchClear"></appsco-search>

                    <div class="group-list">

                        <appsco-loader active="[[ _searchLoader ]]" loader-alt="Appsco is processing request" multi-color=""></appsco-loader>

                        <template is="dom-repeat" items="[[ _searchList ]]">
                            <appsco-group-card group="[[ item ]]" on-selected="_onGroupSelected"></appsco-group-card>
                        </template>

                        <template is="dom-if" if="[[ _message ]]">
                            <p class="message">
                                [[ _message ]]

                                <template is="dom-if" if="[[ _showCreateNewGroupAction ]]">
                                    <paper-button class="link-button" on-tap="_onCreateGroupAction">Create it</paper-button>
                                </template>
                            </p>
                        </template>
                    </div>
                </div>
            </paper-dialog-scrollable>

            <div class="buttons">
                <paper-button dialog-dismiss="">Cancel</paper-button>
                <paper-button autofocus="" on-tap="_onAddGroupsToResourcesAction">[[ _computedButtonTitle ]]</paper-button>
            </div>
        </paper-dialog>
`;
    }

    static get is() { return 'appsco-resource-add-groups'; }

    static get properties() {
        return {
            /**
             * Items to add groups to.
             */
            items: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            groupsApi: {
                type: String
            },

            /**
             * Number of groups to load show in search result.
             */
            size: {
                type: Number,
                value: 8
            },

            resourceType: {
                type: String,
                value: ''
            },

            _computedTitle: {
                type: String,
                computed: '_computeTitle(resourceType)'
            },

            _computedButtonTitle: {
                type: String,
                computed: '_computeButtonTitle(resourceType)'
            },

            /**
             * Applications which are shared.
             * This array is populated from sharing API response.
             */
            _responseItems: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            /**
             * Groups list from search.
             */
            _searchList: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _message: {
                type: String
            },

            /**
             * Indicates if Create New Group action should be displayed.
             */
            _showCreateNewGroupAction: {
                type: Boolean,
                value: false
            },

            /**
             * Selected groups from search list.
             */
            _selectedGroups: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            /**
             * Indicates if search loader should be displayed or not.
             */
            _searchLoader: {
                type: Boolean,
                value: false
            },

            /**
             * Indicates if dialog loader should be displayed or not.
             */
            _dialogLoader: {
                type: Boolean,
                value: false
            },

            _requests: {
                type: Number,
                value: 0
            }
        };
    }

    _computeTitle(resourceType) {
        switch (resourceType) {
            case 'resource':
                return 'Share to group';
            case 'role':
            case 'contact':
                return 'Add to group';
            default:
                return '';
        }
    }

    _computeButtonTitle(resourceType) {
        switch (resourceType) {
            case 'resource':
                return 'Share';
            case 'role':
            case 'contact':
                return 'Add';
            default:
                return '';
        }
    }

    toggle() {
        this.$.dialog.toggle();
    }

    open() {
        this.$.dialog.open();
    }

    close() {
        this.$.dialog.close();
    }

    setItems(items) {
        this.items = items;
    }

    setType(type) {
        this.resourceType = type;
    }

    _onDialogOpened() {
        this.$.appscoSearch.setup();
    }

    _onDialogClosed() {
        this._reset();
        this.set('_selectedGroups', []);
    }

    _showDialogLoader() {
        this._dialogLoader = true;
    }

    _hideDialogLoader() {
        this._dialogLoader = false;
    }

    _showSearchLoader() {
        this._searchLoader = true;
    }

    _hideSearchLoader() {
        this._searchLoader = false;
    }

    _showError(message) {
        this._errorMessage = message;
    }

    _hideError() {
        this._errorMessage = '';
    }

    /**
     * Gets groups by term.
     *
     * @param {Object} event
     * @private
     */
    _onSearch(event) {
        const searchValue = event.detail.term,
            searchLength = searchValue.length;

        this._showSearchLoader();
        this._message = '';
        this._hideError();
        this._showCreateNewGroupAction = false;

        if (searchLength === 0) {
            this._message = '';
            this._showCreateNewGroupAction = false;
            this._hideSearchLoader();
            this.set('_searchList', []);
            return false;
        }

        if (searchLength < 3) {
            this._message = 'Please type three or more letters.';
            this._hideSearchLoader();
            this.set('_searchList', []);
            return false;
        }

        const request = document.createElement('iron-request'),
            url = this.groupsApi + '?extended=1&limit=' + this.size + '&term=' + searchValue;

        this._message = '';

        const options = {
            url: url,
            method: 'GET',
            handleAs: 'json',
            headers: this._headers
        };

        request.send(options).then(function() {
            const groups = request.response.company_groups;

            if (groups && groups.length > 0) {
                this.set('_searchList', groups);
            }
            else {
                this.set('_searchList', []);
                this._message = 'Group with name \'' + decodeURIComponent(searchValue) + '\' does not exist.';
                this._showCreateNewGroupAction = true;
            }

            this._hideSearchLoader();
        }.bind(this));
    }

    _onSearchClear() {
        this._reset();
    }

    _onCreateGroupAction() {
        const name = this.$.appscoSearch.getValue(),
            request = document.createElement('iron-request'),
            url = this.groupsApi,
            options = {
                url: url,
                method: 'POST',
                handleAs: 'json',
                headers: this._headers,
                body: 'company_group[name]=' + encodeURIComponent(name)
            };

        this._showDialogLoader();

        request.send(options).then(function() {
            const group = request.response;

            if (group && group.alias) {
                this.push('_selectedGroups', group);
                this._message = '';
            }

            this._showCreateNewGroupAction = false;
            this._hideDialogLoader();

            this.dispatchEvent(new CustomEvent('group-added', {
                bubbles: true,
                composed: true,
                detail: {
                    group: group
                }
            }));
        }.bind(this), function() {
            this._hideDialogLoader();
            this._showError('Group with name \'' + name + '\' could not be created.');
        }.bind(this));
    }

    /**
     * Called after group has been selected from search list.
     *
     * @param {Object} event
     * @private
     */
    _onGroupSelected(event) {
        this._hideError();
        this.push('_selectedGroups', event.model.item);
        this.splice('_searchList', this._searchList.indexOf(event.model.item), 1);
    }

    _onRemoveSelectedGroup(event) {
        this.push('_searchList', event.model.item);
        this.splice('_selectedGroups', this._selectedGroups.indexOf(event.model.item), 1);
    }

    _addGroupsToMultipleCompanyRoles(items) {
        return new Promise(function(resolve, reject) {
            let groups = this._selectedGroups,
                length = groups.length - 1,
                request = document.createElement('iron-request'),
                options = {
                    url: this.groupsApi + '/roles-batch',
                    method: 'POST',
                    handleAs: 'json',
                    headers: this._headers
                },
                body = '';

            for(let i =0; i <= items.length-1; i++) {
                let next = (i === items.length-1) ? '' : '&';
                body += 'companyRoles[]=' + encodeURIComponent(items[i].self) + next;
            }
            for (let i = 0; i <= length; i++) {
                let next = (i === length) ? '' : '&';
                if(body !== '' && i === 0) body += "&";
                body += 'groups[]=' + encodeURIComponent(groups[i].meta.self) + next;
            }

            options.body = body;

            request.send(options).then(function() {
                if (200 === request.status) {
                    switch (this.resourceType) {
                        case 'role':
                            resolve(request.response);
                            break;
                    }
                }
            }.bind(this), function() {
                if (404 === request.status) {
                    reject('There was an error while sharing resources to groups. Not all ' + this.resourceType + 's were shared to groups.');
                }
            }.bind(this));
        }.bind(this));
    }

    _addGroupsToResource(item) {
        return new Promise(function(resolve, reject) {
            let groups = this._selectedGroups,
                length = groups.length - 1,
                request = document.createElement('iron-request'),
                options = {
                    url: item.self + '/groups',
                    method: 'POST',
                    handleAs: 'json',
                    headers: this._headers
                },
                body = '';

            for (let i = 0; i <= length; i++) {
                let next = (i === length) ? '' : '&';
                body += 'groups[]=' + encodeURIComponent(groups[i].meta.self) + next;
            }

            options.body = body;

            request.send(options).then(function() {
                if (200 === request.status) {
                    switch (this.resourceType) {
                        case 'resource':
                            resolve(request.response.application);
                            break;

                        case 'role':
                            resolve(request.response);
                            break;

                        case 'contact':
                            resolve(request.response);
                            break;
                    }
                }
            }.bind(this), function() {
                if (404 === request.status) {
                    reject('There was an error while sharing resources to groups. Not all ' + this.resourceType + 's were shared to groups.');
                }
            }.bind(this));
        }.bind(this));
    }

    _onAddActionFinished() {
        if (this._responseItems.length > 0) {
            this.dispatchEvent(new CustomEvent('groups-added-to-resources', {
                bubbles: true,
                composed: true,
                detail: {
                    groups: this._selectedGroups,
                    items: this._responseItems,
                    resourceType: this.resourceType
                }
            }));

            this.close();
        }
        else {
            this._showError('There was an error while sharing ' + this.resourceType + 's to selected groups. Please close the dialog and try again.');
        }

        this.set('_selectedGroups', []);
        this.set('_responseItems', []);
        this._hideDialogLoader();
    }

    _onAddGroupsToResourcesAction() {
        if (0 === this._selectedGroups.length) {
            this._showError('Please add at least one group to share ' + this.resourceType + 's to.');
            return false;
        }

        const items = this.items,
            length = items.length;

        this._requests = length;

        this._hideError();
        this._showDialogLoader();
        if(this.resourceType === 'role') {
            this._addGroupsToMultipleCompanyRoles(items).then(function(){
                this.dispatchEvent(new CustomEvent('groups-added-to-resources', {
                    bubbles: true,
                    composed: true,
                    detail: {
                        groups: this._selectedGroups,
                        items: this._responseItems,
                        resourceType: this.resourceType
                    }
                }));

                this.close();

                this.set('_selectedGroups', []);
                this.set('_responseItems', []);
                this._hideDialogLoader();
            }.bind(this));
            return;
        }

        for (let i = 0; i < length; i++) {
            const item = items[i];


            (function(me) {
                me._addGroupsToResource(item).then(function(item) {
                    me.push('_responseItems', item);
                    me._requests--;

                    if (me._requests === 0) {
                        me._onAddActionFinished();
                    }
                }.bind(me), function(message) {
                    me._showError(message);
                    me._requests--;

                    if (me._requests === 0) {
                        me._onAddActionFinished();
                    }
                }.bind(me));

            })(this);
        }
    }

    _reset() {
        this.$.appscoSearch.reset();
        this.set('_searchList', []);
        this._hideSearchLoader();
        this._hideDialogLoader();
        this._hideError();
        this._message = '';
    }
}
window.customElements.define(AppscoResourceAddGroups.is, AppscoResourceAddGroups);
