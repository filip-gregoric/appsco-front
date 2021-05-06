import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-image/iron-image.js';
import '@polymer/iron-icon/iron-icon.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoCompanyGroupImage extends PolymerElement {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
                color: #ffffff;
            }
            .group-image {
                width: 52px;
                height: 52px;
                margin: 0;
                border-radius: 50%;
                background-color: var(--group-image-background-color, var(--account-initials-background-color));
                position: relative;
                @apply --group-image;
            }
            .group-image::shadow #sizedImgDiv, :host .group-image::shadow #placeholder {
                border-radius: 50%;
            }
            .group-image.preview {
                width: 36px;
                height: 36px;
                @apply --group-image-preview;
            }
            .group-image iron-icon {
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
            .group-image.preview iron-icon {
                width: 18px;
                height: 18px;
            }
        </style>

        <template is="dom-if" if="[[ group.image_url ]]">
            <iron-image class\$="[[ imageClasses ]]" src\$="[[ group.image_url ]]" alt="Group image" sizing="cover"></iron-image>
        </template>
        
        <template is="dom-if" if="[[ !group.image_url ]]">
            <div class\$="[[ imageClasses ]]">
                <iron-icon icon="social:people"></iron-icon>
            </div>
        </template>
`;
    }

    static get is() { return 'appsco-company-group-image'; }

    static get properties() {
        return {
            group: {
                type: Object
            },

            preview: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            imageClasses: {
                type: String,
                value: 'group-image preview',
                computed: 'computeImageClasses(preview)'
            }
        };
    }

    computeImageClasses(preview) {
        return preview ? 'group-image preview' : 'group-image';
    }
}
window.customElements.define(AppscoCompanyGroupImage.is, AppscoCompanyGroupImage);
