import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function SendEmailPage() {
  const sendEmail = useMutation(api.emails.sendEmail);
  const [selectedRecipient, setSelectedRecipient] = useState<string>("");
  const [subject, setSubject] = useState("Hello");
  const [message, setMessage] = useState("World");
  const [isSending, setIsSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const testEmails = [
    "delivered@resend.dev",
    "bounced@resend.dev",
    "complained@resend.dev",
  ];

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecipient || !subject || !message) {
      return;
    }

    setIsSending(true);
    setSuccess(false);
    try {
      await sendEmail({
        to: selectedRecipient,
        subject: subject,
        body: message,
      });
      setSelectedRecipient("");
      setSubject("Hello");
      setMessage("World");
      setSuccess(true);
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
          <div className="px-4 lg:px-6">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">🚀 Send Test Email</h1>
                <p className="text-muted-foreground">
                  Test email delivery to Resend's test addresses
                </p>
              </div>

              {success && (
                <Alert className="mb-6">
                  <AlertDescription>
                    ✅ Email sent successfully!
                  </AlertDescription>
                </Alert>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Email Composer</CardTitle>
                  <CardDescription>
                    Compose and send your test email
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={(e) => void handleSendEmail(e)} className="space-y-6">
                    {/* Recipient Selection */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">📮</span>
                        <Label className="text-lg font-semibold">
                          Choose Test Recipient
                        </Label>
                      </div>
                      <RadioGroup
                        value={selectedRecipient}
                        onValueChange={setSelectedRecipient}
                      >
                        <div className="grid grid-cols-1 gap-3">
                          {testEmails.map((email) => (
                            <div key={email} className="flex items-center space-x-3 border rounded-lg p-4">
                              <RadioGroupItem value={email} id={email} />
                              <Label htmlFor={email} className="flex items-center gap-2 cursor-pointer">
                                <span>{email}</span>
                                <span>
                                  {email.includes("delivered")
                                    ? "✅"
                                    : email.includes("bounced")
                                      ? "❌"
                                      : email.includes("complained")
                                        ? "⚠️"
                                        : "👋"}
                                </span>
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>

                    <Separator />

                    {/* To Field */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">📝</span>
                        <Label className="text-lg font-semibold">To</Label>
                      </div>
                      <Input
                        type="text"
                        value={selectedRecipient}
                        onChange={(e) => setSelectedRecipient(e.target.value)}
                        placeholder="email@your-verified-domain.com"
                      />
                    </div>

                    {/* Subject Field */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">📝</span>
                        <Label className="text-lg font-semibold">Subject</Label>
                      </div>
                      <Input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Enter your email subject..."
                        required
                      />
                    </div>

                    {/* Message Field */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">💬</span>
                        <Label className="text-lg font-semibold">Message</Label>
                      </div>
                      <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Write your email message here..."
                        rows={6}
                        required
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isSending || !selectedRecipient || !subject || !message}
                      className="w-full"
                      size="lg"
                    >
                      {isSending ? (
                        <>
                          <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                          Sending Email...
                        </>
                      ) : (
                        <>
                          <span className="mr-2">🚀</span>
                          Send Test Email
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}