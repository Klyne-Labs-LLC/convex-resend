import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
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
            <div className="mb-6">
              <Input
                placeholder="Search emails by subject or recipient..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <Card>
              <CardContent>
                {emails === undefined ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : filteredEmails.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">
                      {emails.length === 0 ? "No emails sent yet" : "No emails match your search"}
                    </p>
                    <p className="text-muted-foreground text-sm mt-2">
                      {emails.length === 0 ? "Send your first test email to get started" : "Try adjusting your search terms"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredEmails.map((email) => (
                      <div key={email.emailId} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium truncate">
                                {email.subject || "No subject"}
                              </h3>
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">
                              To: {email.to}
                            </p>
                            <p className="text-xs text-muted-foreground mb-2">
                              {new Date(email.sentAt).toLocaleString()}
                            </p>
                            
                            {/* Additional details */}
                            <div className="flex gap-3 text-xs text-muted-foreground">
                              {email.opened && <span>Opened</span>}
                              {email.complained && <span>Complained</span>}
                              {email.errorMessage && (
                                <span className="text-red-500">{email.errorMessage}</span>
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
                            >
                              {!email.status
                                ? "Missing"
                                : email.complained
                                  ? "Complained"
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
  );
}