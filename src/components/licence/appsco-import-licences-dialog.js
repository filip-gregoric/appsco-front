import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '../components/appsco-import-resource.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoImportLicencesDialog extends PolymerElement {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
                position: relative;
                @apply --appsco-import-accounts;
            }
            :host .info {
                margin: 0;
            }
            .download-action {
                color: var(--primary-text-color);
                display: inline;
                padding: 0;
                font-size: 12px;
            }
            .download-icon {
                width: 18px;
                height: 18px;
                margin-top: -4px;
            }
        </style>

        <appsco-import-resource id="appscoImportResource" authorization-token="[[ authorizationToken ]]" import-api="[[ importApi ]]">

            <h2 title="" slot="title">Importing licences</h2>

            <div info="" slot="info">
                <p class="info">
                    To get started, prepare your licence data so it’s in the proper format
                    for importing to AppsCo. Allowed format is csv.
                </p><ul>
                    <li>
                        Make sure your symbols are ASCII or Unicode Latin-based.
                    </li>
                    <li>
                        Download example import for reference.
                        <paper-button class="download-action" on-tap="_onDownloadExampleImportFile">
                            <iron-icon class="download-icon" icon="icons:attachment"></iron-icon> Download
                        </paper-button>
                    </li>
                    <li>
                        If your list is in Excel or Google Sheet you can save it as CSV.
                    </li>
                </ul>
                <p></p>
            </div>
        </appsco-import-resource>
`;
    }

    static get is() { return 'appsco-import-licences-dialog'; }

    static get properties() {
        return {
            authorizationToken: {
                type: String
            },

            importApi: {
                type: String
            },

            domain: {
                type: String
            }
        };
    }

    static get importMeta() {
        return import.meta;
    }

    toggle() {
        this.$.appscoImportResource.toggle();
    }

    close() {
        this.$.appscoImportResource.close();
    }

    _onDownloadExampleImportFile(event) {
        event.stopPropagation();
        window.location.href = this.resolveUrl('./data/example-licences-import.csv');
    }
}
window.customElements.define(AppscoImportLicencesDialog.is, AppscoImportLicencesDialog);
