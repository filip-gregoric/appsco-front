import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import '@polymer/iron-ajax/iron-ajax.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import '@polymer/neon-animation/animations/fade-in-animation.js';
import '../components/appsco-loader.js';
import '../components/appsco-form-error.js';
import '../combo-box/suggestion-combo-box.js';
import './appsco-integration-rules-operators.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoEditIntegrationRule extends mixinBehaviors([
    NeonAnimationRunnerBehavior,
    Appsco.HeadersMixin
], PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
                position: relative;
            }
            :host paper-dialog {
                width: 980px;
                top: 120px;
                @apply --appsco-paper-dialog;
            }
            :host paper-dialog-scrollable > * {
                @apply --paper-dialog-scrollable-child;
            }
            :host appsco-loader {
                margin: 0 !important;
                padding: 0 !important;
            }
            :host .buttons paper-button {
                @apply --paper-dialog-button;
            }
            :host .buttons paper-button[dialog-dismiss] {
                @apply --paper-dialog-dismiss-button;
            }
            paper-dropdown-menu {
                width: 100%;
            }
            paper-toggle-button {
                cursor: pointer;
                margin-top: 20px;
            }
            :host .subtitle {
                margin-top: 30px;
                font-size: 16px;
                font-weight: 500;
                text-transform: uppercase;
            }
            :host .primary-button, :host .danger-button {
                @apply --primary-button;
                display: inline-block;
                margin-top: 10px;
            }
            :host .primary-button[active] {
                @apply --shadow-elevation-4dp;
            }
            :host .display-none {
                display: none;
            }
            :host .input-container-title {
                font-size: 16px;
                margin-top: 20px;
            }
            :host div.input-container table {
                width: 100%;
            }
            :host div.input-container table td.operator-select {
                width: 30%;
            }
        </style>

        <appsco-integration-rules-operators id="operators"></appsco-integration-rules-operators>

        <iron-ajax id="getIntegrationPSOSApiRequest" url="[[ _getIntegrationPSOSApi ]]" headers="[[ _headers ]]" on-error="_onIntegrationPSOSError" on-response="_onIntegrationPSOSResponse"></iron-ajax>

        <iron-ajax auto="" url="[[ _getAppscoPSOSApi ]]" headers="[[ _headers ]]" on-error="_onAppscoPSOSError" on-response="_onAppscoPSOSResponse"></iron-ajax>

        <paper-dialog id="dialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation" on-iron-overlay-opened="_onDialogOpened" on-iron-overlay-closed="_onDialogClosed">

            <h2>Change integration rule</h2>

            <appsco-loader active="[[ _loader ]]" loader-alt="AppsCo is processing request" multi-color=""></appsco-loader>

            <paper-dialog-scrollable>
                <div class="dialog-container">

                    <appsco-form-error message="[[ _errorMessage ]]"></appsco-form-error>

                    <iron-form id="form" headers="[[ _headers ]]" on-iron-form-presubmit="_onFormPresubmit" on-iron-form-error="_onFormError" on-iron-form-response="_onFormResponse">
                        <form method="POST" action="[[ _editIntegrationRuleApi ]]">
                            <div class="input-container">
                                <paper-input id="title" label="Title" name="integration_recipe[name]" value="[[ rule.name ]]" required="" auto-validate="" error-message="Please enter rule name."></paper-input>
                            </div>

                            <template is="dom-if" if="[[ _integrationKindRA ]]">
                                <div class="subtitle">Define reaction to event in [[ integration.name ]]</div>
                                <p>
                                    Here you can define interaction with [[ integration.name ]] and AppsCo.
                                    Define events in [[ integration.name ]] and object to which this rule should react.
                                </p>
                                <p>
                                    Lookup - query the [[ integration.name ]] for list of defined incoming objects<br>
                                    Added - react to added event in the [[ integration.name ]]<br>
                                    Modified - react to modified event in the [[ integration.name ]]<br>
                                    Removed - react to removed event in the [[ integration.name ]]
                                </p>
                            </template>
                            <template is="dom-if" if="[[ !_integrationKindRA ]]">
                                <div class="subtitle">Events in AppsCo</div>
                                <p>
                                    Here you can define interaction with [[ integration.name ]] and AppsCo.
                                    Define events in AppsCo and object to which this rule should react.
                                </p>
                                <p>
                                    Lookup - this option is not applicable to AppsCo<br>
                                    Added - react to when user is added in AppsCo directory<br>
                                    Modified - react to when user in your company is modified inside AppsCo<br>
                                    Removed - react to when user is removed from your company in AppsCo
                                </p>
                            </template>

                            <div class="input-container">
                                <paper-dropdown-menu id="fromMethod" label="Method" name="integration_recipe[fromMethod]" horizontal-align="left" on-iron-overlay-opened="_onIronOverlayEvents" on-iron-overlay-closed="_onIronOverlayEvents" required="" error-message="Please select method." auto-validate="">
                                    <paper-listbox id="fromMethodList" class="dropdown-content" on-iron-activate="_onFromMethodSelected" attr-for-selected="value" selected="[[ rule.fromMethod ]]" slot="dropdown-content">
                                        <template is="dom-repeat" items="[[ _computedFromMethodList ]]">
                                            <paper-item value="[[ item.value ]]">[[ item.name ]]</paper-item>
                                        </template>
                                    </paper-listbox>
                                </paper-dropdown-menu>
                            </div>
                            <div class="input-container">
                                <paper-dropdown-menu id="fromPSO" label="Object" name="integration_recipe[fromPSO]" horizontal-align="left" on-iron-overlay-opened="_onIronOverlayEvents" on-iron-overlay-closed="_onIronOverlayEvents" required="" error-message="Please select object." auto-validate="">
                                    <paper-listbox id="fromPSOList" class="dropdown-content" attr-for-selected="value" on-iron-activate="_onFromPSOSelected" on-selected-changed="_onFromPSOSelectedChanged" selected="[[ rule.fromPSO ]]" slot="dropdown-content">
                                        <template is="dom-repeat" items="[[ _computedFromPSOList ]]">
                                            <paper-item value="[[ item.key ]]">[[ item.value ]]</paper-item>
                                        </template>
                                    </paper-listbox>
                                </paper-dropdown-menu>
                            </div>
                            <template is="dom-if" if="[[ _fromConditionListExist ]]">
                                <div class="input-container">
                                    <p>Further filter incoming object</p>
                                    <paper-button class="primary-button" on-tap="_onToggleConditionAction" disabled\$="[[ !_fromPSOSelected ]]" toggles="">Advanced</paper-button>
                                </div>
                            </template>
                            <div id="fromConditionField" class="input-container display-none">
                                <p>Define regular expression for fields to further filter the object. </p>
                                <div class="input-container-title">Conditions:</div>
                                <div class="input-container">
                                    <table>
                                        <tbody>
                                        <template is="dom-repeat" items="[[ _fromConditionList ]]">
                                            <tr>
                                                <td class="operator-select">
                                                    <paper-dropdown-menu id="fromConditionOperator_[[ item.key ]]" label="Operator" name="fromConditionOperator_[[ item.key ]]" horizontal-align="left" on-iron-overlay-opened="_onIronOverlayEvents" on-iron-overlay-closed="_onIronOverlayEvents" required="" error-message="Please select operator." auto-validate="">
                                                        <paper-listbox id="fromCondition_[[ item.key ]]" class="dropdown-content" attr-for-selected="value" selected="{{ item.operator }}" slot="dropdown-content">
                                                            <template is="dom-repeat" items="[[ item.supportedOperators ]]" as="operator">
                                                                <paper-item value="[[ operator ]]">[[ _formatOperator(operator) ]]</paper-item>
                                                            </template>
                                                        </paper-listbox>
                                                    </paper-dropdown-menu>
                                                </td>
                                                <td>
                                                    <template is="dom-if" if="[[ item.options ]]">
                                                        <suggestion-combo-box label="[[ item.key ]]" value="{{ item.value }}" options="[[ item.options ]]"></suggestion-combo-box>
                                                    </template>
                                                    <template is="dom-if" if="[[ !item.options ]]">
                                                        <paper-input label="[[ item.key ]]" value="{{ item.value }}"></paper-input>
                                                    </template>
                                                </td>
                                            </tr>
                                        </template>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <template is="dom-if" if="[[ _integrationKindRA ]]">
                                <div class="subtitle">Define action that should be performed on AppsCo</div>
                                <p>
                                    Define action and object to which this will be applied in AppsCo.
                                </p>
                                <p>
                                    Add - add object into AppsCo<br>
                                    Modify - modify object in AppsCo<br>
                                    Remove - remove object from AppsCo
                                </p>
                            </template>
                            <template is="dom-if" if="[[ !_integrationKindRA ]]">
                                <div class="subtitle">Defined action that should be performed in [[ integration.name ]]</div>
                                <p>
                                    Define action and object to which this will be applied in [[ integration.name ]].
                                </p>
                                <p>
                                    Add - add object into [[ integration.name ]]<br>
                                    Modify - modify object in [[ integration.name ]]<br>
                                    Remove - remove object from [[ integration.name ]]
                                </p>
                            </template>
                            <div class="input-container">
                                <paper-dropdown-menu id="toMethod" label="Method" name="integration_recipe[toMethod]" horizontal-align="left" on-iron-overlay-opened="_onIronOverlayEvents" on-iron-overlay-closed="_onIronOverlayEvents" required="" error-message="Please select method." auto-validate="">
                                    <paper-listbox id="toMethodList" class="dropdown-content" on-iron-activate="_onToMethodSelected" attr-for-selected="value" selected="[[ rule.toMethod ]]" slot="dropdown-content">
                                        <template is="dom-repeat" items="[[ _computedToMethodList ]]">
                                            <paper-item value="[[ item.value ]]">[[ item.name ]]</paper-item>
                                        </template>
                                    </paper-listbox>
                                </paper-dropdown-menu>
                            </div>
                            <div class="input-container">
                                <paper-dropdown-menu id="toPSO" label="Object" name="integration_recipe[toPSO]" horizontal-align="left" on-iron-overlay-opened="_onIronOverlayEvents" on-iron-overlay-closed="_onIronOverlayEvents" required="" error-message="Please select object." auto-validate="">
                                    <paper-listbox id="toPSOList" class="dropdown-content" attr-for-selected="value" selected="[[ rule.toPSO ]]" on-iron-activate="_onToPSOSelected" on-selected-changed="_onToPSOSelectedChanged" slot="dropdown-content">
                                        <template is="dom-repeat" items="[[ _computedToPSOList ]]">
                                            <paper-item value="[[ item.key ]]">[[ item.value ]]</paper-item>
                                        </template>
                                    </paper-listbox>
                                </paper-dropdown-menu>
                            </div>
                            <template is="dom-if" if="[[ _toParamsListExist ]]">
                                <div class="input-container">
                                    <p>Further define affected object</p>
                                    <paper-button class="primary-button" on-tap="_onToggleParamsAction" disabled\$="[[ !_toPSOSelected ]]" toggles="">Advanced</paper-button>
                                </div>
                                <div id="toParamField" class="input-container" hidden\$="[[ !_paramsVisible ]]">
                                    <p>Set default values that should be applied in affected object</p>
                                    <div class="input-container-title">Fields:</div>
                                    <template is="dom-repeat" items="[[ _toParamsList ]]">
                                        <template is="dom-if" if="[[ item.options ]]">
                                            <suggestion-combo-box label="[[ item.key ]]" value="{{ item.value }}" options="[[ item.options ]]"></suggestion-combo-box>
                                        </template>
                                        <template is="dom-if" if="[[ !item.options ]]">
                                            <paper-input label="[[ item.key ]]" value="{{ item.value }}"></paper-input>
                                        </template>
                                    </template>
                                </div>
                            </template>

                            <div class="input-container">
                                <paper-toggle-button id="active" name="integration_recipe[active]" checked\$="[[ rule.active ]]">Activate rule</paper-toggle-button>
                            </div>
                        </form>
                    </iron-form>
                </div>
            </paper-dialog-scrollable>

            <div class="buttons">
                <paper-button dialog-dismiss="">Cancel</paper-button>
                <paper-button autofocus="" on-tap="_onAddAction">Add</paper-button>
            </div>
        </paper-dialog>

        <iron-a11y-keys target="[[ _target ]]" keys="enter" on-keys-pressed="_onEnterAction"></iron-a11y-keys>
`;
    }

    static get is() { return 'appsco-edit-integration-rule'; }

    static get properties() {
        return {
            integration: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            rule: {
                type: Object,
                value: function () {
                    return {};
                },
                notify: true
            },

            apiErrors: {
                type: Object,
                value: function () {
                    return {};
                }
            },

            _getIntegrationPSOSApi: {
                type: String,
                computed: '_computeGetIntegrationPSOSApi(integration)'
            },

            _getAppscoPSOSApi: {
                type: String,
                computed: '_computeGetAppscoPSOSApi(integration)'
            },

            _editIntegrationRuleApi: {
                type: String,
                computed: '_computeEditIntegrationRuleApi(rule)'
            },

            _integrationKindRA: {
                type: Boolean,
                computed: '_computeIntegrationKindRA(integration)'
            },

            _selectedFromMethod: {
                type: String,
                value: '',
                notify: true
            },

            _selectedToMethod: {
                type: String,
                value: ''
            },

            _fromMethodList: {
                type: Array,
                value: function () {
                    return [
                        {
                            value: 'from_lookup',
                            name: 'Lookup'
                        },
                        {
                            value: 'from_added',
                            name: 'Added'
                        },
                        {
                            value: 'from_modified',
                            name: 'Modified'
                        },
                        {
                            value: 'from_deleted',
                            name: 'Removed'
                        }
                    ];
                }
            },

            _computedFromMethodList: {
                type: Array,
                computed: '_computeFromMethodList(_fromMethodList, integration, rule)'
            },

            _fromPSOList: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _computedFromPSOList: {
                type: Array,
                computed: '_computeFromPSOList(_fromPSOList, _selectedFromMethod, integration, rule)'
            },

            _computedToPSOList: {
                type: Array,
                computed: '_computeToPSOList(_availableToPSOList, _selectedToMethod, integration, rule)'
            },

            _fromConditionList: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _fromConditionListExist: {
                type: Boolean,
                computed: '_computeEmptyArray(_fromConditionList)'
            },

            _toParamsList: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _toParamsListExist: {
                type: Boolean,
                computed: '_computeEmptyArray(_toParamsList)'
            },

            _toMethodList: {
                type: Array,
                value: function () {
                    return [
                        {
                            value: 'add',
                            name: 'Add'
                        },
                        {
                            value: 'modify',
                            name: 'Modify'
                        },
                        {
                            value: 'delete',
                            name: 'Remove'
                        }
                    ];
                }
            },

            _computedToMethodList: {
                type: Array,
                computed: '_computeToMethodList(_toMethodList, integration, rule)'
            },

            _toPSOList: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _availableToPSOList: {
                type: Array,
                value: function () {
                    return []
                }
            },

            _appscoPSOList: {
                type: Array,
                value: function () {
                    return [];
                }
            },

            _fromPSOSelected: {
                type: Boolean,
                value: false
            },

            _toPSOSelected: {
                type: Boolean,
                value: false
            },

            _conditionVisible: {
                type: Boolean,
                value: false
            },

            _paramsVisible: {
                type: Boolean,
                value: false
            },

            _loader: {
                type: Boolean,
                value: false
            },

            _errorMessage: {
                type: String
            },

            _target: {
                type: Object
            },

            animationConfig: {
                type: Object
            }
        };
    }

    ready() {
        super.ready();

        this._target = this.$.form;

        this.animationConfig = {
            'entry': {
                name: 'fade-in-animation',
                node: this.$.fromConditionField,
                timing: {
                    duration: 300
                }
            },
            'exit': {
                name: 'fade-out-animation',
                node: this.$.fromConditionField,
                timing: {
                    duration: 200
                }
            }
        };

        afterNextRender(this, function() {
            this._addListeners();
        });
    }

    _addListeners() {
        this.addEventListener('neon-animation-finish', this._onNeonAnimationFinished);
    }

    setIntegration(integration) {
        this.set('integration', {});
        this.set('integration', integration);
    }

    setIntegrationRule(rule) {
        this.set('rule', {});
        this.set('rule', rule);
    }

    open() {
        this.$.dialog.open();
    }

    close() {
        this.$.dialog.close();
    }

    toggle() {
        this.$.dialog.toggle();
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

    _reset() {
        const me = this;

        this._target.reset();
        this._fromPSOSelected = false;
        this._toPSOSelected = false;
        this._conditionVisible = false;
        this._paramsVisible = false;
        this._hideConditionFields();
        this.shadowRoot.getElementById('fromMethodList').selected = -1;
        this.shadowRoot.getElementById('fromPSOList').selected = -1;
        this.shadowRoot.getElementById('toMethodList').selected = -1;
        this.shadowRoot.getElementById('toPSOList').selected = -1;

        this._fromConditionList.forEach(function(element) {
            if (me.$$('#fromCondition_' + element.key)) {
                me.$$('#fromCondition_' + element.key).selected = null;
            }
            if (me.$$('#fromConditionOperator_' + element.key)) {
                me.$$('#fromConditionOperator_' + element.key).selected = null;
            }
        });

        dom(this.root).querySelectorAll('paper-button').forEach(function(element) {
            element.active = false;
        });
    }

    _computeFromMethodList(_fromMethodList, integration, rule) {
        const fromMethods = [];

        if (integration
            && integration.supported_actions
            && integration.supported_actions.source
            && integration.supported_actions.source.existing
        ) {
            for (let idx in integration.supported_actions.source.existing) {
                for (let idx2 in _fromMethodList) {
                    if (_fromMethodList[idx2].value == integration.supported_actions.source.existing[idx]) {
                        fromMethods.push(
                            _fromMethodList[idx2]
                        );
                    }
                }
            }
        }

        return fromMethods;
    }

    _computeToMethodList(_toMethodList, integration, rule) {
        const toMethods = [];

        if (integration
            && integration.supported_actions
            && integration.supported_actions.target
            && integration.supported_actions.target.existing
        ) {
            for (const idx in integration.supported_actions.target.existing) {
                for (const idx2 in _toMethodList) {
                    if (_toMethodList[idx2].value == integration.supported_actions.target.existing[idx]) {
                        toMethods.push(
                            _toMethodList[idx2]
                        );
                    }
                }
            }
        }

        return toMethods;
    }

    _computeFromPSOList(_fromPSOList, _selectedFromMethod, integration, rule) {
        const psos = [],
            targets = {};
        for (const idx in _fromPSOList) {
            targets[_fromPSOList[idx].key] = _fromPSOList[idx];
        }
        if (!_selectedFromMethod && rule) {
            _selectedFromMethod = rule.fromMethod;
        }
        if (integration
            && integration.supported_actions
            && integration.supported_actions.source
            && integration.supported_actions.source.pso
        ) {
            for (const pso in integration.supported_actions.source.pso) {
                if (!targets[pso]) {
                    continue;
                }
                if (integration.supported_actions.source.pso[pso].indexOf(_selectedFromMethod) > -1) {
                    psos.push(targets[pso]);
                }
            }
        }

        return psos;
    }

    _computeToPSOList(_availableToPSOList, _selectedToMethod, integration, rule) {
        const psos = [],
            available = {};
        for (const idx in _availableToPSOList) {
            available[_availableToPSOList[idx].key] = _availableToPSOList[idx];
        }
        if (!_selectedToMethod && rule) {
            _selectedToMethod = rule.toMethod;
        }
        if (integration
            && integration.supported_actions
            && integration.supported_actions.target
            && integration.supported_actions.target.pso
        ) {
            for (const pso in integration.supported_actions.target.pso) {
                if (integration.supported_actions.target.pso[pso].indexOf(_selectedToMethod) > -1
                    && available[pso]
                ) {
                    psos.push(available[pso]);
                }
            }
        }

        return psos;
    }

    _onFromMethodSelected(event) {
        this._selectedFromMethod = event.detail.selected;
    }

    _onToMethodSelected(event) {
        this._selectedToMethod = event.detail.selected;
    }

    _computeGetIntegrationPSOSApi(integration) {
        return integration.self ? (integration.self + '/pso') : null;
    }

    _computeGetAppscoPSOSApi(integration) {
        return integration.self ? (integration.self + '/pso/appsco') : null;
    }

    _computeEditIntegrationRuleApi(rule) {
        return rule.self ? rule.self : null;
    }

    _computeIntegrationKindRA(integration) {
        return (integration.kind && 'ra' === integration.kind);
    }

    _computeEmptyArray(items) {
        return items.length > 0;
    }

    _onDialogOpened() {
        this.$.title.focus();
    }

    _onDialogClosed() {
        this._hideLoader();
        this._hideError();
        this._reset();
    }

    _onIronOverlayEvents(event) {
        event.stopPropagation();
    }

    _loadIntegrationPSOS() {
        const getIntegrationPSOSRequest = this.$.getIntegrationPSOSApiRequest;

        if (getIntegrationPSOSRequest.lastRequest) {
            getIntegrationPSOSRequest.lastRequest.abort();
        }

        getIntegrationPSOSRequest.generateRequest();
    }

    _onIntegrationPSOSError() {
        this.set('_fromPSOList', []);
        this.set('_toPSOList', []);
    }

    _onIntegrationPSOSResponse(event) {
        const response = event.detail.response,
            appscoPSOList = JSON.parse(JSON.stringify(this._appscoPSOList));

        if (this._integrationKindRA) {
            this.set('_fromPSOList', (response && response.psos) ? response.psos : []);
            this.set('_toPSOList', appscoPSOList);
        }
        else {
            this.set('_fromPSOList', appscoPSOList);
            this.set('_toPSOList', (response && response.psos) ? response.psos : []);
        }
        if(this.$.fromPSOList.selected) {
            this.set('_fromPSOSelected', this.$.fromPSOList.selected);
        }
        if (this._fromPSOSelected) {
            this._setFromConditionList(this.$.fromPSOList.selected);
            this._setToPSOAvailableList(this.$.fromPSOList.selected);
        }
        if(this.$.toPSOList.selected) {
            this.set('_toPSOSelected', this.$.toPSOList.selected);
        }
        if (this._toPSOSelected) {
            this._setToParamsList(this.$.toPSOList.selected);
        }
    }

    _onAppscoPSOSError() {
        this.set('_appscoPSOList', []);
    }

    _onAppscoPSOSResponse(event) {
        const response = event.detail.response;

        this.set('_appscoPSOList', (response && response.psos) ? response.psos : []);
        this._loadIntegrationPSOS();
    }

    _setFromConditionListFromRule() {
        const conditionList = this._fromConditionList,
            ruleConditions = this.rule.fromCondition,
            ruleConditionsLength = ruleConditions.length;

        conditionList.forEach(function(element) {

            for (let i = 0; i < ruleConditionsLength; i++) {
                if (element.key === ruleConditions[i].key) {
                    element.operator = ruleConditions[i].value.operator;
                    element.value = ruleConditions[i].value.value;
                    break;
                }
            }
        });
    }

    _setFromConditionList(pso) {
        this._fromPSOSelected = true;
        this._fromPSOList.forEach(function(element) {
            if (pso === element.key) {
                const _fromConditionList = [];
                for (const idx in element.conditions) {
                    _fromConditionList.push({
                        key: idx,
                        value: '',
                        supportedOperators: element.conditions[idx],
                        operator: element.conditions[idx][0],
                        options: this._getOptions(element, idx)
                    });
                }
                this.set('_fromConditionList', _fromConditionList);
            }
        }.bind(this));

        if (this.rule.fromCondition && this.rule.fromCondition.length > 0) {
            this._setFromConditionListFromRule();
        }
    }

    _onFromPSOSelected(event) {
        this._setFromConditionList(event.detail.selected);
    }


    _setToPSOAvailableList(selectedItem) {
        let transformable = [],
            filteredTargetPsos = [];
        this._fromPSOList.forEach(function(el) {
            if (el.key === selectedItem) {
                transformable = el.targets;
            }
        });

        this._toPSOList.forEach(function(el) {
            if (transformable.indexOf(el.key) !== -1) {
                filteredTargetPsos.push(el);
            }
        });

        this.set('_availableToPSOList', filteredTargetPsos);
        if (transformable.indexOf(this.$.toPSOList.selected) === -1) {
            this.$.toPSOList.selected = null;
        }
    }

    _getOptions(element, idx) {
        const result = [null];
        if (!element.conditions || !element.condition_options || !element.conditions[idx] || !element.condition_options[idx]) {
            return null;
        }
        for (const i in element.condition_options[idx]) {
            result.push(element.condition_options[idx][i]);
        }

        return result;
    }

    _onFromPSOSelectedChanged(event) {
        let selectedItem = this.$.fromPSOList.selected,
            transformable = [],
            filteredTargetPsos = [];

        this._setFromConditionList(event.detail.value);

        this._fromPSOList.forEach(function(el) {
            if (el.key === selectedItem) {
                transformable = el.targets;
            }
        });

        this._toPSOList.forEach(function(el) {
            if (transformable.indexOf(el.key) !== -1) {
                filteredTargetPsos.push(el);
            }
        });

        this.set('_availableToPSOList', filteredTargetPsos);
        if (transformable.indexOf(this.$.toPSOList.selected) === -1) {
            this.$.toPSOList.selected = null;
        }

    }

    _setToParamsListFromRule() {
        const paramsList = this._toParamsList,
            ruleParams = this.rule.toField,
            ruleParamsLength = ruleParams.length;

        paramsList.forEach(function(element) {
            for (let i = 0; i < ruleParamsLength; i++) {
                if (element.key === ruleParams[i].key) {
                    element.value = ruleParams[i].value;
                    break;
                }
            }
        });
    }

    _setToParamsList(pso) {
        this._toPSOSelected = true;
        this._toPSOList.forEach(function(element) {
            if (pso === element.key) {
                this.set('_toParamsList', element.params.map(function(el) {
                    return {
                        key: el,
                        value: '',
                        options: (element.target_options[el] && element.target_options[el].length ? element.target_options[el] : null)
                    };
                }));
                return false;
            }
        }.bind(this));

        if (this.rule.toField && this.rule.toField.length > 0) {
            this._setToParamsListFromRule();
        }
    }

    _onToPSOSelected(event) {
        this._setToParamsList(event.detail.selected);
    }

    _onToPSOSelectedChanged(event) {
        this._setToParamsList(event.detail.value);
    }

    _onToggleConditionAction(event) {
        if (this.$.fromPSOList.selected) {
            this._conditionVisible = !this._conditionVisible;
            this._conditionVisible ? this._showConditionFields() : this._hideConditionFields();
        }
        else {
            event.target.active = false;
        }
    }

    _showConditionFields() {
        this.animationConfig.entry.node.style.display = 'block';
        this.playAnimation('entry');
    }

    _hideConditionFields() {
        this.playAnimation('exit');
    }

    _onToggleParamsAction() {
        if (this.$.toPSOList.selected) {
            this._paramsVisible = !this._paramsVisible;
        }
        else {
            event.target.active = false;
        }
    }

    _onNeonAnimationFinished() {
        if (this.animationConfig && !this._conditionVisible) {
            this.animationConfig.exit.node.style.display = 'none';
        }
    }

    _onEnterAction() {
        this._onAddAction();
    }

    _onAddAction() {
        this._hideError();

        if (this._target.validate()) {
            this._showLoader();
            this._target.submit();
        }

    }

    _onFormPresubmit(event) {
        let form = event.target,
            fromMethod = this.$.fromMethod,
            fromPSO = this.$.fromPSO,
            toMethod = this.$.toMethod,
            toPSO = this.$.toPSO,
            conditionIndex = 0,
            paramIndex = 0;

        form.request.method = 'PATCH';
        form.request.body['integration_recipe[fromMethod]'] = fromMethod.selectedItem ? fromMethod.selectedItem.value : '';
        form.request.body['integration_recipe[fromPSO]'] = fromPSO.selectedItem ? fromPSO.selectedItem.value : '';
        form.request.body['integration_recipe[toMethod]'] = toMethod.selectedItem ? toMethod.selectedItem.value : '';
        form.request.body['integration_recipe[toPSO]'] = toPSO.selectedItem ? toPSO.selectedItem.value : '';

        this._fromConditionList.forEach(function(element) {
            if ('' != element.value) {
                form.request.body['integration_recipe[fromCondition][' + conditionIndex + '][field]'] = element.key;
                form.request.body['integration_recipe[fromCondition][' + conditionIndex + '][value]'] = element.value;
                form.request.body['integration_recipe[fromCondition][' + conditionIndex + '][operator]'] = element.operator;
                conditionIndex ++;
            }
        });

        this._toParamsList.forEach(function(element) {
            if ('' != element.value) {
                form.request.body['integration_recipe[toField][' + paramIndex + '][key]'] = element.key;
                form.request.body['integration_recipe[toField][' + paramIndex + '][value]'] = element.value;
                paramIndex ++;
            }
        });
    }

    _onFormError(event) {
        this._showError(this.apiErrors.getError(event.detail.request.response.code));
        this._hideLoader();
    }

    _onFormResponse(event) {
        this.close();

        this.dispatchEvent(new CustomEvent('integration-rule-edited', {
            bubbles: true,
            composed: true,
            detail: {
                integration: this.integration,
                rule: event.detail.response
            }
        }));
    }

    _formatOperator(operatorKey) {
        return this.$.operators.getOperator(operatorKey);
    }
}
window.customElements.define(AppscoEditIntegrationRule.is, AppscoEditIntegrationRule);
