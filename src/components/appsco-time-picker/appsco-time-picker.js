import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/iron-icon/iron-icon.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoTimePicker extends mixinBehaviors([NeonAnimationRunnerBehavior], PolymerElement) {
  static get template() {
    return html`
        <style>
            :host {
                @apply --layout-vertical;
                @apply --layout-start;
                font-size: 12px;
                width: 100%;
                position: relative;
            }

            #activeItem {
                position: absolute;
                right: 0;
                top: 30px;
                color: #9b9b9b;
            }

            .filter {
                width: 100%;
                position: relative;
                z-index: 5;
                display: none;
            }

            .dropdown-content {
                @apply --shadow-elevation-2dp;
                padding: 0;
                position: absolute;
                top: 4px;
                left: 0;
                width: 100%;
                z-index: 5;
                overflow-y: auto;
            }

            .paper-item {
                padding: 0 8px;
                height: 36px;
                line-height: 18px;
                font-size: 14px;
                cursor: pointer;
            }

            :host #searchPanel {
                width: 100%;
            }

            :host #searchPanelInput {
                margin-top: 20px;
            }

            :host #itemList {
                max-height: 200px;
                max-width: 75px;
            }

        </style>

        <div id="searchPanel">
            <paper-input id="searchPanelInput" placeholder="[[ label ]]" no-label-float="" value="{{ value }}" on-focus="_onFilterPanelFocus" on-blur="_onFilterPanelBlur" on-keyup="_onFilterPanelKeyup">
            </paper-input>
        </div>

        <div id="activeItem" class="item-active item-list-action" on-tap="_showPanelList">
            [[ _selectedItem ]]
            <iron-icon icon="arrow-drop-down"></iron-icon>
        </div>

        <div id="filterPanel" class="filter" hidden\$="[[ !_active ]]">

            <paper-listbox id="itemList" class="dropdown-content" selected="[[ _selectedItem ]]" attr-for-selected="value" on-iron-activate="_onItemActivate">

                <template is="dom-repeat" items="[[ _times ]]">
                    <paper-item class="paper-item" value="[[ item ]]" name="[[ item ]]" label="[[ item ]]">
                        [[ item ]]
                        <paper-ripple></paper-ripple>
                    </paper-item>
                </template>

            </paper-listbox>

        </div>
`;
  }

  static get is() { return 'appsco-time-picker'; }

  static get properties() {
      return {
          label: {
              type: String,
              value: ''
          },

          value: {
              type: String,
              value: '',
              notify: true
          },

          options: {
              type: Array,
              value: function () {
                  return [
                      '00:00',
                      '00:30',
                      '01:00',
                      '01:30',
                      '02:00',
                      '02:30',
                      '03:00',
                      '03:30',
                      '04:00',
                      '04:30',
                      '05:00',
                      '05:30',
                      '06:00',
                      '06:30',
                      '07:00',
                      '07:30',
                      '08:00',
                      '08:30',
                      '09:00',
                      '09:30',
                      '10:00',
                      '10:30',
                      '11:00',
                      '11:30',
                      '12:00',
                      '12:30',
                      '13:00',
                      '13:30',
                      '14:00',
                      '14:30',
                      '15:00',
                      '15:30',
                      '16:00',
                      '16:30',
                      '17:00',
                      '17:30',
                      '18:00',
                      '18:30',
                      '19:00',
                      '19:30',
                      '20:00',
                      '20:30',
                      '21:00',
                      '21:30',
                      '22:00',
                      '22:30',
                      '23:00',
                      '23:30'
                  ];
              },
              observer: '_onOptionsChanged'
          },

          _times: {
              type: Array,
              value: function () {
                  return [];
              }
          },

          _active: {
              type: Boolean,
              value: false
          },

          _selectedItem: {
              type: String,
              value: ''
          },

          _clearPanelSearch: {
              type: Boolean,
              value: ''
          },

          animationConfig: {
              type: Object
          }
      };
  }

  ready() {
      super.ready();

      this.animationConfig = {
          'entry': {
              name: 'scale-up-animation',
              axis: 'y',
              transformOrigin: '0 0',
              node: this.shadowRoot.getElementById('filterPanel'),
              timing: {
                  delay: 50,
                  duration: 200
              }
          },
          'exit': {
              name: 'fade-out-animation',
              node: this.shadowRoot.getElementById('filterPanel'),
              timing: {
                  duration: 100
              }
          }
      };
  }

  _stopPropagation(e) {
      e.stopPropagation();
  }

  _focusFirstPanel() {
      this.shadowRoot.getElementById('itemList').items[0].focus();
  }

  _filterItems(term) {
      const items = this.options,
          length = items.length;

      if (length === 0) {
          this.set('_times', JSON.parse(JSON.stringify(this.options)));
          return;
      }

      this.set('_times', []);

      for (let i = 0; i < length; i++) {
          const item = items[i];

          if ((null === item) || (item && item.toLowerCase().indexOf(term.toLowerCase()) >= 0))    {
              this.push('_times', item);
          }
      }
  }

  _onFilterPanelKeyup(event) {
      const term = event.target.value ? event.target.value : '';
      this._filterItems(term);
  }

  _showPanelList() {
      this.shadowRoot.getElementById('searchPanelInput').focus();
  }

  _onItemActivate(event) {
      const input = this.shadowRoot.getElementById('searchPanelInput');
      input.value = event.detail.selected;
  }

  _onFilterPanelBlur() {
      setTimeout(function() {
          if (this.shadowRoot.getElementById('searchPanelInput').contains(document.activeElement)) {
              return;
          }
          this.animationConfig.entry.node.style.display = 'none';
          this.playAnimation('exit');
      }.bind(this), 300);
  }

  _onFilterPanelFocus() {
      this.animationConfig.entry.node.style.display = 'block';
      this.playAnimation('entry');
  }

  _onOptionsChanged(newValue) {
      if (newValue) {
          this.set('_times', JSON.parse(JSON.stringify(newValue)));
      }
  }
}
window.customElements.define(AppscoTimePicker.is, AppscoTimePicker);
