import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icons/social-icons.js';
import '@polymer/paper-card/paper-card.js';
import './appsco-dropdown.js';
import '../account/appsco-account-notifications.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { DisableUpgradeMixin } from "@polymer/polymer/lib/mixins/disable-upgrade-mixin";
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoAccountNotificationsDropdown extends DisableUpgradeMixin(PolymerElement) {
    static get template() {
        return html`
        <style include="iron-flex iron-flex-alignment">
            :host {
                display: inline-block;
                position: relative;

                --paper-card-header-text: {
                     padding-top: 6px;
                     padding-bottom: 6px;
                     font-size: 20px;
                     @apply --notifications-paper-card-header-text;
                 };
                --paper-card-actions: {
                     padding: 0;
                 };
                --paper-card-content: {
                     padding: 0;
                 };

                --appsco-account-notifications-dropdown: {
                    width: 350px;
                };

                --appsco-account-notifications-container: {
                     padding-top: 0;
                 };

                --appsco-account-notifications-paper-progress: {
                     width: 96%;
                     top: -6px;
                 };

                --account-notifications-appsco-list-item: {
                     padding: 16px 6px 6px 10px;
                 };

                --appsco-list-item-date: {
                     top: 2px;
                 };
            }
            :host appsco-dropdown {
                top: 12px;
                right: 1px;
                @apply --appsco-account-notifications-dropdown;
            }
            :host paper-card {
                width: 100%;
            }
            :host .see-all-button {
                width: 100%;
                padding: 6px 0;
                margin: 0;
                border-radius: 0;
                background-color: transparent;
                font-size: 14px;
                color: var(--primary-text-color, #273441);
                border: none;
                @apply --appsco-account-notifications-all-action;
            }
        </style>

        <appsco-dropdown id="appscoNotificationsDropdown" trigger="[[ _triggerDropdown ]]">

            <paper-card heading="Notifications" class="layout vertical">

                <div class="card-content layout vertical">

                    <appsco-account-notifications id="appscoAccountNotifications" authorization-token="[[ authorizationToken ]]" notifications-api="[[ notificationsApi ]]" size="[[ notificationsSize ]]" on-notifications-load="_onNotificationsLoad">
                    </appsco-account-notifications>

                </div>

                <div id="notificationsActions" class="card-actions" hidden="">
                    <paper-button class="see-all-button" on-tap="_seeAllNotificationsAction">See all notifications</paper-button>
                </div>

            </paper-card>

        </appsco-dropdown>
`;
    }

    static get is() { return 'appsco-account-notifications-dropdown'; }

    static get properties() {
        return {
            authorizationToken: {
                type: String
            },

            notificationsApi: {
                type: String
            },

            /**
             * Number of notifications to load.
             */
            notificationsSize: {
                type: Number,
                value: 5
            },

            /**
             * Indicates if notifications are opened or not.
             */
            _open: {
                type: Boolean,
                observer: '_openedChanged'
            },

            /**
             * DOM element which triggers the dropdown.
             */
            _triggerDropdown: {
                type: Object,
                notify: true
            }
        };
    }

    ready() {
        super.ready();

        this._triggerDropdown = this.shadowRoot.getElementById('notificationsAction');
    }

    toggleNotifications() {
        this._open = !this._open;
    }

    _openedChanged(opened) {
        if (undefined === opened) {
            return;
        }

        setTimeout(function() {
            this.$.appscoNotificationsDropdown.toggle();
            if (opened) {
                this.$.appscoAccountNotifications.loadNotifications();
            }
        }.bind(this));
    }

    _onNotificationsLoad() {
        this.$.notificationsActions.hidden = false;
        this.dispatchEvent(new CustomEvent('notifications-seen', { bubbles: true, composed: true }));
    }

    _seeAllNotificationsAction() {
        this.dispatchEvent(new CustomEvent('all-notifications', { bubbles: true, composed: true }));

        this.toggleNotifications();
    }
}
window.customElements.define(AppscoAccountNotificationsDropdown.is, AppscoAccountNotificationsDropdown);
