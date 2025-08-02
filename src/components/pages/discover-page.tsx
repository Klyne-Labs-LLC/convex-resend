import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  IconTrendingUp,
  IconStar,
  IconClock,
  IconUsers,
  IconSearch,
  IconFilter,
  IconFlame as IconFire,
  IconBooks,
  IconHeart,
  IconArrowUp,
  IconTrophy,
  IconSparkles,
  IconBook
} from "@tabler/icons-react";

export function DiscoverPage() {
  // Use existing Convex data as discovery seed
  const readingData = useQuery(api.emails.listMyEmailsAndStatuses);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"trending" | "recommendations" | "genres">("trending");

  // Transform data into discovery content
  const trendingBooks = [
    {
      id: "1",
      title: "The Seven Husbands of Evelyn Hugo",
      author: "Taylor Jenkins Reid",
      rating: 4.8,
      cover: "📚",
      genre: "Fiction",
      trendScore: 95,
      readers: 12450,
      description: "A reclusive Hollywood icon shares her secrets...",
      tags: ["Romance", "Historical Fiction", "LGBTQ+"]
    },
    {
      id: "2", 
      title: "Atomic Habits",
      author: "James Clear",
      rating: 4.6,
      cover: "⚡",
      genre: "Self-Help",
      trendScore: 92,
      readers: 8730,
      description: "Build good habits and break bad ones...",
      tags: ["Productivity", "Psychology", "Personal Growth"]
    },
    {
      id: "3",
      title: "Tomorrow, and Tomorrow, and Tomorrow",
      author: "Gabrielle Zevin",
      rating: 4.7,
      cover: "🎮",
      genre: "Literary Fiction",
      trendScore: 89,
      readers: 6540,
      description: "The story of two friends creating video games...",
      tags: ["Gaming", "Friendship", "Technology"]
    }
  ];

  const personalizedRecs = readingData?.slice(0, 6).map((session, index) => {
    const recBooks = [
      { title: "The Midnight Library", author: "Matt Haig", reason: "Similar to your interest in philosophy", cover: "🌙", match: 94 },
      { title: "Educated", author: "Tara Westover", reason: "Based on your memoir reading", cover: "📖", match: 91 },
      { title: "The Song of Achilles", author: "Madeline Miller", reason: "Fans of classics love this", cover: "⚔️", match: 89 },
      { title: "Klara and the Sun", author: "Kazuo Ishiguro", reason: "Literary fiction recommendation", cover: "☀️", match: 87 },
      { title: "The Silent Patient", author: "Alex Michaelides", reason: "Popular psychological thriller", cover: "🤐", match: 85 },
      { title: "Circe", author: "Madeline Miller", reason: "Mythology and beautiful prose", cover: "🏛️", match: 88 }
    ];
    
    return {
      id: session.emailId,
      ...recBooks[index % recBooks.length],
      addedDate: session.sentAt
    };
  }) || [];

  const genreStats = [
    { name: "Fiction", books: 2847, trend: "+12%" },
    { name: "Self-Help", books: 1923, trend: "+8%" },
    { name: "Romance", books: 1756, trend: "+25%" },
    { name: "Sci-Fi", books: 1234, trend: "+15%" },
    { name: "Mystery", books: 987, trend: "+6%" },
    { name: "Biography", books: 654, trend: "+3%" }
  ];

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Header */}
          <div className="px-4 lg:px-6">
            <div className="max-w-6xl mx-auto">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <IconSparkles className="h-8 w-8" />
                    <div>
                      <CardTitle className="text-3xl">Discover Your Next Great Read</CardTitle>
                      <p className="text-lg text-muted-foreground">
                        Explore trending books, get personalized recommendations, and find your next literary adventure
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Search Bar */}
                  <div className="relative max-w-md">
                    <IconSearch className="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search books, authors, or genres..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 h-12"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="grid gap-4 md:grid-cols-4 mt-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <IconFire className="h-8 w-8" />
                      <div>
                        <div className="text-2xl font-bold">1,247</div>
                        <div className="text-sm text-muted-foreground">Trending Now</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <IconUsers className="h-8 w-8" />
                      <div>
                        <div className="text-2xl font-bold">52.3K</div>
                        <div className="text-sm text-muted-foreground">Active Readers</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <IconTrophy className="h-8 w-8" />
                      <div>
                        <div className="text-2xl font-bold">8,934</div>
                        <div className="text-sm text-muted-foreground">New Releases</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <IconBooks className="h-8 w-8" />
                      <div>
                        <div className="text-2xl font-bold">142</div>
                        <div className="text-sm text-muted-foreground">Categories</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Main Content Tabs */}
          <div className="px-4 lg:px-6">
            <div className="max-w-6xl mx-auto">
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="trending" className="flex items-center gap-2">
                    <IconTrendingUp className="h-4 w-4" />
                    Trending
                  </TabsTrigger>
                  <TabsTrigger value="recommendations" className="flex items-center gap-2">
                    <IconStar className="h-4 w-4" />
                    For You
                  </TabsTrigger>
                  <TabsTrigger value="genres" className="flex items-center gap-2">
                    <IconFilter className="h-4 w-4" />
                    By Genre
                  </TabsTrigger>
                </TabsList>

                {/* Trending Books */}
                <TabsContent value="trending" className="space-y-6 mt-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">🔥 What's Hot Right Now</h2>
                    <Button variant="outline">
                      <IconClock className="h-4 w-4 mr-2" />
                      View All Trending
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {trendingBooks.map((book, index) => (
                      <Card key={book.id}>
                        <CardContent className="p-6">
                          <div className="flex gap-6">
                            {/* Book Cover & Ranking */}
                            <div className="flex items-center gap-4">
                              <div className="text-3xl font-bold text-muted-foreground">#{index + 1}</div>
                              <div className="text-6xl">{book.cover}</div>
                            </div>
                            
                            {/* Book Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h3 className="text-xl font-bold mb-1">{book.title}</h3>
                                  <p className="text-muted-foreground mb-2">by {book.author}</p>
                                  <p className="text-sm text-muted-foreground mb-3 max-w-lg">{book.description}</p>
                                </div>
                                
                                <div className="text-right">
                                  <div className="flex items-center gap-1 mb-2">
                                    <IconStar className="h-4 w-4 fill-current" />
                                    <span className="font-medium">{book.rating}</span>
                                  </div>
                                  <div className="text-sm text-muted-foreground">{book.readers.toLocaleString()} readers</div>
                                </div>
                              </div>
                              
                              {/* Tags and Actions */}
                              <div className="flex items-center justify-between">
                                <div className="flex gap-2">
                                  {book.tags.map((tag) => (
                                    <Badge key={tag} variant="secondary">{tag}</Badge>
                                  ))}
                                </div>
                                
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center gap-1 text-sm">
                                    <IconArrowUp className="h-4 w-4" />
                                    <span className="font-medium">{book.trendScore}% trending</span>
                                  </div>
                                  <Button size="sm">Add to Shelf</Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Personalized Recommendations */}
                <TabsContent value="recommendations" className="space-y-6 mt-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">✨ Picked Just for You</h2>
                    <Button variant="outline">
                      <IconHeart className="h-4 w-4 mr-2" />
                      Improve Recommendations
                    </Button>
                  </div>
                  
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {personalizedRecs.map((book) => (
                      <Card key={book.id}>
                        <CardContent className="p-5">
                          <div className="text-center">
                            <div className="text-5xl mb-3">{book.cover}</div>
                            <h3 className="font-bold mb-1">{book.title}</h3>
                            <p className="text-sm text-muted-foreground mb-3">by {book.author}</p>
                            
                            <Card className="mb-4">
                              <CardContent className="p-3">
                                <div className="text-xs font-medium text-muted-foreground mb-1">Why we recommend this:</div>
                                <div className="text-sm">{book.reason}</div>
                              </CardContent>
                            </Card>
                            
                            <div className="flex items-center justify-between">
                              <Badge variant="secondary">{book.match}% match</Badge>
                              <Button size="sm">Add to Shelf</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Browse by Genre */}
                <TabsContent value="genres" className="space-y-6 mt-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">📖 Explore by Genre</h2>
                    <Button variant="outline">
                      <IconBook className="h-4 w-4 mr-2" />
                      View All Genres
                    </Button>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {genreStats.map((genre) => (
                      <Card key={genre.name}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-semibold mb-1">{genre.name}</h3>
                              <p className="text-sm text-muted-foreground">{genre.books.toLocaleString()} books</p>
                            </div>
                            <IconBooks className="h-8 w-8" />
                          </div>
                          
                          <div className="mt-4 flex items-center justify-between">
                            <Badge variant="secondary">
                              {genre.trend} this month
                            </Badge>
                            <Button size="sm" variant="ghost">
                              Explore →
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
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