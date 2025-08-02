import { useConvexAuth, useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  IconUser,
  IconSettings,
  IconBook,
  IconHeart,
  IconTarget,
  IconFlame,
  IconBookmark,
  IconUsers,
  IconBell,
  IconLock
} from "@tabler/icons-react";

export function ProfilePage() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  const currentUser = useQuery(api.auth.currentUser);
  const readingData = useQuery(api.emails.listMyEmailsAndStatuses);

  // Transform reading data into profile stats
  const profileStats = {
    booksRead: Math.floor((readingData?.length || 0) / 3) + 2,
    currentStreak: 7,
    totalHighlights: readingData?.filter(s => s.opened).length || 0,
    circlesJoined: 3,
    readingGoal: 24,
    monthlyProgress: Math.floor((readingData?.length || 0) / 2) + 1
  };

  const recentActivity = [
    { action: "Finished reading", book: "Atomic Habits", date: "2 days ago", type: "completed" },
    { action: "Joined circle", book: "Classic Literature Circle", date: "1 week ago", type: "social" },
    { action: "Added to shelf", book: "The Midnight Library", date: "1 week ago", type: "wishlist" },
    { action: "Shared highlight", book: "Sapiens", date: "2 weeks ago", type: "highlight" }
  ];

  const readingPreferences = [
    { category: "Fiction", selected: true },
    { category: "Self-Help", selected: true },
    { category: "Science", selected: false },
    { category: "Biography", selected: true },
    { category: "Fantasy", selected: false },
    { category: "Mystery", selected: true }
  ];

  const achievements = [
    { title: "Speed Reader", description: "Read 5 books in a month", icon: IconFlame, earned: true },
    { title: "Social Butterfly", description: "Join 3 reading circles", icon: IconUsers, earned: true },
    { title: "Highlight Master", description: "Save 50 highlights", icon: IconBookmark, earned: false },
    { title: "Goal Crusher", description: "Complete annual reading goal", icon: IconTarget, earned: false }
  ];

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Profile Header */}
          <div className="px-4 lg:px-6">
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    <Avatar className="h-20 w-20">
                      <AvatarFallback className="text-2xl">
                        {currentUser?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold mb-2">
                        {currentUser?.name || 'Reader'}
                      </h1>
                      <p className="text-muted-foreground mb-4">
                        {currentUser?.email || 'user@example.com'}
                      </p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold">{profileStats.booksRead}</div>
                          <div className="text-sm text-muted-foreground">Books Read</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{profileStats.currentStreak}</div>
                          <div className="text-sm text-muted-foreground">Day Streak</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{profileStats.totalHighlights}</div>
                          <div className="text-sm text-muted-foreground">Highlights</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{profileStats.circlesJoined}</div>
                          <div className="text-sm text-muted-foreground">Circles</div>
                        </div>
                      </div>
                      
                      <Button variant="outline">
                        <IconSettings className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Profile Tabs */}
          <div className="px-4 lg:px-6">
            <div className="max-w-4xl mx-auto">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="achievements">Achievements</TabsTrigger>
                  <TabsTrigger value="preferences">Preferences</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6 mt-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Reading Goal */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <IconTarget className="h-5 w-5" />
                          2024 Reading Goal
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <span>{profileStats.monthlyProgress} of {profileStats.readingGoal} books</span>
                            <span>{Math.round((profileStats.monthlyProgress / profileStats.readingGoal) * 100)}%</span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${Math.min((profileStats.monthlyProgress / profileStats.readingGoal) * 100, 100)}%` }}
                            />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            You're {profileStats.monthlyProgress >= profileStats.readingGoal / 12 ? 'ahead of' : 'behind'} schedule for this month
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Current Reading */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <IconBook className="h-5 w-5" />
                          Currently Reading
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="text-3xl">📚</div>
                            <div>
                              <h3 className="font-semibold">The Alchemist</h3>
                              <p className="text-sm text-muted-foreground">by Paulo Coelho</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>45% complete</span>
                            </div>
                            <div className="w-full bg-secondary rounded-full h-2">
                              <div className="bg-primary h-2 rounded-full" style={{ width: '45%' }} />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentActivity.map((activity, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                            {activity.type === 'completed' && <IconBook className="h-5 w-5 text-green-600" />}
                            {activity.type === 'social' && <IconUsers className="h-5 w-5 text-blue-600" />}
                            {activity.type === 'wishlist' && <IconHeart className="h-5 w-5 text-red-600" />}
                            {activity.type === 'highlight' && <IconBookmark className="h-5 w-5 text-yellow-600" />}
                            
                            <div className="flex-1">
                              <p className="font-medium">{activity.action}</p>
                              <p className="text-sm text-muted-foreground">{activity.book}</p>
                            </div>
                            <span className="text-sm text-muted-foreground">{activity.date}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Achievements Tab */}
                <TabsContent value="achievements" className="space-y-6 mt-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    {achievements.map((achievement, index) => (
                      <Card key={index} className={achievement.earned ? "" : "opacity-60"}>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-lg ${achievement.earned ? 'bg-primary' : 'bg-muted'}`}>
                              <achievement.icon className={`h-6 w-6 ${achievement.earned ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                            </div>
                            <div>
                              <h3 className="font-semibold">{achievement.title}</h3>
                              <p className="text-sm text-muted-foreground">{achievement.description}</p>
                              {achievement.earned && (
                                <Badge variant="secondary" className="mt-2">Earned</Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Preferences Tab */}
                <TabsContent value="preferences" className="space-y-6 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Reading Preferences</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-3">Favorite Genres</h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {readingPreferences.map((pref) => (
                              <div key={pref.category} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id={pref.category}
                                  checked={pref.selected}
                                  className="rounded"
                                />
                                <label htmlFor={pref.category} className="text-sm font-medium">
                                  {pref.category}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-3">Reading Goal</h4>
                          <div className="flex items-center gap-4">
                            <Input type="number" value={profileStats.readingGoal} className="w-20" />
                            <span className="text-sm text-muted-foreground">books per year</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Settings Tab */}
                <TabsContent value="settings" className="space-y-6 mt-6">
                  <div className="space-y-6">
                    {/* Account Settings */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <IconUser className="h-5 w-5" />
                          Account Settings
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium">Status</label>
                            <p className="text-sm text-muted-foreground">
                              {isAuthenticated ? "Signed in" : "Not signed in"}
                            </p>
                          </div>
                          <Button 
                            variant="destructive" 
                            onClick={() => void signOut()}
                          >
                            Sign Out
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Notification Settings */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <IconBell className="h-5 w-5" />
                          Notifications
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Reading Reminders</p>
                              <p className="text-sm text-muted-foreground">Daily notifications to keep your streak</p>
                            </div>
                            <input type="checkbox" defaultChecked className="rounded" />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Circle Updates</p>
                              <p className="text-sm text-muted-foreground">New discussions in your reading circles</p>
                            </div>
                            <input type="checkbox" defaultChecked className="rounded" />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Recommendations</p>
                              <p className="text-sm text-muted-foreground">Weekly book recommendations</p>
                            </div>
                            <input type="checkbox" className="rounded" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Privacy Settings */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <IconLock className="h-5 w-5" />
                          Privacy
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Public Profile</p>
                              <p className="text-sm text-muted-foreground">Allow others to see your reading activity</p>
                            </div>
                            <input type="checkbox" defaultChecked className="rounded" />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Show Reading Stats</p>
                              <p className="text-sm text-muted-foreground">Display your reading statistics publicly</p>
                            </div>
                            <input type="checkbox" className="rounded" />
                          </div>
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