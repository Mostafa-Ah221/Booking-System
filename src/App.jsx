import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './Components/Layout/Layout';
import Home from './Components/Home/Home';
import PricingComponent from './Components/Pricing/PricingComponent';
import Setup_1 from './Components/Steps/Step_1';
import Setup_2 from './Components/Steps/Step_2';
import Setup_3 from './Components/Steps/Step_3';
import Setup_4 from './Components/Steps/Step_4';
import LayoutDashboard from './Components/Dashboard/LayoutDashboard';
import UserDashboard from './Components/Dashboard/Appointments/UserDashboard';
import Interviews from './Components/Dashboard/InterviewsPages/InterViewPage/Interviews';
import BookPage from './Components/Dashboard/BookingPage/BookPage';
import ProfilePage from './Components/Dashboard/Profile_Page/ProfilePage';
import AdminCenter from './Components/Settings/AdminCenter';
import SettingsLayout from './Components/Settings/settingsLayout';
import BasicInfo from './Components/Settings/Organization/Basic-Info';
import CreateInterviewModal from './Components/Dashboard/CreateNewInterview/CreateInterviewPage';
import CustomDomain from './Components/Settings/Organization/CustomDomain';
import Availability from './Components/Dashboard/Profile_Page/Availability';
import InterviewDetails from './Components/Dashboard/InterviewsPages/InterViewPage/InterviewDetails';
import InterviewLayut from './Components/Dashboard/InterviewsPages/InterviewLayut';
import SchedulingRules from './Components/Dashboard/InterviewsPages/InterViewPage/SchedulingRules';
import BookingForm from './Components/Dashboard/InterviewsPages/InterViewPage/BookingForm';
import RecruitersManag from './Components/Dashboard/InterviewsPages/InterViewPage/RecruitersManag';
import InterviewAvailability from './Components/Dashboard/InterviewsPages/InterViewPage/InterviewFolder/InterviewAvailability';
import EmailNotifications from './Components/Dashboard/InterviewsPages/InterViewPage/EmailNotifications';
import WorkspaceManag from './Components/Settings/Modules/WorkspacePages/WorkspaceManag';
import ResourcesSection from './Components/Settings/Modules/Resources/ResourcesSection';
import NotificationSettings from './Components/Settings/ProductCustom/NotificationSettings';
import CustomLabels from './Components/Settings/ProductCustom/CustomLabels';
import RolesPermissions from './Components/Settings/ProductCustom/RolesPermissions';
import Customers from './Components/Settings/Modules/Customers';
import Reports from './Components/Settings/Modules/Reports';
import InterviewFormOne from './Components/Dashboard/CreateNewInterview/InterviewFormOne';
import PrivacyAndSecurity from './Components/Settings/Administration/PrivacyAndSecurity';
import LayoutThemPanal from './Components/Dashboard/BookingPage/LayoutThems/LayoutThemPanal';
import AllLayout from './Components/Dashboard/BookingPage/LayoutWorkspaceTheme/LayoutShapes/AllLayout';
import PersonLocation from './Components/Settings/Modules/PersonLocation';
import IntegrationsPage from './Components/Settings/Integration/IntegrationPage';
import AcountProfile from './Components/MyAcount/pagesAcount/AcountProfile';
import LayoutAcount from './Components/MyAcount/LayoutAcount';
import ExportData from './Components/Settings/Administration/ExportData';
import SecuritySetting from './Components/MyAcount/pagesAcount/SecuritySetting';
import NewGroups from './Components/MyAcount/pagesAcount/NewGroups';
import Signup from './Components/Auth/Signup/Signup';
import Login from './Components/Auth/Login/Login';
import Verify from './Components/Auth/Signup/Verify';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';
import ForgetPassword from './Components/Auth/ForgetPassword/ForgetPassword';
import AppointmentBooking from './Components/embeded/AppointmentBooking';
import { Toaster } from 'react-hot-toast';
import Analytics from './Components/Dashboard/Analytics/Analytics';
import ResetPassword from './Components/Auth/ForgetPassword/ResetPassword';
import AppointmentConfirmation from './Components/embeded/AppointmentConfirmation';
import BookingSummary from './Components/embeded/BookingSummary';

const router = createBrowserRouter([
  
  { path: "share/:id", element: <AppointmentBooking />, },
  { path: "share/:id/appointmentConfirmation", element: <AppointmentConfirmation /> },
  { path: "share/:id/appointmentConfirmation/summary", element: <BookingSummary /> },
  { path: "setup_1", element: <Setup_1 /> },
  { path: "signup", element: <Signup /> },
  { path: "login", element: <Login /> },
  { path: "/forget-password", element: <ForgetPassword /> },
  { path: "/reset-password", element: <ResetPassword /> },
  { path: "/verify", element: <Verify /> },
  { path: "/bookPage/themes-and-layout", element: <LayoutThemPanal /> },
  { path: "/bookPage/workspace-themes", element: <AllLayout /> },
  { path: "/create_interview", element: <CreateInterviewModal />,
    children: [
    { path: "InterFormOne", element: <InterviewFormOne /> },
    ]
  },
       {
        path: "/layoutDashboard",
        element:<ProtectedRoute><LayoutDashboard /></ProtectedRoute> ,
        children: [
            { index: true, element: <Analytics /> }, 
            { path: "userDashboard", element: <UserDashboard /> },
            { path: "interviews", element: <Interviews /> },
            { path: "bookPage", element: <BookPage /> },
            { path: "profilepage", element: <ProfilePage /> },            
            { path: "analytics", element: <Analytics /> },            
        ],
      },
      {
        path: "/setting",
        element: <ProtectedRoute><SettingsLayout /></ProtectedRoute>,
        children: [
          { path: "", element: <AdminCenter /> }, 
          { path: "basic-info", element: <BasicInfo /> },
          { path: "business-hours", element: <Availability />},
          { path: "custom-domain", element: <CustomDomain /> },
          { path: "workspaces", element: <WorkspaceManag /> },
          { path: "resources-section", element: <ResourcesSection /> },
          { path: "person-location", element: <PersonLocation /> },
          { path: "notification-settings", element: <NotificationSettings /> },
          { path: "custom-labels", element: <CustomLabels /> },
          { path: "roles-permissions", element: <RolesPermissions /> },
          { path: "customers", element: <Customers /> },
          { path: "reports", element: <Reports /> },
          { path: "privacy-and-security", element: <PrivacyAndSecurity /> },
          { path: "export-data", element: <ExportData /> },
          { path: "integrations-page", element: <IntegrationsPage /> },
        ],
      },
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> }, 
      { path: "/pricing", element:<PricingComponent />  },
    ],
  },
    { path: "/interview-layout/:id", element:<ProtectedRoute><InterviewLayut /></ProtectedRoute> ,
        children: [
          { index: true, element: <ProtectedRoute><InterviewDetails /></ProtectedRoute> },
          { path: "scheduling-rules", element:<ProtectedRoute><SchedulingRules /></ProtectedRoute>  },
          { path: "recruiters-managment", element: <ProtectedRoute><RecruitersManag /></ProtectedRoute> },
          { path: "interview-availability", element:<ProtectedRoute><InterviewAvailability /></ProtectedRoute>  },
          { path: "email-notifications/:type", element: <ProtectedRoute><EmailNotifications /></ProtectedRoute> },
          // { path: "booking-form", element: <BookingForm /> },
        ]
       },
       { path: "/layoutAcount", element: <LayoutAcount />, 
        children: [
          { path: "acount-profile", element: <AcountProfile /> },
          { path: "security-setting", element: <SecuritySetting /> },
          { path: "newGroups", element: <NewGroups /> },
        ]
       },
]);

function App() {
  return( 
    <>
    <Toaster position="top-center" reverseOrder={false} />
    <RouterProvider router={router} />
    
    </>
)
}

export default App;
