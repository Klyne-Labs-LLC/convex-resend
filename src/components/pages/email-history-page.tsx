import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function EmailHistoryPage() {
  const emails = useQuery(api.emails.listMyEmailsAndStatuses);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEmails = emails?.filter(email => 
    email.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.to.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">📊 Email History</h1>
              <p className="text-muted-foreground">
                Track your sent emails and their delivery status
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All Emails</CardTitle>
                <CardDescription>
                  View and search through all your sent emails
                </CardDescription>
                <div className="pt-4">
                  <Input
                    placeholder="Search emails by subject or recipient..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
              </CardHeader>
              <CardContent>
                {emails === undefined ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : filteredEmails.length === 0 ? (
                  <div className="text-center py-12">
                    <span className="text-6xl mb-4 block">📭</span>
                    <p className="text-muted-foreground text-lg">
                      {emails.length === 0 ? "No emails sent yet" : "No emails match your search"}
                    </p>
                    <p className="text-muted-foreground text-sm mt-2">
                      {emails.length === 0 ? "Send your first test email to get started" : "Try adjusting your search terms"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredEmails.map((email) => (
                      <Card key={email.emailId} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-xl">📧</span>
                                <h3 className="font-semibold truncate text-lg">
                                  {email.subject || "No subject"}
                                </h3>
                              </div>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm">📮</span>
                                <p className="text-sm text-muted-foreground">
                                  To: <span className="font-medium">{email.to}</span>
                                </p>
                              </div>
                              <div className="flex items-center gap-2 mb-3">
                                <span className="text-sm">🕒</span>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(email.sentAt).toLocaleString()}
                                </p>
                              </div>
                              
                              {/* Additional details for history view */}
                              <div className="flex gap-2 text-xs text-muted-foreground">
                                {email.opened && (
                                  <span className="flex items-center gap-1">
                                    <span>👀</span> Opened
                                  </span>
                                )}
                                {email.complained && (
                                  <span className="flex items-center gap-1">
                                    <span>🤬</span> Complained
                                  </span>
                                )}
                                {email.errorMessage && (
                                  <span className="flex items-center gap-1 text-red-500">
                                    <span>❌</span> {email.errorMessage}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex-shrink-0">
                              <Badge 
                                variant={
                                  !email.status
                                    ? "destructive"
                                    : email.complained
                                      ? "secondary"
                                      : email.opened
                                        ? "default"
                                        : email.status === "delivered"
                                          ? "default"
                                          : email.status === "bounced"
                                            ? "destructive"
                                            : email.errorMessage
                                              ? "destructive"
                                              : "secondary"
                                }
                                className="text-sm"
                              >
                                <span className="mr-1">
                                  {!email.status
                                    ? "🗑️"
                                    : email.complained
                                      ? "🤬"
                                      : email.opened
                                        ? "👀"
                                        : email.status === "delivered"
                                          ? "✅"
                                          : email.status === "bounced"
                                            ? "👻"
                                            : email.errorMessage
                                              ? "❌"
                                              : "⏳"}
                                </span>
                                {!email.status
                                  ? "Email missing"
                                  : email.complained
                                    ? "Delivered (but complained)"
                                    : email.opened
                                      ? "Opened"
                                      : email.status === "bounced"
                                        ? "Bounced"
                                        : email.errorMessage
                                          ? "Error"
                                          : email.status}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}