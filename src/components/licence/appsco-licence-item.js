import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-button/paper-button.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-media-query/iron-media-query.js';
import './appsco-licence-image.js';
import { AppscoListItemBehavior } from '../components/appsco-list-item-behavior.js';
import '../components/appsco-list-item-styles.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoLicenceItem extends mixinBehaviors([
    NeonAnimationRunnerBehavior,
    AppscoListItemBehavior,
    Appsco.HeadersMixin
], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-list-item-styles">
            :host([preview][activated]) {
                background-color: #e8e8e8;
            }
            :host([preview]) .item-title {                
                font-size: var(--licence-item-preview-font-size, 14px);
                cursor: pointer;
            }
            :host .item-title {
                @apply --text-no-wrap;
            }
            :host([mobile-screen]) .item-additional-info {
                display: none;
            }
        </style>

        <iron-media-query query="(max-width: 600px)" query-matches="{{ mobileScreen }}"></iron-media-query>

        <template is="dom-if" if="[[ preview ]]">
            <span class="info-label item-title">[[ item.product_name ]]</span>
        </template>

        <template is="dom-if" if="[[ !preview ]]">
            <div class="item">

                <template is="dom-if" if="[[ selectable ]]">
                    <div class="select-action" on-tap="_onSelectItemAction">
                        <appsco-licence-image></appsco-licence-image>

                        <div class="icon-action">
                            <div class="iron-action-inner">
                                <iron-icon icon="icons:check"></iron-icon>
                            </div>
                        </div>
                    </div>
                </template>

                <template is="dom-if" if="[[ !selectable ]]">
                    <appsco-licence-image></appsco-licence-image>
                </template>

                <div class="item-info item-basic-info">
                    <span class="info-label licence-title">[[ item.product_name ]]</span>
                    <span class="info-value">[[ item.origin ]]</span>
                </div>

                <div class="item-info item-additional-info">
                    <div class="info">
                        <span class="info-label">Licences:&nbsp;</span>
                        <span class="info-value">[[ numberOfLicences ]]</span>
                    </div>
                    <div class="info">
                        <span class="info-label">Group:&nbsp;</span>
                        <span class="info-value">[[ groupName ]]</span>
                    </div>
                    <div class="info">
                        <span class="info-label">Company:&nbsp;</span>
                        <span class="info-value">[[ item.owner.name ]]</span>
                    </div>
                </div>

                <div class="actions">
                    <paper-button on-tap="_onEditItemAction">Edit</paper-button>
                </div>
            </div>
        </template>
`;
    }

    static get is() { return 'appsco-licence-item'; }

    static get properties() {
        return {
            preview: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            mobileScreen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            numberOfLicences: {
                type: String,
                computed: '_computeNumberOfLicences(item.number_of_licences)'
            },

            groupName: {
                type: String,
                computed: '_computeGroupName(item.group)'
            }
        };
    }

    ready() {
        super.ready();

        afterNextRender(this, function() {
            this._addListeners();
        });
    }

    _addListeners() {
        this.addEventListener('tap', this._onItemAction);
    }

    _computeNumberOfLicences(groupName) {
        return groupName ? groupName : '-';
    }

    _computeGroupName(numberOfLicences) {
        return Number.isInteger(numberOfLicences) ? numberOfLicences : '-';
    }
}
window.customElements.define(AppscoLicenceItem.is, AppscoLicenceItem);
