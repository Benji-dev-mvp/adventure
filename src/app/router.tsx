import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppShell } from "./AppShell";

import { HomePage } from "@/pages/home/HomePage";
import { ProductPage } from "@/pages/product/ProductPage";
import { HowItWorksPage } from "@/pages/how-it-works/HowItWorksPage";
import { SolutionsPage } from "@/pages/solutions/SolutionsPage";
import { SalesLeadersPage } from "@/pages/solutions/SalesLeadersPage";
import { RevOpsPage } from "@/pages/solutions/RevOpsPage";
import { StartupsPage } from "@/pages/solutions/StartupsPage";
import { PricingPage } from "@/pages/pricing/PricingPage";
import { ResourcesHubPage } from "@/pages/resources/ResourcesHubPage";
import { CaseStudiesPage } from "@/pages/resources/CaseStudiesPage";
import { BlogIndexPage } from "@/pages/resources/BlogIndexPage";
import { BlogPostPage } from "@/pages/resources/BlogPostPage";
import { AboutPage } from "@/pages/company/AboutPage";
import { CustomersPage } from "@/pages/company/CustomersPage";
import { SecurityPage } from "@/pages/company/SecurityPage";
import { LoginPage } from "@/pages/auth/LoginPage";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Marketing pages with AppShell */}
        <Route path="/" element={<AppShell><HomePage /></AppShell>} />
        <Route path="/product" element={<AppShell><ProductPage /></AppShell>} />
        <Route path="/how-it-works" element={<AppShell><HowItWorksPage /></AppShell>} />

        <Route path="/solutions" element={<AppShell><SolutionsPage /></AppShell>} />
        <Route path="/solutions/sales-leaders" element={<AppShell><SalesLeadersPage /></AppShell>} />
        <Route path="/solutions/rev-ops" element={<AppShell><RevOpsPage /></AppShell>} />
        <Route path="/solutions/startups" element={<AppShell><StartupsPage /></AppShell>} />

        <Route path="/pricing" element={<AppShell><PricingPage /></AppShell>} />

        <Route path="/resources" element={<AppShell><ResourcesHubPage /></AppShell>} />
        <Route path="/resources/case-studies" element={<AppShell><CaseStudiesPage /></AppShell>} />
        <Route path="/resources/blog" element={<AppShell><BlogIndexPage /></AppShell>} />
        <Route path="/resources/blog/:slug" element={<AppShell><BlogPostPage /></AppShell>} />

        <Route path="/company/about" element={<AppShell><AboutPage /></AppShell>} />
        <Route path="/company/customers" element={<AppShell><CustomersPage /></AppShell>} />
        <Route path="/company/security" element={<AppShell><SecurityPage /></AppShell>} />

        {/* Login page without AppShell */}
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}
