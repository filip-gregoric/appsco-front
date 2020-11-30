import '@polymer/polymer/polymer-legacy.js';
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import '@polymer/iron-selector/iron-selector.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-ajax/iron-request.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '@polymer/neon-animation/neon-animated-pages.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/device-icons.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-toast/paper-toast.js';
import '@polymer/paper-progress/paper-progress.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-styles/color.js';
import './components/header/appsco-header.js';
import './components/components/appsco-api.js';
import './components/components/appsco-api-errors.js';
import './components/company-role/appsco-role-save-client-data.js';
import './components/company/appsco-company-notice.js';
import './shared-styles.js';
import './webkit-scrollbar-style.js';
import './components/get-started/appsco-tutorial.js';
import './components/components/appsco-behavior-export-report.js';
import '@polymer/polymer/lib/utils/render-status.js';

const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="appsco-app-header">
    <template>
        <style include="shared-styles">
            :host {
                display: block;
                min-height: 100vh;

                --brand-color: var(--app-primary-color);
                --brand-text-color: #ffffff;
                --brand-default-text-color: #ffffff;

                --app-primary-color: #279FBC;
                --app-primary-color-1: #39C2D7;
                --app-secondary-color: #273441;
                --app-secondary-color-1: #1183A4;
                --app-danger-color: #db4437;
                --app-warning-color: var(--paper-orange-300);
                --body-background-color: #f5f8fa;
                --body-background-color-darker: #dbdbdb;
                --app-primary-color-dark: #414042;
                --success-color: #5AC099;

                --primary-text-color: #414042;
                --secondary-text-color: #969696;

                --header-background-color: var(--brand-color);
                --header-text-color: var(--brand-text-color);
                --header-icon-color: var(--header-text-color);
                --header-divider-color: var(--header-text-color);

                --appsco-product-text-color: var(--header-text-color);

                --primary-button-background-color: var(--brand-color);

                --border-radius-base: 3px;

                --paper-progress-active-color: var(--success-color);

                --border-color: var(--divider-color);
            }

            /* Top header style START */
            appsco-header {
                height: 64px;
                padding: 16px 10px;
                box-sizing: border-box;
                background-color: var(--header-background-color);

                --appsco-brand: {
                    display: block;
                };
                --appsco-product: {
                    height: 32px;
                    line-height: 35px;
                };

                --paper-listbox: {
                    color: var(--app-secondary-color);
                };

                --notifications-paper-card-header-text: {
                    color: var(--primary-text-color);
                };

                --appsco-brand-logo: {
                    width: auto;
                }
            }
            /* Top header style END */

            /* Bottom header style START */
            app-header {
                background-color: #ffffff;
                box-shadow: 0 3px 3px -2px rgba(0, 0, 0, 0.4);
                z-index: 1;
            }
            app-header paper-icon-button {
                --paper-icon-button-ink-color: white;
            }
            app-header .actions {
                height: 100%;
            }
            .page-title {
                margin-right: 10px;
                font-size: 18px;
                color: var(--primary-text-color);
                text-transform: capitalize;
            }
            /* Bottom header style END */

            /* Menu list style START */
            .drawer-list {
            }
            .drawer-list > a,
            .drawer-list div[disabled],
            .drawer-list div[head]
            {
                display: block;
                padding: 0 16px;
                text-decoration: none;
                color: var(--app-secondary-color);
                line-height: 36px;
                border-bottom: 1px solid var(--divider-color);
                outline: none;
                font-size: 14px;
            }
            .drawer-list div[head] {
                background-color: #279FBC;
                color: #ffffff;
            }
            .section {
                display: block;
                padding: 0 16px;
                color: var(--secondary-text-color);
                line-height: 36px;
                border-bottom: 1px solid var(--divider-color);
                outline: none;
                font-size: 14px;
            }
            .drawer-list div[head].business {
                background-color: #5AC099;
            }
            .drawer-list div[disabled] {
                opacity: 0.4;
            }
            .drawer-list a.iron-selected {
                background-color: var(--google-grey-300);
            }
            /* Menu list style END */

            :host app-drawer-layout[fullbleed] {
                top: 64px;
                overflow: hidden;
            }
            app-drawer {
                top: 64px;
                border-top: 1px solid #ffffff;
                height: calc(100vh - 64px);
                --app-drawer-content-container: {
                    padding-top: 0;
                    background: var(--body-background-color);
                    overflow: auto;
                };
            }
            app-drawer iron-icon {
                --iron-icon-fill-color: var(--app-primary-color-dark);
            }
            app-toolbar {
                padding: 0 10px;
            }
            :host .flex-horizontal {
                @apply --layout-horizontal;
                @apply --layout-center;
            }
            :host .flex {
                @apply --layout-flex;
            }
            .pages {
                height: 100%;
            }
            .menu-text {
                display: inline-block;
                vertical-align: middle;
                padding-left: 8px;
            }
            paper-progress {
                width: 100%;
                position: absolute;
                top: 64px;
                left: 0;
                z-index: 10;
            }
            paper-progress::shadow #primaryProgress {
                background-color: var(--paper-progress-active-color);
            }
            :host([tablet-screen]) {
                --appsco-paper-dialog: {
                    width: 90%;
                    top: 20vh;
                };
            }
            :host([mobile-screen]) {
                --appsco-account-notifications-dropdown: {
                    width: 300px;
                };

                --appsco-account-info-dropdown: {
                    width: 300px;
                };
            }
            .toast-close-action {
                position: absolute;
                top: 0;
                right: 2px;
                width: 18px;
                height: 18px;
                margin: 0;
                color: #ffffff;
            }
        </style>
    </template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);
