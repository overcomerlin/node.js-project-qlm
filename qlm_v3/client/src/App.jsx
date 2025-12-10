import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { lazy, Suspense, useEffect } from "react";
import Navigation from "./navigation/navigation";
import Footer from "./footer/footer";
import HomePage from "./main/homePage";
import {
  Routes,
  Route,
  BrowserRouter,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { loadingData } from "./config";
import { AuthProvider, useAuth } from "./utils/authContext";
import ProtectedRoute from "./utils/protectedRoute";
import { LanguageProvider } from "./main/utils/LanguageContext";

// Lazy load the page components
const CrtfIssue = lazy(() => import("./main/crtfIssue"));
const CrtfRenew = lazy(() => import("./main/crtfRenew"));
const CrtfReplace = lazy(() => import("./main/crtfReplace"));
const LoginPage = lazy(() => import("./main/loginPage"));
const CrtfPrintTune = lazy(() => import("./main/crtfPrintTune"));
const UserData = lazy(() => import("./main/userData"));
const FunctionSwitch = lazy(() => import("./main/functionSwitch"));
const NewUser = lazy(() => import("./main/newUser"));
const NewCompany = lazy(() => import("./main/newCompany"));
const PublishStatistic = lazy(() => import("./main/publishStatistic"));
const VehicleSearch = lazy(() => import("./main/vehicleSearch"));
const PrintCrtfSn = lazy(() => import("./main/printCrtfSn"));
const DataImport = lazy(() => import("./main/dataImport"));
const BatchPrint = lazy(() => import("./main/batchPrint"));

function AppContent() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 當使用者登入且仍在登入頁面時，將他們導向首頁
    if (isLoggedIn && location.pathname === "/login") {
      navigate("/", { replace: true });
    }
  }, [isLoggedIn, location, navigate]);

  return (
    <>
      <Navigation />
      <Suspense
        fallback={
          <div>
            <h3>{loadingData}</h3>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/issue"
            element={
              <ProtectedRoute>
                <CrtfIssue />
              </ProtectedRoute>
            }
          />
          <Route
            path="/renew"
            element={
              <ProtectedRoute>
                <CrtfRenew />
              </ProtectedRoute>
            }
          />
          <Route
            path="/replace"
            element={
              <ProtectedRoute>
                <CrtfReplace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/print-tune"
            element={
              <ProtectedRoute>
                <CrtfPrintTune />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-data"
            element={
              <ProtectedRoute>
                <UserData />
              </ProtectedRoute>
            }
          />
          <Route
            path="/func-switch"
            element={
              <ProtectedRoute>
                <FunctionSwitch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/new-user"
            element={
              <ProtectedRoute>
                <NewUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/new-company"
            element={
              <ProtectedRoute>
                <NewCompany />
              </ProtectedRoute>
            }
          />
          <Route
            path="/publish-statistic"
            element={
              <ProtectedRoute>
                <PublishStatistic />
              </ProtectedRoute>
            }
          />
          <Route
            path="/veh-search"
            element={
              <ProtectedRoute>
                <VehicleSearch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/print-crtf-sn"
            element={
              <ProtectedRoute>
                <PrintCrtfSn />
              </ProtectedRoute>
            }
          />
          <Route
            path="/data-import"
            element={
              <ProtectedRoute>
                <DataImport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/batch-print"
            element={
              <ProtectedRoute>
                <BatchPrint />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Suspense>
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </AuthProvider>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick={true}
        pauseOnHover={true}
        draggable={true}
        theme="colored"
        style={{ zIndex: 99999 }}
      />
    </BrowserRouter>
  );
}

export default App;
