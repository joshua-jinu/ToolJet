import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useRouter from '@/_hooks/use-router';
import { ToolTip } from '@/_components/ToolTip';
import { Profile } from '@/_components/Profile';
import { NotificationCenter } from '@/_components/NotificationCenter';
import Logo from '@assets/images/rocket.svg';
import Header from '../Header';
import { authenticationService, auditLogsService } from '@/_services';
import config from 'config';

function Layout({ children, switchDarkMode, darkMode }) {
  const currentUser = authenticationService.currentUserValue;
  const router = useRouter();
  const navigate = useNavigate();

  function handleAuditLogClick() {
    auditLogsService.getLicenseTerms().then(() => navigate('/audit-logs'));
    document.activeElement.blur();
    return;
  }

  const canAnyGroupPerformAction = (action, permissions) => {
    if (!permissions) {
      return false;
    }

    return permissions.some((p) => p[action]);
  };

  const canCreateDataSource = () => {
    return canAnyGroupPerformAction('data_source_create', currentUser.group_permissions) || currentUser.super_admin;
  };

  const canUpdateDataSource = () => {
    return canAnyGroupPerformAction('update', currentUser.data_source_group_permissions) || currentUser.super_admin;
  };

  const marketplaceEnabled = config.ENABLE_MARKETPLACE_FEATURE === 'true';
  return (
    <div className="row m-auto">
      <div className="col-auto p-0">
        <aside
          className="left-sidebar p-2 h-100 position-fixed"
          style={{ width: 48, borderRight: !darkMode ? '1px solid #eee' : 'inherit' }}
        >
          <div className="application-brand" data-cy={`home-page-logo`}>
            <Link to="/">
              {window.public_config?.WHITE_LABEL_LOGO ? (
                <img src={window.public_config?.WHITE_LABEL_LOGO} height={26} />
              ) : (
                <Logo />
              )}
            </Link>
          </div>
          <hr style={{ margin: '0 -8px' }} />
          <div>
            <ul className="sidebar-inner nav nav-vertical">
              <li className="text-center mt-2 cursor-pointer">
                <Link to="/">
                  <ToolTip message="Dashboard" placement="right">
                    <svg
                      className="layout-sidebar-icon"
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      data-cy="dashboard-icon"
                    >
                      <rect width="32" height="32" rx="4" fill={router.pathname === '/' ? '#E6EDFE' : 'none'} />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M7 9C7 7.89543 7.89543 7 9 7H13C14.1046 7 15 7.89543 15 9V13C15 14.1046 14.1046 15 13 15H9C7.89543 15 7 14.1046 7 13V9ZM13 9H9V13H13V9ZM21 7C21.5523 7 22 7.44772 22 8V10H24C24.5523 10 25 10.4477 25 11C25 11.5523 24.5523 12 24 12H22V14C22 14.5523 21.5523 15 21 15C20.4477 15 20 14.5523 20 14V12H18C17.4477 12 17 11.5523 17 11C17 10.4477 17.4477 10 18 10H20V8C20 7.44772 20.4477 7 21 7ZM7 19C7 17.8954 7.89543 17 9 17H13C14.1046 17 15 17.8954 15 19V23C15 24.1046 14.1046 25 13 25H9C7.89543 25 7 24.1046 7 23V19ZM13 19H9V23H13V19ZM17 19C17 17.8954 17.8954 17 19 17H23C24.1046 17 25 17.8954 25 19V23C25 24.1046 24.1046 25 23 25H19C17.8954 25 17 24.1046 17 23V19ZM19 19V23H23V19H19Z"
                        fill={router.pathname === '/' ? '#3E63DD' : '#C1C8CD'}
                      />
                    </svg>
                  </ToolTip>
                </Link>
              </li>
              {window.public_config?.ENABLE_TOOLJET_DB == 'true' && currentUser?.admin && (
                <li className="text-center mt-3 cursor-pointer">
                  <Link to="/database">
                    <ToolTip message="Database" placement="right">
                      <svg
                        className="layout-sidebar-icon"
                        width="32"
                        height="33"
                        viewBox="0 0 32 33"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        data-cy="database-icon"
                      >
                        <rect
                          y="0.325684"
                          width="32"
                          height="32"
                          rx="4"
                          fill={router.pathname === '/database' ? '#E6EDFE' : '#none'}
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M10 9.32568C9.73478 9.32568 9.48043 9.43104 9.29289 9.61858C9.10536 9.80611 9 10.0605 9 10.3257V13.3257H13V9.32568H10ZM10 7.32568C9.20435 7.32568 8.44129 7.64175 7.87868 8.20436C7.31607 8.76697 7 9.53003 7 10.3257V16.3257C7 16.878 7.44772 17.3257 8 17.3257C8.55228 17.3257 9 16.878 9 16.3257V15.3257H13V16.3257C13 16.878 13.4477 17.3257 14 17.3257C14.5523 17.3257 15 16.878 15 16.3257V15.3257H23V22.3257C23 22.5909 22.8946 22.8453 22.7071 23.0328C22.5196 23.2203 22.2652 23.3257 22 23.3257H16C15.4477 23.3257 15 23.7734 15 24.3257C15 24.878 15.4477 25.3257 16 25.3257H22C22.7957 25.3257 23.5587 25.0096 24.1213 24.447C24.6839 23.8844 25 23.1213 25 22.3257V10.3257C25 9.53003 24.6839 8.76697 24.1213 8.20436C23.5587 7.64175 22.7957 7.32568 22 7.32568H10ZM15 9.32568V13.3257H23V10.3257C23 10.0605 22.8946 9.80611 22.7071 9.61858C22.5196 9.43104 22.2652 9.32568 22 9.32568H15ZM6 20.3257C6 19.2211 6.89543 18.3257 8 18.3257H12C13.1046 18.3257 14 19.2211 14 20.3257V24.3257C14 25.4303 13.1046 26.3257 12 26.3257H8C6.89543 26.3257 6 25.4303 6 24.3257V20.3257ZM8 20.3257V24.3257H12V20.3257H8Z"
                          fill={router.pathname === '/database' ? '#3E63DD' : '#C1C8CD'}
                        />
                      </svg>
                    </ToolTip>
                  </Link>
                </li>
              )}
              <li className="text-center mt-3 cursor-pointer">
                <Link to="/workspace-settings">
                  <ToolTip message="Workspace settings" placement="right">
                    <svg
                      className="layout-sidebar-icon"
                      width="32"
                      height="33"
                      viewBox="0 0 32 33"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      data-cy="workspace-settings-icon"
                    >
                      <rect
                        y="0.326172"
                        width="32"
                        height="32"
                        rx="4"
                        fill={router.pathname === '/workspace-settings' ? '#E6EDFE' : '#none'}
                      />
                      <g clipPath="url(#clip0_453_63684)">
                        <path
                          d="M16.0005 26.3262C14.7205 26.3262 13.6505 25.4862 13.3505 24.2462C13.2605 23.8562 12.8705 23.6262 12.4705 23.7162C12.4005 23.7362 12.3305 23.7662 12.2605 23.8062C11.1705 24.4762 9.82047 24.3062 8.92047 23.4062C8.01047 22.4962 7.85047 21.1562 8.52047 20.0662C8.62047 19.8962 8.65047 19.7062 8.60047 19.5162C8.55047 19.3262 8.44047 19.1662 8.27047 19.0662C8.21047 19.0262 8.14047 18.9962 8.06047 18.9762C6.82047 18.6762 5.98047 17.6062 5.98047 16.3262C5.98047 15.0462 6.82047 13.9762 8.06047 13.6762C8.45047 13.5862 8.69047 13.1862 8.59047 12.8062C8.57047 12.7362 8.54047 12.6662 8.50047 12.5962C7.83047 11.5062 7.99047 10.1562 8.90047 9.25617C9.81047 8.34617 11.1505 8.18617 12.2405 8.85617C12.4405 8.97617 12.6805 8.99617 12.8905 8.90617C13.1005 8.81617 13.2605 8.63617 13.3205 8.40617C13.6205 7.16617 14.6905 6.32617 15.9705 6.32617C17.2505 6.32617 18.3105 7.16617 18.6205 8.40617C18.7105 8.79617 19.1105 9.03617 19.4905 8.93617C19.5605 8.91617 19.6305 8.88617 19.7005 8.84617C20.8005 8.17617 22.1405 8.34617 23.0405 9.24617C23.9505 10.1562 24.1105 11.4962 23.4405 12.5862C23.3405 12.7562 23.3105 12.9462 23.3505 13.1362C23.3905 13.3262 23.5105 13.4862 23.6805 13.5862C23.7405 13.6262 23.8105 13.6562 23.8905 13.6662C25.1305 13.9662 25.9705 15.0362 25.9705 16.3162C25.9705 17.5962 25.1305 18.6562 23.8905 18.9662C23.5005 19.0562 23.2605 19.4562 23.3605 19.8362C23.3805 19.9062 23.4105 19.9762 23.4505 20.0462C24.1205 21.1362 23.9505 22.4862 23.0505 23.3862C22.1505 24.2862 20.8005 24.4562 19.7105 23.7862C19.5405 23.6862 19.3505 23.6562 19.1605 23.6962C18.9705 23.7362 18.8105 23.8562 18.7105 24.0262C18.6705 24.0962 18.6405 24.1562 18.6205 24.2362C18.3205 25.4762 17.2505 26.3162 15.9705 26.3162L16.0005 26.3262ZM12.6505 21.6962C13.8805 21.6962 15.0005 22.5362 15.3005 23.7762C15.4205 24.2862 15.8705 24.3262 16.0005 24.3262C16.1305 24.3262 16.5805 24.2862 16.7005 23.7762C16.7705 23.4962 16.8705 23.2362 17.0205 22.9962C17.4005 22.3762 17.9905 21.9362 18.7005 21.7662C19.4105 21.5962 20.1405 21.7062 20.7605 22.0862C21.2105 22.3562 21.5505 22.0762 21.6505 21.9762C21.7405 21.8862 22.0305 21.5362 21.7605 21.0862C21.6105 20.8462 21.5005 20.5862 21.4405 20.3062C21.0905 18.8462 21.9905 17.3762 23.4405 17.0162C23.9505 16.8962 23.9905 16.4462 23.9905 16.3162C23.9905 16.1862 23.9505 15.7362 23.4405 15.6162C23.1705 15.5462 22.9105 15.4462 22.6705 15.2962C22.0505 14.9162 21.6105 14.3162 21.4405 13.6162C21.2705 12.9062 21.3805 12.1762 21.7605 11.5562C22.0305 11.1062 21.7505 10.7662 21.6505 10.6662C21.5605 10.5762 21.2105 10.2862 20.7605 10.5562C20.5205 10.7062 20.2605 10.8162 19.9805 10.8762C18.5205 11.2262 17.0505 10.3262 16.6905 8.86617C16.5705 8.35617 16.1205 8.31617 15.9905 8.31617C15.8605 8.31617 15.4105 8.35617 15.2905 8.86617C15.0805 9.71617 14.5005 10.4062 13.6905 10.7362C12.8805 11.0762 11.9805 11.0062 11.2305 10.5462C10.7805 10.2762 10.4305 10.5562 10.3405 10.6562C10.2505 10.7462 9.96047 11.0962 10.2305 11.5462C10.3805 11.7862 10.4905 12.0462 10.5505 12.3262C10.9005 13.7862 10.0005 15.2662 8.54047 15.6162C8.03047 15.7362 7.99047 16.1862 7.99047 16.3162C7.99047 16.4462 8.03047 16.8962 8.54047 17.0162C8.82047 17.0862 9.08047 17.1962 9.32047 17.3362C10.6005 18.1162 11.0105 19.7962 10.2305 21.0762C9.96047 21.5262 10.2405 21.8662 10.3405 21.9662C10.4405 22.0662 10.7805 22.3462 11.2305 22.0762C11.4705 21.9262 11.7305 21.8162 12.0105 21.7562C12.2205 21.7062 12.4405 21.6762 12.6505 21.6762V21.6962Z"
                          fill={router.pathname === '/workspace-settings' ? '#3E63DD' : '#C1C8CD'}
                        />
                        <path
                          d="M16.0005 20.3262C13.7905 20.3262 12.0005 18.5362 12.0005 16.3262C12.0005 14.1162 13.7905 12.3262 16.0005 12.3262C18.2105 12.3262 20.0005 14.1162 20.0005 16.3262C20.0005 18.5362 18.2105 20.3262 16.0005 20.3262ZM16.0005 14.3262C14.9005 14.3262 14.0005 15.2262 14.0005 16.3262C14.0005 17.4262 14.9005 18.3262 16.0005 18.3262C17.1005 18.3262 18.0005 17.4262 18.0005 16.3262C18.0005 15.2262 17.1005 14.3262 16.0005 14.3262Z"
                          fill={router.pathname === '/workspace-settings' ? '#3E63DD' : '#C1C8CD'}
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_453_63684">
                          <rect width="20" height="20" fill="white" transform="translate(6 6.32617)" />
                        </clipPath>
                      </defs>
                    </svg>
                  </ToolTip>
                </Link>
              </li>
              {currentUser?.super_admin && (
                <li className="text-center mt-3 cursor-pointer">
                  <Link to="/instance-settings">
                    <ToolTip message="Instance settings" placement="right">
                      <svg
                        className="layout-sidebar-icon"
                        width="32"
                        height="33"
                        viewBox="0 0 32 33"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          y="0.326172"
                          width="32"
                          height="32"
                          rx="4"
                          fill={router.pathname === '/instance-settings' ? '#E6EDFE' : '#none'}
                        />
                        <g clipPath="url(#clip0_941_122397)">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M6 5C4.89543 5 4 5.89543 4 7V9C4 10.1046 4.89543 11 6 11H18C19.1046 11 20 10.1046 20 9V7C20 5.89543 19.1046 5 18 5H6ZM6 13C5.46957 13 4.96086 13.2107 4.58579 13.5858C4.21071 13.9609 4 14.4696 4 15V17C4 17.5304 4.21071 18.0391 4.58579 18.4142C4.96086 18.7893 5.46957 19 6 19H12C12.5523 19 13 19.4477 13 20C13 20.5523 12.5523 21 12 21H6C4.93913 21 3.92172 20.5786 3.17157 19.8284C2.42143 19.0783 2 18.0609 2 17V15C2 13.9391 2.42143 12.9217 3.17157 12.1716C3.23082 12.1123 3.29174 12.0551 3.35421 12C2.52377 11.2671 2 10.1947 2 9V7C2 4.79086 3.79086 3 6 3H18C20.2091 3 22 4.79086 22 7V9C22 11.2091 20.2091 13 18 13H6ZM7 7C7.55228 7 8 7.44772 8 8V8.01C8 8.56228 7.55228 9.01 7 9.01C6.44772 9.01 6 8.56228 6 8.01V8C6 7.44772 6.44772 7 7 7ZM18.001 13.5C18.5533 13.5 19.001 13.9477 19.001 14.5V15.1707C19.3521 15.2948 19.6732 15.4824 19.9505 15.7197L20.532 15.384C21.0103 15.1078 21.6219 15.2717 21.898 15.75C22.1742 16.2283 22.0103 16.8399 21.532 17.116L20.951 17.4515C20.9838 17.6293 21.001 17.8127 21.001 18C21.001 18.1872 20.9838 18.3705 20.951 18.5482L21.5327 18.8838C22.0111 19.1598 22.1752 19.7713 21.8992 20.2497C21.6232 20.7281 21.0117 20.8922 20.5333 20.6162L19.9507 20.2801C19.6734 20.5175 19.3522 20.7052 19.001 20.8293V21.5C19.001 22.0523 18.5533 22.5 18.001 22.5C17.4487 22.5 17.001 22.0523 17.001 21.5V20.8293C16.65 20.7052 16.3289 20.5177 16.0517 20.2804L15.4697 20.6162C14.9913 20.8922 14.3798 20.7281 14.1038 20.2497C13.8278 19.7713 13.9919 19.1598 14.4703 18.8838L15.0511 18.5487C15.0182 18.3708 15.001 18.1874 15.001 18C15.001 17.8126 15.0182 17.6292 15.0511 17.4513L14.4703 17.1162C13.9919 16.8402 13.8278 16.2287 14.1038 15.7503C14.3798 15.2719 14.9913 15.1078 15.4697 15.3838L16.0517 15.7196C16.3289 15.4823 16.65 15.2948 17.001 15.1707V14.5C17.001 13.9477 17.4487 13.5 18.001 13.5ZM17.1187 17.5289C17.1247 17.5193 17.1305 17.5096 17.1362 17.4997C17.1415 17.4905 17.1467 17.4812 17.1517 17.4718C17.3283 17.1885 17.6426 17 18.001 17C18.3661 17 18.6854 17.1956 18.86 17.4877C18.8623 17.4918 18.8646 17.4959 18.867 17.5C18.8695 17.5044 18.872 17.5087 18.8746 17.513C18.9551 17.6571 19.001 17.8232 19.001 18C19.001 18.1768 18.9551 18.3429 18.8746 18.487C18.872 18.4914 18.8694 18.4958 18.8668 18.5003C18.8645 18.5043 18.8622 18.5083 18.86 18.5123C18.6854 18.8044 18.3661 19 18.001 19C17.6426 19 17.3283 18.8115 17.1517 18.5282C17.1467 18.5188 17.1415 18.5095 17.1362 18.5003C17.1305 18.4904 17.1247 18.4807 17.1187 18.4711C17.0436 18.3307 17.001 18.1703 17.001 18C17.001 17.8297 17.0436 17.6693 17.1187 17.5289ZM7 15C7.55228 15 8 15.4477 8 16V16.01C8 16.5623 7.55228 17.01 7 17.01C6.44772 17.01 6 16.5623 6 16.01V16C6 15.4477 6.44772 15 7 15Z"
                            fill={router.pathname === '/instance-settings' ? '#3E63DD' : '#C1C8CD'}
                            transform="translate(4 4.32617)"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_453_63684">
                            <rect width="20" height="20" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </ToolTip>
                  </Link>
                </li>
              )}
              {(canUpdateDataSource() || canCreateDataSource() || currentUser?.admin || currentUser.super_admin) && (
                <li className="text-center mt-3 cursor-pointer">
                  <Link to="/global-datasources">
                    <ToolTip message="Global Datasources" placement="right">
                      <svg
                        className="layout-sidebar-icon"
                        width="32"
                        height="33"
                        viewBox="0 0 32 33"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          y="0.325684"
                          width="32"
                          height="32"
                          rx="4"
                          fill={router.pathname === '/global-datasources' ? '#E6EDFE' : '#none'}
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M9.29209 9.58052C9.01022 9.83042 9 9.97447 9 10C9 10.0255 9.01022 10.1696 9.29209 10.4195C9.57279 10.6683 10.036 10.9381 10.6943 11.185C12.0034 11.6759 13.879 12 16 12C18.121 12 19.9966 11.6759 21.3057 11.185C21.964 10.9381 22.4272 10.6683 22.7079 10.4195C22.9898 10.1696 23 10.0255 23 10C23 9.97447 22.9898 9.83042 22.7079 9.58052C22.4272 9.33166 21.964 9.06185 21.3057 8.81501C19.9966 8.32409 18.121 8 16 8C13.879 8 12.0034 8.32409 10.6943 8.81501C10.036 9.06185 9.57279 9.33166 9.29209 9.58052ZM23 12.6162C22.6909 12.7798 22.3574 12.9266 22.008 13.0576C20.4217 13.6525 18.2973 14 16 14C13.7027 14 11.5783 13.6525 9.99202 13.0576C9.64262 12.9266 9.3091 12.7798 9 12.6162V16C9 16.0187 9.00689 16.1594 9.28011 16.4067C9.55297 16.6538 10.0136 16.9298 10.6943 17.185C12.0524 17.6943 13.9615 18 16 18C18.0385 18 19.9476 17.6943 21.3057 17.185C21.9864 16.9298 22.447 16.6538 22.7199 16.4067C22.9931 16.1594 23 16.0187 23 16V12.6162ZM23 18.6158C22.6937 18.7782 22.3609 18.9253 22.008 19.0576C20.3656 19.6736 18.205 20 16 20C13.795 20 11.6344 19.6736 9.99202 19.0576C9.6391 18.9253 9.30634 18.7782 9 18.6158V22C9 22.0187 9.00689 22.1594 9.28011 22.4067C9.55297 22.6538 10.0136 22.9298 10.6943 23.185C12.0524 23.6943 13.9615 24 16 24C18.0385 24 19.9476 23.6943 21.3057 23.185C21.9864 22.9298 22.447 22.6538 22.7199 22.4067C22.9931 22.1594 23 22.0187 23 22V18.6158ZM25 22C25 22.777 24.5855 23.4156 24.0622 23.8894C23.5385 24.3634 22.8276 24.7503 22.008 25.0576C20.3656 25.6736 18.205 26 16 26C13.795 26 11.6344 25.6736 9.99202 25.0576C9.17237 24.7503 8.46146 24.3634 7.93782 23.8894C7.41454 23.4156 7 22.777 7 22V10C7 9.19711 7.43749 8.55194 7.96527 8.08401C8.49422 7.61504 9.20256 7.2384 9.99202 6.94235C11.5783 6.34749 13.7027 6 16 6C18.2973 6 20.4217 6.34749 22.008 6.94235C22.7974 7.2384 23.5058 7.61504 24.0347 8.08401C24.5625 8.55194 25 9.19711 25 10V22Z"
                          fill={router.pathname === '/global-datasources' ? '#3E63DD' : '#C1C8CD'}
                        />
                      </svg>
                    </ToolTip>
                  </Link>
                </li>
              )}
              {marketplaceEnabled && (
                <li className="text-center mt-3 d-flex flex-column">
                  <Link to="/integrations">
                    <ToolTip message="Marketplace (Beta)" placement="right">
                      <div
                        className="layout-sidebar-icon cursor-pointer"
                        style={{
                          width: '32px',
                          height: '33px',
                          padding: '4px 6px',
                          backgroundColor: router.pathname === '/integrations' ? '#E6EDFE' : '#none',
                          borderRadius: '4px',
                          marginLeft: '2px',
                        }}
                      >
                        <svg
                          width="auto"
                          height="auto"
                          viewBox="0 0 32 33"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            y="0.325684"
                            width="32"
                            height="33"
                            rx="4"
                            fill={router.pathname === '/integrations' ? '#E6EDFE' : '#none'}
                          />
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M1.62969 5.61618C2.77971 2.2981 5.61934 0 8.90009 0H23.1C26.3808 0 29.2204 2.2981 30.3703 5.61618L31.4989 8.87221C31.8601 9.91437 32.199 11.2583 31.8603 12.6375C31.4447 14.33 30.4545 15.8106 29.1062 16.732V25.6641C29.1062 29.7155 25.9046 33 21.955 33H10.0443C6.0949 33 2.89327 29.7155 2.89327 25.6641V16.7315C1.54526 15.8101 0.555389 14.3297 0.139727 12.6375C-0.199061 11.2583 0.13995 9.91437 0.501169 8.87219L1.62969 5.61618ZM5.2846 17.6707V25.6641C5.2846 28.3608 7.4156 30.5468 10.0443 30.5468H21.955C24.5839 30.5468 26.7149 28.3608 26.7149 25.6641V17.6709C26.4575 17.7075 26.1941 17.7266 25.9256 17.7266C23.8362 17.7266 22.0625 16.5866 20.9628 14.8887C19.8633 16.5866 18.0895 17.7266 16 17.7266C13.9106 17.7266 12.1368 16.5866 11.0372 14.8887C9.93758 16.5866 8.16383 17.7266 6.07436 17.7266C5.80578 17.7266 5.54226 17.7075 5.2846 17.6707ZM12.2329 10.7725C12.2329 13.3981 14.048 15.2735 16 15.2735C17.9521 15.2735 19.7671 13.3981 19.7671 10.7725C19.7671 10.095 20.3025 9.54589 20.9628 9.54589C21.6231 9.54589 22.1585 10.095 22.1585 10.7725C22.1585 13.3981 23.9737 15.2735 25.9256 15.2735C27.5508 15.2735 29.0597 13.9991 29.5415 12.0381C29.7011 11.3886 29.5678 10.6231 29.2457 9.69403L28.1172 6.438C27.2574 3.9574 25.2307 2.45316 23.1 2.45316H8.90009C6.7693 2.45316 4.7426 3.9574 3.88283 6.438L2.75431 9.69403C2.4323 10.6231 2.29904 11.3886 2.45859 12.0381C2.94028 13.9991 4.44929 15.2735 6.07436 15.2735C8.02641 15.2735 9.84152 13.3981 9.84152 10.7725C9.84152 10.095 10.3768 9.54589 11.0372 9.54589C11.6975 9.54589 12.2329 10.095 12.2329 10.7725ZM21.5079 23.5342C21.8321 24.1245 21.6287 24.8725 21.0535 25.2052C19.2402 26.254 17.6675 26.8874 16.0041 26.8907C14.3385 26.8939 12.7627 26.2654 10.942 25.2029C10.368 24.8679 10.1674 24.1191 10.4939 23.5302C10.8204 22.9414 11.5504 22.7357 12.1244 23.0706C13.8116 24.0551 14.9511 24.4395 15.9995 24.4375C17.0499 24.4354 18.19 24.0452 19.879 23.0683C20.4542 22.7355 21.1834 22.9442 21.5079 23.5342Z"
                            fill={router.pathname === '/integrations' ? '#3E63DD' : '#C1C8CD'}
                          />
                        </svg>
                      </div>
                    </ToolTip>
                  </Link>
                </li>
              )}
              <li className="m-auto">
                {currentUser?.admin && (
                  <ToolTip message="Audit Logs" placement="right">
                    <Link className="layout-sidebar-icon audit-logs-nav-item" onClick={handleAuditLogClick}>
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect
                          y="0.326172"
                          width="32"
                          height="32"
                          rx="4"
                          fill={router.pathname === '/audit-logs' ? '#E6EDFE' : '#none'}
                        />
                        <g clipPath="url(#clip0_453_63684)">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M11 9C10.7348 9 10.4804 9.10536 10.2929 9.29289C10.1054 9.48043 10 9.73478 10 10V22C10 22.2652 10.1054 22.5196 10.2929 22.7071C10.4804 22.8946 10.7348 23 11 23H13.615C14.1673 23 14.615 23.4477 14.615 24C14.615 24.5523 14.1673 25 13.615 25H11C10.2044 25 9.44129 24.6839 8.87868 24.1213C8.31607 23.5587 8 22.7956 8 22V10C8 9.20435 8.31607 8.44129 8.87868 7.87868C9.44129 7.31607 10.2044 7 11 7H19C19.7956 7 20.5587 7.31607 21.1213 7.87868C21.6839 8.44129 22 9.20435 22 10V18C22 18.5523 21.5523 19 21 19C20.4477 19 20 18.5523 20 18V10C20 9.73478 19.8946 9.48043 19.7071 9.29289C19.5196 9.10536 19.2652 9 19 9H11ZM12 12C12 11.4477 12.4477 11 13 11H17C17.5523 11 18 11.4477 18 12C18 12.5523 17.5523 13 17 13H13C12.4477 13 12 12.5523 12 12ZM12 16C12 15.4477 12.4477 15 13 15H15C15.5523 15 16 15.4477 16 16C16 16.5523 15.5523 17 15 17H13C12.4477 17 12 16.5523 12 16ZM24.7071 20.2929C25.0976 20.6834 25.0976 21.3166 24.7071 21.7071L20.7071 25.7071C20.3166 26.0976 19.6834 26.0976 19.2929 25.7071L17.2929 23.7071C16.9024 23.3166 16.9024 22.6834 17.2929 22.2929C17.6834 21.9024 18.3166 21.9024 18.7071 22.2929L20 23.5858L23.2929 20.2929C23.6834 19.9024 24.3166 19.9024 24.7071 20.2929Z"
                            fill={router.pathname === '/audit-logs' ? '#3E63DD' : '#C1C8CD'}
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_453_63684">
                            <rect width="20" height="20" fill="white" transform="translate(6 6.32617)" />
                          </clipPath>
                        </defs>
                      </svg>
                    </Link>
                  </ToolTip>
                )}
                <NotificationCenter darkMode={darkMode} />
                <Profile switchDarkMode={switchDarkMode} darkMode={darkMode} />
              </li>
            </ul>
          </div>
        </aside>
      </div>
      <div style={{ paddingLeft: 48 }} className="col">
        <Header />
        <div style={{ paddingTop: 48 }}>{children}</div>
      </div>
    </div>
  );
}

export default Layout;
