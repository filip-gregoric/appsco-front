import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-ajax/iron-request.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import '../components/appsco-loader.js';
import '../components/appsco-form-error.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoRemoveOAuthApplication extends mixinBehaviors([Appsco.HeadersMixin], PolymerElement) {
  static get template() {
    return html`
        <style>
            :host {
                display: block;
                position: relative;
                @apply --appsco-remove-oauth-application;

                --form-error-box: {
                    margin-top: 0;
                };
            }
            :host paper-dialog {
                width: 670px;
                top: 20vh;
                @apply --appsco-paper-dialog;
            }
            :host paper-dialog-scrollable > * {
                @apply --paper-dialog-scrollable-child;
            }
            :host .buttons paper-button {
                @apply --paper-dialog-button;
            }
            :host .buttons paper-button[dialog-dismiss] {
                @apply --paper-dialog-dismiss-button;
            }
            :host appsco-loader {
                @apply --paper-dialog-appsco-loader;
            }
        </style>
        <paper-dialog id="dialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation" on-iron-overlay-closed="_onDialogClosed">

            <h2>Remove [[ application.title ]]</h2>

            <appsco-loader active="[[ _loader ]]" loader-alt="AppsCo is processing request" multi-color=""></appsco-loader>

            <paper-dialog-scrollable>
                <div class="delete-container">
                    <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>
                    <p>Please confirm removing of this application.</p>
                </div>
            </paper-dialog-scrollable>

            <div class="buttons">
                <paper-button dialog-dismiss="">Cancel</paper-button>
                <paper-button autofocus="" on-tap="_onRemoveAction">Remove</paper-button>
            </div>
        </paper-dialog>
`;
  }

  static get is() { return 'appsco-remove-oauth-application'; }

  static get properties() {
      return {
          application: {
              type: Object,
              value: function () {
                  return {};
              }
          },

          apiErrors: {
              type: Object,
              value: function () {
                  return {};
              }
          },

          _removeApi: {
              type: String,
              computed: '_computeRemoveApi(application)'
          },

          _loader: {
              type: Boolean,
              value: false
          },

          _errorMessage: {
              type: String
          }
      };
  }

  setApplication(application) {
      this.set('application', application);
  }

  open () {
      this.$.dialog.open();
  }

  close () {
      this.$.dialog.close();
  }

  toggle () {
      this.$.dialog.toggle();
  }

  _computeRemoveApi(application) {
      return application.self ? application.self : null;
  }

  _showLoader() {
      this._loader = true;
  }

  _hideLoader() {
      this._loader = false;
  }

  _showError(message) {
      this._errorMessage = message;
  }

  _hideError() {
      this._errorMessage = '';
  }

  _onDialogClosed() {
      this._hideError();
      this._hideLoader();
  }

  _onRemoveAction() {

      if (!this._removeApi || !this._headers['Authorization']) {
          this._showError(this.apiErrors.getError(404));
          return false;
      }

      const request = document.createElement('iron-request'),
          options = {
              url: this._removeApi,
              method: 'DELETE',
              handleAs: 'json',
              headers: this._headers
          };

      this._showLoader();

      request.send(options).then(function() {
          this.close();

          if (200 === request.status) {
              this.dispatchEvent(new CustomEvent('oauth-application-removed', {
                  bubbles: true,
                  composed: true,
                  detail: {
                      application: request.response
                  }
              }));
          }

      }.bind(this), function() {
          this._showError(this.apiErrors.getError(request.response.code));
          this._hideLoader();
      }.bind(this));
  }
}
window.customElements.define(AppscoRemoveOAuthApplication.is, AppscoRemoveOAuthApplication);
