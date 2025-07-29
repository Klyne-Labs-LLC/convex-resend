import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AnalyticsPage() {
  const emails = useQuery(api.emails.listMyEmailsAndStatuses);

  const stats = {
    totalEmails: emails?.length || 0,
    delivered: emails?.filter(e => e.status === "delivered").length || 0,
    opened: emails?.filter(e => e.opened).length || 0,
    bounced: emails?.filter(e => e.status === "bounced").length || 0,
    complained: emails?.filter(e => e.complained).length || 0,
    errors: emails?.filter(e => e.errorMessage).length || 0,
  };

  const deliveryRate = stats.totalEmails > 0 ? ((stats.delivered / stats.totalEmails) * 100).toFixed(1) : 0;
  const openRate = stats.delivered > 0 ? ((stats.opened / stats.delivered) * 100).toFixed(1) : 0;
  const bounceRate = stats.totalEmails > 0 ? ((stats.bounced / stats.totalEmails) * 100).toFixed(1) : 0;
  const complaintRate = stats.delivered > 0 ? ((stats.complained / stats.delivered) * 100).toFixed(1) : 0;

  // Get recent activity data
  const recentEmails = emails?.slice(-7) || [];
  const dailyStats = recentEmails.reduce((acc, email) => {
    const date = new Date(email.sentAt).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = { sent: 0, delivered: 0, opened: 0 };
    }
    acc[date].sent++;
    if (email.status === "delivered") acc[date].delivered++;
    if (email.opened) acc[date].opened++;
    return acc;
  }, {} as Record<string, { sent: number; delivered: number; opened: number }>);

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{deliveryRate}%</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.delivered} of {stats.totalEmails} emails delivered
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{openRate}%</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.opened} of {stats.delivered} delivered emails opened
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{bounceRate}%</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.bounced} emails bounced
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Complaint Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{complaintRate}%</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.complained} complaints received
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Status Breakdown */}
            <div className="grid gap-6 md:grid-cols-2 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Status Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Delivered</span>
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium">{stats.delivered}</div>
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500" 
                            style={{ width: `${stats.totalEmails > 0 ? (stats.delivered / stats.totalEmails) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Opened</span>
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium">{stats.opened}</div>
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500" 
                            style={{ width: `${stats.totalEmails > 0 ? (stats.opened / stats.totalEmails) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Bounced</span>
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium">{stats.bounced}</div>
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-red-500" 
                            style={{ width: `${stats.totalEmails > 0 ? (stats.bounced / stats.totalEmails) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Complained</span>
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium">{stats.complained}</div>
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-yellow-500" 
                            style={{ width: `${stats.totalEmails > 0 ? (stats.complained / stats.totalEmails) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  {Object.keys(dailyStats).length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No recent activity</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {Object.entries(dailyStats).map(([date, stats]) => (
                        <div key={date} className="flex items-center justify-between">
                          <div className="text-sm font-medium">{date}</div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Sent: {stats.sent}</span>
                            <span>Delivered: {stats.delivered}</span>
                            <span>Opened: {stats.opened}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}