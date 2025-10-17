import { createBrowserRouter , RouterProvider } from 'react-router-dom';
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
import Recruiters from './Components/Settings/Organization/Recruiters/Recruiters';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getPermissions } from './redux/apiCalls/PermissionsCallApi';
import PermissionRoute from './Components/ProtectedRoute/PermissionRoute';
import AppointmentHandler from './Components/pages/AppointmentHandler';
import { fetchProfileData } from './redux/apiCalls/ProfileCallApi';
import VerifyForm from './Components/pages/VerifyForm';
import VerifyRoute from './Components/pages/VerifyRoute';
import SMSNotificationsSection from './Components/Dashboard/InterviewsPages/InterViewPage/SmsNotification';
import UnifiedNotifications from './Components/Dashboard/InterviewsPages/InterViewPage/EmailNotifications';
import Webinars from './Components/Webinars/Webinars';
import FeaturesView from './Components/Features/FeaturesView';
import StaffComp from './Components/Dashboard/StaffPages/StaffComp';
import LayoutDetails from './Components/Dashboard/StaffPages/Staff_Details/layoutDetails';
import WorkspaceDetails from './Components/Dashboard/Workspace/WorkspaceDetails';
import AssignStaffToIntVw from './Components/Dashboard/InterviewsPages/InterViewPage/AssignStaffToIntVw';
import StaffDashboardLayout from './Components/Staff_Dashboard/Staff_DashboardLayout';
import StaffAppointments from './Components/Staff_Dashboard/StaffAppointments';
import StaffProfile from './Components/Staff_Dashboard/StaffProfile';
import Staff_Interview from './Components/Staff_Dashboard/Staff_Interview';
import NotFound from './Components/ProtectedRoute/NotFound';

const router = createBrowserRouter ([
    { path: "/verifyNotification", element: <VerifyForm /> },
  {
    path: "manage",
    element: (
      <VerifyRoute>
        <AppointmentHandler />
      </VerifyRoute>
    ),
  },
  { path: "/:id", element: <AppointmentBooking /> },
  { path: "/Admin/:idAdmin", element: <AppointmentBooking /> },
  { path: "/Staff/:idCustomer", element: <AppointmentBooking /> },
  { path: "/Space/:idSpace", element: <AppointmentBooking /> },

   { 
    path: "/:id/appointmentConfirmation", 
    element: <AppointmentConfirmation /> 
  },
  { 
    path: "/:id/appointmentConfirmation/summary", 
    element: <BookingSummary /> 
  },

  // Admin routes
  { 
    path: "/Admin/:idAdmin/appointmentConfirmation", 
    element: <AppointmentConfirmation /> 
  },
  { 
    path: "/Admin/:idAdmin/appointmentConfirmation/summary", 
    element: <BookingSummary /> 
  },

  // Staff routes
  { 
    path: "/Staff/:idCustomer/appointmentConfirmation", 
    element: <AppointmentConfirmation /> 
  },
  { 
    path: "/Staff/:idCustomer/appointmentConfirmation/summary", 
    element: <BookingSummary /> 
  },

  // Space routes
  { 
    path: "/Space/:idSpace/appointmentConfirmation", 
    element: <AppointmentConfirmation /> 
  },
  { 
    path: "/Space/:idSpace/appointmentConfirmation/summary", 
    element: <BookingSummary /> 
  },
  { path: "setup_1", element: <ProtectedRoute><Setup_1 /></ProtectedRoute> },
  { path: "signup", element: <Signup /> },
  { path: "login", element: <Login /> },
  { path: "/forget-password", element: <ForgetPassword /> },
  { path: "/reset-password", element: <ResetPassword /> },
  { path: "/verify", element: <Verify /> },
  { path: "/bookPage/themes-and-layout", element: <ProtectedRoute><LayoutThemPanal /></ProtectedRoute> },
  { path: "/bookPage/workspace-themes", element:<ProtectedRoute><AllLayout /></ProtectedRoute>  },
 {
  path: "/create_interview",
  element: (
    <ProtectedRoute>
      <PermissionRoute permission="create interview">
        <CreateInterviewModal />
      </PermissionRoute>
    </ProtectedRoute>
  ),
  children: [
    {
      path: "InterFormOne",
      element: (
        <PermissionRoute permission="create interview">
          <InterviewFormOne />
        </PermissionRoute>
      )
    }
  ]
},
       {
        path: "/layoutDashboard",
        element:<ProtectedRoute><LayoutDashboard /></ProtectedRoute> ,
        children: [
            { index: true, element: <Analytics /> }, 
            { path: "userDashboard", element:(<PermissionRoute permission="view appointment"><UserDashboard /></PermissionRoute>)  },
            { path: "interviews", element:( <PermissionRoute permission="view interview"><Interviews /></PermissionRoute>)  },
            { path: "bookPage", element: <BookPage /> },
            { path: "profilepage", element: <ProfilePage /> },            
            { path: "analytics", element:<Analytics />  },            
            { path: "WorkspaceAvailability", element:<WorkspaceDetails />  },            
            {path: "recruiterPage", element: <StaffComp />},
            {path: "recruiter/:id",  element: <LayoutDetails />},
            
            // Settings as nested route under layoutDashboard
            {
              path: "/layoutDashboard/setting",
              element: <SettingsLayout />,
              children: [
                { index: true, element: <AdminCenter /> }, 
                { path: "basic-info", element: <BasicInfo /> },
                { path: "business-hours", element: <Availability />},
                { path: "users", element:(<PermissionRoute permission="view staff"><Recruiters /></PermissionRoute>) },
                { path: "custom-domain", element: <CustomDomain /> },
                { path: "workspaces", element: <WorkspaceManag /> },
                { path: "resources-section", element: <ResourcesSection /> },
                { path: "person-location", element: <PersonLocation /> },
                { path: "notification-settings", element: <NotificationSettings /> },
                { path: "custom-labels", element: <CustomLabels /> },
                { path: "roles-permissions", element: (<PermissionRoute permission="view roles"><RolesPermissions /></PermissionRoute>) },
                { path: "reports", element: <Reports /> },
                { path: "clients", element: (<PermissionRoute permission="view clients"><Customers /></PermissionRoute>) },
                { path: "editcustomer", element: <Customers /> },
                { path: "privacy-and-security", element: <PrivacyAndSecurity /> },
                { path: "export-data", element: <ExportData /> },
                { path: "integrations-page", element: <IntegrationsPage /> },
              ],
            },
                        
        ],
      },
      {
        path: "/staff_dashboard_layout",
        element: <ProtectedRoute><StaffDashboardLayout /></ProtectedRoute> ,
        children: [
            {index: true, element:(<StaffProfile />)  },
            { path: "Staff_Profilepage", element: <StaffProfile /> }, 
            { path: "Staff_Appointment", element:(<StaffAppointments />)  },
            { path: "Staff_Interviews", element:( <Staff_Interview />)  },
                        
        ],
      },
      
 {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> }, 
      { path: "/pricing", element: <PricingComponent /> },
      { path: "/Webinars", element: <Webinars /> },
      { path: "/features", element: <FeaturesView /> },
      { path: "*", element: <NotFound /> }, 
    ],
  },
    { path: "/interview-layout/:id", element:(<ProtectedRoute>
      <PermissionRoute permission="view interview"><InterviewLayut /></PermissionRoute>
      </ProtectedRoute>) ,
        children: [
          { index: true, element: <ProtectedRoute>
            <PermissionRoute permission="edit interview">
              <InterviewDetails />
            </PermissionRoute>
            </ProtectedRoute> },
          { path: "scheduling-rules", element:<ProtectedRoute><SchedulingRules /></ProtectedRoute>  },
          { path: "assign-staff-to-interview", element:<ProtectedRoute><AssignStaffToIntVw /></ProtectedRoute>  },
          { path: "recruiters-managment", element: <ProtectedRoute><RecruitersManag /></ProtectedRoute> },
          { path: "interview-availability", element:<ProtectedRoute><InterviewAvailability /></ProtectedRoute>  },
        { path: "notifications/:type", element: <ProtectedRoute><UnifiedNotifications /></ProtectedRoute> },

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
   const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);

useEffect(() => {
  if (token) {
    dispatch(getPermissions());
  }
}, [dispatch, token]);

 
  return( 
    <>
    <Toaster position="top-center" reverseOrder={false} />
    <RouterProvider router={router} />
    
    </>
)
}

export default App;