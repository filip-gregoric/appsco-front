import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-material/paper-material.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-image/iron-image.js';
import '@google-web-components/google-chart';
import { IronResizableBehavior } from '@polymer/iron-resizable-behavior/iron-resizable-behavior.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import './components/page/appsco-content.js';
import './components/page/appsco-page-styles.js';
import './components/components/appsco-loader.js';
import '@polymer/paper-progress/paper-progress.js';
import './lib/mixins/appsco-page-mixin.js';
import './lib/mixins/appsco-headers-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
class AppscoStatisticsPage extends mixinBehaviors([
    IronResizableBehavior,
    Appsco.HeadersMixin,
    Appsco.PageMixin
], PolymerElement) {
    static get template() {
        return html`
        <style include="appsco-page-styles">
            :host {
                --chart-background-color: #ffffff;

                --chart-container-width: {
                    width: 50%;
                };
            }
            .one-chart {
                @apply --layout-horizontal;
            }
            .two-charts {
                @apply --layout-horizontal;
            }
            .one-chart .chart-container {
                width: 100%;
                @apply --layout-flex;
                position: relative;
            }
            .two-charts .chart-container {
                width: var(--chart-container-width);
                @apply --layout-flex;
                position: relative;
            }
            google-chart {
                height: 300px;
                width: 100%;
                padding: 0 10px;
                margin-bottom: 20px;
                box-sizing: border-box;
            }
            .chart-h-380 {
                height: 380px;
            }
            .two-fa-chart {
                max-width: 1000px;
            }
            .title-h2 {
                margin: 10px 0 20px 0;
                font-weight: 500;
                text-align: center;
            }
            .title-h3 {
                font-weight: 400;
                text-align: center;
            }
            .no-data-info google-chart {
                opacity: 0.2;
            }
            .chart-info,
            .filter {
                padding: 20px 10px 0;
                margin: 0 10px;
                background-color: var(--chart-background-color);
            }
            .chart-info-no-chart {
                padding-bottom: 20px;
            }
            .chart-info .info {
                margin-top: 10px;
                margin-bottom: 0;
            }
            .chart-info .info-tip {
                color: var(--secondary-text-color);
                font-style: italic;
            }
            .info {
                @apply --info-message;
                text-align: center;
            }
            paper-dropdown-menu {
                --paper-input-container: {
                    padding-bottom: 0;
                };
                --paper-input-container-input: {
                    font-size: 14px;
                    cursor: pointer;
                };
            }
            paper-item {
                min-height: initial;
                padding: 8px 10px;
                line-height: 18px;
            }
            :host paper-item:hover {
                @apply --paper-item-hover;
            }
            .filter {
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --layout-end-justified;
                padding-bottom: 20px;
                position: relative;
                box-sizing: border-box;
            }
            :host([medium-screen]) .two-charts {
                @apply --layout-horizontal;
                width: 100%;
            }
            :host([medium-screen]) .chart-container {
                @apply --layout-flex;
            }
            :host([tablet-screen]) .two-charts {
                @apply --layout-vertical;
                width: 100%;
            }
            :host([tablet-screen]) .chart-container {
                @apply --layout-flex;
                width: 100%;
            }

        </style>

        <iron-ajax id="applicationSecurityAjax" auto="" url="[[ _applicationSecurityApi ]]" handle-as="json" headers="[[ _headers ]]" on-response="_handleApplicationSecurityResponse" on-error="_handleApplicationSecurityError"></iron-ajax>

        <iron-ajax id="userSecurityAjax" auto="" url="[[ _userSecurityApi ]]" handle-as="json" headers="[[ _headers ]]" on-response="_handleUserPasswordsScoresResponse" on-error="_handleUserPasswordsScoresError"></iron-ajax>

        <iron-ajax id="loginAttemptsAjax" auto="" method="POST" url="[[ _loginAttemptsApi ]]" handle-as="json" headers="[[ _headers ]]" on-response="_handleLoginAttemptsResponse" on-error="_handleLoginAttemptsError"></iron-ajax>

        <iron-ajax id="twoFaAjax" auto="" url="[[ _twoFaApi ]]" handle-as="json" headers="[[ _headers ]]" on-response="_handleTwoFaResponse" on-error="_handleTwoFaError"></iron-ajax>

        <iron-ajax id="licenceAjax" auto="" url="[[ _licenceApi ]]" handle-as="json" headers="[[ _headers ]]" on-response="_handleLicencesResponse" on-error="_handleLicencesError"></iron-ajax>

        <iron-media-query query="(max-width: 1200px)" query-matches="{{ mediumScreen }}"></iron-media-query>
        <iron-media-query query="(max-width: 800px)" query-matches="{{ tabletScreen }}"></iron-media-query>

        <appsco-content id="appscoContent">

            <div content="" slot="content">

                <div class="one-chart">

                    <div class="chart-container">
                        <template is="dom-if" if="[[ _showLoginAttemptsExampleChart ]]">
                            <div class="no-data-info">
                                <h2 class="title-h2">Application usage</h2>
                                <p class="info">
                                    [[ _loginAttemptsMessage ]]
                                </p>

                                <h3 class="title-h3">Example:</h3>
                                <google-chart id="loginAttemptsChartExample" class="chart-h-380" type="line"></google-chart>
                            </div>
                        </template>

                        <appsco-loader multi-color="" active="[[ _loginAttemptsChartLoader ]]"></appsco-loader>

                        <template is="dom-if" if="[[ !_showLoginAttemptsExampleChart ]]">
                            <h2 class="title-h2">Application usage</h2>

                            <template is="dom-if" if="[[ _loginAttemptsMessage ]]">
                                <div class="chart-info">
                                    <p class="info">
                                        [[ _loginAttemptsMessage ]]
                                    </p>
                                </div>
                            </template>

                            <template is="dom-if" if="[[ !_loginAttemptsMessage ]]">
                                <div class="chart-info">
                                    <p class="info">
                                        Displays login attempts for top five most used applications in the past 30 days.
                                    </p>
                                    <p class="info info-tip">
                                        * Hover over application's peak to see corresponding values.
                                    </p>
                                </div>
                            </template>

                            <div class="filter">
                                <paper-dropdown-menu horizontal-align="right" label="Filter by account type" on-iron-activate="_onFilterApplicationUsageByAccountTypeAction">
                                    <paper-listbox id="filterList" class="dropdown-content" attr-for-selected="value" selected="[[ _filterAccountType ]]" slot="dropdown-content">
                                        <template is="dom-repeat" items="[[ _accountTypeList ]]">
                                            <paper-item value\$="[[ item.value ]]" name\$="[[ item.name ]]">
                                                [[ item.name ]]
                                            </paper-item>
                                        </template>
                                    </paper-listbox>
                                </paper-dropdown-menu>
                            </div>

                            <template is="dom-if" if="[[ !_loginAttemptsMessage ]]">
                                <google-chart id="loginAttemptsChart" class="chart-h-380" type="line" on-google-chart-ready="_onLoginAttemptsChartReady"></google-chart>
                            </template>
                        </template>
                    </div>

                </div>

                <div class="two-charts">
                    <div class="chart-container">
                        <template is="dom-if" if="[[ _applicationSecurityMessage ]]">
                            <div class="no-data-info">
                                <h2 class="title-h2">Resource security</h2>
                                <p class="info">
                                    [[ _applicationSecurityMessage ]]
                                </p>

                                <h3 class="title-h3">Example:</h3>
                                <google-chart id="applicationSecurityChartExample" class="chart-h-380" type="column"></google-chart>
                            </div>
                        </template>

                        <template is="dom-if" if="[[ !_applicationSecurityMessage ]]">
                            <appsco-loader multi-color="" active="[[ _applicationSecurityChartLoader ]]"></appsco-loader>

                            <h2 class="title-h2">Resources security</h2>
                            <div class="chart-info">
                                <p class="info">
                                    Displays average security score for configured resources and number of configured instances for each resource.
                                </p>
                                <p class="info info-tip">
                                    * Hover over chart bar to see corresponding value.
                                </p>
                            </div>
                            <google-chart id="applicationSecurityChart" class="chart-h-380" type="column" on-google-chart-ready="_onApplicationSecurityChartReady"></google-chart>
                        </template>
                    </div>

                    <div class="chart-container">
                        <template is="dom-if" if="[[ _userSecurityMessage ]]">
                            <div class="no-data-info">
                                <h2 class="title-h2">User security</h2>
                                <p class="info">
                                    [[ _userSecurityMessage ]]
                                </p>

                                <h3 class="title-h3">Example:</h3>
                                <google-chart id="userSecurityChartExample" class="chart-h-380" type="column"></google-chart>
                            </div>
                        </template>

                        <appsco-loader multi-color="" active="[[ _userSecurityChartLoader ]]"></appsco-loader>

                        <template is="dom-if" if="[[ !_userSecurityMessage ]]">
                            <h2 class="title-h2">User security</h2>
                            <div class="chart-info">
                                <p class="info">
                                    Displays average security score for users and number of configured resources for each user.
                                </p>
                                <p class="info info-tip">
                                    * Hover over chart bar to see corresponding value.
                                </p>
                            </div>
                            <google-chart id="userSecurityChart" class="chart-h-380" type="column" on-google-chart-ready="_onUserSecurityChartReady"></google-chart>
                        </template>
                    </div>
                </div>

                <div class="two-charts">
                    <div class="chart-container">
                        <template is="dom-if" if="[[ _twoFaMessage ]]">
                            <div class="no-data-info">
                                <h2 class="title-h2">Two-factor authentication</h2>
                                <p class="info">
                                    [[ _twoFaMessage ]]
                                </p>

                                <h3 class="title-h3">Example:</h3>
                                <google-chart id="twoFaChartExample" class="chart-h-380 two-fa-chart" type="pie"></google-chart>
                            </div>
                        </template>

                        <appsco-loader multi-color="" active="[[ _twoFaChartLoader ]]"></appsco-loader>

                        <template is="dom-if" if="[[ _twoFaInfo ]]">
                            <h2 class="title-h2">Two-factor authentication</h2>
                            <div class="chart-info chart-info-no-chart">
                                <p class="info">[[ _twoFaInfo ]]</p>
                                <p class="info">Total users: [[ _twoFaTotal ]].</p>
                            </div>
                        </template>

                        <template is="dom-if" if="[[ !_twoFaInfo ]]">
                            <template is="dom-if" if="[[ !_twoFaMessage ]]">
                                <h2 class="title-h2">Two-factor authentication</h2>
                                <div class="chart-info">
                                    <p class="info">
                                        Displays two-factor authentication statistics for users.
                                    </p>
                                    <p class="info info-tip">
                                        * Hover over pie chart slice to see corresponding value.
                                    </p>
                                </div>

                                <google-chart id="twoFaChart" class="chart-h-380 two-fa-chart" type="pie" on-google-chart-ready="_onTwoFaChartReady"></google-chart>
                            </template>
                        </template>
                    </div>

                    <div class="chart-container">
                        <template is="dom-if" if="[[ _licenceMessage ]]">
                            <div class="no-data-info">
                                <h2 class="title-h2">AppsCo licences</h2>
                                <p class="info">
                                    [[ _licenceMessage ]]
                                </p>

                                <h3 class="title-h3">Example:</h3>
                                <google-chart id="licenceChartExample" class="chart-h-380 two-fa-chart" type="pie"></google-chart>
                            </div>
                        </template>

                        <appsco-loader multi-color="" active="[[ _licenceChartLoader ]]"></appsco-loader>

                        <template is="dom-if" if="[[ !_licenceMessage ]]">
                            <h2 class="title-h2">AppsCo licences</h2>
                            <div class="chart-info">
                                <p class="info">
                                    Displays used and unused AppsCo licences ratio.
                                </p>
                                <p class="info info-tip">
                                    * Hover over pie chart slice to see corresponding value.
                                </p>
                            </div>
                            <google-chart id="licenceChart" class="chart-h-380 two-fa-chart" type="pie" on-google-chart-ready="_onLicenceChartReady"></google-chart>
                        </template>
                    </div>
                </div>

            </div>
        </appsco-content>
`;
    }

    static get is() { return 'appsco-statistics-page'; }

    static get properties() {
        return {
            companyApi: {
                type: String
            },

            _applicationSecurityApi: {
                type: String,
                computed: '_computeApplicationSecurityApi(companyApi)'
            },

            _applicationSecurityChartLoader: {
                type: Boolean,
                value: true
            },

            _applicationSecurityMessage: {
                type: String,
                value: ''
            },

            _userSecurityApi: {
                type: String,
                computed: '_computeUserSecurityApi(companyApi)'
            },

            _userSecurityChartLoader: {
                type: Boolean,
                value: true
            },

            _userSecurityMessage: {
                type: String,
                value: ''
            },

            _loginAttemptsApi: {
                type: String,
                computed: '_computeLoginAttemptsApi(companyApi, _filterAccountType)'
            },

            _loginAttemptsChartLoader: {
                type: Boolean,
                value: true
            },

            _loginAttemptsMessage: {
                type: String,
                value: ''
            },

            _showLoginAttemptsExampleChart: {
                type: Boolean,
                value: false
            },

            _accountTypeList: {
                type: Array,
                value: function () {
                    return [
                        {
                            name: 'All',
                            value: 'all'
                        },
                        {
                            name: 'Users',
                            value: 'roles'
                        },
                        {
                            name: 'Contacts',
                            value: 'contacts'
                        }];
                }
            },

            _filterAccountType: {
                type: String,
                value: 'all'
            },

            _twoFaApi: {
                type: String,
                computed: '_computeTwoFaApi(companyApi)'
            },

            _twoFaChartLoader: {
                type: Boolean,
                value: true
            },

            _twoFaInfo: {
                type: String,
                value: ''
            },

            _twoFaTotal: {
                type: Number,
                value: 0
            },

            _twoFaMessage: {
                type: String,
                value: ''
            },

            _licenceApi: {
                type: String,
                computed: '_computeLicenceApi(companyApi)'
            },

            _licenceChartLoader: {
                type: Boolean,
                value: true
            },

            _licenceMessage: {
                type: String,
                value: ''
            },

            mediumScreen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            tabletScreen: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },

            pageLoaded: {
                type: Boolean,
                value: false
            }
        };
    }

    static get observers() {
        return [
            '_updateScreen(mediumScreen)'
        ];
    }

    ready() {
        super.ready();

        this.pageLoaded = false;
        afterNextRender(this, function() {
            this._pageLoaded();
            this._addListeners();
        });
    }

    _addListeners() {
        this.addEventListener('iron-resize', this._onIronResize);
    }

    initializePage() {
        this.reloadStatistics();
    }

    resetPage() {
        this._filterAccountType = 'all';
    }

    _updateScreen() {
        this.updateStyles();
    }

    _computeApplicationSecurityApi(companyApi) {
        return companyApi ? companyApi + '/statistics/application-security' : null;
    }

    _computeUserSecurityApi(companyApi) {
        return companyApi ? companyApi + '/statistics/user-password-scores' : null;
    }

    _computeLoginAttemptsApi(companyApi, filterAccountType) {
        return companyApi ?
            ((companyApi + '/statistics/login-attempts') +
                (filterAccountType ? ('?type=' + filterAccountType) : ''))
            : null;
    }

    _computeTwoFaApi(companyApi) {
        return companyApi ? companyApi + '/statistics/twofa' : null;
    }

    _computeLicenceApi(companyApi) {
        return companyApi ? companyApi + '/statistics/licences' : null;
    }

    _pageLoaded() {
        this.pageLoaded = true;
        this.dispatchEvent(new CustomEvent('page-loaded', { bubbles: true, composed: true }));
    }

    _showLoader(loader) {
        this.set(loader, true);
    }

    _hideLoader(loader) {
        this.set(loader, false);
    }

    _onIronResize () {
        var charts = dom(this.root).querySelectorAll('google-chart');

        this.updateStyles({'--chart-container-width': '50%;'});

        charts.forEach(function(chart, index) {
            chart.redraw();
        });
    }

    _onFilterApplicationUsageByAccountTypeAction(event) {
        event.stopPropagation();
        this._showLoader('_loginAttemptsChartLoader');
        this._filterAccountType = event.detail.item.getAttribute('value');
    }

    reloadStatistics() {
        this._showLoader('_applicationSecurityChartLoader');
        this.$.applicationSecurityAjax.generateRequest();

        this._showLoader('_userSecurityChartLoader');
        this.$.userSecurityAjax.generateRequest();

        this._showLoader('_loginAttemptsChartLoader');
        this.$.loginAttemptsAjax.generateRequest();

        this._showLoader('_twoFaChartLoader');
        this.$.twoFaAjax.generateRequest();

        this._showLoader('_licenceChartLoader');
        this.$.licenceAjax.generateRequest();
    }

    _handleApplicationSecurityResponse(event) {
        var response = event.detail.response,
            chartOptions = {
                titlePosition: 'none',
                backgroundColor: this.getComputedStyleValue('--chart-background-color'),
                hAxis: {
                    title: 'Resource',
                    textStyle: {
                        color: this.getComputedStyleValue('--primary-text-color')
                    }
                },
                vAxis: {
                    title: 'Security score (%)',
                    textStyle: {
                        color: this.getComputedStyleValue('--primary-text-color')
                    },
                    viewWindowMode: 'explicit',
                    viewWindow: {
                        min: 0,
                        max: 100
                    },
                    gridlines: {
                        count: 10
                    }
                },
                animation: {
                    startup: 'true',
                    duration: 600,
                    easing: 'in'
                }
            },
            chart = this.shadowRoot.getElementById('applicationSecurityChart'),
            dataApplications = ['Resource', 'Resource score', 'Configured instances'];

        if (null == response || (response && !response.length)) {
            this._applicationSecurityMessage = 'There are no configured resources. Please configure some in order to create statistics.';

            setTimeout(function() {
                var exampleChart = this.shadowRoot.getElementById('applicationSecurityChartExample');

                exampleChart.options = chartOptions;
                exampleChart.data = [
                    dataApplications,
                    ['Facebook', 56, 5],
                    ['Twitter', 89, 12]
                ];
            }.bind(this), 1000);

            this._hideLoader('_applicationSecurityChartLoader');
            return false;
        }

        if (response && response.length > 0) {
            this._applicationSecurityMessage = '';

            chart.options = chartOptions;
            chart.data = [dataApplications];

            if (response) {
                var length = response.length;

                response = response.reverse();

                for (var i = 0; i < length; i++) {
                    var record = response[i],
                        data = [];

                    if ( chart.data.length < 11) {
                        data.push(record.application.title);
                        data.push(record.report.score);
                        data.push(record.report.info.configured);
                        chart.data.push(data);
                    }
                }
            }
        }
    }

    _handleApplicationSecurityError(event) {
        this._applicationSecurityMessage = 'We couldn\'t load statistics at the moment. Please try again later.';
        this._hideLoader('_applicationSecurityChartLoader');
    }

    _onApplicationSecurityChartReady() {
        this._hideLoader('_applicationSecurityChartLoader');
    }

    _handleUserPasswordsScoresResponse(event) {
        var response = event.detail.response,
            chartOptions = {
                titlePosition: 'none',
                backgroundColor: this.getComputedStyleValue('--chart-background-color'),
                hAxis: {
                    title: 'User',
                    textStyle: {
                        color: this.getComputedStyleValue('--primary-text-color')
                    }
                },
                vAxis: {
                    title: 'Security score (%)',
                    textStyle: {
                        color: this.getComputedStyleValue('--primary-text-color')
                    },
                    viewWindowMode: 'explicit',
                    viewWindow: {
                        min: 0,
                        max: 100
                    },
                    gridlines: {
                        count: 10
                    }
                },
                animation: {
                    startup: 'true',
                    duration: 600,
                    easing: 'in'
                }
            },
            chart = this.shadowRoot.getElementById('userSecurityChart'),
            dataUsers = ['User', 'Overall score', 'Number of configured resources'];

        if (null == response || (response && !response.length)) {
            this._userSecurityMessage = 'There is no users in company!';

            setTimeout(function() {
                this._showExampleUserSecurityChart(chartOptions, dataUsers);
            }.bind(this), 1000);

            this._hideLoader('_userSecurityChartLoader');
            return false;
        }

        if (response && response.length > 0) {
            var length = response.length,
                scoresExist = false,
                isScoreGreaterThanZero = false;

            this._userSecurityMessage = '';
            chart.options = chartOptions;
            chart.data = [dataUsers];

            for (var i = 0; i < length; i++) {
                var record = response[i],
                    applicationScores = record.application_scores,
                    scoresLength = record.application_scores.length,
                    score = 0,
                    data = [];

                if (scoresLength > 0) {
                    scoresExist = true;

                    for (var j = 0; j < scoresLength; j++) {
                        score += applicationScores[j].score;
                    }

                    if (0 != score && chart.data.length < 11) {
                        isScoreGreaterThanZero = true;
                        data.push(record.user.name, (scoresLength > 0) ? (score / scoresLength) : 0, scoresLength);
                        chart.data.push(data);
                    }
                }
            }

            if (!scoresExist) {
                this._userSecurityMessage = 'No resources have been assigned to users or resources are not configured. Please assign some resources to users and configure them or invite users to configure them.';

                setTimeout(function() {
                    this._showExampleUserSecurityChart(chartOptions, dataUsers);
                }.bind(this), 1000);

                this._hideLoader('_userSecurityChartLoader');
                return false;
            } else if (!isScoreGreaterThanZero) {
                this._userSecurityMessage = 'There is no resources with security score greater than zero.';

                setTimeout(function() {
                    this._showExampleUserSecurityChart(chartOptions, dataUsers);
                }.bind(this), 1000);

                this._hideLoader('_userSecurityChartLoader');
                return false;
            }
        }
    }

    /**
     * Shows default user security chart in case there is no resources or resources are not configured
     *
     * @param {Object} chartOptions
     * @param {Array} dataUsers
     * @private
     */
    _showExampleUserSecurityChart(chartOptions, dataUsers) {
        var exampleChart = this.shadowRoot.getElementById('userSecurityChartExample');

        exampleChart.options = chartOptions;
        exampleChart.data = [
            dataUsers,
            ['John Doe', 56, 12],
            ['Jane Jonson', 93, 6]
        ];
    }

    _handleUserPasswordsScoresError(event) {
        this._userSecurityMessage = 'We couldn\'t load statistics at the moment. Please try again later.';
        this._hideLoader('_userSecurityChartLoader');
    }

    _onUserSecurityChartReady() {
        this._hideLoader('_userSecurityChartLoader');
    }

    _drawLoginAttemptsExampleChart(options) {
        var exampleChart = this.shadowRoot.getElementById('loginAttemptsChartExample'),
            chartOptions = options ? options : {
                titlePosition: 'none',
                hAxis: {
                    title: 'Last 30 days',
                    textStyle: {
                        color: this.getComputedStyleValue('--primary-text-color')
                    },
                    viewWindowMode: 'explicit',
                    viewWindow: {
                        min: 0,
                        max: 30
                    },
                    gridlines: {
                        count: 30
                    }
                },
                vAxis: {
                    title: 'Login attempts',
                    textStyle: {
                        color: this.getComputedStyleValue('--primary-text-color')
                    },
                    format: '0'
                },
                backgroundColor: this.getComputedStyleValue('--chart-background-color'),
                animation: {
                    startup: 'true',
                    duration: 600,
                    easing: 'in'
                },
                focusTarget: 'category'
            },
            currentDate = new Date(),
            year = currentDate.getFullYear(),
            month = currentDate.getMonth(),
            day = currentDate.getDate();

        if (!exampleChart) {
            return false;
        }

        exampleChart.options = chartOptions;
        exampleChart.data = [
            ['Day in month', 'Facebook', 'Twitter']
        ];

        for (var i = 0; i < 30; i++){
            var date = new Date(year, month, day - i),
                chartDay = date.toLocaleDateString('en', { month: 'short', day: 'numeric' });

            exampleChart.data.push([chartDay, Math.floor(Math.random() * 21), Math.floor(Math.random() * 21)]);
        }
    }

    _handleLoginAttemptsResponse(event) {
        var response = event.detail.response,
            chartOptions = {
                titlePosition: 'none',
                hAxis: {
                    title: 'Last 30 days',
                    textStyle: {
                        color: this.getComputedStyleValue('--primary-text-color')
                    },
                    viewWindowMode: 'explicit',
                    viewWindow: {
                        min: 0,
                        max: 30
                    },
                    gridlines: {
                        count: 30
                    }
                },
                vAxis: {
                    title: 'Login attempts',
                    textStyle: {
                        color: this.getComputedStyleValue('--primary-text-color')
                    },
                    format: '0'
                },
                backgroundColor: this.getComputedStyleValue('--chart-background-color'),
                animation: {
                    startup: 'true',
                    duration: 600,
                    easing: 'in'
                },
                focusTarget: 'category'
            },
            chart = this.shadowRoot.getElementById('loginAttemptsChart'),
            length = response ? response.length : 0,
            chartApplications = ['Day in month'],
            innerData = [];

        if (response && !length) {

            switch (this._filterAccountType) {
                case 'all':
                    this._loginAttemptsMessage = 'There are no login actions attempted.';
                    break;

                case 'roles':
                    this._loginAttemptsMessage = 'There are no login actions attempted by users.';
                    break;

                case 'contacts':
                    this._loginAttemptsMessage = 'There are no login actions attempted by contacts.';
                    break;

                default:
                    this._loginAttemptsMessage = 'There are no login actions attempted. Please invite users and contacts to try some applications login.';

                    return false;
            }

            this._showLoginAttemptsExampleChart = true;
            setTimeout(function() {
                this._drawLoginAttemptsExampleChart(chartOptions);
                this._hideLoader('_loginAttemptsChartLoader');
            }.bind(this), 1000);
        }

        if (response && length > 0) {
            this._loginAttemptsMessage = '';
            this._showLoginAttemptsExampleChart = false;

            chart.options = chartOptions;

            for (var i = 0; i < length; i++) {
                var record = response[i],
                    date = new Date(record.created_at.date),
                    date = date.toLocaleDateString('en', { month: 'short', day: 'numeric' });

                if (chartApplications.indexOf(record.data.application.title) == -1) {
                    chartApplications.push(record.data.application.title);
                }

                if (!innerData[date]) {
                    innerData[date] = [];
                }

                innerData[date][record.data.application.title] =
                    !innerData[date][record.data.application.title] ?
                        1 :
                        (innerData[date][record.data.application.title] + 1);
            }

            chart.data = [chartApplications];

            for (var i = 29; i >= 0; i--) {
                var date = new Date(),
                    chartData = [];

                date.setDate(date.getDate() - i);
                date = date.toLocaleDateString('en', { month: 'short', day: 'numeric' });

                chartData.push(date);

                if (!innerData[date]) {
                    innerData[date] = [];
                }

                for (var j = 1; j < chartApplications.length; j++) {
                    innerData[date][chartApplications[j]] = !innerData[date][chartApplications[j]] ? 0 : innerData[date][chartApplications[j]];
                    chartData.push(innerData[date][chartApplications[j]]);
                }

                chart.data.push(chartData);
            }
        }
    }

    _handleLoginAttemptsError(event) {
        this._loginAttemptsMessage = 'We couldn\'t load statistics at the moment. Please try again later.';
        this._showLoginAttemptsExampleChart = true;
        this._drawLoginAttemptsExampleChart();
        this._hideLoader('_loginAttemptsChartLoader');
    }

    _onLoginAttemptsChartReady() {
        this._hideLoader('_loginAttemptsChartLoader');
    }

    _handleTwoFaResponse(event) {
        var response = event.detail.response,
            chartOptions = {
                titleTextStyle: {
                    color: this.getComputedStyleValue('--primary-text-color'),
                    bold: false
                },
                backgroundColor: this.getComputedStyleValue('--chart-background-color'),
                animation: {
                    startup: 'true',
                    duration: 600,
                    easing: 'in'
                },
                slices: {
                    0: {
                        color: this.getComputedStyleValue('--success-color')
                    },
                    1: {
                        color: this.getComputedStyleValue('--app-danger-color')
                    }
                }
            },
            chart = this.shadowRoot.getElementById('twoFaChart');

        this._twoFaMessage = '';
        this._twoFaInfo = '';

        for (let key in response) {

            if (response) {

                this._twoFaTotal = response.active + response.inactive;

                if (0 == response.active) {
//                            chartOptions.pieSliceText = 'value';
                    this._twoFaInfo = 'None of the users activated two-factor authentication.';
                    this._hideLoader('_twoFaChartLoader');
                    return false;
                }

                chartOptions.title = 'Total users: ' + this._twoFaTotal;
                chart.options = chartOptions;

                chart.data = [
                    ['Data type', 'Count'],
                    ['Two-factor authentication active', response.active],
                    ['Two-factor authentication inactive', response.inactive]

                ];
            }

            return false;
        }

        this._twoFaMessage = 'There are no users added to the company. Please add some in order to create statistics.';

        setTimeout(function() {
            var exampleChart = this.shadowRoot.getElementById('twoFaChartExample');

            chartOptions.title = 'Total users: 25';
            exampleChart.options = chartOptions;
            exampleChart.data = [
                ['Data type', 'Count'],
                ['Two-factor authentication active', 15],
                ['Two-factor authentication inactive', 10]
            ];
        }.bind(this), 1000);

        this._hideLoader('_twoFaChartLoader');
    }

    _handleTwoFaError(event) {
        this._twoFaMessage = 'We couldn\'t load statistics at the moment. Please try again later.';
        this._hideLoader('_twoFaChartLoader');
    }

    _onTwoFaChartReady() {
        this._hideLoader('_twoFaChartLoader');
    }

    _handleLicencesResponse(event) {
        var response = event.detail.response,
            chartOptions = {
                titleTextStyle: {
                    color: this.getComputedStyleValue('--primary-text-color'),
                    bold: false
                },
                backgroundColor: this.getComputedStyleValue('--chart-background-color'),
                animation: {
                    startup: 'true',
                    duration: 600,
                    easing: 'in'
                },
                slices: {
                    0: {
                        color: this.getComputedStyleValue('--success-color')
                    },
                    1: {
                        color: this.getComputedStyleValue('--app-danger-color')
                    },
                    2: {
                        color: '#279FBC'
                    }
                }
            },
            chart = this.shadowRoot.getElementById('licenceChart');

        for (let key in response) {
            this._licenceMessage = '';

            if (response) {

                chartOptions.title = 'Total licences: ' + response.appscoLicences + '\nActive users: ' + response.active_users;
                chart.options = chartOptions;

                chart.data = [
                    ['Data type', 'Count'],
                    ['Used licences', response.currentLicences],
                    ['Unused licences', response.appscoLicences - response.currentLicences]
                ];
            }

            return false;
        }

        this._licenceMessage = 'There are no data related to AppsCo licences. Statistics will be created when you create subscription plan.';

        setTimeout(function() {
            var exampleChart = this.shadowRoot.getElementById('licenceChartExample');

            chartOptions.title = 'Total licences: ' + 10 + '\nActive users: ' + 5;
            exampleChart.options = chartOptions;

            exampleChart.data = [
                ['Data type', 'Count'],
                ['Used licences', 8],
                ['Unused licences', 2]
            ];
        }.bind(this), 1000);

        this._hideLoader('_licenceChartLoader');
    }

    _handleLicencesError(event) {
        this._licenceMessage = 'We couldn\'t load statistics at the moment. Please try again later.';
        this._hideLoader('_licenceChartLoader');
    }

    _onLicenceChartReady() {
        this._hideLoader('_licenceChartLoader');
    }
}
window.customElements.define(AppscoStatisticsPage.is, AppscoStatisticsPage);
