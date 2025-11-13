import { lazy } from 'react';

// Lazy load des pages non-critiques
export const LazyAbout = lazy(() => import('@/pages/About'));
export const LazyBlog = lazy(() => import('@/pages/Blog'));
export const LazyBlogPost = lazy(() => import('@/pages/BlogPost'));
export const LazyBlogEditor = lazy(() => import('@/pages/BlogEditor'));
export const LazyContact = lazy(() => import('@/pages/Contact'));
export const LazyDiscussions = lazy(() => import('@/pages/Discussions'));
export const LazyFavoris = lazy(() => import('@/pages/Favoris'));
export const LazyProfile = lazy(() => import('@/pages/Profile'));
export const LazyPublicProfile = lazy(() => import('@/pages/PublicProfile'));
export const LazySettings = lazy(() => import('@/pages/Settings'));
export const LazyNotifications = lazy(() => import('@/pages/Notifications'));
export const LazyMyAds = lazy(() => import('@/pages/MyAds'));
export const LazyAdSummary = lazy(() => import('@/pages/AdSummary'));

// Lazy load des pages admin
export const LazyAdmin = lazy(() => import('@/pages/Admin'));
export const LazyAdminAds = lazy(() => import('@/pages/AdminAds'));
export const LazyAdminAgencies = lazy(() => import('@/pages/AdminAgencies'));
export const LazyAdminBlog = lazy(() => import('@/pages/AdminBlog'));
export const LazyAdminOmraManagement = lazy(() => import('@/pages/AdminOmraManagement'));
export const LazyAdminOmraOffers = lazy(() => import('@/pages/AdminOmraOffers'));
export const LazyAdminScrapers = lazy(() => import('@/pages/AdminScrapers'));
export const LazyAdminSecurityAudit = lazy(() => import('@/pages/AdminSecurityAudit'));
export const LazyAdminTopicRequests = lazy(() => import('@/pages/AdminTopicRequests'));

// Lazy load des pages de publication
export const LazyCategorySelection = lazy(() => import('@/pages/publish/CategorySelection'));
export const LazyFormulaSelection = lazy(() => import('@/pages/publish/FormulaSelection'));
export const LazySejourDetails = lazy(() => import('@/pages/publish/SejourDetails'));
export const LazyVolDetails = lazy(() => import('@/pages/publish/VolDetails'));
export const LazyHebergementDetails = lazy(() => import('@/pages/publish/HebergementDetails'));
export const LazyGuideDetails = lazy(() => import('@/pages/publish/GuideDetails'));
export const LazyChauffeurDetails = lazy(() => import('@/pages/publish/ChauffeurDetails'));
export const LazyBabysittingDetails = lazy(() => import('@/pages/publish/BabysittingDetails'));

// Lazy load des utilitaires
export const LazyIslamicCalendar = lazy(() => import('@/pages/IslamicCalendar'));
export const LazyPrayerTimes = lazy(() => import('@/pages/PrayerTimes'));
export const LazyRamadanHajjDates = lazy(() => import('@/pages/RamadanHajjDates'));

// Lazy load des comparateurs
export const LazyComparateurOmra = lazy(() => import('@/pages/ComparateurOmra'));
export const LazyComparatifVisuel = lazy(() => import('@/pages/ComparatifVisuel'));
