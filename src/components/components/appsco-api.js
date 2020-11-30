import '@polymer/polymer/polymer-legacy.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class AppscoApi extends PolymerElement {
    static get template() {
        return html``;
    }

    static get is() { return 'appsco-api'; }

    static get properties() {
        return {
            domain: {
                type: String,
                value: "https://appsco.com",
                reflectToAttribute: true
            },

            index: {
                type: String,
                value: ''
            },

            me: {
                type: String,
                computed: '_me(index, domain)'
            },

            dashboards: {
                type: String,
                computed: '_dashboards(index, domain)'
            },

            applicationTemplates: {
                type: String,
                computed: '_applicationTemplates(index, domain)'
            },

            link: {
                type: String,
                computed: '_link(index, domain)'
            },

            item: {
                type: String,
                computed: '_item(index, domain)'
            },

            notifications: {
                type: String,
                computed: '_notifications(index, domain)'
            },

            checkNewNotifications: {
                type: String,
                computed: '_checkNewNotifications(index, domain)'
            },

            notificationsSeen: {
                type: String,
                computed: '_notificationsSeen(index, domain)'
            },

            accounts: {
                type: String,
                computed: '_accounts(index, domain)'
            },

            icons: {
                type: String,
                computed: '_icons(index, domain)'
            },

            personalItems: {
                type: String,
                computed: '_personalItems(index, domain)'
            },

            personalItemsWithoutFolder: {
                type: String,
                computed: '_computePersonalItemsWithoutFolder(foldersApi)'
            },

            sharedWithMeItems: {
                type: String,
                computed: '_sharedWithMeItems(index, domain)'
            },

            logout: {
                type: String,
                computed: '_logout(index, domain)'
            },

            authorizedApps: {
                type: String,
                computed: '_authorizedApps(index, domain)'
            },

            twoFA: {
                type: String,
                computed: '_twoFA(index, domain)'
            },

            twoFAQr: {
                type: String,
                computed: '_twoFAQr(index, domain)'
            },

            twoFACodes: {
                type: String,
                computed: '_twoFACodes(index, domain)'
            },

            transferToken: {
                type: String,
                computed: '_transferToken(index, domain)'
            },

            changePassword: {
                type: String,
                computed: '_changePassword(index, domain)'
            },

            removeAccount: {
                type: String,
                computed: '_removeAccount(index, domain)'
            },

            accountLog: {
                type: String,
                computed: '_accountLog(index, domain)'
            },

            partner: {
                type: String,
                computed: '_partner(index, domain)'
            },

            profileImage: {
                type: String,
                computed: '_profileImage(index, domain)'
            },

            companies: {
                type: String,
                computed: '_companies(index, domain)'
            },

            upgradeToBusiness: {
                type: String,
                computed: '_upgradeToBusiness(index, domain)'
            },

            companiesAccountIsContactInApi: {
                type: String,
                computed: '_computeCompaniesAccountIsContactInApi(me)'
            },

            isUserLoggedInApi: {
                type: String,
                computed: '_computeIsUserLoggedInApi(me)'
            },

            isUserPassing2FAVerificationApi: {
                type: String,
                computed: '_computeIsUserPassing2FAVerificationApi(me)'
            },

            loginURL: {
                type: String,
                computed: '_computeLoginURL(index, domain)'
            },

            registerBusinessURL: {
                type: String,
                computed: '_computeRegisterBusinessURL(index, domain)'
            },

            setupTwoFAURL: {
                type: String,
                computed: '_computeSetupTwoFAURL(index, domain)'
            },

            saveClientDataApi: {
                type: String,
                computed: '_computeSaveClientDataApi(me)'
            },

            partners: {
                type: String,
                computed: '_computePartners(index, domain)'
            },

            foldersApi: {
                type: String,
                computed: '_computeFoldersApi(index, domain)'
            },

            getUserPrivilegesApi: {
                type: String,
                computed: '_computeGetUserPrivilegesApi(me)'
            },

            tutorialsApi: {
                type: String,
                computed: '_computeTutorialsApi(me)'
            },

            pageConfigApi: {
                type: String,
                computed: '_computePageConfigApi(me)'
            },

            name: {
                type: Object,
                value: function () {
                    return {
                        me: this.me,
                        dashboards: this.dashboards,
                        applicationTemplates: this.applicationTemplates,
                        link: this.link,
                        item: this.item,
                        notifications: this.notifications,
                        checkNewNotifications: this.checkNewNotifications,
                        notificationsSeen: this.notificationsSeen,
                        accounts: this.accounts,
                        icons: this.icons,
                        personalItems: this.personalItems,
                        personalItemsWithoutFolder: this.personalItemsWithoutFolder,
                        sharedWithMeItems: this.sharedWithMeItems,
                        logout: this.logout,
                        authorizedApps: this.authorizedApps,
                        twoFA: this.twoFA,
                        twoFAQr: this.twoFAQr,
                        twoFACodes: this.twoFACodes,
                        transferToken: this.transferToken,
                        changePassword: this.changePassword,
                        removeAccount: this.removeAccountApi,
                        accountLog: this.accountLog,
                        partner: this.partner,
                        profileImage: this.profileImage,
                        companies: this.companies,
                        upgradeToBusiness: this.upgradeToBusiness,
                        companiesAccountIsContactInApi: this.companiesAccountIsContactInApi,
                        isUserLoggedInApi: this.isUserLoggedInApi,
                        isUserPassing2FAVerificationApi: this.isUserPassing2FAVerificationApi,
                        loginURL: this.loginURL,
                        registerBusinessURL: this.registerBusinessURL,
                        setupTwoFAURL: this.setupTwoFAURL,
                        saveClientDataApi: this.saveClientDataApi,
                        partners: this.partners,
                        foldersApi: this.foldersApi,
                        getUserPrivilegesApi: this.getUserPrivilegesApi,
                        tutorialsApi: this.tutorialsApi,
                        pageConfigApi: this.pageConfigApi
                    }
                },
                notify: true
            }
        };
    }

    ready() {
        super.ready();

        this.name = {
            me: this.me,
            dashboards: this.dashboards,
            applicationTemplates: this.applicationTemplates,
            link: this.link,
            item: this.item,
            notifications: this.notifications,
            checkNewNotifications: this.checkNewNotifications,
            notificationsSeen: this.notificationsSeen,
            accounts: this.accounts,
            icons: this.icons,
            personalItems: this.personalItems,
            personalItemsWithoutFolder: this.personalItemsWithoutFolder,
            sharedWithMeItems: this.sharedWithMeItems,
            logout: this.logout,
            authorizedApps: this.authorizedApps,
            twoFA: this.twoFA,
            twoFAQr: this.twoFAQr,
            twoFACodes: this.twoFACodes,
            transferToken: this.transferToken,
            changePassword: this.changePassword,
            removeAccount: this.removeAccount,
            accountLog: this.accountLog,
            partner: this.partner,
            profileImage: this.profileImage,
            companies: this.companies,
            upgradeToBusiness: this.upgradeToBusiness,
            companiesAccountIsContactInApi: this.companiesAccountIsContactInApi,
            isUserLoggedInApi: this.isUserLoggedInApi,
            isUserPassing2FAVerificationApi: this.isUserPassing2FAVerificationApi,
            loginURL: this.loginURL,
            registerBusinessURL: this.registerBusinessURL,
            setupTwoFAURL: this.setupTwoFAURL,
            saveClientDataApi: this.saveClientDataApi,
            partners: this.partners,
            foldersApi: this.foldersApi,
            getUserPrivilegesApi: this.getUserPrivilegesApi,
            tutorialsApi: this.tutorialsApi,
            pageConfigApi: this.pageConfigApi
        };
    }

    _computeOrigin(domain, index) {
        return domain+'/'+(index == '' ? '' : index + '/' )+'api/v2';
    }

    _me(index, domain) {
        return this._computeOrigin(domain, index)+'/me';
    }

    _dashboards(index, domain) {
        return this._computeOrigin(domain, index)+'/dashboards';
    }

    _computePersonalItemsWithoutFolder(foldersApi) {
        return foldersApi+'/personal-icons';
    }

    _applicationTemplates(index, domain) {
        return this._computeOrigin(domain, index)+'/applications';
    }

    _link(index, domain) {
        return this._computeOrigin(domain, index)+'/applications/link';
    }

    _item(index, domain) {
        return this._computeOrigin(domain, index)+'/applications/item';
    }

    _notifications(index, domain) {
        return this._computeOrigin(domain, index)+'/notifications';
    }

    _checkNewNotifications(index, domain) {
        return this._computeOrigin(domain, index)+'/notifications/new-notifications';
    }

    _notificationsSeen(index, domain) {
        return this._computeOrigin(domain, index)+'/me/notifications-seen';
    }

    _accounts(index, domain) {
        return this._computeOrigin(domain, index)+'/accounts';
    }

    _icons(index, domain) {
        return this._computeOrigin(domain, index)+'/me/icons';
    }

    _personalItems(index, domain) {
        return this._computeOrigin(domain, index) + '/me/icons/personal';
    }

    _sharedWithMeItems(index, domain) {
        return this._computeOrigin(domain, index) + '/me/icons/no-personal-dashboard-group-shared-with-me';
    }

    _logout(index, domain) {
        return domain + '/' + (index == '' ? '' : index + '/' ) + 'logout';
    }

    _authorizedApps(index, domain) {
        return this._computeOrigin(domain, index) + '/me/authorized-apps';
    }

    _twoFA(index, domain) {
        return this._computeOrigin(domain, index) + '/me/2fa';
    }

    _twoFAQr(index, domain) {
        return this._computeOrigin(domain, index) + '/me/2fa/qr';
    }

    _twoFACodes(index, domain) {
        return this._computeOrigin(domain, index) + '/me/2fa/codes';
    }

    _transferToken(index, domain) {
        return this._computeOrigin(domain, index) + '/me/transfer-token';
    }

    _changePassword(index, domain) {
        return this._computeOrigin(domain, index) + '/me/change-password';
    }

    _removeAccount(index, domain) {
        return this._computeOrigin(domain, index) + '/accounts/remove';
    }

    _accountLog(index, domain) {
        return this._computeOrigin(domain, index) + '/me/log';
    }

    _partner(index, domain) {
        return this._computeOrigin(domain, index) + '/me/partner';
    }

    _profileImage(index, domain) {
        return this._computeOrigin(domain, index) + '/me/profile-image';
    }

    _companies(index, domain) {
        return this._computeOrigin(domain, index) + '/companies';
    }

    _upgradeToBusiness(index, domain) {
        return this._computeOrigin(domain, index) + '/company';
    }

    _computeCompaniesAccountIsContactInApi(me) {
        return me ? (me + '/contact/companies?extended=1') : null;
    }

    _computeIsUserLoggedInApi(me) {
        return me ? (me + '/is-logged-in') : null;
    }

    _computeIsUserPassing2FAVerificationApi(me) {
        return me ? (me + '/is-passing-2fa-verification') : null;
    }

    _computeLoginURL(index, domain) {
        return domain ? (domain + '/' + (index == '' ? '' : index + '/' ) + 'login') : null;
    }

    _computeRegisterBusinessURL(index, domain) {
        return domain ? (domain + '/' + (index === '' ? '' : index + '/' ) + 'login/register_business') : null;
    }

    _computeSetupTwoFAURL(index, domain) {
        return domain ? (domain + '/' + (index == '' ? '' : index + '/' ) + 'force/configure-2fa') : null;
    }

    _computeSaveClientDataApi(me) {
        return me ? (me + '/byod/register') : null;
    }

    _computePartners(index, domain) {
        return this._computeOrigin(domain, index) + '/partners';
    }

    _computeFoldersApi(index, domain) {
        return this._computeOrigin(domain, index) + '/dashboard-groups';
    }

    _computeGetUserPrivilegesApi(me) {
        return me ? (me + '/acl') : null;
    }

    _computeTutorialsApi(me) {
        return me ? (me + '/tutorial') : null;
    }

    _computePageConfigApi(me) {
        return me ? (me + '/page-config') : null;
    }
}
window.customElements.define(AppscoApi.is, AppscoApi);
