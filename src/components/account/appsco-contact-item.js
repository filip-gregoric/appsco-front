import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-button/paper-button.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-media-query/iron-media-query.js';
import './appsco-account-image.js';
import '../components/appsco-date-format.js';
import { AppscoListItemBehavior } from '../components/appsco-list-item-behavior.js';
import '../components/appsco-list-item-styles.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoContactItem extends mixinBehaviors([
    NeonAnimationRunnerBehavior,
    AppscoListItemBehavior
], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-list-item-styles"></style>
        <style>
            :host([tablet-screen]) .item-additional-info {
                display: none;
            }
        </style>

        <iron-media-query query="(max-width: 800px)" query-matches="{{ tabletScreen }}"></iron-media-query>

        <div class="item" on-tap="_onItemAction">

            <div class="select-action" on-tap="_onSelectItemAction">
                <appsco-account-image account="[[ item.account ]]"></appsco-account-image>

                <div class="icon-action">
                    <div class="iron-action-inner">
                        <iron-icon icon="icons:check"></iron-icon>
                    </div>
                </div>
            </div>

            <div class="item-info item-basic-info">
                <span class="info-label item-title">[[ item.account.display_name ]]</span>
                <span class="info-value">[[ item.account.email ]]</span>
            </div>

            <div class="item-info item-additional-info">
                <div class="info">
                    <span class="info-label">Added:&nbsp;</span>
                    <appsco-date-format class="info-value" date="[[ item.createdAt.date ]]" options="{&quot;year&quot;: &quot;numeric&quot;, &quot;month&quot;: &quot;long&quot;, &quot;day&quot;: &quot;numeric&quot;, &quot;hour&quot;: &quot;2-digit&quot;, &quot;minute&quot;: &quot;2-digit&quot;}"></appsco-date-format>
                </div>

                <template is="dom-if" if="[[ _groups ]]">
                    <div class="info">
                        <span class="info-label">Groups:&nbsp;</span>
                        <span class="info-value">[[ _groups ]]</span>
                    </div>
                </template>
            </div>

            <div class="actions">
                <paper-button on-tap="_onEditItemAction">Edit</paper-button>
            </div>
        </div>
`;
    }

    static get is() { return 'appsco-contact-item'; }

    static get properties() {
        return {
            tabletScreen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            }
        };
    }
}
window.customElements.define(AppscoContactItem.is, AppscoContactItem);
