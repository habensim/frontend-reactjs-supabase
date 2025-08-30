import React, { Suspense, lazy } from 'react';
import { PageLoader } from './LoadingSpinner';

interface LazyRouteProps {
  component: React.ComponentType<any>;
  fallback?: React.ReactNode;
}

export function LazyRoute({ component: Component, fallback = <PageLoader /> }: LazyRouteProps) {
  return (
    <Suspense fallback={fallback}>
      <Component />
    </Suspense>
  );
}

// Lazy-loaded page components
export const LazyHomePage = lazy(() => import('../pages/HomePage'));
export const LazyIndustrySelectionPage = lazy(() => import('../pages/IndustrySelectionPage'));
export const LazyTemplateGalleryPage = lazy(() => import('../pages/TemplateGalleryPage'));
export const LazyTemplateOptionsPage = lazy(() => import('../pages/TemplateOptionsPage'));
export const LazyRegistrationPage = lazy(() => import('../pages/RegistrationPage'));
export const LazyCheckoutPage = lazy(() => import('../pages/CheckoutPage'));
export const LazyPaymentSuccessPage = lazy(() => import('../pages/PaymentSuccessPage'));
