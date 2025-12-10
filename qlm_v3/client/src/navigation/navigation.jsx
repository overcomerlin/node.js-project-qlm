import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBIcon,
  MDBCollapse,
  MDBNavbarNav,
  MDBBadge,
  MDBBtn,
} from "mdb-react-ui-kit";
import logo from "../assets/demo.png";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import ModuleItem from "./moduleItem";
import DropdownItem from "./dropdownItem";
import { useAuth } from "../utils/authContext";
import {
  adminManagmentPageTitle,
  batchPrintPageTitle,
  dataImportPageTitle,
  funcSwitchPageTitle,
  getText,
  issuePageTitle,
  newCompanyPageTitle,
  newUserPageTitle,
  printCrtfSnPageTitle,
  printTunePageTitle,
  publishStatisticPageTitle,
  renewPageTitle,
  replacePageTitle,
  statisticsPageTitle,
  userDataPageTitle,
  userManagmentPageTitle,
  vehSearchPageTitle,
} from "../config";
import { useModuleFieldsQuery } from "../main/dataAccess/useModuleFieldsQuery";
import ReturnLoadingError from "../main/utils/returnLoadingError";
import { useLanguage } from "../main/utils/LanguageContext";

export default function Navigation() {
  const { language } = useLanguage();
  const [openBasic, setOpenBasic] = useState(false);
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  const {
    data: moduleFields,
    isLoading: isModuleFieldsLoading,
    isError: isModuleFieldsError,
    error: moduleFieldsError,
  } = useModuleFieldsQuery(user);

  if (isModuleFieldsLoading || isModuleFieldsError) {
    return (
      <ReturnLoadingError
        isLoading={isModuleFieldsLoading}
        isError={isModuleFieldsError}
        error={moduleFieldsError}
      />
    );
  }

  const logoutHandler = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <MDBNavbar expand="xl" light bgColor="info" className="sticky-top">
      <MDBContainer fluid>
        <MDBNavbarBrand tag={NavLink} to="/">
          <div className="d-flex flex-column align-items-center">
            <img src={logo} height="40" alt="Logo of Jasslin" loading="lazy" />
            <p className="fs-4 fw-light fst-italic">
              {getText(language, "APP_TITLE")}
            </p>
          </div>
        </MDBNavbarBrand>
        <MDBNavbarToggler
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={() => setOpenBasic(!openBasic)}
        >
          <MDBIcon fas icon="bars" />
        </MDBNavbarToggler>
        <MDBCollapse navbar open={openBasic}>
          {isLoggedIn && moduleFields && (
            <MDBNavbarNav className="mx-4 mb-2 mb-lg-0">
              {moduleFields.ISSUE && (
                <ModuleItem
                  to="/issue"
                  color="dark"
                  itemText={issuePageTitle}
                />
              )}
              {moduleFields.RENEW && (
                <ModuleItem
                  to="/renew"
                  color="dark"
                  itemText={renewPageTitle}
                />
              )}
              {moduleFields.REPLACE && (
                <ModuleItem
                  to="/replace"
                  color="dark"
                  itemText={replacePageTitle}
                />
              )}
              {moduleFields.PRINT_TUNE && (
                <ModuleItem
                  to="/print-tune"
                  color="dark"
                  itemText={printTunePageTitle}
                />
              )}
              {moduleFields.STATISTICS && (
                <ModuleItem
                  to="/statistics"
                  color="dark"
                  itemText={statisticsPageTitle}
                />
              )}
              {moduleFields.USER_MANAGMENT_OPEN && (
                <DropdownItem
                  itemText={userManagmentPageTitle}
                  userData={
                    moduleFields.USER_MANAGMENT.USER_DATA
                      ? {
                          addr: "/user-data",
                          dropdownItemText: userDataPageTitle,
                        }
                      : null
                  }
                  funcTune={
                    moduleFields.USER_MANAGMENT.FUNC_TUNE
                      ? {
                          addr: "/func-switch",
                          dropdownItemText: funcSwitchPageTitle,
                        }
                      : null
                  }
                  newUser={
                    moduleFields.USER_MANAGMENT.NEW_USER
                      ? {
                          addr: "/new-user",
                          dropdownItemText: newUserPageTitle,
                        }
                      : null
                  }
                  newCompany={
                    moduleFields.USER_MANAGMENT.NEW_COMPANY
                      ? {
                          addr: "/new-company",
                          dropdownItemText: newCompanyPageTitle,
                        }
                      : null
                  }
                />
              )}
              {moduleFields.ADMIN_MANAGMENT_OPEN && (
                <DropdownItem
                  itemText={adminManagmentPageTitle}
                  printCrtfSN={
                    moduleFields.ADMIN_MANAGMENT.PRINT_CRTF_SN
                      ? {
                          addr: "/print-crtf-sn",
                          dropdownItemText: printCrtfSnPageTitle,
                        }
                      : null
                  }
                  publishStatistic={
                    moduleFields.ADMIN_MANAGMENT.PUBLISH_STATISTIC
                      ? {
                          addr: "/publish-statistic",
                          dropdownItemText: publishStatisticPageTitle,
                        }
                      : null
                  }
                  vehSearch={
                    moduleFields.ADMIN_MANAGMENT.VEH_SEARCH
                      ? {
                          addr: "/veh-search",
                          dropdownItemText: vehSearchPageTitle,
                        }
                      : null
                  }
                  dataImport={
                    moduleFields.ADMIN_MANAGMENT.DATA_IMPORT
                      ? {
                          addr: "/data-import",
                          dropdownItemText: dataImportPageTitle,
                        }
                      : null
                  }
                  batchPrint={
                    moduleFields.ADMIN_MANAGMENT.BATCH_PRINT
                      ? {
                          addr: "/batch-print",
                          dropdownItemText: batchPrintPageTitle,
                        }
                      : null
                  }
                />
              )}
            </MDBNavbarNav>
          )}
        </MDBCollapse>
        <div className="d-flex align-items-end">
          {isLoggedIn ? (
            <div className="d-flex flex-column align-items-center">
              <MDBBadge className="mx-2 mb-3" color="info" light>
                {user?.username}
              </MDBBadge>
              <MDBBtn onClick={logoutHandler} color="danger" className="fs-6">
                登出
              </MDBBtn>
            </div>
          ) : (
            <div className="d-flex flex-column align-items-center">
              <MDBBadge className="mx-2 mb-3" color="info" light>
                未知使用者
              </MDBBadge>
              <ModuleItem to="/login" itemText="登入" />
            </div>
          )}
        </div>
      </MDBContainer>
    </MDBNavbar>
  );
}
