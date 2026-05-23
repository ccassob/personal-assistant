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
        path: 'dashboard/ecommerce',
        loadComponent: () => import('./views/dashboard/ecommerce/ecommerce').then((m) => m.Ecommerce),
        data: { title: 'Ecommerce' },
      },
      {
        path: 'dashboard/analytics',
        loadComponent: () => import('./views/dashboard/analytics/analytics').then((m) => m.Analytics),
        data: { title: 'Analytics' },
      },
      {
        path: 'dashboard/projects',
        loadComponent: () => import('./views/dashboard/projects/projects').then((m) => m.Projects),
        data: { title: 'Projects' },
      },
      {
        path: 'apps/ecommerce/marketplace',
        loadComponent: () => import('./views/apps/ecommerce/marketplace/marketplace').then((m) => m.Marketplace),
        data: { title: 'Marketplace' },
      },
      {
        path: 'apps/ecommerce/products',
        loadComponent: () => import('./views/apps/ecommerce/products/products').then((m) => m.Products),
        data: { title: 'Products' },
      },
      {
        path: 'apps/ecommerce/products-grid',
        loadComponent: () => import('./views/apps/ecommerce/products-grid/products-grid').then((m) => m.ProductsGrid),
        data: { title: 'Products Grid' },
      },
      {
        path: 'apps/ecommerce/product-details',
        loadComponent: () => import('./views/apps/ecommerce/product-details/product-details').then((m) => m.ProductDetails),
        data: { title: 'Product Details' },
      },
      {
        path: 'apps/ecommerce/product-add',
        loadComponent: () => import('./views/apps/ecommerce/product-add/product-add').then((m) => m.ProductAdd),
        data: { title: 'Add Product' },
      },
      {
        path: 'apps/ecommerce/categories',
        loadComponent: () => import('./views/apps/ecommerce/categories/categories').then((m) => m.Categories),
        data: { title: 'Categories' },
      },
      {
        path: 'apps/ecommerce/orders',
        loadComponent: () => import('./views/apps/ecommerce/orders/orders').then((m) => m.Orders),
        data: { title: 'Orders' },
      },
      {
        path: 'apps/ecommerce/order-details',
        loadComponent: () => import('./views/apps/ecommerce/order-details/order-details').then((m) => m.OrderDetails),
        data: { title: 'Order Details' },
      },
      {
        path: 'apps/ecommerce/order-add',
        loadComponent: () => import('./views/apps/ecommerce/order-add/order-add').then((m) => m.OrderAdd),
        data: { title: 'Add/Edit Order' },
      },
      {
        path: 'apps/ecommerce/customers',
        loadComponent: () => import('./views/apps/ecommerce/customers/customers').then((m) => m.Customers),
        data: { title: 'Customers' },
      },
      {
        path: 'apps/ecommerce/cart',
        loadComponent: () => import('./views/apps/ecommerce/cart/cart').then((m) => m.Cart),
        data: { title: 'Cart' },
      },
      {
        path: 'apps/ecommerce/checkout',
        loadComponent: () => import('./views/apps/ecommerce/checkout/checkout').then((m) => m.Checkout),
        data: { title: 'Checkout' },
      },
      {
        path: 'apps/ecommerce/sellers',
        loadComponent: () => import('./views/apps/ecommerce/sellers/sellers').then((m) => m.Sellers),
        data: { title: 'Sellers' },
      },
      {
        path: 'apps/ecommerce/seller-details',
        loadComponent: () => import('./views/apps/ecommerce/seller-details/seller-details').then((m) => m.SellerDetails),
        data: { title: 'Sellers Details' },
      },
      {
        path: 'apps/ecommerce/refunds',
        loadComponent: () => import('./views/apps/ecommerce/refunds/refunds').then((m) => m.Refunds),
        data: { title: 'Refunds' },
      },
      {
        path: 'apps/ecommerce/reviews',
        loadComponent: () => import('./views/apps/ecommerce/reviews/reviews').then((m) => m.Reviews),
        data: { title: 'Reviews' },
      },
      {
        path: 'apps/ecommerce/warehouse',
        loadComponent: () => import('./views/apps/ecommerce/warehouse/warehouse').then((m) => m.Warehouse),
        data: { title: 'Warehouse' },
      },
      {
        path: 'apps/ecommerce/product-stocks',
        loadComponent: () => import('./views/apps/ecommerce/product-stocks/product-stocks').then((m) => m.ProductStocks),
        data: { title: 'Product Stocks' },
      },
      {
        path: 'apps/ecommerce/purchased-orders',
        loadComponent: () => import('./views/apps/ecommerce/purchased-orders/purchased-orders').then((m) => m.PurchasedOrders),
        data: { title: 'Purchased Orders' },
      },
      {
        path: 'apps/ecommerce/product-views',
        loadComponent: () => import('./views/apps/ecommerce/product-views/product-views').then((m) => m.ProductViews),
        data: { title: 'Product Views' },
      },
      {
        path: 'apps/ecommerce/sales',
        loadComponent: () => import('./views/apps/ecommerce/sales/sales').then((m) => m.Sales),
        data: { title: 'Sales' },
      },
      {
        path: 'apps/ecommerce/attributes',
        loadComponent: () => import('./views/apps/ecommerce/attributes/attributes').then((m) => m.Attributes),
        data: { title: 'Attributes' },
      },
      {
        path: 'apps/ecommerce/settings',
        loadComponent: () => import('./views/apps/ecommerce/settings/settings').then((m) => m.Settings),
        data: { title: 'Settings' },
      },
      {
        path: 'apps/email/inbox',
        loadComponent: () => import('./views/apps/email/inbox/inbox').then((m) => m.Inbox),
        data: { title: 'Inbox' },
      },
      {
        path: 'apps/email/details',
        loadComponent: () => import('./views/apps/email/details/details').then((m) => m.Details),
        data: { title: 'Details' },
      },
      {
        path: 'apps/email/compose',
        loadComponent: () => import('./views/apps/email/compose/compose').then((m) => m.Compose),
        data: { title: 'Compose' },
      },
      {
        path: 'apps/users/contacts',
        loadComponent: () => import('./views/apps/users/contacts/contacts').then((m) => m.Contacts),
        data: { title: 'Contacts' },
      },
      {
        path: 'apps/users/roles',
        loadComponent: () => import('./views/apps/users/roles/roles').then((m) => m.Roles),
        data: { title: 'Roles' },
      },
      {
        path: 'apps/users/role-details',
        loadComponent: () => import('./views/apps/users/role-details/role-details').then((m) => m.RoleDetails),
        data: { title: 'Role Details' },
      },
      {
        path: 'apps/users/permissions',
        loadComponent: () => import('./views/apps/users/permissions/permissions').then((m) => m.Permissions),
        data: { title: 'Permissions' },
      },
      {
        path: 'apps/projects/grid',
        loadComponent: () => import('./views/apps/projects/grid/grid').then((m) => m.Grid),
        data: { title: 'My Projects' },
      },
      {
        path: 'apps/projects/list',
        loadComponent: () => import('./views/apps/projects/list/list').then((m) => m.List),
        data: { title: 'Projects List' },
      },
      {
        path: 'apps/projects/details',
        loadComponent: () => import('./views/apps/projects/details/details').then((m) => m.Details),
        data: { title: 'View Project' },
      },
      {
        path: 'apps/projects/kanban',
        loadComponent: () => import('./views/apps/projects/kanban/kanban').then((m) => m.Kanban),
        data: { title: 'Kanban Board' },
      },
      {
        path: 'apps/projects/team-board',
        loadComponent: () => import('./views/apps/projects/team-board/team-board').then((m) => m.TeamBoard),
        data: { title: 'Team Board' },
      },
      {
        path: 'apps/projects/activity',
        loadComponent: () => import('./views/apps/projects/activity/activity').then((m) => m.Activity),
        data: { title: 'Activity Steam' },
      },
      {
        path: 'apps/file-manager',
        loadComponent: () => import('./views/apps/file-manager/file-manager').then((m) => m.FileManager),
        data: { title: 'File Manager' },
      },
      {
        path: 'apps/chat',
        loadComponent: () => import('./views/apps/chat/chat').then((m) => m.Chat),
        data: { title: 'Chat' },
      },
      {
        path: 'apps/calendar',
        loadComponent: () => import('./views/apps/calendar/calendar').then((m) => m.Calendar),
        data: { title: 'Calendar' },
      },
      {
        path: 'apps/social-feed',
        loadComponent: () => import('./views/apps/social-feed/social-feed').then((m) => m.SocialFeed),
        data: { title: 'Social Feed' },
      },
      {
        path: 'apps/invoice/list',
        loadComponent: () => import('./views/apps/invoice/list/list').then((m) => m.List),
        data: { title: 'Invoices' },
      },
      {
        path: 'apps/invoice/details',
        loadComponent: () => import('./views/apps/invoice/details/details').then((m) => m.Details),
        data: { title: 'Single Invoice' },
      },
      {
        path: 'apps/invoice/create',
        loadComponent: () => import('./views/apps/invoice/create/create').then((m) => m.Create),
        data: { title: 'New Invoice' },
      },
      {
        path: 'apps/companies',
        loadComponent: () => import('./views/apps/companies/companies').then((m) => m.Companies),
        data: { title: 'Companies' },
      },
      {
        path: 'apps/clients',
        loadComponent: () => import('./views/apps/clients/clients').then((m) => m.Clients),
        data: { title: 'Clients' },
      },
      {
        path: 'apps/outlook',
        loadComponent: () => import('./views/apps/outlook/outlook').then((m) => m.Outlook),
        data: { title: 'Outlook View' },
      },
      {
        path: 'apps/vote-list',
        loadComponent: () => import('./views/apps/vote-list/vote-list').then((m) => m.VoteList),
        data: { title: 'Vote List' },
      },
      {
        path: 'apps/issue-tracker',
        loadComponent: () => import('./views/apps/issue-tracker/issue-tracker').then((m) => m.IssueTracker),
        data: { title: 'Issue Tracker' },
      },
      {
        path: 'apps/api-keys',
        loadComponent: () => import('./views/apps/api-keys/api-keys').then((m) => m.ApiKeys),
        data: { title: 'API Keys' },
      },
      {
        path: 'apps/manage',
        loadComponent: () => import('./views/apps/manage/manage').then((m) => m.Manage),
        data: { title: 'Manage Apps' },
      },
      {
        path: 'apps/blog/list',
        loadComponent: () => import('./views/apps/blog/list/list').then((m) => m.List),
        data: { title: 'Blog List' },
      },
      {
        path: 'apps/blog/grid',
        loadComponent: () => import('./views/apps/blog/grid/grid').then((m) => m.Grid),
        data: { title: 'Blog Grid' },
      },
      {
        path: 'apps/blog/article',
        loadComponent: () => import('./views/apps/blog/article/article').then((m) => m.Article),
        data: { title: 'Article' },
      },
      {
        path: 'apps/blog/add',
        loadComponent: () => import('./views/apps/blog/add/add').then((m) => m.Add),
        data: { title: 'Add Article' },
      },
      {
        path: 'apps/pin-board',
        loadComponent: () => import('./views/apps/pin-board/pin-board').then((m) => m.PinBoard),
        data: { title: 'Pin Board' },
      },
      {
        path: 'apps/forum/view',
        loadComponent: () => import('./views/apps/forum/view/view').then((m) => m.View),
        data: { title: 'Forum View' },
      },
      {
        path: 'apps/forum/post',
        loadComponent: () => import('./views/apps/forum/post/post').then((m) => m.Post),
        data: { title: 'Forum Post' },
      },
      {
        path: 'pages/profile',
        loadComponent: () => import('./views/pages/profile/profile').then((m) => m.Profile),
        data: { title: 'Profile' },
      },
      {
        path: 'pages/account-settings',
        loadComponent: () => import('./views/pages/account-settings/account-settings').then((m) => m.AccountSettings),
        data: { title: 'Account Settings' },
      },
      {
        path: 'pages/faq',
        loadComponent: () => import('./views/pages/faq/faq').then((m) => m.Faq),
        data: { title: 'FAQ' },
      },
      {
        path: 'pages/pricing',
        loadComponent: () => import('./views/pages/pricing/pricing').then((m) => m.Pricing),
        data: { title: 'Pricing' },
      },
      {
        path: 'pages/empty',
        loadComponent: () => import('./views/pages/empty/empty').then((m) => m.Empty),
        data: { title: 'Empty Page' },
      },
      {
        path: 'pages/timeline',
        loadComponent: () => import('./views/pages/timeline/timeline').then((m) => m.Timeline),
        data: { title: 'Timeline' },
      },
      {
        path: 'pages/gallery',
        loadComponent: () => import('./views/pages/gallery/gallery').then((m) => m.Gallery),
        data: { title: 'Gallery' },
      },
      {
        path: 'pages/sitemap',
        loadComponent: () => import('./views/pages/sitemap/sitemap').then((m) => m.Sitemap),
        data: { title: 'Sitemap' },
      },
      {
        path: 'pages/search-results',
        loadComponent: () => import('./views/pages/search-results/search-results').then((m) => m.SearchResults),
        data: { title: 'Search Results' },
      },
      {
        path: 'pages/privacy-policy',
        loadComponent: () => import('./views/pages/privacy-policy/privacy-policy').then((m) => m.PrivacyPolicy),
        data: { title: 'Privacy Policy' },
      },
      {
        path: 'pages/terms-conditions',
        loadComponent: () => import('./views/pages/terms-conditions/terms-conditions').then((m) => m.TermsConditions),
        data: { title: 'Terms & Conditions' },
      },
      {
        path: 'plugins/sortable',
        loadComponent: () => import('./views/plugins/sortable/sortable').then((m) => m.Sortable),
        data: { title: 'Sortable List' },
      },
      {
        path: 'plugins/text-diff',
        loadComponent: () => import('./views/plugins/text-diff/text-diff').then((m) => m.TextDiff),
        data: { title: 'Text Diff' },
      },
      {
        path: 'plugins/pdf-viewer',
        loadComponent: () => import('./views/plugins/pdf-viewer/pdf-viewer').then((m) => m.PdfViewer),
        data: { title: 'PDF Viewer' },
      },
      {
        path: 'plugins/sweet-alerts',
        loadComponent: () => import('./views/plugins/sweet-alerts/sweet-alerts').then((m) => m.SweetAlerts),
        data: { title: 'Sweet Alerts' },
      },
      {
        path: 'plugins/pass-meter',
        loadComponent: () => import('./views/plugins/pass-meter/pass-meter').then((m) => m.PassMeter),
        data: { title: 'Password Meter' },
      },
      {
        path: 'plugins/live-favicon',
        loadComponent: () => import('./views/plugins/live-favicon/live-favicon').then((m) => m.LiveFavicon),
        data: { title: 'Live Favicon' },
      },
      {
        path: 'plugins/clipboard',
        loadComponent: () => import('./views/plugins/clipboard/clipboard').then((m) => m.Clipboard),
        data: { title: 'Clipboard' },
      },
      {
        path: 'plugins/loading-buttons',
        loadComponent: () => import('./views/plugins/loading-buttons/loading-buttons').then((m) => m.LoadingButtons),
        data: { title: 'Loading Buttons' },
      },
      {
        path: 'plugins/masonry',
        loadComponent: () => import('./views/plugins/masonry/masonry').then((m) => m.Masonry),
        data: { title: 'Masonry' },
      },
      {
        path: 'plugins/tour',
        loadComponent: () => import('./views/plugins/tour/tour').then((m) => m.Tour),
        data: { title: 'Tour' },
      },
      {
        path: 'plugins/animation',
        loadComponent: () => import('./views/plugins/animation/animation').then((m) => m.Animation),
        data: { title: 'Animation' },
      },
      {
        path: 'plugins/video-player',
        loadComponent: () => import('./views/plugins/video-player/video-player').then((m) => m.VideoPlayer),
        data: { title: 'Video Player' },
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
        path: 'ui/accordions',
        loadComponent: () => import('./views/ui/accordions/accordions').then((m) => m.Accordions),
        data: { title: 'Accordions' },
      },
      {
        path: 'ui/alerts',
        loadComponent: () => import('./views/ui/alerts/alerts').then((m) => m.Alerts),
        data: { title: 'Alerts' },
      },
      {
        path: 'ui/images',
        loadComponent: () => import('./views/ui/images/images').then((m) => m.Images),
        data: { title: 'Images' },
      },
      {
        path: 'ui/badges',
        loadComponent: () => import('./views/ui/badges/badges').then((m) => m.Badges),
        data: { title: 'Badges' },
      },
      {
        path: 'ui/breadcrumb',
        loadComponent: () => import('./views/ui/breadcrumb/breadcrumb').then((m) => m.Breadcrumb),
        data: { title: 'Breadcrumb' },
      },
      {
        path: 'ui/buttons',
        loadComponent: () => import('./views/ui/buttons/buttons').then((m) => m.Buttons),
        data: { title: 'Buttons' },
      },
      {
        path: 'ui/cards',
        loadComponent: () => import('./views/ui/cards/cards').then((m) => m.Cards),
        data: { title: 'Cards' },
      },
      {
        path: 'ui/carousel',
        loadComponent: () => import('./views/ui/carousel/carousel').then((m) => m.Carousel),
        data: { title: 'Carousel' },
      },
      {
        path: 'ui/collapse',
        loadComponent: () => import('./views/ui/collapse/collapse').then((m) => m.Collapse),
        data: { title: 'Collapse' },
      },
      {
        path: 'ui/colors',
        loadComponent: () => import('./views/ui/colors/colors').then((m) => m.Colors),
        data: { title: 'Colors' },
      },
      {
        path: 'ui/dropdowns',
        loadComponent: () => import('./views/ui/dropdowns/dropdowns').then((m) => m.Dropdowns),
        data: { title: 'Dropdowns' },
      },
      {
        path: 'ui/videos',
        loadComponent: () => import('./views/ui/videos/videos').then((m) => m.Videos),
        data: { title: 'Videos' },
      },
      {
        path: 'ui/grid',
        loadComponent: () => import('./views/ui/grid/grid').then((m) => m.Grid),
        data: { title: 'Grid Options' },
      },
      {
        path: 'ui/links',
        loadComponent: () => import('./views/ui/links/links').then((m) => m.Links),
        data: { title: 'Links' },
      },
      {
        path: 'ui/list-group',
        loadComponent: () => import('./views/ui/list-group/list-group').then((m) => m.ListGroup),
        data: { title: 'List Group' },
      },
      {
        path: 'ui/modals',
        loadComponent: () => import('./views/ui/modals/modals').then((m) => m.Modals),
        data: { title: 'Modals' },
      },
      {
        path: 'ui/notifications',
        loadComponent: () => import('./views/ui/notifications/notifications').then((m) => m.Notifications),
        data: { title: 'Notifications' },
      },
      {
        path: 'ui/offcanvas',
        loadComponent: () => import('./views/ui/offcanvas/offcanvas').then((m) => m.Offcanvas),
        data: { title: 'Offcanvas' },
      },
      {
        path: 'ui/placeholders',
        loadComponent: () => import('./views/ui/placeholders/placeholders').then((m) => m.Placeholders),
        data: { title: 'Placeholders' },
      },
      {
        path: 'ui/pagination',
        loadComponent: () => import('./views/ui/pagination/pagination').then((m) => m.Pagination),
        data: { title: 'Pagination' },
      },
      {
        path: 'ui/popovers',
        loadComponent: () => import('./views/ui/popovers/popovers').then((m) => m.Popovers),
        data: { title: 'Popovers' },
      },
      {
        path: 'ui/progress',
        loadComponent: () => import('./views/ui/progress/progress').then((m) => m.Progress),
        data: { title: 'Progress' },
      },
      {
        path: 'ui/scrollspy',
        loadComponent: () => import('./views/ui/scrollspy/scrollspy').then((m) => m.Scrollspy),
        data: { title: 'Scrollspy' },
      },
      {
        path: 'ui/spinners',
        loadComponent: () => import('./views/ui/spinners/spinners').then((m) => m.Spinners),
        data: { title: 'Spinners' },
      },
      {
        path: 'ui/tabs',
        loadComponent: () => import('./views/ui/tabs/tabs').then((m) => m.Tabs),
        data: { title: 'Tabs' },
      },
      {
        path: 'ui/tooltips',
        loadComponent: () => import('./views/ui/tooltips/tooltips').then((m) => m.Tooltips),
        data: { title: 'Tooltips' },
      },
      {
        path: 'ui/typography',
        loadComponent: () => import('./views/ui/typography/typography').then((m) => m.Typography),
        data: { title: 'Typography' },
      },
      {
        path: 'ui/utilities',
        loadComponent: () => import('./views/ui/utilities/utilities').then((m) => m.Utilities),
        data: { title: 'Utilities' },
      },
      {
        path: 'widgets',
        loadComponent: () => import('./views//widgets/widgets').then((m) => m.Widgets),
        data: { title: 'Widgets' },
      },
      {
        path: 'metrics',
        loadComponent: () => import('./views//metrics/metrics').then((m) => m.Metrics),
        data: { title: 'Metrics' },
      },
      {
        path: 'charts/apex/area',
        loadComponent: () => import('./views/charts/apex/area/area').then((m) => m.Area),
        data: { title: 'Area' },
      },
      {
        path: 'charts/apex/bar',
        loadComponent: () => import('./views/charts/apex/bar/bar').then((m) => m.Bar),
        data: { title: 'Bar' },
      },
      {
        path: 'charts/apex/bubble',
        loadComponent: () => import('./views/charts/apex/bubble/bubble').then((m) => m.Bubble),
        data: { title: 'Bubble' },
      },
      {
        path: 'charts/apex/candlestick',
        loadComponent: () => import('./views/charts/apex/candlestick/candlestick').then((m) => m.Candlestick),
        data: { title: 'Candlestick' },
      },
      {
        path: 'charts/apex/column',
        loadComponent: () => import('./views/charts/apex/column/column').then((m) => m.Column),
        data: { title: 'Column' },
      },
      {
        path: 'charts/apex/heatmap',
        loadComponent: () => import('./views/charts/apex/heatmap/heatmap').then((m) => m.Heatmap),
        data: { title: 'Heatmap' },
      },
      {
        path: 'charts/apex/line',
        loadComponent: () => import('./views/charts/apex/line/line').then((m) => m.Line),
        data: { title: 'Line' },
      },
      {
        path: 'charts/apex/mixed',
        loadComponent: () => import('./views/charts/apex/mixed/mixed').then((m) => m.Mixed),
        data: { title: 'Mixed' },
      },
      {
        path: 'charts/apex/timeline',
        loadComponent: () => import('./views/charts/apex/timeline/timeline').then((m) => m.Timeline),
        data: { title: 'Timeline' },
      },
      {
        path: 'charts/apex/boxplot',
        loadComponent: () => import('./views/charts/apex/boxplot/boxplot').then((m) => m.Boxplot),
        data: { title: 'Boxplot' },
      },
      {
        path: 'charts/apex/treemap',
        loadComponent: () => import('./views/charts/apex/treemap/treemap').then((m) => m.Treemap),
        data: { title: 'Treemap' },
      },
      {
        path: 'charts/apex/pie',
        loadComponent: () => import('./views/charts/apex/pie/pie').then((m) => m.Pie),
        data: { title: 'Pie' },
      },
      {
        path: 'charts/apex/radar',
        loadComponent: () => import('./views/charts/apex/radar/radar').then((m) => m.Radar),
        data: { title: 'Radar' },
      },
      {
        path: 'charts/apex/radialbar',
        loadComponent: () => import('./views/charts/apex/radialbar/radialbar').then((m) => m.Radialbar),
        data: { title: 'RadialBar' },
      },
      {
        path: 'charts/apex/scatter',
        loadComponent: () => import('./views/charts/apex/scatter/scatter').then((m) => m.Scatter),
        data: { title: 'Scatter' },
      },
      {
        path: 'charts/apex/polar-area',
        loadComponent: () => import('./views/charts/apex/polar-area/polar-area').then((m) => m.PolarArea),
        data: { title: 'Polar Area' },
      },
      {
        path: 'charts/apex/sparklines',
        loadComponent: () => import('./views/charts/apex/sparklines/sparklines').then((m) => m.Sparklines),
        data: { title: 'Sparklines' },
      },
      {
        path: 'charts/apex/range',
        loadComponent: () => import('./views/charts/apex/range/range').then((m) => m.Range),
        data: { title: 'Range' },
      },
      {
        path: 'charts/apex/funnel',
        loadComponent: () => import('./views/charts/apex/funnel/funnel').then((m) => m.Funnel),
        data: { title: 'Funnel' },
      },
      {
        path: 'charts/apex/slope',
        loadComponent: () => import('./views/charts/apex/slope/slope').then((m) => m.Slope),
        data: { title: 'Slope' },
      },
      {
        path: 'charts/echart/line',
        loadComponent: () => import('./views/charts/echart/line/line').then((m) => m.Line),
        data: { title: 'Line' },
      },
      {
        path: 'charts/echart/bar',
        loadComponent: () => import('./views/charts/echart/bar/bar').then((m) => m.Bar),
        data: { title: 'Bar' },
      },
      {
        path: 'charts/echart/pie',
        loadComponent: () => import('./views/charts/echart/pie/pie').then((m) => m.Pie),
        data: { title: 'Pie' },
      },
      {
        path: 'charts/echart/scatter',
        loadComponent: () => import('./views/charts/echart/scatter/scatter').then((m) => m.Scatter),
        data: { title: 'Scatter' },
      },
      {
        path: 'charts/echart/geo-map',
        loadComponent: () => import('./views/charts/echart/geo-map/geo-map').then((m) => m.GeoMap),
        data: { title: 'GEO Map' },
      },
      {
        path: 'charts/echart/gauge',
        loadComponent: () => import('./views/charts/echart/gauge/gauge').then((m) => m.Gauge),
        data: { title: 'Gauge' },
      },
      {
        path: 'charts/echart/candlestick',
        loadComponent: () => import('./views/charts/echart/candlestick/candlestick').then((m) => m.Candlestick),
        data: { title: 'Candlestick' },
      },
      {
        path: 'charts/echart/area',
        loadComponent: () => import('./views/charts/echart/area/area').then((m) => m.Area),
        data: { title: 'Area' },
      },
      {
        path: 'charts/echart/radar',
        loadComponent: () => import('./views/charts/echart/radar/radar').then((m) => m.Radar),
        data: { title: 'Radar' },
      },
      {
        path: 'charts/echart/heatmap',
        loadComponent: () => import('./views/charts/echart/heatmap/heatmap').then((m) => m.Heatmap),
        data: { title: 'Heatmap' },
      },
      {
        path: 'charts/echart/other',
        loadComponent: () => import('./views/charts/echart/other/other').then((m) => m.Other),
        data: { title: 'Other' },
      },
      {
        path: 'form/elements',
        loadComponent: () => import('./views/form/elements/elements').then((m) => m.Elements),
        data: { title: 'Basic Elements' },
      },
      {
        path: 'form/pickers',
        loadComponent: () => import('./views/form/pickers/pickers').then((m) => m.Pickers),
        data: { title: 'Pickers' },
      },
      {
        path: 'form/select',
        loadComponent: () => import('./views/form/select/select').then((m) => m.Select),
        data: { title: 'Select' },
      },
      {
        path: 'form/validation',
        loadComponent: () => import('./views/form/validation/validation').then((m) => m.Validation),
        data: { title: 'Validation' },
      },
      {
        path: 'form/wizard',
        loadComponent: () => import('./views/form/wizard/wizard').then((m) => m.Wizard),
        data: { title: 'Wizard' },
      },
      {
        path: 'form/fileuploads',
        loadComponent: () => import('./views/form/fileuploads/fileuploads').then((m) => m.Fileuploads),
        data: { title: 'File Uploads' },
      },
      {
        path: 'form/text-editors',
        loadComponent: () => import('./views/form/text-editors/text-editors').then((m) => m.TextEditors),
        data: { title: 'Text Editors' },
      },
      {
        path: 'form/range-slider',
        loadComponent: () => import('./views/form/range-slider/range-slider').then((m) => m.RangeSlider),
        data: { title: 'Range Slider' },
      },
      {
        path: 'form/layout',
        loadComponent: () => import('./views/form/layout/layout').then((m) => m.Layout),
        data: { title: 'Layouts' },
      },
      {
        path: 'form/other-plugin',
        loadComponent: () => import('./views/form/other-plugin/other-plugin').then((m) => m.OtherPlugin),
        data: { title: 'Other Plugins' },
      },
      {
        path: 'tables/static',
        loadComponent: () => import('./views/tables/static/static').then((m) => m.Static),
        data: { title: 'Static Tables' },
      },
      {
        path: 'tables/custom',
        loadComponent: () => import('./views/tables/custom/custom').then((m) => m.Custom),
        data: { title: 'Custom Tables' },
      },
      {
        path: 'tables/datatables/basic',
        loadComponent: () => import('./views/tables/datatables/basic/basic').then((m) => m.Basic),
        data: { title: 'Basic' },
      },
      {
        path: 'tables/datatables/export-data',
        loadComponent: () => import('./views/tables/datatables/export-data/export-data').then((m) => m.ExportData),
        data: { title: 'Export Data' },
      },
      {
        path: 'tables/datatables/select',
        loadComponent: () => import('./views/tables/datatables/select/select').then((m) => m.Select),
        data: { title: 'Select' },
      },
      {
        path: 'tables/datatables/ajax',
        loadComponent: () => import('./views/tables/datatables/ajax/ajax').then((m) => m.Ajax),
        data: { title: 'Ajax' },
      },
      {
        path: 'tables/datatables/javascript',
        loadComponent: () => import('./views/tables/datatables/javascript/javascript').then((m) => m.Javascript),
        data: { title: 'Javascript Source' },
      },
      {
        path: 'tables/datatables/rendering',
        loadComponent: () => import('./views/tables/datatables/rendering/rendering').then((m) => m.Rendering),
        data: { title: 'Data Rendering' },
      },
      {
        path: 'tables/datatables/scroll',
        loadComponent: () => import('./views/tables/datatables/scroll/scroll').then((m) => m.Scroll),
        data: { title: 'Scroll' },
      },
      {
        path: 'tables/datatables/fixed-columns',
        loadComponent: () => import('./views/tables/datatables/fixed-columns/fixed-columns').then((m) => m.FixedColumns),
        data: { title: 'Fixed Columns' },
      },
      {
        path: 'tables/datatables/fixed-header',
        loadComponent: () => import('./views/tables/datatables/fixed-header/fixed-header').then((m) => m.FixedHeader),
        data: { title: 'Fixed Header' },
      },
      {
        path: 'tables/datatables/columns',
        loadComponent: () => import('./views/tables/datatables/columns/columns').then((m) => m.Columns),
        data: { title: 'Show & Hide Column' },
      },
      {
        path: 'tables/datatables/child-rows',
        loadComponent: () => import('./views/tables/datatables/child-rows/child-rows').then((m) => m.ChildRows),
        data: { title: 'Child Rows' },
      },
      {
        path: 'tables/datatables/column-searching',
        loadComponent: () => import('./views/tables/datatables/column-searching/column-searching').then((m) => m.ColumnSearching),
        data: { title: 'Column Searching' },
      },
      {
        path: 'tables/datatables/range-search',
        loadComponent: () => import('./views/tables/datatables/range-search/range-search').then((m) => m.RangeSearch),
        data: { title: 'Range Search' },
      },
      {
        path: 'tables/datatables/rows-add',
        loadComponent: () => import('./views/tables/datatables/rows-add/rows-add').then((m) => m.RowsAdd),
        data: { title: 'Add Rows' },
      },
      {
        path: 'tables/datatables/checkbox-select',
        loadComponent: () => import('./views/tables/datatables/checkbox-select/checkbox-select').then((m) => m.CheckboxSelect),
        data: { title: 'Checkbox Select' },
      },
      {
        path: 'icons/tabler',
        loadComponent: () => import('./views/icons/tabler/tabler').then((m) => m.Tabler),
        data: { title: 'Tabler' },
      },
      {
        path: 'icons/lucide',
        loadComponent: () => import('./views/icons/lucide/lucide').then((m) => m.Lucide),
        data: { title: 'Lucide' },
      },
      {
        path: 'icons/flags',
        loadComponent: () => import('./views/icons/flags/flags').then((m) => m.Flags),
        data: { title: 'Flags' },
      },
      {
        path: 'maps/google',
        loadComponent: () => import('./views/maps/google/google').then((m) => m.Google),
        data: { title: 'Google Maps' },
      },
      {
        path: 'maps/vector',
        loadComponent: () => import('./views/maps/vector/vector').then((m) => m.Vector),
        data: { title: 'Vector Maps' },
      },
      {
        path: 'maps/leaflet',
        loadComponent: () => import('./views/maps/leaflet/leaflet').then((m) => m.Leaflet),
        data: { title: 'Leaflet Maps' },
      },
    ],
  },
  {
    path: '',
    canActivate: [LayoutService],
    children: [
      {
        path: 'landing',
        loadComponent: () => import('./views//landing/landing').then((m) => m.Landing),
        data: { title: 'Landing' },
      },
      {
        path: 'pages/coming-soon',
        loadComponent: () => import('./views/pages/coming-soon/coming-soon').then((m) => m.ComingSoon),
        data: { title: 'Coming Soon' },
      },
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
