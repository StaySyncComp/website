// router.js
import { createBrowserRouter } from "react-router-dom";
import PrivateRoute from "@/components/common/PrivateRoute";
import CreateOrganization from "@/pages/CreateOrganization";
import Login from "@/pages/Login";
import { Layout } from "@/components/layout/Layout";
import HomeIcon from "@/assets/icons/HomeIcon";
import ReportsIcon from "@/assets/icons/ReportsIcon";
import CallsIcon from "@/assets/icons/CallsIcon";
import PeopleIcon from "@/assets/icons/PeopleIcon";
import Settings from "@/pages/Settings";
import Employees from "@/pages/Employees";
import OrganizationSettings from "@/pages/OrganizationSettings";
import SettingsIcon from "@/assets/icons/SettingsIcon";
import Calls from "@/pages/Calls";
import Reports from "@/pages/Reports";
import ChatbotLauncher from "@/features/guest/components/ChatBotLauncher";
import Home from "@/pages/Home";
import ChatGuestPage from "@/pages/Guest";
import PublicInfoPage from "@/pages/PublicInfoPage";
import AddCall from "@/features/calls/components/AddCall";
import CallDetails from "@/features/calls/components/CallDetails";
import UnauthorizedPage from "@/pages/errors/UnauthorizedPage";
import NotFoundPage from "@/pages/errors/NotFoundPage";
import Homepage from "@/pages/HomePage";
import AccessibilityLauncher from "@/components/common/accessibility/AccessibilityLauncher";
import AccessibilityStatement from "@/pages/AccessibilityStatement/AccessibilityStatement";
import PrivacyPolicy from "@/pages/PrivacyPolicy/PrivacyPolicy";
import PublicLayout from "@/components/layout/Public/Layout";
import RoomsIcon from "@/assets/icons/RoomsIcon";
import CleaningManagement from "@/pages/CleaningManagement";
import AiChatPage from "@/features/ai-assistant/pages/AiChatPage";
import { Sparkles } from "lucide-react";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        path: "/",
        element: <Homepage />,
        handle: { documentTitle: "landing" },
      },
      {
        path: "/login",
        element: <Login />,
        handle: { documentTitle: "login" },
      },
      {
        path: "/chat",
        element: <ChatGuestPage />,
        handle: { documentTitle: "chat" },
      },
      {
        path: "/info/:organizationId",
        element: <PublicInfoPage />,
        handle: { documentTitle: "information_page" },
      },
      {
        path: "/info/:organizationId/:pageId",
        element: <PublicInfoPage />,
        handle: { documentTitle: "information_page" },
      },
      {
        path: "/create-organization",
        element: <CreateOrganization />,
        handle: { documentTitle: "create_organization" },
      },
      {
        path: "/unauthorized",
        element: <UnauthorizedPage />,
        handle: { documentTitle: "unauthorized" },
      },
      {
        path: "/accessibility-statement",
        element: <AccessibilityStatement />,
        handle: { documentTitle: "accessibility_statement" },
      },
      {
        path: "/privacy-policy",
        element: <PrivacyPolicy />,
        handle: { documentTitle: "privacy_policy" },
      },
      {
        path: "*",
        element: <NotFoundPage />,
        handle: { documentTitle: "not_found" },
      },
    ],
  },
  {
    path: "/",
    element: (
      <Layout>
        <PrivateRoute />
        <AccessibilityLauncher />
        <ChatbotLauncher />
      </Layout>
    ),
    handle: { showInSidebar: true },
    children: [
      {
        path: "/home",
        element: <Home />,
        handle: {
          title: "home",
          documentTitle: "home",
          navigationTitle: "home",
          icon: HomeIcon,
          showInSidebar: true,
        },
      },
      {
        path: "/dashboard",
        element: <Reports />,
        handle: {
          title: "dashboard",
          documentTitle: "dashboard",
          navigationTitle: "dashboard",
          icon: ReportsIcon,
          showInSidebar: true,
        },
      },
      {
        path: "/calls",
        handle: {
          title: "calls",
          icon: CallsIcon,
          documentTitle: "calls",
          navigationTitle: "calls",
          showInSidebar: true,
        },
        element: <Calls />,
      },
      {
        path: "/calls/add",
        handle: {
          documentTitle: "add_call",
          navigationTitle: "add_call",
        },
        element: <AddCall />,
      },
      {
        path: "/calls/:id",
        handle: {
          documentTitle: "call_details",
          navigationTitle: "call_details",
        },
        element: <CallDetails />,
      },

      {
        path: "/settings",
        handle: { documentTitle: "settings" },
        element: <Settings />,
      },
      {
        path: "/employees",
        element: <Employees />,
        handle: {
          documentTitle: "employees",
          title: "employees",
          navigationTitle: "employees",
          showInSidebar: true,
          icon: PeopleIcon,
        },
      },
      {
        path: "/cleaning-management",
        element: <CleaningManagement />,
        handle: {
          title: "cleaning_management",
          documentTitle: "cleaning_management",
          navigationTitle: "cleaning_management",
          showInSidebar: true,
          icon: RoomsIcon,
        },
      },
      {
        path: "/settings",
        handle: {
          documentTitle: "settings",
        },
        element: <Settings />,
      },
      {
        path: "/ai-assistant",
        element: <AiChatPage />,
        handle: {
          title: "ai_assistant",
          documentTitle: "ai_assistant",
          showInSidebar: true,
          icon: Sparkles,
        },
      },
      {
        path: "/organization-settings",
        element: <OrganizationSettings />,
        handle: {
          documentTitle: "organization_settings",
          title: "organization_settings",
          navigationTitle: "organization_settings",
          showInSidebar: true,
          icon: SettingsIcon,
        },
      },
    ],
  },
]);
