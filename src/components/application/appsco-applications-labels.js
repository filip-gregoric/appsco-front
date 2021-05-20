import '@polymer/polymer/polymer-legacy.js';
import './appsco-applications.js';
import './appsco-applications-label.js';
import '../../lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { beforeNextRender } from "@polymer/polymer/lib/utils/render-status";
import { DisableUpgradeMixin } from "@polymer/polymer/lib/mixins/disable-upgrade-mixin";

class AppscoApplicationsLabels extends mixinBehaviors([
    Appsco.HeadersMixin
], DisableUpgradeMixin(PolymerElement)) {
    static get template() {
        return html`
        <template is="dom-repeat" items="[[ labels ]]">
            <div hidden\$="[[ !_isLabelVisible(item, _showOnlyPersonal, _showOnlyShared, _group, _company) ]]">
                <appsco-applications-label
                    authorization-token="[[ authorizationToken ]]"
                    account="[[ account ]]"
                    label="[[ item ]]"
                    size="[[ size ]]"
                    hide-on-empty="[[ hideOnEmpty ]]"
                    collapse-on-empty="false"
                    display-style="[[ displayStyle ]]"
                    sort="[[ sort ]]">
                </appsco-applications-label>            
            </div>
        </template>`;
    }

    static get is() { return 'appsco-applications-labels'; }

    static get properties() {
        return {
            account: {
                type: Object
            },

            size: {
                type: Number,
                value: 20
            },

            labels: {
                type: Array
            },

            displayStyle: {
                type: String
            },

            sort: {
                type: Object
            },

            _group: {
                type: Object
            },

            _company: {
                type: Object
            },

            _showOnlyPersonal: {
                type: Boolean,
                value: false
            },

            _showOnlyShared: {
                type: Boolean,
                value: false
            },

            hideOnEmpty: {
                type: Boolean,
                computed: '_computeHideOnEmpty(_group, _company)',
                value: true
            }
        };
    }

    _labelComponents() {
        return Array.from(this.shadowRoot.querySelectorAll('appsco-applications-label'));
    }

    initializeResourcesDragBehavior() {
        setTimeout(function() {
            this._labelComponents().forEach(component => component.initializeResourcesDragBehavior());
        }.bind(this), 500);
    }

    _computeHideOnEmpty(group, company) {
        return !group && !company;
    }

    setDisplayStyle(displayStyle) {
        this.displayStyle = displayStyle;
    }

    setSort(sort) {
        beforeNextRender(this, function() {
            this._labelComponents().forEach(component => component.setSort(sort));
        });
    }

    _resetViewProperties(){
        this._setViewProperties({});
    }

    _setViewProperties(properties) {
        const defaultProperties = {
            _showOnlyPersonal: false,
            _showOnlyShared: false,
            _group: null,
            _company: null
        };

        this.setProperties({ ...defaultProperties, ...properties });
    }

    showOnlyPersonal() {
        this._resetViewProperties();
        this._showOnlyPersonal = true;
    }

    showAll() {
        this._resetViewProperties();
        this._labelComponents().forEach(component => component.setGroup(null));
    }

    showGroup(group) {
        this._setViewProperties({ _group: group });
        if (!group) {
            this._labelComponents().forEach(component => component.setGroup(null));
            return;
        }
        const groupCompany = group.company.self ? group.company : { self: group.company };
        this._labelComponents().forEach(function(component) {
            component.setGroup(component.isLabelForCompany(groupCompany) ? group : null);
        });
    }

    showSharedByCompany(company) {
        this._setViewProperties({ _company: company });
        this._labelComponents().forEach(component => component.setGroup(null));
    }

    showOnlyShared() {
        this._resetViewProperties();
        this._showOnlyShared = true;
    }

    _isLabelVisible(label, showOnlyPersonal, showOnlyShared, group, company){
        if (!showOnlyPersonal && !showOnlyShared && !group && !company) {
            return true;
        }

        if (showOnlyPersonal) {
            return !label.company;
        }

        if (showOnlyShared) {
            return label.company;
        }

        if (group) {
            return label.company && label.company.self === group.company;
        }

        if (company) {
            return label.company && label.company.self === company.self;
        }
    }

    addApplications(applications) {
        applications.forEach(function(application) {
            const component = this._findComponentForApplication(application);
            if (component) {
                component.addApplications([application]);
            }
        }.bind(this));
    }

    _findComponentForApplication(application) {
        if (!application.application.company) {
            return this._labelComponents()[0];
        }

        return this._findComponentForCompany(application.application.company);
    }

    _findComponentForCompany(company) {
        return this._labelComponents().find((component) => { return component.isLabelForCompany(company) });
    }

    modifyApplications(applications) {
        applications.forEach(function(application) {
            const component = this._findComponentForApplication(application);
            if (component) {
                component.modifyApplications([application]);
            }
        }.bind(this));
    }

    reloadApplications() {
        this._labelComponents().forEach(component => component.reloadApplications());
    }

    removeApplications(applications) {
        applications.forEach(function(application) {
            const component = this._findComponentForApplication(application);
            if (component) {
                component.removeApplications([application]);
            }
        }.bind(this));
    }

    getFirstApplication() {
        return this._labelComponents()[0].getFirstApplication();
    }

    filterByStatus(api) {
        this._labelComponents().forEach(component => component.filterByStatus(api));
    }

    filterByTerm(term) {
        this._labelComponents().forEach(component => component.filterByTerm(term));
    }

    reset() {
        this._labelComponents().forEach(component => component.reset());
    }
}
window.customElements.define(AppscoApplicationsLabels.is, AppscoApplicationsLabels);
