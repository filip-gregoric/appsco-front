/**
`appsco-application-autologin`
Provides switcher for application types: UN/PW and Item.
If application template has both types switching between these two types should be possible.
If application template has type Item or UN/PW only than switcher should be disabled.
Autologin type is set to TRUE in case application types are: UN/PW, SAML, JWT.

    <appsco-application-autologin>
    </appsco-application-autologin>

### Styling

`<appsco-application-autologin>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--appsco-application-autologin` | Mixin for the root element | `{}`

@demo demo/appsco-application-autologin.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import '@polymer/paper-toggle-button/paper-toggle-button.js';
import '@polymer/iron-ajax/iron-request.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoApplicationAutologin extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
  static get template() {
    return html`
        <style>
            :host {
                display: inline-block;
                position: relative;
            @apply --appsco-application-autologin;
            }
            :host paper-toggle-button {
                cursor: pointer;
            }
        </style>
        <paper-toggle-button id="switch">Auto Login</paper-toggle-button>
`;
  }

  static get is() { return 'appsco-application-autologin'; }

  static get properties() {
      return {
          application: {
              type: Object,
              value: function () {
                  return {};
              },
              notify: true
          }
      };
  }

  ready() {
      super.ready();

      afterNextRender(this, function() {
          this._processAuthType();
          this._addListeners();
      });
  }

  _addListeners() {
      this.addEventListener('change', this._switch);
      this.addEventListener('application-changed', this._processAuthType);
  }

  _processAuthType() {
      const app = (this.application && this.application.application)
          ? this.application.application
          : (this.application && this.application.auth_type ? this.application : null);

      if (app) {
          this.$.switch.active = app.auth_type === 'unpw';
          this.$.switch.disabled = true;

          const appRequest = document.createElement('iron-request'),
              me = this;

          appRequest.send({
              url: app.application_template,
              method: 'GET',
              handleAs: 'json',
              headers: this._headers
          }).then(function() {
              if ('item' in appRequest.response.application.auth_types &&
                      'unpw' in appRequest.response.application.auth_types
              ) {
                  me.$.switch.disabled = false;
                  return false;
              }
              me.dispatchEvent(new CustomEvent('autologin-unavailable', { bubbles: true, composed: true }));
          });
      }
  }

  _switch() {
      const request = document.createElement('iron-request'),
          me = this;

      this.$.switch.disabled = true;

      const options = {
          url: this.application.meta.autologin,
          method: 'POST',
          handleAs: 'json',
          headers: this._headers
      };

      request.send(options).then(function() {
          me.$.switch.disabled = false;
          this.dispatchEvent(new CustomEvent('autologin-changed', { bubbles: true, composed: true }));
      }.bind(this));
  }
}
window.customElements.define(AppscoApplicationAutologin.is, AppscoApplicationAutologin);
