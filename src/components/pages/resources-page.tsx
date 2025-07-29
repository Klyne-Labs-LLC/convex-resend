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
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">📚 Resources</h1>
              <p className="text-muted-foreground">
                Helpful documentation and guides for the technologies used in this project
              </p>
            </div>

            {categories.map(category => (
              <div key={category} className="mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  {category}
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {resources
                    .filter(resource => resource.category === category)
                    .map((resource) => (
                      <Card key={resource.title} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <span className="text-2xl">{resource.icon}</span>
                            {resource.title}
                          </CardTitle>
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
                              className="flex items-center gap-2"
                            >
                              Visit Documentation
                              <span>🔗</span>
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
                <CardTitle>💡 Quick Tips</CardTitle>
                <CardDescription>
                  Helpful tips for using this email testing application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-semibold text-blue-700">Test Email Addresses</h3>
                    <p className="text-sm text-muted-foreground">
                      Use the provided test addresses (delivered@resend.dev, bounced@resend.dev, complained@resend.dev) 
                      to test different email scenarios without affecting real recipients.
                    </p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h3 className="font-semibold text-green-700">Email Tracking</h3>
                    <p className="text-sm text-muted-foreground">
                      All sent emails are automatically tracked for delivery status, opens, and complaints. 
                      Check the Analytics page for detailed performance metrics.
                    </p>
                  </div>
                  <div className="border-l-4 border-yellow-500 pl-4">
                    <h3 className="font-semibold text-yellow-700">Domain Verification</h3>
                    <p className="text-sm text-muted-foreground">
                      To send emails to real recipients, make sure your email domain is verified in your Resend account. 
                      Test addresses work without verification.
                    </p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h3 className="font-semibold text-purple-700">Real-time Updates</h3>
                    <p className="text-sm text-muted-foreground">
                      Email statuses update in real-time thanks to Convex's reactive database. 
                      You'll see delivery confirmations and opens as they happen.
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