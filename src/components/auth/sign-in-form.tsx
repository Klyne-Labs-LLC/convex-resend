import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { IconMail as MailIcon } from "@tabler/icons-react";

export function SignInForm() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2">
            <MailIcon className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Resend Email Testing</h1>
          </div>
          <p className="text-muted-foreground">
            Sign in to start testing email delivery
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{flow === "signIn" ? "Sign In" : "Sign Up"}</CardTitle>
            <CardDescription>
              {flow === "signIn" 
                ? "Welcome back! Sign in to your account" 
                : "Create a new account to get started"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setError(null);
                setIsLoading(true);
                
                const formData = new FormData(e.target as HTMLFormElement);
                formData.set("flow", flow);
                
                void (async () => {
                  try {
                    await signIn("password", formData);
                  } catch (error: any) {
                    setError(error.message || "An error occurred during sign in");
                  } finally {
                    setIsLoading(false);
                  }
                })();
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="email@your-verified-domain.com"
                  required
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">
                  You must use a verified domain for your email to send correctly
                </p>
              </div>
              
              {flow === "signUp" && (
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Your full name"
                    required
                    disabled={isLoading}
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Your password"
                  required
                  disabled={isLoading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                    {flow === "signIn" ? "Signing in..." : "Signing up..."}
                  </>
                ) : (
                  <>
                    {flow === "signIn" ? "Sign in" : "Sign up"}
                  </>
                )}
              </Button>

              <div className="flex items-center justify-center gap-2 text-sm">
                <span className="text-muted-foreground">
                  {flow === "signIn"
                    ? "Don't have an account?"
                    : "Already have an account?"}
                </span>
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto"
                  onClick={() => {
                    setFlow(flow === "signIn" ? "signUp" : "signIn");
                    setError(null);
                  }}
                  disabled={isLoading}
                >
                  {flow === "signIn" ? "Sign up" : "Sign in"}
                </Button>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {error}
                  </AlertDescription>
                </Alert>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}