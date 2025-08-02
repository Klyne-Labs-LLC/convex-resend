import { useQuery } from "convex/react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  IconBook as BookIcon, 
  IconCheck as CheckIcon, 
  IconEye as EyeIcon, 
  IconFlame as FlameIcon,
  IconRocket as RocketIcon,
  IconBooks as BooksIcon,
  IconBookmark as BookmarkIcon,
  IconUsers as UsersIcon,
  IconTrophy as TrophyIcon,
  IconCalendar as CalendarIcon,
  IconTarget as TargetIcon
} from "@tabler/icons-react";

export function DashboardPage() {
  const navigate = useNavigate();
  // Reinterpret email data as reading sessions
  const readingSessions = useQuery(api.emails.listMyEmailsAndStatuses);
  
  // Mock reading data based on actual data
  const todayBook = {
    title: "The Alchemist",
    author: "Paulo Coelho",
    currentPage: "Chapter 3: The Journey Begins",
    progress: 45,
    timeToRead: "15 minutes",
    cover: "📘"
  };

  const readingStats = {
    currentStreak: 7,
    booksThisYear: Math.min(3, Math.floor((readingSessions?.length || 0) / 5) + 1),
    activeCircles: 2,
    totalHighlights: readingSessions?.filter(s => s.opened).length || 0,
  };

  const recentActivity = readingSessions?.slice(0, 3).map((session, index) => {
    const bookTitles = ["Atomic Habits", "1984", "The Alchemist"];
    const authors = ["James Clear", "George Orwell", "Paulo Coelho"];
    const activities = ["highlighted a passage", "joined discussion", "completed chapter"];
    
    return {
      id: session.emailId,
      book: bookTitles[index % bookTitles.length],
      author: authors[index % authors.length],
      activity: activities[index % activities.length],
      time: session.sentAt,
      status: session.status === "delivered" ? "completed" : "in-progress"
    };
  }) || [];


  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Reading Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 px-4 lg:px-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reading Streak</CardTitle>
                <FlameIcon className="h-5 w-5 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{readingStats.currentStreak}</div>
                <p className="text-xs text-muted-foreground">
                  days in a row
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Books This Year</CardTitle>
                <BooksIcon className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{readingStats.booksThisYear}</div>
                <p className="text-xs text-muted-foreground">
                  completed books
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Circles</CardTitle>
                <UsersIcon className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{readingStats.activeCircles}</div>
                <p className="text-xs text-muted-foreground">
                  reading groups
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Highlights</CardTitle>
                <BookmarkIcon className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{readingStats.totalHighlights}</div>
                <p className="text-xs text-muted-foreground">
                  passages saved
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Today's Reading */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <CardTitle>Good morning, Reader!</CardTitle>
                <CardDescription>
                  Ready for today's reading adventure?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Current Book Progress */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{todayBook.cover}</div>
                      <div>
                        <h3 className="font-semibold">{todayBook.title}</h3>
                        <p className="text-sm text-muted-foreground">by {todayBook.author}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{todayBook.progress}% complete</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all" 
                          style={{ width: `${todayBook.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="bg-muted p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Today's Page</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {todayBook.timeToRead} • {todayBook.currentPage}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-green-600 font-medium">Ready</span>
                      </div>
                    </div>
                  </div>

                  {/* Reading Action */}
                  <div className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                      Continue Santiago's journey as he meets the mysterious alchemist and learns about following his Personal Legend...
                    </div>
                    
                    <Button 
                      className="w-full"
                      onClick={() => navigate("/shelves")}
                    >
                      <BookIcon className="h-4 w-4 mr-2" /> Continue Reading
                    </Button>
                    
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div>
                        <div className="text-lg font-bold">{readingStats.currentStreak}</div>
                        <div className="text-xs text-muted-foreground">Day Streak</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold">{readingStats.booksThisYear}</div>
                        <div className="text-xs text-muted-foreground">Books This Year</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold">{readingStats.activeCircles}</div>
                        <div className="text-xs text-muted-foreground">Active Circles</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold">{readingStats.totalHighlights}</div>
                        <div className="text-xs text-muted-foreground">Highlights</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Reading Activity */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Reading Circles</CardTitle>
                <CardDescription>
                  See what your reading circles are up to
                </CardDescription>
              </CardHeader>
              <CardContent>
                {readingSessions === undefined ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : readingSessions.length === 0 ? (
                  <div className="text-center py-8">
                    <BookIcon className="h-10 w-10 text-muted-foreground mb-2 mx-auto" />
                    <p className="text-muted-foreground">Start your reading journey today!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <UsersIcon className="h-4 w-4 text-muted-foreground" />
                          <h4 className="font-medium">Book Club Friends</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Reading "Atomic Habits" • 5 members
                        </p>
                        <p className="text-xs text-muted-foreground">
                          3 new discussions
                        </p>
                      </div>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <UsersIcon className="h-4 w-4 text-muted-foreground" />
                          <h4 className="font-medium">Classic Literature Circle</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Reading "1984" • 8 members
                        </p>
                        <p className="text-xs text-muted-foreground">
                          1 new discussion
                        </p>
                      </div>
                      <Button variant="outline" size="sm">View</Button>
                    </div>

                    {/* Recent Achievements */}
                    <div className="mt-6 pt-4 border-t">
                      <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <TrophyIcon className="h-4 w-4" />
                        Recent Achievements
                      </h4>
                      <div className="grid gap-2 sm:grid-cols-3">
                        <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                          <FlameIcon className="h-4 w-4 text-orange-500" />
                          <div>
                            <div className="text-xs font-medium">Week Warrior</div>
                            <div className="text-xs text-muted-foreground">7-day reading streak</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                          <TargetIcon className="h-4 w-4 text-green-500" />
                          <div>
                            <div className="text-xs font-medium">Goal Crusher</div>
                            <div className="text-xs text-muted-foreground">Completed monthly goal</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                          <UsersIcon className="h-4 w-4 text-blue-500" />
                          <div>
                            <div className="text-xs font-medium">Circle Builder</div>
                            <div className="text-xs text-muted-foreground">Joined 2 reading circles</div>
                          </div>
                        </div>
                      </div>
                    </div>
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