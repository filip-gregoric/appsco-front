/**
`appsco-account-log`
Used to present account log. Each log message is presented in a new row.

Example:
    <body>
        <appsco-account-log
            account-log-api=""
            authorization-token=""
            size=""
            load-more>
        </appsco-account-log>

### Styling

`<appsco-account-log>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--appsco-account-log` | Mixin for the root element | `{}`
`--appsco-account-log-container` | Mixin for the log wrapper element | `{}`
`--appsco-account-log-item` | Mixin applied to inner appsco-account-log-item element | `{}`
`--appsco-account-log-item-first` | Mixin applied to first appsco-account-log-item element | `{}`
`--account-log-paper-progress` | Mixin applied to notifications paper-progress | `{}`
`--load-more-button` | Mixin applied to Load More button | `{}`

@demo demo/appsco-account-log.html
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
import { AppLocalizeBehavior } from '@polymer/app-localize-behavior/app-localize-behavior.js';
import './appsco-account-log-item.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoAccountLog extends mixinBehaviors([AppLocalizeBehavior, Appsco.HeadersMixin], PolymerElement) {
  static get template() {
    return html`
        <style>
            :host {
                display: block;
                font-size: 14px;
                color: var(--primary-text-color);
                @apply --appsco-account-log;
            }
            :host .account-log {
                padding-top: 10px;
                position: relative;
                @apply --layout-vertical;
                @apply --appsco-account-log-container;
            }
            :host appsco-account-log-item {
                @apply --appsco-account-log-item;
            }
            :host appsco-account-log-item:first-of-type {
                @apply --appsco-account-log-item-first;
            }
            :host .message {
                color: var(--secondary-text-color);
                font-style: italic;
                @apply --paper-font-body2;
                @apply --info-message;
                @apply --text-wrap-break;
            }
            :host paper-progress {
                width: 100%;
                position: absolute;
                top: 0;
                left: 0;
                @apply --appsco-list-progress-bar;
            }
            :host paper-button {
                display: block;
                width: 120px;
                margin: 20px auto 0;
                text-align: center;
                @apply --load-more-button;
            }
        </style>

        <iron-ajax id="ironAjaxLog" url="{{ _computedUrl }}" method="GET" headers="{{ _headers }}" handle-as="json" on-error="_handleError" on-response="_handleResponse">
        </iron-ajax>

        <iron-ajax auto="" url="{{ _timezoneListUrl }}" handle-as="json" on-response="_onTimezoneListResponse">
        </iron-ajax>

        <iron-ajax auto="" url="{{ _countryListUrl }}" handle-as="json" on-response="_onCountryListResponse">
        </iron-ajax>

        <div class="account-log">

            <paper-progress id="progress" indeterminate=""></paper-progress>

            <template is="dom-repeat" items="[[ _logList ]]">
                <appsco-account-log-item item="[[ _formatLogItem(item) ]]" short-view="[[ shortView ]]"></appsco-account-log-item>
            </template>

            <template is="dom-if" if="{{ _message }}">
                <p class="message">
                    [[ _message ]]
                </p>
            </template>

            <paper-button id="loadMore" class="load-more-button" on-tap="_loadMore" hidden="[[ !loadMore ]]">Load More</paper-button>
        </div>
`;
  }

  static get is() { return 'appsco-account-log'; }

  static get properties() {
      return {
          logApi: {
              type: String
          },

          /**
           * Number of notifications to load.
           */
          size: {
              type: Number,
              value: 5
          },

          loadMore: {
              type: Boolean,
              value: false
          },

          shortView: {
              type: Boolean,
              value: false
          },

          _nextPage: {
              type: Number,
              value: 1
          },

          _computedUrl: {
              type: String,
              computed: null
          },

          _timezoneListUrl: {
              type: String,
              value: function () {
                  return this.resolveUrl('./data/timezone-list.json');
              }
          },

          _countryListUrl: {
              type: String,
              value: function () {
                  return this.resolveUrl('./data/country-list.json');
              }
          },

          _logList: {
              type: Array,
              value: function () {
                  return [];
              },
              notify: true
          },

          _timezoneList: {
              type: Array,
              value: function () {
                  return [];
              }
          },

          _genderList: {
              type: Array,
              value: function () {
                  return [
                      {
                          name: 'Male',
                          value: 'm'
                      },
                      {
                          name: 'Female',
                          value: 'f'
                      }
                  ];
              }
          },

          _isPublicList: {
              type: Array,
              value: function () {
                  return [
                      {
                          name: 'on',
                          value: true
                      },
                      {
                          name: 'off',
                          value: false
                      }
                  ]
              }
          },

          /**
           * Country list to get name of country from.
           * Country code = account.country.
           *
           * This is loaded from local data/country-list.json.
           */
          _countryList: {
              type: Array,
              value: function () {
                  return [];
              }
          },

          _message: {
              type: String
          },

          language: {
              value: 'en',
              type: String
          }
      };
  }
  ready() {
      super.ready();

      afterNextRender(this, function() {
          this.loadResources(this.resolveUrl('data/locales.json'));
      });
  }

  _onCountryListResponse(event, ironRequest) {
      this._countryList = ironRequest.response;
  }

  _onTimezoneListResponse(event, ironRequest) {
      ironRequest.response.forEach(function(zone, i) {
          if (zone.utc) {
              zone.utc.forEach(function(utc, index) {
                  const item = {
                      value: utc,
                      text: utc.split('/')[1]
                  };

                  this.push('_timezoneList', item);
              }.bind(this));
          }
      }.bind(this));
  }

  _computeUrl(logApi) {
      return logApi + '?page=' + this._nextPage + '&limit=' + this.size;
  }

  _formatLogUserLogged(item) {
      return {
          icon: 'icons:input',
          date: item.created_at.date,
          message: this.localize('account_log_user_logged'),
          address: item.ip
      }
  }

  _formatLogProfileChanged(item) {
      let data = item.data,
          message = '';

      for (let property in data) {
          if (property === 'application') {
              continue;
          }

          let propertyValue = data[property],
              propertyName = property.replace('_updated', ''),
              from = propertyValue.from,
              to = propertyValue.to;

          switch (propertyName) {
              case 'timezone':
                  this._timezoneList.forEach(function(zone, index) {
                      if (zone.value === from) {
                          from = zone.text;
                      }
                      if (zone.value === to) {
                          to = zone.text;
                      }
                  });
                  break;
              case 'country':
                  this._countryList.forEach(function(country, index) {
                      if (country.code === from) {
                          from = country.name;
                      }
                      if (country.code === to) {
                          to = country.name;
                      }
                  });
                  break;
              case 'gender':
                  this._genderList.forEach(function(gender, index) {
                      if (gender.value === from) {
                          from = gender.name;
                      }
                      if (gender.value === to) {
                          to = gender.name;
                      }
                  });
                  break;
              case 'is_public':
                  this._isPublicList.forEach(function(is_public, index) {
                      if (is_public.value === to) {
                          to = is_public.name;
                      }
                  });
                  break;
              default:
          }

          if ('is_public' === propertyName) {
              message += this.localize('public_profile_changed', 'newValue', to);
          } else {
              message += ' ' + this.localize(propertyName) + ' ' + this.localize('account_log_profile_changed', 'fromValue', from, 'toValue', to);
          }
      }

      return {
          icon: 'editor:mode-edit',
          date: item.created_at.date,
          message: message,
          address: item.ip
      }
  }

  _formatLogProfileImageChanged(item) {
      return {
          image: item.data.photo,
          date: item.created_at.date,
          message: this.localize('account_log_profile_image_changed'),
          address: item.ip
      }
  }

  _formatLogPasswordChanged(item) {
      return {
          icon: 'hardware:security',
          date: item.created_at.date,
          message: this.localize('account_log_password_changed'),
          address: item.ip
      }
  }

  _formatLogTokenGenerated(item) {
      return {
          icon: 'communication:vpn-key',
          date: item.created_at.date,
          message: this.localize('account_log_token_generated'),
          address: item.ip
      }
  }

  _formatLogApplicationRemoved(item) {
      return {
          image: item.data.icon,
          date: item.created_at.date,
          message: this.localize('account_log_application_removed', 'application', item.data.title),
          address: item.ip
      }
  }

  _formatLog2FAEnabled(item) {
      return {
          icon: 'icons:check',
          date: item.created_at.date,
          message: this.localize('account_log_2fa_enabled'),
          address: item.ip
      }
  }

  _formatLog2FADisabled(item) {
      return {
          icon: 'icons:clear',
          date: item.created_at.date,
          message: this.localize('account_log_2fa_disabled'),
          address: item.ip
      }
  }

  _formatLogOauthAppAuthorized(item) {
      var msg = this.localize(
          'account_log_application_authorized',
          'application',
          (item.data && item.data.title)
              ? item.data.title
              : (item.data.oauth_authorization.oauth_application.title
                  ? item.data.oauth_authorization.oauth_application.title
                  : '')
      );
      return {
          icon: 'icons:apps',
          date: item.created_at.date,
          message: msg,
          address: item.ip
      }
  }

  _formatLogAuthorizedAppRevoked(item) {
      const msg = this.localize(
          'account_log_application_revoked',
          'application',
          (item.data && item.data.title)
              ? item.data.title
              : (item.data.oauth_authorization.oauth_application.title
              ? item.data.oauth_authorization.oauth_application.title
              : '')
      );
      return {
          icon: 'icons:undo',
          date: item.created_at.date,
          message: msg,
          address: item.ip
      }
  }

  _formatLogDirectoryAccountAdded(item) {
      return {
          icon: 'social:person-add',
          date: item.created_at.date,
          message: this.localize('account_log_account_added_to_company', 'account', item.data.account.display_name, 'company', item.data.company.name),
          address: item.ip
      }
  }

  _formatLogDirectoryRoleRemoved(item) {
      let displayName = "unknown";
      if(item.data && item.data.account && item.data.account.display_name) {
          displayName = item.data.account.display_name;
      }
      let companyName = "unknown";
      if(item.data.company && item.data.company.name) {
          companyName = item.data.company.name;
      }
      return {
          icon: 'social:person-outline',
          date: item.created_at.date,
          message: this.localize('account_log_account_removed_from_company', 'account', displayName, 'company', companyName),
          address: item.ip
      }
  }

  _formatLogOrgunitCreated(item) {
      return {
          icon: 'icons:group-work',
          date: item.created_at.date,
          message: this.localize('account_log_orgunit_created', 'orgunit', item.data.orgunit.name, 'company', item.data.company.name),
          address: item.ip
      }
  }

  _formatLogOrgunitUpdated(item) {
      let data = item.data,
          message = '';

      for (let property in data) {
          const propertyValue = data[property],
              from = propertyValue.from,
              to = propertyValue.to;

          const propertyName = property.replace('_updated', '');
          message += ' ' + this.localize('account_log_orgunit_updated', 'property', propertyName, 'fromValue', from, 'toValue', to);
      }

      return {
          icon: 'editor:mode-edit',
          date: item.created_at.date,
          message: message,
          address: item.ip
      }
  }

  _formatLogOrgunitRemoved(item) {
      return {
          icon: 'icons:remove-circle',
          date: item.created_at.date,
          message: this.localize('account_log_orgunit_removed', 'orgunit', item.data.orgunit.name, 'company', item.data.company.name),
          address: item.ip
      }
  }

  _formatLogRoleAddedToOrgunit(item) {
      const logItem = {
              date: item.created_at.date,
              message: this.localize('account_log_role_added_to_orgunit', 'account', item.data.role.account.display_name, 'orgunit', item.data.orgunit.name, 'company', item.data.company.name),
              address: item.ip
          },
          picture = item.data.role.account.picture_url;


      if (picture) {
          logItem.image = picture;
      }
      else {
          logItem.icon = 'social:group-add';
      }

      return logItem;
  }

  _formatLogRoleRemovedFromOrgunit(item) {
      const logItem = {
              date: item.created_at.date,
              message: this.localize('account_log_role_removed_from_orgunit', 'account', item.data.account.display_name, 'orgunit', item.data.org_unit.name),
              address: item.ip
          },
          picture = item.data.account.picture_url;


      if (picture) {
          logItem.image = picture;
      }
      else {
          logItem.icon = 'social:person-outline';
      }

      return logItem;
  }

  _formatLogApplicationAddedToOrgunit(item) {
      return {
          image: item.data.application.application_url,
          date: item.created_at.date,
          message: this.localize('account_log_application_added_to_orgunit', 'application', item.data.application.title, 'orgunit', item.data.orgunit.name),
          address: item.ip
      }
  }

  _formatLogApplicationRemovedFromOrgunit(item) {
      return {
          image: item.data.application.application_url,
          date: item.created_at.date,
          message: this.localize('account_log_application_removed_from_orgunit', 'application', item.data.application.title, 'orgunit', item.data.name),
          address: item.ip
      }
  }

  _formatLogUserChangedCompanyLogo(item) {
      return {
          image: item.data.company.image,
          date: item.created_at.date,
          message: this.localize('account_log_company_logo_changed', 'company', item.data.company.name),
          address: item.ip
      }
  }

  _formatLogUserChangedCompanyResourceImage(item) {
      return {
          image: item.data.application.application_url,
          date: item.created_at.date,
          message: this.localize('application_image_changed', 'resource', item.data.application.title),
          address: item.ip
      }
  }

  _formatLogCompanyRolePromotedToAdmin(item) {
      const logItem = {
              date: item.created_at.date,
              message: this.localize('account_log_role_promoted_to_admin', 'account', item.data.account.name),
              address: item.ip
          },
          picture = item.data.account.picture_url;

      if (picture) {
          logItem.image = picture;
      }
      else {
          logItem.icon = 'social:person-outline';
      }

      return logItem;
  }

  _formatLogCompanyRoleDemotedFromAdmin(item) {
      const logItem = {
              date: item.created_at.date,
              message: this.localize('account_log_role_demoted_from_admin', 'account', item.data.account.name),
              address: item.ip
          },
          picture = item.data.account.picture_url;

      if (picture) {
          logItem.image = picture;
      }
      else {
          logItem.icon = 'social:person-outline';
      }

      return logItem;
  }

  _formatLogGroupCreated(item) {
      return {
          icon: 'social:group',
          date: item.created_at.date,
          message: this.localize('account_log_group_created', 'group', item.data.group.name, 'company', item.data.company.name),
          address: item.ip
      }
  }

  _formatLogGroupRemoved(item) {
      return {
          icon: 'social:people-outline',
          date: item.created_at.date,
          message: this.localize('account_log_group_removed', 'group', item.data.group.name, 'company', item.data.company.name),
          address: item.ip
      }
  }

  _formatLogResourceAddedToGroup(item) {
      return {
          icon: 'image:exposure-plus-1',
          date: item.created_at.date,
          message: this.localize('account_log_resource_added_to_group', 'group', item.data.group.name, 'resource', item.data.application.title, 'company', item.data.company.name),
          address: item.ip
      }
  }

  _formatLogResourceRemovedFromGroup(item) {
      return {
          icon: 'image:exposure-neg-1',
          date: item.created_at.date,
          message: this.localize('account_log_resource_removed_from_group', 'group', item.data.group.name, 'resource', item.data.application.title, 'company', item.data.company.name),
          address: item.ip
      }
  }

  _formatLogRoleAddedToGroup(item) {
      return {
          icon: 'social:person-add',
          date: item.created_at.date,
          message: this.localize('account_log_role_added_to_group', 'group', item.data.group.name, 'account', item.data.account.display_name, 'company', item.data.company.name),
          address: item.ip
      }
  }

  _formatLogRoleRemovedFromGroup(item) {
      return {
          icon: 'social:person-outline',
          date: item.created_at.date,
          message: this.localize('account_log_role_removed_from_group', 'group', item.data.group.name, 'account', item.data.account.display_name, 'company', item.data.company.name),
          address: item.ip
      }
  }

  _formatLogContactAddedToGroup(item) {
      return {
          icon: 'social:person-add',
          date: item.created_at.date,
          message: this.localize('account_log_contact_added_to_group', 'group', item.data.group.name, 'account', item.data.account.display_name, 'company', item.data.company.name),
          address: item.ip
      }
  }

  _formatLogContactRemovedFromGroup(item) {
      return {
          icon: 'social:person-outline',
          date: item.created_at.date,
          message: this.localize('account_log_contact_removed_from_group', 'group', item.data.group.name, 'account', item.data.account.display_name, 'company', item.data.company.name),
          address: item.ip
      }
  }

  /**
   * Maps log as object dependent on log type.
   *
   * @param {Object} item
   * @returns {{ item: object }}
   * @private
   */
  _formatLogItem(item) {
      let logItem = {};

      switch (item.type) {
          case 'user_logged':
              logItem = this._formatLogUserLogged(item);
              break;
          case 'user_profile_info_changed':
              logItem = this._formatLogProfileChanged(item);
              break;
          case 'user_profile_photo_changed':
              logItem = this._formatLogProfileImageChanged(item);
              break;
          case 'user_changed_password':
              logItem = this._formatLogPasswordChanged(item);
              break;
          case 'user_generated_transfer_token':
              logItem = this._formatLogTokenGenerated(item);
              break;
          case 'user_removed_application':
              logItem = this._formatLogApplicationRemoved(item);
              break;
          case 'user_2fa_enabled':
              logItem = this._formatLog2FAEnabled(item);
              break;
          case 'user_2fa_disabled':
              logItem = this._formatLog2FADisabled(item);
              break;
          case 'user_oauth_app_authorized':
              logItem = this._formatLogOauthAppAuthorized(item);
              break;
          case 'user_oauth_app_authorization_revoked':
              logItem = this._formatLogAuthorizedAppRevoked(item);
              break;
          case 'directory_account_added':
              logItem = this._formatLogDirectoryAccountAdded(item);
              break;
          case 'directory_role_removed':
              logItem = this._formatLogDirectoryRoleRemoved(item);
              break;
          case 'created_orgunit':
              logItem = this._formatLogOrgunitCreated(item);
              break;
          case 'orgunit_updated':
              logItem = this._formatLogOrgunitUpdated(item);
              break;
          case 'orgunit_removed':
              if (item.data.company) {
                  logItem = this._formatLogOrgunitRemoved(item);
              }
              else {
                  logItem = {
                      icon: 'icons:remove-circle',
                          date: item.created_at.date,
                      message: "Organization unit "+item.data.org_unit.name+" removed",
                      address: item.ip
                  };
              }

              break;
          case 'orgunit_added':
              logItem = this._formatLogRoleAddedToOrgunit(item);
              break;
          case 'role_removed_from_orgunit':
              logItem = this._formatLogRoleRemovedFromOrgunit(item);
              break;
          case 'application_added_to_orgunit':
              logItem = this._formatLogApplicationAddedToOrgunit(item);
              break;
          case 'application_removed_from_orgunit':
              logItem = this._formatLogApplicationRemovedFromOrgunit(item);
              break;
          case 'user_changed_company_logo':
              logItem = this._formatLogUserChangedCompanyLogo(item);
              break;
          case 'application_image_changed':
              logItem = this._formatLogUserChangedCompanyResourceImage(item);
              break;
          case 'account_log_role_promoted_to_admin':
              logItem = this._formatLogCompanyRolePromotedToAdmin(item);
              break;
          case 'account_log_role_demoted_from_admin':
              logItem = this._formatLogCompanyRoleDemotedFromAdmin(item);
              break;
          case 'group_created':
              logItem = this._formatLogGroupCreated(item);
              break;
          case 'group_removed':
              logItem = this._formatLogGroupRemoved(item);
              break;
          case 'resource_added_to_group':
              logItem = this._formatLogResourceAddedToGroup(item);
              break;
          case 'resource_removed_from_group':
              logItem = this._formatLogResourceRemovedFromGroup(item);
              break;
          case 'role_added_to_group':
              logItem = this._formatLogRoleAddedToGroup(item);
              break;
          case 'role_removed_from_group':
              logItem = this._formatLogRoleRemovedFromGroup(item);
              break;
          case 'contact_added_to_group':
              logItem = this._formatLogContactAddedToGroup(item);
              break;
          case 'contact_removed_from_group':
              logItem = this._formatLogContactRemovedFromGroup(item);
              break;
          default:
      }

      return logItem;
  }

  loadLog() {
      this.$.progress.hidden = false;
      this.set('_logList', []);
      this.set('_message', '');
      this._nextPage = 1;

      this.$.ironAjaxLog.url = this._computeUrl(this.logApi);
      this.$.ironAjaxLog.generateRequest();
  }

  _loadMore() {
      this.$.progress.hidden = false;

      this.$.ironAjaxLog.url = this._computeUrl(this.logApi);
      this.$.ironAjaxLog.generateRequest();
  }

  _handleError(event) {
      this.$.loadMore.disabled = true;
      this._message = 'We couldn\'t load log at the moment. Please try again in a minute. If error continues contact us.';
      this._handleEmptyLog();
  }

  _handleResponse(event) {
      let response = event.detail.response,
          logList = [],
          currentLength = this._logList.length;

      if (response) {
          logList = response.log;

          if (logList && logList.length > 0) {
              this.$.loadMore.disabled = false;
              this._nextPage += 1;

              logList.forEach(function(log, i) {
                  setTimeout(function() {

                      this.push('_logList', logList[i]);

                      if (i === (logList.length - 1)) {
                          if (this._logList.length === response.meta.total) {
                              this.$.loadMore.disabled = true;
                          }

                          this._handleEmptyLog();
                      }
                  }.bind(this), (i + 1) * 30);
              }.bind(this));
          }
          else if (logList && !logList.length) {
              if (!currentLength) {
                  this._message = 'The log is empty.';
              }

              this.$.loadMore.disabled = true;
              this._handleEmptyLog();
          }
          else if (!currentLength) {
              this._message = 'We couldn\'t load log at the moment.';
              this._hideProgressBar();

              this.dispatchEvent(new CustomEvent('log-empty', { bubbles: true, composed: true }));
          }
      }
  }

  _handleEmptyLog() {
      this._hideProgressBar();
      this.dispatchEvent(new CustomEvent('log-empty', { bubbles: true, composed: true }));
  }

  _hideProgressBar() {
      setTimeout(function() {
          this.$.progress.hidden = true;
      }.bind(this), 500);
  }
}
window.customElements.define(AppscoAccountLog.is, AppscoAccountLog);
