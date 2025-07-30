"use client";

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DashboardPage } from "@/components/pages/dashboard-page";
import { SendEmailPage } from "@/components/pages/send-email-page";
import { EmailHistoryPage } from "@/components/pages/email-history-page";
import { AnalyticsPage } from "@/components/pages/analytics-page";
import { ResourcesPage } from "@/components/pages/resources-page";
import React from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { themes } from "@/themes";
import { useThemeLoader } from "@/hooks/use-theme-loader";
import { DEFAULT_THEME } from "@/theme.config";

export default function App() {
  // Global theme state with immediate default theme loading
  const [theme, setTheme] = React.useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || DEFAULT_THEME;
  });
  
  useThemeLoader(theme);
  
  React.useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <Routes>
      {/* Root redirect to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* Protected routes with dashboard layout */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/send-email"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <SendEmailPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/email-history"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <EmailHistoryPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <AnalyticsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/resources"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ResourcesPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <SettingsPage theme={theme} setTheme={setTheme} />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/help"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <HelpPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function SettingsPage({ theme, setTheme }: { theme: string; setTheme: React.Dispatch<React.SetStateAction<string>> }) {
  const { signOut } = useAuthActions();
  const { isAuthenticated } = useConvexAuth();

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Theme Switcher Card */}
              <Card>
                <CardTitle className="pl-4">Theme</CardTitle>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {themes.map((t) => (
                      <Button
                        key={t.name}
                        variant={theme === t.name ? "default" : "outline"}
                        onClick={() => setTheme(t.name)}
                      >
                        {t.name}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
              {/* Account Section */}
              <Card>
                <CardTitle className="pl-4">Account</CardTitle>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Status</label>
                      <p className="text-sm text-muted-foreground">
                        {isAuthenticated ? "Signed in" : "Not signed in"}
                      </p>
                    </div>
                    <div>
                      <button
                        onClick={() => void signOut()}
                        className="bg-destructive text-destructive-foreground px-4 py-2 rounded-md text-sm hover:bg-destructive/90 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* Email Config Section */}
              <Card>
                <CardTitle className="pl-4">Email Configuration</CardTitle>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Email settings are managed through your Resend account. 
                    Visit <a href="https://resend.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">resend.com</a> to configure domains and API keys.
                  </p>
                </CardContent>
              </Card>
              {/* About Section */}
              <Card>
                <CardTitle className="pl-4">About</CardTitle>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Demo application for testing Resend email delivery built with Convex, React, and shadcn/ui.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Help page component
function HelpPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="bg-card p-6 rounded-lg border">
                  <h2 className="text-lg font-semibold mb-4">Getting Started</h2>
                  <ol className="space-y-2 text-sm text-muted-foreground">
                    <li>1. Sign in with your credentials</li>
                    <li>2. Navigate to "Send Email" to compose a test email</li>
                    <li>3. Choose a test recipient or enter a custom email</li>
                    <li>4. Send your email and track its status</li>
                    <li>5. View analytics and history in their respective sections</li>
                  </ol>
                </div>

                <div className="bg-card p-6 rounded-lg border">
                  <h2 className="text-lg font-semibold mb-4">Test Email Addresses</h2>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• <code>delivered@resend.dev</code> - Always delivers successfully</li>
                    <li>• <code>bounced@resend.dev</code> - Always bounces</li>
                    <li>• <code>complained@resend.dev</code> - Delivers but marks as complaint</li>
                  </ul>
                </div>

                <div className="bg-card p-6 rounded-lg border">
                  <h2 className="text-lg font-semibold mb-4">Understanding Analytics</h2>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• <strong>Delivery Rate:</strong> Percentage of emails successfully delivered</li>
                    <li>• <strong>Open Rate:</strong> Percentage of delivered emails that were opened</li>
                    <li>• <strong>Bounce Rate:</strong> Percentage of emails that bounced</li>
                    <li>• <strong>Complaint Rate:</strong> Percentage of emails marked as spam</li>
                  </ul>
                </div>

                <div className="bg-card p-6 rounded-lg border">
                  <h2 className="text-lg font-semibold mb-4">Troubleshooting</h2>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Emails not sending? Check your domain verification</li>
                    <li>• Status not updating? Wait a few moments for real-time updates</li>
                    <li>• Can't sign in? Ensure you're using the correct credentials</li>
                    <li>• Need custom domains? Configure them in your Resend account</li>
                  </ul>
                </div>
              </div>

              <div className="bg-card p-6 rounded-lg border">
                <h2 className="text-lg font-semibold mb-4">Support Links</h2>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <h3 className="font-medium mb-2">Convex Support</h3>
                    <p className="text-sm text-muted-foreground">
                      Visit <a href="https://docs.convex.dev" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">docs.convex.dev</a> for backend help
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Resend Support</h3>
                    <p className="text-sm text-muted-foreground">
                      Visit <a href="https://resend.com/docs" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">resend.com/docs</a> for email service help
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Component Library</h3>
                    <p className="text-sm text-muted-foreground">
                      Visit <a href="https://ui.shadcn.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">ui.shadcn.com</a> for UI component docs
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}