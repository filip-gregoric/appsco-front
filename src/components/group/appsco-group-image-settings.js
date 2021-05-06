import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-image/iron-image.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '../components/appsco-loader.js';
import { AppscoUploadImageBehavior } from '../components/appsco-upload-image-behavior.js';
import '../components/appsco-upload-image-styles.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoGroupImageSettings extends mixinBehaviors([ AppscoUploadImageBehavior ], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-upload-image-styles">
            :host appsco-loader,
            :host .upload-container,
            :host .item-image,
            :host .item-image-upload,
            :host .item-image::shadow #sizedImgDiv,
            :host .item-image::shadow #placeholder {
                border-radius: var(--group-image-upload-radius, 50%);
            }
            :host .upload-container {
                border-radius: var(--group-image-upload-radius, 50%);
            }
        </style>

        <div class="upload-container">
            <appsco-loader active="[[ _loader ]]" loader-alt="AppsCo is processing request" multi-color=""></appsco-loader>

            <iron-image class="item-image" src\$="[[ group.image_url ]]" alt="Group image" sizing="cover"></iron-image>

            <template is="dom-if" if="[[ !previewOnly ]]">
                <label for="imageInput" class\$="item-image-upload [[ _imagePreview ]]">
                    <iron-icon icon="file-upload" class="icon-upload"></iron-icon>
                </label>

                <input type="file" accept="image/*" id="imageInput" name="group-image" class="upload-file" on-change="_onUploadImage">
            </template>
        </div>

        <template is="dom-if" if="[[ !previewOnly ]]">
            <template is="dom-if" if="[[ group.image_url ]]">
                <paper-button class="remove-action" on-tap="_onRemoveImageAction">Remove image</paper-button>
            </template>
        </template>

        <slot name="info"></slot>
`;
    }

    static get is() { return 'appsco-group-image-settings'; }

    static get properties() {
        return {
            group: {
                type: Object
            },

            _imagePreview: {
                type: String,
                computed: '_computeImagePreviewClass(group)'
            }
        };
    }

    _computeImagePreviewClass(group) {
        return (group && group.image_url) ? 'has-image' : 'no-image';
    }

    _setNewImage(file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            this._setObjectAttribute('group', 'image_url', e.target.result);
        }.bind(this);

        reader.readAsDataURL(file);
    }

    _fireChangeEvent() {}

    _setStateAfterImageIsRemoved() {
        this._setObjectAttribute('group', 'image_url', '');
        this._hideLoader();
    }
}
window.customElements.define(AppscoGroupImageSettings.is, AppscoGroupImageSettings);
