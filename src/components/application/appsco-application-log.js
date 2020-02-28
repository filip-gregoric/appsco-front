/**
`appsco-application-log`
Used to present resource log. Each log message is presented in a new row.

    <appsco-application-log>
    </appsco-application-log>

### Styling

`<appsco-application-log>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--appsco-application-log` | Mixin for the root element | `{}`
`--appsco-application-logs` | Mixin for the log wrapper element | `{}`
`--application-log-item` | Mixin for the appsco-list-item element | `{}`
`--application-log-item-first` | Mixin for the first appsco-list-item element in list | `{}`
`--load-more-button` | Mixin applied to Load More button | `{}`

@demo demo/appsco-application-log.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import '@polymer/iron-image/iron-image.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-styles/shadow.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-progress/paper-progress.js';
import '../components/appsco-list-item.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { beforeNextRender, afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoApplicationLog extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
  static get template() {
    return html`
        <style>
            :host {
                display: block;
                @apply --appsco-application-log;
            }

            :host .logs {
                @apply --layout-vertical;
                @apply --appsco-application-logs;
            }

            :host .progress {
                height: 6px;
                position: relative;
            }

            :host paper-progress {
                width: 100%;
                position: absolute;
                top: 0;
                left: 0;
                @apply --application-log-progress;
            }

            :host paper-button {
                display: block;
                width: 120px;
                margin: 20px auto 0;
                text-align: center;
                @apply --load-more-button;
            }

            :host .message {
                color: var(--secondary-text-color);
                @apply --paper-font-body2;
                @apply --info-message;
            }

            :host appsco-list-item {
                @apply --application-log-item;
            }

            :host appsco-list-item:first-of-type {
                @apply --application-log-item-first;
            }
        </style>

        <iron-ajax on-request="_loading" auto="" url="[[ _currentUrl ]]" on-response="_handleResponse" on-error="_handleError" headers="[[ _headers ]]" debounce-duration="300">
        </iron-ajax>

        <div class="logs">
            <div class="progress">
                <paper-progress id="progress" indeterminate=""></paper-progress>
            </div>
            <template is="dom-repeat" items="[[ _logMessages ]]" index-as="current" rendered-item-count="{{ renderedCount }}">

                <appsco-list-item item="[[ _mapToListItem(item) ]]">
                </appsco-list-item>
            </template>

            <template is="dom-if" if="{{ _message }}">
                <p class="message">
                    [[ _message ]]
                </p>
            </template>

            <template is="dom-if" if="[[ loadMore ]]">
                <paper-button on-tap="loadMoreLogs" id="loadMore" class="load-more-button" hidden="[[ !_moreLogItems ]]">Load More
                </paper-button>
            </template>
        </div>
`;
  }

  static get is() { return 'appsco-application-log'; }

  static get properties() {
      return {
          /**
           * [Application](https://developers.appsco.com/api/dashboard/id/icons/id) for which log should be rendered
           */
          application: {
              type: Object,
              value: function () {
                  return {};
              },
              notify: true,
              observer: '_init'
          },

          /**
           * [ApplicationLog]() that is to be rendered
           */
          _logMessages: {
              type: Array,
              value: function () {
                  return [];
              }
          },
          /**
           * Number of log items to load and present
           */
          size: {
              type: Number,
              value: 5
          },

          loadMore: {
              type: Boolean,
              value: false,
              reflectToAttribute: true
          },

          _loadMore: {
              type: Boolean,
              value: false
          },

          _moreLogItems: {
              type: Boolean,
              value: true
          },

          company: {
              type: Boolean,
              value: false
          },

          _currentUrl: {
              type: String,
              notify: true
          },

          _message: {
              type: String
          },

          _next: {
              type: String
          },

          /**
           * Image to display in log if there is no account image.
           */
          _placeholder: {
              type: String,
              value: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIwAAACMCAMAAACZHrEMAAAAqFBMVEUAAAAnNEEnNEEnNEEnNEEnNEE8rPcnNEEnNEEnNUI8rPc8rPc8rPcnNEEnNEEnNEEnNEEnNEE8rPc8rPc8rPc8rPcnNEE8rPcnNEE8rPcnNEH///88rPeTmqAoPlDJzNBdZ3Hx8/WBiI+us7g0gLUuWno1QU1OtPjk5+kxbZg9TFtswfprc3w6oebX2ds3lNO8wMShpqxQWmWu3fye1vszeKfU7f6Nz/toHOtWAAAAGnRSTlMAnyC/EO+fYEDPYO26r4+AcFA9IIAQ388wUFlk1w8AAASsSURBVHjazNbdqqtADAXg+XEYvajam1JWkFYLIiIb2/d/uHPgwPam7kmM7p7vCRbJJBmzXR4r6z2w8N5WMTe/7FrbAqsKW1/N73DxFJAUTtGZg7m6AFtRH5gnix5CPmbmCK4M2CCU+5cnt9jM5vtG8VDx+8VxFmp2n2ZlFXZRZUbtfMFOLmdtWU7Y0SlTlSVgV2F7cbISuys3FscVOEDhzAZ5wCFCbsQiDhONkMWB7BFZ+qmZb/TtNjdTr0ijyNJ3M70xd70wjT5L37S0om16SRp9lqmlH7QTP40+y4MSHsI0+izHp4ncLPo00STkSOqIpUNSYhe7gJSxJZZ2REpw5gdZIWmSvlFFZtaVSBqJbURSaVadkfYktifSzqtNCkgbiG1AWlhr1AlpLxJ4Ie20vUnoSKDD1kZlFzDMJDCD4fKuURU4vkjgCxzVm3UHFhIBi+Pfx+PDWNFNWtxJ5I6F4Eb5T4bxzMLow8hLYz8bxrJGSR9GPlDlp8OUzAupDyO7lxFcI4mM4IqcudYvPeF0O3w+zPcTrsEkP5R8tfmnAN+NBG7gK+RdwpMEnhBwiVnS//QEYuLrq100dyyYn+EAvnEigWkEXzB/XcH3IKEH+K6ywe5IrANbvfwetHOtn24r2zIDiQ0ABJsGfLQB+JYPp/oW6C9CbiKA/+PNIJoKfA2JNeCrjAXfRGIT+KzxECCxHnxeFmYmoRkC3iBB16cOEgYiA4m0SFCFaY6bJXmYvhUVpoeIgUyjKIwijP4kDD0StGFef2g1t50GgSCABrSBPhj7aHDcGgPZkk0lFlr+/880PDhpaumc4pwvONnN7ly35ks6VAAiw0c84FiADHjgPI9ZLvOx/LfjMrxnz6sULsMDZnUPGigJu6VxYHnUVrb/meCpDEiu3GUyTTsJb4ZAwHkGCbm7TAFKFXeZEhRx7jKgvHWXWYPCHzXTvipOBloi7k97A5pF7jIv2kZDfDrIrECD0T1QPoHWq7tMAZrSMJ85VJRc2/WId4fkag0GGbB44r/eBox44ACB/3o5GH6xb4a/7Yf71m1D0xoK7l3bhApQ8IFpaI6dSHw1EEW6o1lo9QhHyaHtZCJZZJJMdK36GBfBcqvJROxvu/RRROw+OVg/aGo5Iw7zW69DlDPqhiytlLOHspdLUn/62+TUJ7lkP3s8pXFlJdRyjfgrpCJjlGvUYf5dKyVVUaM0Dj+MKakH1Cln15xUhcN1MsMCmKo46+S3V+O+m7VjFYdhIAigU22x2nCglTE+llRxkYBJlf//tbsikKQ4CVtand4XDCPBNnPdzMV2/f70VRwNrpu52dbP0WBhTnl+mKvHubh7PWVqcSvnlJng+tfyKud1If98qNvdurjfMo/0vN6rdbP+XuvsoP1iHV2yg3ZosI6CIitaRxEFbN0wisg6IWCYNAQMk4aAYdIQMEwaAoZJQ8AwaQg7sblh7BaDuQgRB+hsDmbFIVOy5tKEo5ZgTYUFFSaxhuRZywDlhAXVpvTvv+WdklUjRStRrIpEtBSpopWI1jQFOyAkhYeJxXYSnuBGeceNmFnhTFmCFQVhRR+Rac40QhzRWeREIvZGhFJNjh/wS1HnPv+ePgAAAABJRU5ErkJggg=='
          }
      };
  }

  ready() {
      super.ready();

      beforeNextRender(this, function() {
          this.load();
      });

      afterNextRender(this, function() {
          this._addListeners();
      });
  }

  _addListeners() {
      this.addEventListener('on-request', this._loading);
  }

  load() {
      this._init();
  }

  _init() {
      this.set('_logMessages', []);
      this.set('_currentUrl', '');

      // If it is not owner -> it is shared application and user shouldn't see its subscribers.
      if (!this.application.owner && !this.company) {
          return false;
      }

      if (this.application && this.application.meta) {
          this._next = this.application.meta.log + "?page=1&limit=" + this.size;
          this._currentUrl = this._next;
      }
  }

  _handleResponse(e) {
      const me = this,
            response = e.detail.response;

      if (!this._loadMore) {
          this.set('_logMessages', []);
      }

      this._loadMore = false;

      if (response && response.log.length > 0) {
          this.set('_message', '');

          response.log.forEach(function (el, index) {
              setTimeout(function () {
                  me.push('_logMessages', el);
              }, (index + 1) * 30);

              if (index === response.log.length - 1) {
                  me._moreLogItems = true;
                  me.dispatchEvent(new CustomEvent('log-loaded', { bubbles: true, composed: true }));
              }

          });

          this._next = e.detail.response.meta.next + "&limit=" + this.size;
          // Wait for a bit longer so that loading looks nice
          setTimeout(function () {
              me.$.progress.hidden = true;

              if (parseInt(e.detail.response.meta.page) === parseInt(e.detail.response.meta.pages)) {
                  me._moreLogItems = false;
              }

          }, 600 + (e.detail.response.log.length * 100))
      }
      else {
          this._message = 'The log is empty.';
          this.$.progress.hidden = true;
          this._moreLogItems = false;

          this.dispatchEvent(new CustomEvent('log-empty', { bubbles: true, composed: true }));
      }
  }

  _handleError() {
      this._message = 'We couldn\'t load log at the moment. Please try again in a minute.';
      this.$.progress.hidden = true;
  }

  loadMoreLogs() {
      this._loadMore = true;
      this._currentUrl = this._next;
  }

  _loading() {
      this.$.progress.hidden = false;
  }

  /**
   * Returns log message dependent on item type.
   *
   * @param {Object} item
   * @returns {{ message: string }}
   * @private
   */
  _getLogMessage(item) {
      var message = '';

      switch (item.type) {
          case 'application_shared':
              if (item.for) {
                  message = item.account.display_name + ' shared resource to ' + item.for.display_name + '.';
              }
              else {
                  message = 'Resource shared to ' + item.account.display_name + '.';
              }
              break;
          case 'company_application_shared':
              message = item.account.display_name + ' shared resource to ' + item.for.display_name + '.';
              break;
          case 'modified':
              message = 'Modified by ' + item.account.display_name + '.';
              break;
          case 'logged_in':
              message = item.account.display_name + ' logged in.';
              break;
          case 'claims_changed':
              message = item.account.display_name + ' changed claims.';
              break;
          case 'deleted':
              message = item.account.display_name + ' removed resource.';
              break;
          case 'revoked':
              message = item.account.display_name + ' revoked access to ' + item.for.display_name + '.';
              break;
          case 'application_created':
              message = item.application.title + ' created by ' + item.account.display_name + '.';
              break;
          case 'account_claims_updated':
              message = item.account.display_name + ' updated resource claims for ' + item.for.display_name + '.';
              break;
          case 'application_removed_from_orgunit':
              message = item.account.display_name + ' removed org unit ' + item.data.name + ' from application.';
              break;
          case 'application_added_to_orgunit':
              message = item.account.display_name + ' added application ' + item.application.title + ' to org unit ' + item.data.orgunit.name + '.';
              break;
          case 'application_image_changed':
              message = 'Resource image changed by ' + item.account.display_name + '.';
              break;
          case 'orgunit_removed':
              message = 'Organization unit '+ item.data.name +' removed by ' + item.account.display_name + '.';
              break;
          case 'username_copied':
              message = 'Username copied by ' + item.account.display_name + '.';
              break;
          case 'password_copied':
              message = 'Password copied by ' + item.account.display_name + '.';
              break;
          default:
      }

      return message;
  }

  /**
   * Maps log object to list-item object.
   *
   * @param {Object} item
   * @returns {{ item: object }}
   * @private
   */
  _mapToListItem(item) {
      return {
          icon: item.account.image ? item.account.image : this._placeholder,
          date: item.created_at.date,
          message: this._getLogMessage(item)
      };
  }
}
window.customElements.define(AppscoApplicationLog.is, AppscoApplicationLog);
