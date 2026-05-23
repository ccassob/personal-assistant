import { Routes } from '@angular/router'
import { AuthGuard } from '@core/services/auth.guard'
import { LayoutService } from '@core/services/layout.service'
import { MainLayout } from '@layouts/main-layout'

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard/projects',
    pathMatch: 'full',
  },
  {
    path: '',
    component: MainLayout,
    canActivate: [AuthGuard, LayoutService],
    children: [
      {
        path: 'dashboard/projects',
        loadComponent: () => import('./views/dashboard/projects/projects').then((m) => m.Projects),
        data: { title: 'Projects' },
      },
      {
        path: 'pages/empty',
        loadComponent: () => import('./views/pages/empty/empty').then((m) => m.Empty),
        data: { title: 'Empty Page' },
      },
      {
        path: 'layouts/scrollable',
        loadComponent: () => import('./views/layouts/scrollable/scrollable').then((m) => m.Scrollable),
        data: { title: 'Scrollable' },
      },
      {
        path: 'layouts/compact',
        loadComponent: () => import('./views/layouts/compact/compact').then((m) => m.Compact),
        data: { title: 'Compact' },
      },
      {
        path: 'layouts/boxed',
        loadComponent: () => import('./views/layouts/boxed/boxed').then((m) => m.Boxed),
        data: { title: 'Boxed' },
      },
      {
        path: 'layouts/horizontal',
        loadComponent: () => import('./views/layouts/horizontal/horizontal').then((m) => m.Horizontal),
        data: { title: 'Horizontal' },
      },
      {
        path: 'layouts/preloader',
        loadComponent: () => import('./views/layouts/preloader/preloader').then((m) => m.Preloader),
        data: { title: 'Preloader' },
      },
      {
        path: 'layouts/sidebar-light',
        loadComponent: () => import('./views/layouts/sidebar-light/sidebar-light').then((m) => m.SidebarLight),
        data: { title: 'Light Menu' },
      },
      {
        path: 'layouts/sidebar-gradient',
        loadComponent: () => import('./views/layouts/sidebar-gradient/sidebar-gradient').then((m) => m.SidebarGradient),
        data: { title: 'Gradient Menu' },
      },
      {
        path: 'layouts/sidebar-gray',
        loadComponent: () => import('./views/layouts/sidebar-gray/sidebar-gray').then((m) => m.SidebarGray),
        data: { title: 'Gray Menu' },
      },
      {
        path: 'layouts/sidebar-image',
        loadComponent: () => import('./views/layouts/sidebar-image/sidebar-image').then((m) => m.SidebarImage),
        data: { title: 'Image Menu' },
      },
      {
        path: 'layouts/sidebar-compact',
        loadComponent: () => import('./views/layouts/sidebar-compact/sidebar-compact').then((m) => m.SidebarCompact),
        data: { title: 'Compact Menu' },
      },
      {
        path: 'layouts/sidebar-on-hover',
        loadComponent: () => import('./views/layouts/sidebar-on-hover/sidebar-on-hover').then((m) => m.SidebarOnHover),
        data: { title: 'On Hover Menu' },
      },
      {
        path: 'layouts/sidebar-on-hover-active',
        loadComponent: () => import('./views/layouts/sidebar-on-hover-active/sidebar-on-hover-active').then((m) => m.SidebarOnHoverActive),
        data: { title: 'On Hover Active' },
      },
      {
        path: 'layouts/sidebar-offcanvas',
        loadComponent: () => import('./views/layouts/sidebar-offcanvas/sidebar-offcanvas').then((m) => m.SidebarOffcanvas),
        data: { title: 'Offcanvas Menu' },
      },
      {
        path: 'layouts/sidebar-no-icons',
        loadComponent: () => import('./views/layouts/sidebar-no-icons/sidebar-no-icons').then((m) => m.SidebarNoIcons),
        data: { title: 'No Icons with Lines' },
      },
      {
        path: 'layouts/sidebar-with-lines',
        loadComponent: () => import('./views/layouts/sidebar-with-lines/sidebar-with-lines').then((m) => m.SidebarWithLines),
        data: { title: 'Sidebar with Lines' },
      },
      {
        path: 'layouts/topbar-dark',
        loadComponent: () => import('./views/layouts/topbar-dark/topbar-dark').then((m) => m.TopbarDark),
        data: { title: 'Dark Topbar' },
      },
      {
        path: 'layouts/topbar-gray',
        loadComponent: () => import('./views/layouts/topbar-gray/topbar-gray').then((m) => m.TopbarGray),
        data: { title: 'Gray Topbar' },
      },
      {
        path: 'layouts/topbar-gradient',
        loadComponent: () => import('./views/layouts/topbar-gradient/topbar-gradient').then((m) => m.TopbarGradient),
        data: { title: 'Gradient Topbar' },
      },
      {
        path: 'icons/tabler',
        loadComponent: () => import('./views/icons/tabler/tabler').then((m) => m.Tabler),
        data: { title: 'Tabler' },
      },
    ],
  },
  {
    path: '',
    canActivate: [LayoutService],
    children: [
      {
        path: 'auth/sign-in',
        loadComponent: () => import('./views/auth/sign-in/sign-in').then((m) => m.SignIn),
        data: { title: 'Sign In' },
      },
      {
        path: 'auth/sign-up',
        loadComponent: () => import('./views/auth/sign-up/sign-up').then((m) => m.SignUp),
        data: { title: 'Sign Up' },
      },
      {
        path: 'auth/reset-pass',
        loadComponent: () => import('./views/auth/reset-pass/reset-pass').then((m) => m.ResetPass),
        data: { title: 'Reset Password' },
      },
      {
        path: 'auth/new-pass',
        loadComponent: () => import('./views/auth/new-pass/new-pass').then((m) => m.NewPass),
        data: { title: 'New Password' },
      },
      {
        path: 'auth/two-factor',
        loadComponent: () => import('./views/auth/two-factor/two-factor').then((m) => m.TwoFactor),
        data: { title: 'Two Factor' },
      },
      {
        path: 'auth/lock-screen',
        loadComponent: () => import('./views/auth/lock-screen/lock-screen').then((m) => m.LockScreen),
        data: { title: 'Lock Screen' },
      },
      {
        path: 'auth/success-mail',
        loadComponent: () => import('./views/auth/success-mail/success-mail').then((m) => m.SuccessMail),
        data: { title: 'Success Mail' },
      },
      {
        path: 'auth/login-pin',
        loadComponent: () => import('./views/auth/login-pin/login-pin').then((m) => m.LoginPin),
        data: { title: 'Login with PIN' },
      },
      {
        path: 'auth/delete-account',
        loadComponent: () => import('./views/auth/delete-account/delete-account').then((m) => m.DeleteAccount),
        data: { title: 'Delete Account' },
      },
      {
        path: 'auth/card/sign-in',
        loadComponent: () => import('./views/auth/card/sign-in/sign-in').then((m) => m.SignIn),
        data: { title: 'Sign In' },
      },
      {
        path: 'auth/card/sign-up',
        loadComponent: () => import('./views/auth/card/sign-up/sign-up').then((m) => m.SignUp),
        data: { title: 'Sign Up' },
      },
      {
        path: 'auth/card/reset-pass',
        loadComponent: () => import('./views/auth/card/reset-pass/reset-pass').then((m) => m.ResetPass),
        data: { title: 'Reset Password' },
      },
      {
        path: 'auth/card/new-pass',
        loadComponent: () => import('./views/auth/card/new-pass/new-pass').then((m) => m.NewPass),
        data: { title: 'New Password' },
      },
      {
        path: 'auth/card/two-factor',
        loadComponent: () => import('./views/auth/card/two-factor/two-factor').then((m) => m.TwoFactor),
        data: { title: 'Two Factor' },
      },
      {
        path: 'auth/card/lock-screen',
        loadComponent: () => import('./views/auth/card/lock-screen/lock-screen').then((m) => m.LockScreen),
        data: { title: 'Lock Screen' },
      },
      {
        path: 'auth/card/success-mail',
        loadComponent: () => import('./views/auth/card/success-mail/success-mail').then((m) => m.SuccessMail),
        data: { title: 'Success Mail' },
      },
      {
        path: 'auth/card/login-pin',
        loadComponent: () => import('./views/auth/card/login-pin/login-pin').then((m) => m.LoginPin),
        data: { title: 'Login with PIN' },
      },
      {
        path: 'auth/card/delete-account',
        loadComponent: () => import('./views/auth/card/delete-account/delete-account').then((m) => m.DeleteAccount),
        data: { title: 'Delete Account' },
      },
      {
        path: 'auth/split/sign-in',
        loadComponent: () => import('./views/auth/split/sign-in/sign-in').then((m) => m.SignIn),
        data: { title: 'Sign In' },
      },
      {
        path: 'auth/split/sign-up',
        loadComponent: () => import('./views/auth/split/sign-up/sign-up').then((m) => m.SignUp),
        data: { title: 'Sign Up' },
      },
      {
        path: 'auth/split/reset-pass',
        loadComponent: () => import('./views/auth/split/reset-pass/reset-pass').then((m) => m.ResetPass),
        data: { title: 'Reset Password' },
      },
      {
        path: 'auth/split/new-pass',
        loadComponent: () => import('./views/auth/split/new-pass/new-pass').then((m) => m.NewPass),
        data: { title: 'New Password' },
      },
      {
        path: 'auth/split/two-factor',
        loadComponent: () => import('./views/auth/split/two-factor/two-factor').then((m) => m.TwoFactor),
        data: { title: 'Two Factor' },
      },
      {
        path: 'auth/split/lock-screen',
        loadComponent: () => import('./views/auth/split/lock-screen/lock-screen').then((m) => m.LockScreen),
        data: { title: 'Lock Screen' },
      },
      {
        path: 'auth/split/success-mail',
        loadComponent: () => import('./views/auth/split/success-mail/success-mail').then((m) => m.SuccessMail),
        data: { title: 'Success Mail' },
      },
      {
        path: 'auth/split/login-pin',
        loadComponent: () => import('./views/auth/split/login-pin/login-pin').then((m) => m.LoginPin),
        data: { title: 'Login with PIN' },
      },
      {
        path: 'auth/split/delete-account',
        loadComponent: () => import('./views/auth/split/delete-account/delete-account').then((m) => m.DeleteAccount),
        data: { title: 'Delete Account' },
      },
      {
        path: 'error/400',
        loadComponent: () => import('./views/error/error-400/error-400').then((m) => m.Error400),
        data: { title: '400 Bad Request' },
      },
      {
        path: 'error/401',
        loadComponent: () => import('./views/error/error-401/error-401').then((m) => m.Error401),
        data: { title: '401 Unauthorized' },
      },
      {
        path: 'error/403',
        loadComponent: () => import('./views/error/error-403/error-403').then((m) => m.Error403),
        data: { title: '403 Forbidden' },
      },
      {
        path: 'error/404',
        loadComponent: () => import('./views/error/error-404/error-404').then((m) => m.Error404),
        data: { title: '404 Not Found' },
      },
      {
        path: 'error/408',
        loadComponent: () => import('./views/error/error-408/error-408').then((m) => m.Error408),
        data: { title: '408 Request Timeout' },
      },
      {
        path: 'error/500',
        loadComponent: () => import('./views/error/error-500/error-500').then((m) => m.Error500),
        data: { title: '500 Internal Server' },
      },
      {
        path: 'error/maintenance',
        loadComponent: () => import('./views/error/maintenance/maintenance').then((m) => m.Maintenance),
        data: { title: 'Maintenance' },
      },
    ],
  },
]
