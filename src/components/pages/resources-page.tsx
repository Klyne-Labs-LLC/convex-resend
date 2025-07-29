import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ResourcesPage() {
  const resources = [
    {
      title: "Convex Documentation",
      description: "Read comprehensive documentation for all Convex features and learn how to build full-stack applications.",
      href: "https://docs.convex.dev/home",
      category: "Backend",
      icon: "🏗️"
    },
    {
      title: "Resend Email Service",
      description: "Resend is a modern email service that provides a simple API for sending transactional emails at scale.",
      href: "https://resend.com/",
      category: "Email",
      icon: "📧"
    },
    {
      title: "Convex Auth",
      description: "Convex Auth is a modern authentication library that integrates seamlessly with Convex backend.",
      href: "https://labs.convex.dev/auth/",
      category: "Authentication",
      icon: "🔐"
    },
    {
      title: "Resend Component",
      description: "Official Resend component for Convex that handles email queuing, batching, and delivery tracking.",
      href: "https://www.convex.dev/components/resend",
      category: "Integration",
      icon: "🔗"
    },
    {
      title: "shadcn/ui Components",
      description: "Beautiful and accessible React components built with Radix UI and Tailwind CSS.",
      href: "https://ui.shadcn.com/",
      category: "UI",
      icon: "🎨"
    },
    {
      title: "Tailwind CSS",
      description: "A utility-first CSS framework for rapidly building custom user interfaces.",
      href: "https://tailwindcss.com/",
      category: "Styling",
      icon: "🎭"
    }
  ];

  const categories = [...new Set(resources.map(r => r.category))];

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            {categories.map(category => (
              <div key={category} className="mb-8">
                <h2 className="text-lg font-semibold mb-4">{category}</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {resources
                    .filter(resource => resource.category === category)
                    .map((resource) => (
                      <Card key={resource.title} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <CardTitle className="text-base">{resource.title}</CardTitle>
                          <CardDescription>
                            {resource.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button asChild variant="outline" className="w-full">
                            <a 
                              href={resource.href} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              Visit Documentation
                            </a>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            ))}

            {/* Quick Tips */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-1">Test Email Addresses</h3>
                    <p className="text-sm text-muted-foreground">
                      Use delivered@resend.dev, bounced@resend.dev, complained@resend.dev 
                      to test different scenarios without affecting real recipients.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Email Tracking</h3>
                    <p className="text-sm text-muted-foreground">
                      All emails are automatically tracked for delivery status, opens, and complaints. 
                      Check Analytics for detailed metrics.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Domain Verification</h3>
                    <p className="text-sm text-muted-foreground">
                      To send to real recipients, verify your domain in your Resend account. 
                      Test addresses work without verification.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Real-time Updates</h3>
                    <p className="text-sm text-muted-foreground">
                      Email statuses update in real-time. You'll see delivery confirmations 
                      and opens as they happen.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}