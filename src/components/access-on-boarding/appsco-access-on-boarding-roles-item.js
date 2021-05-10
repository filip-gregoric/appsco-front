import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-button/paper-button.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-collapse/iron-collapse.js';
import '@polymer/paper-styles/shadow.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import '@polymer/iron-ajax/iron-request.js';
import '../account/appsco-account-image.js';
import { AppscoListItemBehavior } from '../components/appsco-list-item-behavior.js';
import '../components/appsco-list-item-styles.js';
import './appsco-access-on-boarding-event-item.js';
import '../components/appsco-date-format.js';
import '../components/appsco-loader.js';
import '../components/appsco-form-error.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoAccessOnBoardingRolesItem extends mixinBehaviors([
    NeonAnimationRunnerBehavior,
    AppscoListItemBehavior,
    Appsco.HeadersMixin
], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-list-item-styles">
            :host {
                --appsco-access-on-boarding-event-item: {
                    width: 100%;
                    padding-right: 0;
                    margin-bottom: 15px;
                    box-sizing: border-box;
                };

                --read-background-color: #e0e0e0;
                --paper-checkbox-size: 24px;
                --paper-checkbox-unchecked-color: var(--primary-text-color);
                --paper-checkbox-checked-color: var(--primary-text-color);                
            }
            :host .item[done] {
                --item-background-color: var(--read-background-color);
            }
            appsco-account-image {
                --account-initials-background-color: var(--report-account-initials-background-color);
            }
            iron-collapse {
                @apply --shadow-elevation-2dp;
            }
            .events-container {
                padding: 20px;
                background-color: var(--collapsible-content-background-color);
                position: relative;
            }
            :host .events-container[done] {
                background-color: var(--read-background-color);
            }
            .event-list {
                width: 100%;
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --layout-wrap;
            }
            .message {
                @apply --info-message;
            }
            .resource-icon {
                width: 24px;
                height: 24px;
                margin-right: 5px;
                display: block;
            }
            .resource-title {
                @apply --paper-font-common-nowrap;
                margin-right: 10px;
                font-size: 12px;
                color: var(--secondary-text-color);
            }
            :host .event-list tr[data-status="unresolved"] td .resource-title {
                color: var(--primary-text-color);
            }
            :host .resource-status {
                text-transform: capitalize;
            }
            :host table {
                width: 100%;
                border-collapse: separate;
                border-spacing: 0 10px;
            }
            :host table tr th {
                font-size: 12px;
                font-weight: normal;
                color: var(--secondary-text-color);
                text-align: left;
            }
            :host table tr .fixed-td {
                width: 40px;
            }
            :host table tr td {
                font-size: 12px;
                color: var(--primary-text-color);
            }
            :host table tr td.event {
                color: var(--app-danger-color);
            }
            :host .event-list tr[data-status="resolved"] td {
                color: var(--secondary-text-color);
            }
            :host .list-actions {
                margin-top: 10px;
                @apply --layout-vertical;
                @apply --layout-end;
            }
            :host .resolve-action {
                @apply --primary-button;
                @apply --shadow-elevation-2dp;
                color: var(--primary-text-color);
                background-color: var(--item-background-color);
                border: none;

            }
            :host([screen800]) .item-additional-info {
                display: none;
            }
            :host .item-info {
                padding: 0 10px;
            }
            :host .item-additional-info > .info > .info-label {
                margin-left: 10px;
            }
            :host .info-value[data-count] {
                color: var(--app-danger-color);
            }
            :host .info-value[data-count="0"] {
                color: inherit;
            }
        </style>

        <iron-media-query query="(max-width: 800px)" query-matches="{{ screen800}}"></iron-media-query>

        <div class="item" done\$="[[ !_hasUnresolved ]]">
            <appsco-account-image account="[[ item.user_info ]]"></appsco-account-image>

            <div class="item-info item-basic-info">
                <span class="info-label item-title">[[ item.user_info.display_name ]]</span>
                <span class="info-value">[[ item.user_info.email ]]</span>
            </div>

            <div class="item-info item-additional-info">
                <div class="info">
                    <span class="info-label">Unresolved:&nbsp;</span>
                    <span class="info-value" data-count\$="[[ _unresolvedCount ]]">[[ _unresolvedCount ]]</span>
                </div>
            </div>

            <template is="dom-if" if="[[ _hasUnresolved ]]">
                <div class="actions">
                    <paper-button on-tap="_onShowEvents" hidden\$="[[ _eventsVisible ]]">Show</paper-button>
                    <paper-button on-tap="_onHideEvents" hidden\$="[[ !_eventsVisible ]]">Hide</paper-button>
                </div>
            </template>
        </div>

        <iron-collapse id="events">
            <div class="events-container" done\$="[[ !_hasUnresolved ]]">

                <appsco-loader class="dialog-loader" active="[[ _loader ]]" loader-alt="AppsCo is processing request" multi-color=""></appsco-loader>

                <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>

                <div class="event-list">
                    <table>
                        <tbody><tr>
                            <th class="fixed-td"></th>
                            <th class="fixed-td"></th>
                            <th>Resource title</th>
                            <th>Event</th>
                            <th>Date</th>
                            <th>Action required</th>
                            <th>Status</th>
                        </tr>

                        <template is="dom-repeat" items="[[ item.access_onboardings ]]" as="ev" observe="status">
                            <tr data-status\$="[[ ev.status ]]">
                                <td>
                                    <paper-checkbox noink="" checked="{{ ev.selected }}" disabled\$="[[ ev.disabled ]]"></paper-checkbox>
                                </td>
                                <td>
                                    <iron-image class="resource-icon" placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABGdBTUEAALGPC/xhBQAAAI5JREFUeAHt1YEJwCAQBEFN/60KYgMRbGMnHXjs5Ofa5x/h7wu//T3dAAqIL4BAPIChAAXEF0AgHoCfIAIIxBdAIB6AK4AAAvEFEIgH4AoggEB8AQTiAbgCCCAQXwCBeACuAAIIxBdAIB6AK4AAAvEFEIgH4AoggEB8AQTiAbgCCCAQXwCBeACuAAIIxBe4yV0EThqVC64AAAAASUVORK5CYII=" sizing="cover" preload="" fade="" src="[[ ev.application_icon.application.application_url ]]"></iron-image>
                                </td>
                                <td>
                                    <span class="resource-title">[[ ev.application_icon.title ]]</span>
                                </td>
                                <td class="event">
                                    {{ _getParameter(ev, 'event') }}
                                </td>
                                <td>
                                    <appsco-date-format date="[[ ev.created_at.date ]]" options="{&quot;year&quot;: &quot;numeric&quot;, &quot;month&quot;: &quot;long&quot;, &quot;day&quot;: &quot;numeric&quot;}"></appsco-date-format>
                                </td>
                                <td>
                                    {{ _getParameter(ev, 'action') }}
                                </td>
                                <td>
                                    <span class="resource-status">[[ ev.status ]]</span>
                                </td>
                            </tr>
                        </template>
                    </tbody></table>
                </div>

                <template is="dom-if" if="[[ _hasUnresolved ]]">
                    <div class="list-actions">
                        <paper-button class="resolve-action" on-tap="_onResolveSelectedAction">Mark as resolved</paper-button>
                    </div>
                </template>
            </div>
        </iron-collapse>
`;
    }

    static get is() { return 'appsco-access-on-boarding-roles-item'; }

    static get properties() {
        return {
            item: {
                type: Object
            },

            screen800: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            eventTypesList: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _eventsVisible: {
                type: Boolean,
                value: false
            },

            _resolveRequests: {
                type: Number,
                value: 0
            },

            _unresolvedCount: {
                type: Number,
                computed: '_computeCountByStatus(item.access_onboardings, "unresolved")'
            },

            _hasUnresolved: {
                type: Boolean,
                computed: '_computeHasUnresolved(_unresolvedCount)'
            },

            _resolvedEvents: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _unresolvedEvents: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _loader: {
                type: Boolean,
                value: false
            },

            _errorMessage: {
                type: String
            }
        };
    }

    static get observers() {
        return [
            '_updateScreen(screen800)',
            '_processAccessOnBoardings(item.access_onboardings)'
        ];
    }

    _updateScreen() {
        this.updateStyles();
    }

    _processAccessOnBoardings(events) {
        if (!events) {
            return;
        }
        for(let x = 0; x < events.length; x++) {
            this._processAccessOnBoarding(events[x]);
        }
    }

    _processAccessOnBoarding(event) {
        event.selected = this._isResolvedEvent(event);
        event.disabled = this._isResolvedEvent(event);
    }

    _showLoader() {
        this._loader = true;
    }

    _hideLoader() {
        this._loader = false;
    }

    _showError(message) {
        this._errorMessage = message;
    }

    _hideError() {
        this._errorMessage = '';
    }

    _onShowEvents() {
        this.$.events.show();
        this._eventsVisible = true;
    }

    _onHideEvents() {
        this.$.events.hide();
        this._eventsVisible = false;
    }

    _isResolvedEvent(item) {
        return ('resolved' === item.status);
    }

    _getParameter(item, parameter) {
        const eventTypes = this.eventTypesList;

        for (let i = 0; i < eventTypes.length; i++) {
            const eventType = eventTypes[i];

            if (eventType.name === item.event_type) {
                return eventType[parameter];
            }
        }

        return '';
    }

    _removeItemIfNoUnresolvedEvents() {
        if (0 === this.item.access_onboardings.length) {
            this.dispatchEvent(new CustomEvent('remove-item', {
                bubbles: true,
                composed: true,
                detail: {
                    item: this.item
                }
            }));
        }
    }

    _onResolveEventsFinished() {
        if (0 < this._resolvedEvents.length) {
            this.dispatchEvent(new CustomEvent('access-on-boarding-events-resolved', {
                bubbles: true,
                composed: true,
                detail: {
                    resolvedItems: this._resolvedEvents,
                    unresolvedItems: this._unresolvedEvents
                }
            }));
        }
        else {
            this._showError('There was an error while resolving events. Please try again. If error continues contact AppsCo support.');
        }

        this.set('_resolvedEvents', []);
        this.set('_unresolvedEvents', []);
        this.set('item.access_onboardings', this.item.access_onboardings.splice(0));
        if (!this._hasUnresolved) {
            this._onHideEvents();
        }
        this._hideLoader();
    }

    _resolveEvent(item) {
        return new Promise(function(resolve, reject) {
            const request = document.createElement('iron-request'),
                options = {
                    url: item.meta.resolve,
                    method: 'PUT',
                    handleAs: 'json',
                    headers: this._headers
                };

            request.send(options).then(function() {
                if (200 === request.status) {
                    resolve(request.response);
                }
            }.bind(this), function() {
                if (404 === request.status) {
                    reject(item);
                }
            }.bind(this));
        }.bind(this));
    }

    _processResolvedEvent(item) {
        this._processAccessOnBoarding(item);
        this.push('_resolvedEvents', item);
        const index = this._findIndexOfAccessOnBoardingById(item.id);
        if (index > -1) {
            this.set('item.access_onboardings.' + index, item);
        }
    }

    _onResolveSelectedAction() {
        const resolveList = this.item.access_onboardings.filter(function (el) {
                return el.selected && !el.disabled;
            }),
            length = resolveList.length;

        if (0 === length) {
            this._showError('Please select at least one event to resolve.');
            return false;
        }

        this._resolveRequests = length;

        this._showLoader();
        this._hideError();

        for (let i = 0; i < length; i++) {
            const item = resolveList[i];

            (function(me) {
                me._resolveEvent(item).then(function(item) {
                    me._processResolvedEvent(item);
                    me._resolveRequests--;
                    if (me._resolveRequests === 0) {
                        me._onResolveEventsFinished();
                    }
                }.bind(me), function(item) {
                    me.push('_unresolvedEvents', item);
                    me._resolveRequests--;

                    if (me._resolveRequests === 0) {
                        me._onResolveEventsFinished();
                    }
                }.bind(me));
            })(this);
        }
    }

    _findIndexOfAccessOnBoardingById(id) {
        return this.item.access_onboardings.findIndex(ev => ev.id === id);
    }

    _computeCountByStatus(events, status) {
        if (!events) {
            return 0;
        }
        let count = 0;
        events.forEach(function(ev) {
            if (status === ev.status) count++;
        });
        return count;
    }

    _computeHasUnresolved(unresolvedCount) {
        return unresolvedCount > 0;
    }
}
window.customElements.define(AppscoAccessOnBoardingRolesItem.is, AppscoAccessOnBoardingRolesItem);
