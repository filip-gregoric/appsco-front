import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-image/iron-image.js';
import '@polymer/iron-icon/iron-icon.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoLicenceImage extends PolymerElement {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
                color: #ffffff;
            }
            .licence-image {
                width: 48px;
                height: 48px;
                margin: 0;
                border-radius: 50%;
                background-color: var(--licence-image-background-color, var(--account-initials-background-color));
                position: relative;
                @apply --licence-image;
            }
            .licence-image::shadow #sizedImgDiv, :host .licence-image::shadow #placeholder {
                border-radius: 50%;
            }
            .licence-image.preview {
                width: 36px;
                height: 36px;
                @apply --licence-image-preview;
            }
            .licence-image iron-icon {
                width: 24px;
                height: 24px;
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                margin: auto;

                --iron-icon-fill-color: var(--primary-text-color, #ffffff);
            }
            .licence-image.preview iron-icon {
                width: 18px;
                height: 18px;
            }
        </style>

            <template is="dom-if" if="[[ !preview ]]">
                <div class="licence-image">
                    <iron-icon icon="icons:assignment"></iron-icon>
                </div>
            </template>

            <template is="dom-if" if="[[ preview ]]">
                <div class="licence-image preview">
                    <iron-icon icon="icons:assignment"></iron-icon>
                </div>
            </template>
`;
    }

    static get is() { return 'appsco-licence-image'; }

    static get properties() {
        return {
            preview: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            }
        };
    }
}
window.customElements.define(AppscoLicenceImage.is, AppscoLicenceImage);
