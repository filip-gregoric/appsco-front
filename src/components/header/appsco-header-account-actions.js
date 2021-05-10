import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icons/communication-icons.js';
import './appsco-account-notifications-dropdown.js';
import '../notifications/appsco-notification-icon.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";

class AppscoHeaderAccountActions extends PolymerElement {
    static get template() {
        return html`
        <style>
            :host {
                display: inline-block;

                --paper-icon-button-ink-color: var(--appsco-account-action-color);

            @apply --appsco-header-account-actions;
            }
            :host a {
                text-decoration: none;
            }
            :host .action-icon,
            :host a .action-icon,
            :host a:active .action-icon,
            :host a:visited .action-icon {
                color: var(--appsco-account-action-color);
            }
            :host .new-notifications-icon {
                color: var(--appsco-account-new-notifications-color, var(--primary-color));
                --paper-icon-button-ink-color: var(--appsco-account-new-notifications-color, var(--primary-color));
            }
            :host paper-icon-button::shadow paper-ripple {
                width: 150%;
                height: 150%;
                top: -25%;
                left: -25%;
            }
            :host paper-icon-button {
                color: var(--appsco-account-action-color);
            }
        </style>

        <div class="account-actions">

            <template is="dom-if" if="[[ account.intranet ]]">
                <a href="[[ account.intranet ]]" target="_blank" rel="noopener noreferrer" tabindex="-1">
                    <paper-icon-button class="action-icon" icon="language" title="Intranet"></paper-icon-button>
                </a>
            </template>

            <template is="dom-if" if="[[ chat ]]">
                <paper-icon-button id="chatAction" class="action-icon" icon="communication:forum" title="Chat" on-tap="_onChatAction">
                </paper-icon-button>
            </template>

            <template is="dom-if" if="[[ tutorialActionAvailable ]]">
                <paper-icon-button
                    icon="icons:help"
                    class="appsco-get-started-icon"
                    on-tap="_onGetStartedIcon">
                </paper-icon-button>
            </template>

            <appsco-notification-icon id="newNotificationsIcon" on-tap="_onNewNotificationsAction"></appsco-notification-icon>

            <appsco-account-notifications-dropdown id="appscoAccountNotificationsDropdown" authorization-token="[[ authorizationToken ]]" notifications-api="[[ notificationsApi ]]" notifications-size="[[ notificationsSize ]]" disable-upgrade>
            </appsco-account-notifications-dropdown>

        </div>
`;
    }

    static get is() { return 'appsco-header-account-actions'; }

    static get properties() {
        return {
            account: {
                type: Object
            },

            /** Indicates if chat exists or not. */
            chat: {
                type: Boolean,
                value: false
            },

            tutorialActionAvailable: {
                type: Boolean,
                value: false
            },

            authorizationToken: {
                type: String
            },

            notificationsApi: {
                type: String
            },

            notificationsSize: {
                type: Number,
                value: 5
            },

            /**
             * Indicates if there are new notifications.
             */
            _newNotifications: {
                type: Boolean,
                value: false
            }
        };
    }

    _onChatAction(event) {
        this.dispatchEvent(new CustomEvent('account-chat', { bubbles: true, composed: true }));
    }

    notifyNewNotifications(newNotificationsCount) {
        this.$.newNotificationsIcon.setNotificationsCount(newNotificationsCount);
        this._newNotifications = true;
    }

    notifyNotificationsSeen() {
        this.$.newNotificationsIcon.setNotificationsCount(0);
        this._newNotifications = false;
    }

    _onNewNotificationsAction(event) {
        this._newNotifications = false;
        const dropDown = this.$.appscoAccountNotificationsDropdown;
        dropDown.removeAttribute('disable-upgrade');

        afterNextRender(this, () => dropDown.toggleNotifications());
    }

    _onGetStartedIcon(event) {
        this.dispatchEvent(new CustomEvent('get-started', {
            bubbles: true,
            composed: true,
            detail: {
                account: this.account
            }
        }));
    }
}
window.customElements.define(AppscoHeaderAccountActions.is, AppscoHeaderAccountActions);
