import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { 
  IconUsers, 
  IconMessageCircle, 
  IconPlus, 
  IconSearch,
  IconClock,
  IconArrowRight,
  IconStar,
  IconBook as IconBookOpen,
  IconHeart,
  IconEye
} from "@tabler/icons-react";

export function CirclesPage() {
  // Use existing Convex data as reading circles data
  const emailSessions = useQuery(api.emails.listMyEmailsAndStatuses);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"feed" | "my-circles" | "discover">("feed");

  // Transform email data into reading circles
  const mockCircles = emailSessions?.map((session, index) => {
    const circleNames = [
      "Book Club Friends", "Classic Literature Circle", "Sci-Fi Enthusiasts", 
      "Self-Improvement Readers", "Philosophy Discussion Group", "Modern Fiction Fans"
    ];
    const bookTitles = [
      "Atomic Habits", "1984", "Dune", "Think and Grow Rich", "Sapiens", "The Great Gatsby"
    ];
    const authors = [
      "James Clear", "George Orwell", "Frank Herbert", "Napoleon Hill", "Yuval Noah Harari", "F. Scott Fitzgerald"
    ];

    return {
      id: session.emailId,
      name: circleNames[index % circleNames.length],
      currentBook: {
        title: bookTitles[index % bookTitles.length],
        author: authors[index % authors.length]
      },
      memberCount: Math.floor(Math.random() * 50) + 5,
      unreadCount: session.opened ? 0 : Math.floor(Math.random() * 8) + 1,
      lastActivity: session.sentAt,
      isActive: session.status === "delivered",
      weeklyGoal: Math.floor(Math.random() * 100) + 50,
      description: `Discussing ${bookTitles[index % bookTitles.length]} with passionate readers`,
      avatar: ["🎭", "📖", "🌟", "🔮", "💡", "🎨"][index % 6],
      color: ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500", "bg-pink-500", "bg-indigo-500"][index % 6]
    };
  }) || [];

  // Activity feed data
  const activityFeed = emailSessions?.slice(0, 8).map((session, index) => {
    const activities = [
      { type: "discussion", text: "started a discussion about Chapter 5", icon: IconMessageCircle },
      { type: "highlight", text: "shared a highlight from page 127", icon: IconStar },
      { type: "reading", text: "finished reading for the week", icon: IconBookOpen },
      { type: "join", text: "joined the circle", icon: IconUsers },
      { type: "like", text: "liked Sarah's comment", icon: IconHeart }
    ];
    const users = ["Alex Chen", "Sarah Kim", "Mike Rodriguez", "Emma Thompson", "David Wilson"];
    const circles = ["Book Club Friends", "Sci-Fi Enthusiasts", "Philosophy Group"];
    
    const activity = activities[index % activities.length];
    
    return {
      id: session.emailId,
      user: users[index % users.length],
      action: activity.text,
      circle: circles[index % circles.length],
      time: session.sentAt,
      type: activity.type,
      icon: activity.icon,
      isNew: !session.opened
    };
  }) || [];

  const filteredCircles = mockCircles.filter(circle => 
    circle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    circle.currentBook.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Header */}
          <div className="px-4 lg:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Reading Circles</h1>
                  <p className="text-lg text-muted-foreground">Connect, discuss, and grow together</p>
                </div>
                <Button size="lg" className="rounded-full">
                  <IconPlus className="h-5 w-5 mr-2" />
                  Start a Circle
                </Button>
              </div>

              {/* Search */}
              <div className="relative max-w-md mb-8">
                <IconSearch className="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search circles and discussions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 rounded-full border-2"
                />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-4 lg:px-6">
            <div className="max-w-4xl mx-auto">
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
                <TabsList className="grid w-full grid-cols-3 h-12 rounded-full">
                  <TabsTrigger value="feed" className="rounded-full">Activity Feed</TabsTrigger>
                  <TabsTrigger value="my-circles" className="rounded-full">My Circles</TabsTrigger>
                  <TabsTrigger value="discover" className="rounded-full">Discover</TabsTrigger>
                </TabsList>

                {/* Activity Feed */}
                <TabsContent value="feed" className="mt-8">
                  <div className="space-y-4">
                    {activityFeed.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-4 p-4 rounded-xl border bg-card hover:bg-muted/50 transition-colors">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {activity.user.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{activity.user}</span>
                            <span className="text-muted-foreground">{activity.action}</span>
                            {activity.isNew && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                            <span>in {activity.circle}</span>
                            <span>•</span>
                            <span>{new Date(activity.time).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <activity.icon className="h-5 w-5 text-muted-foreground mt-1" />
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* My Circles */}
                <TabsContent value="my-circles" className="mt-8">
                  {filteredCircles.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <IconUsers className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">No circles yet</h3>
                      <p className="text-muted-foreground mb-6">Join your first reading circle to get started</p>
                      <Button size="lg" className="rounded-full">
                        <IconPlus className="h-5 w-5 mr-2" />
                        Create Your First Circle
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredCircles.map((circle) => (
                        <Card key={circle.id} className="overflow-hidden border-l-4 border-l-primary">
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              {/* Circle Avatar */}
                              <div className={`w-12 h-12 ${circle.color} rounded-xl flex items-center justify-center text-white text-xl`}>
                                {circle.avatar}
                              </div>
                              
                              {/* Circle Info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h3 className="text-lg font-semibold">{circle.name}</h3>
                                    <p className="text-sm text-muted-foreground">{circle.description}</p>
                                  </div>
                                  <Button variant="ghost" size="sm" className="rounded-full">
                                    <IconArrowRight className="h-4 w-4" />
                                  </Button>
                                </div>

                                {/* Current Reading */}
                                <div className="flex items-center gap-2 mb-3">
                                  <IconBookOpen className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm font-medium">{circle.currentBook.title}</span>
                                  <span className="text-sm text-muted-foreground">by {circle.currentBook.author}</span>
                                </div>

                                {/* Stats Row */}
                                <div className="flex items-center gap-6 text-sm">
                                  <div className="flex items-center gap-2">
                                    <IconUsers className="h-4 w-4 text-muted-foreground" />
                                    <span>{circle.memberCount} members</span>
                                  </div>
                                  
                                  <div className="flex items-center gap-2">
                                    <IconMessageCircle className="h-4 w-4 text-muted-foreground" />
                                    <span>{circle.unreadCount} new</span>
                                    {circle.unreadCount > 0 && (
                                      <Badge variant="destructive" className="h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                                        {circle.unreadCount}
                                      </Badge>
                                    )}
                                  </div>
                                  
                                  <div className="flex items-center gap-2">
                                    <IconClock className="h-4 w-4 text-muted-foreground" />
                                    <span>{new Date(circle.lastActivity).toLocaleDateString()}</span>
                                  </div>
                                  
                                  {circle.isActive && (
                                    <Badge variant="secondary" className="rounded-full">
                                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                                      Active
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Discover */}
                <TabsContent value="discover" className="mt-8">
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Popular Circles */}
                    <Card className="border-2 border-dashed">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <IconStar className="h-5 w-5 text-yellow-500" />
                          Popular This Week
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {["Atomic Habits Discussion", "Classic Book Club", "Sci-Fi Adventures"].map((name, i) => (
                          <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                            <div>
                              <div className="font-medium">{name}</div>
                              <div className="text-sm text-muted-foreground">{45 + i * 10} members</div>
                            </div>
                            <Button size="sm" variant="outline" className="rounded-full">
                              Join
                            </Button>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    {/* Browse by Genre */}
                    <Card className="border-2 border-dashed">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <IconEye className="h-5 w-5 text-blue-500" />
                          Browse by Genre
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-3">
                          {["Fiction", "Non-Fiction", "Sci-Fi", "Romance", "Mystery", "Self-Help"].map((genre) => (
                            <Button key={genre} variant="outline" className="rounded-full justify-start">
                              {genre}
                            </Button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}