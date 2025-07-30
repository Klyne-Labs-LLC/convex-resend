import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  IconMail as EmailIcon, 
  IconCheck as CheckIcon, 
  IconEye as EyeIcon, 
  IconAlertCircle as AlertCircleIcon,
  IconRocket as RocketIcon,
  IconMailForward as MailForwardIcon,
  IconInbox as InboxIcon,
  IconTrash as TrashIcon,
  IconMoodAngry as MoodAngryIcon,
  IconGhost as GhostIcon
} from "@tabler/icons-react";

export function DashboardPage() {
  const navigate = useNavigate();
  const emails = useQuery(api.emails.listMyEmailsAndStatuses);
  const sendEmail = useMutation(api.emails.sendEmail);
  
  const [quickEmail, setQuickEmail] = useState("");
  const [quickSubject, setQuickSubject] = useState("Quick Test");
  const [quickMessage, setQuickMessage] = useState("This is a quick test email from the dashboard.");
  const [isSending, setIsSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const stats = {
    totalEmails: emails?.length || 0,
    delivered: emails?.filter(e => e.status === "delivered").length || 0,
    opened: emails?.filter(e => e.opened).length || 0,
    bounced: emails?.filter(e => e.status === "bounced").length || 0,
  };

  const deliveryRate = stats.totalEmails > 0 ? ((stats.delivered / stats.totalEmails) * 100).toFixed(1) : 0;
  const openRate = stats.delivered > 0 ? ((stats.opened / stats.delivered) * 100).toFixed(1) : 0;

  const handleQuickSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickEmail || !quickSubject || !quickMessage) return;

    setIsSending(true);
    setSuccess(false);
    try {
      await sendEmail({
        to: quickEmail,
        subject: quickSubject,
        body: quickMessage,
      });
      setQuickEmail("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error sending email:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 px-4 lg:px-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Emails</CardTitle>
                <EmailIcon className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalEmails}</div>
                <p className="text-xs text-muted-foreground">
                  Total emails sent
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
                <CheckIcon className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{deliveryRate}%</div>
                <p className="text-xs text-muted-foreground">
                  {stats.delivered} delivered
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
                <EyeIcon className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{openRate}%</div>
                <p className="text-xs text-muted-foreground">
                  {stats.opened} opened
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bounced</CardTitle>
                <AlertCircleIcon className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.bounced}</div>
                <p className="text-xs text-muted-foreground">
                  Failed deliveries
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Send Email Widget */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Send Email</CardTitle>
                <CardDescription>
                  Send a quick test email right from the dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                {success && (
                  <Alert className="mb-4">
                    <AlertDescription>
                      <CheckIcon className="h-4 w-4 text-green-500 mr-2" /> Email sent successfully!
                    </AlertDescription>
                  </Alert>
                )}
                <form onSubmit={(e) => {
                  e.preventDefault();
                  void handleQuickSend(e);
                }} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quick-email">To</Label>
                      <Input
                        id="quick-email"
                        type="email"
                        value={quickEmail}
                        onChange={(e) => setQuickEmail(e.target.value)}
                        placeholder="delivered@resend.dev"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quick-subject">Subject</Label>
                      <Input
                        id="quick-subject"
                        value={quickSubject}
                        onChange={(e) => setQuickSubject(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2 flex items-end">
                      <Button 
                        type="submit" 
                        disabled={isSending || !quickEmail || !quickSubject || !quickMessage}
                        className="w-full"
                      >
                        {isSending ? (
                          <>
                            <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <RocketIcon className="h-4 w-4 mr-2" /> Send Quick Email
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quick-message">Message</Label>
                    <Textarea
                      id="quick-message"
                      value={quickMessage}
                      onChange={(e) => setQuickMessage(e.target.value)}
                      rows={2}
                      required
                    />
                  </div>
                </form>
                <div className="mt-4 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/send-email")}
                    className="w-full"
                  >
                    <MailForwardIcon className="h-4 w-4 mr-2" /> Go to Full Email Composer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Emails */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Emails</CardTitle>
                <CardDescription>
                  Your most recently sent emails
                </CardDescription>
              </CardHeader>
              <CardContent>
                {emails === undefined ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : emails.length === 0 ? (
                  <div className="text-center py-8">
                    <InboxIcon className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No emails sent yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {emails.slice(0, 5).map((email) => (
                      <div key={email.emailId} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <EmailIcon className="h-4 w-4 text-muted-foreground" />
                            <h4 className="font-medium truncate">
                              {email.subject || "No subject"}
                            </h4>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            To: {email.to}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(email.sentAt).toLocaleString()}
                          </p>
                        </div>
                        <Badge variant={
                          !email.status
                            ? "destructive"
                            : email.status === 'bounced'
                              ? "destructive"
                              : email.status === 'delivered'
                                ? "default"
                                : email.opened
                                  ? "default"
                                  : email.errorMessage
                                    ? "destructive"
                                    : "secondary"
                        }>
                          <span className="mr-1">
                            {!email.status
                              ? <TrashIcon className="h-4 w-4 text-muted-foreground" />
                              : email.status === 'bounced'
                                ? <MoodAngryIcon className="h-4 w-4 text-destructive" />
                                : email.status === 'delivered'
                                  ? <CheckIcon className="h-4 w-4 text-muted-foreground" />
                                  : email.opened
                                    ? <EyeIcon className="h-4 w-4 text-muted-foreground" />
                                    : email.errorMessage
                                      ? <AlertCircleIcon className="h-4 w-4 text-destructive" />
                                      : <GhostIcon className="h-4 w-4 text-muted-foreground" />
                            }
                          </span>
                          {!email.status
                            ? "Missing"
                            : email.status === 'bounced'
                              ? "Bounced"
                              : email.status === 'delivered'
                                ? email.opened 
                                  ? "Opened" 
                                  : "Delivered"
                                : email.errorMessage
                                  ? "Error"
                                  : email.status.charAt(0).toUpperCase() + email.status.slice(1)}
                        </Badge>
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