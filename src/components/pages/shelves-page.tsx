import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  IconBook, 
  IconBooks, 
  IconBookmark,
  IconStar,
  IconSearch,
  IconPlus
} from "@tabler/icons-react";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export function ShelvesPage() {
  // Use existing Convex data as book data
  const readingSessions = useQuery(api.emails.listMyEmailsAndStatuses);
  const [activeTab, setActiveTab] = useState<"reading" | "completed" | "wishlist">("reading");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  // const [showAddBook, setShowAddBook] = useState(false); // For future use
  
  // Transform email data into book data
  const mockBooks = readingSessions?.map((session, index) => {
    const bookTitles = [
      "The Alchemist", "Atomic Habits", "1984", "To Kill a Mockingbird", "The Great Gatsby",
      "Pride and Prejudice", "The Catcher in the Rye", "Dune", "The Hobbit", "Sapiens"
    ];
    const authors = [
      "Paulo Coelho", "James Clear", "George Orwell", "Harper Lee", "F. Scott Fitzgerald",
      "Jane Austen", "J.D. Salinger", "Frank Herbert", "J.R.R. Tolkien", "Yuval Noah Harari"
    ];
    const genres = ["Fiction", "Self-Help", "Classic", "Sci-Fi", "Fantasy", "Philosophy"];
    const covers = ["📘", "📗", "📙", "📕", "📓", "📔", "📒", "📖", "📚", "📜"];
    
    return {
      id: session.emailId,
      title: bookTitles[index % bookTitles.length],
      author: authors[index % authors.length],
      genre: genres[index % genres.length],
      cover: covers[index % covers.length],
      progress: session.status === "delivered" ? Math.floor(Math.random() * 100) : 0,
      status: session.status === "delivered" ? "reading" : session.status === "bounced" ? "wishlist" : "completed",
      rating: session.opened ? 5 : Math.floor(Math.random() * 5) + 1,
      addedDate: session.sentAt,
      currentPage: Math.floor(Math.random() * 300) + 1,
      totalPages: Math.floor(Math.random() * 200) + 200,
      timeLeft: `${Math.floor(Math.random() * 10) + 1}h ${Math.floor(Math.random() * 60)}m`
    };
  }) || [];

  const genres = ["all", "Fiction", "Self-Help", "Classic", "Sci-Fi", "Fantasy", "Philosophy"];
  
  const filteredBooks = mockBooks.filter(book => {
    const matchesTab = book.status === activeTab;
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === "all" || book.genre === selectedGenre;
    return matchesTab && matchesSearch && matchesGenre;
  });

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Header */}
          <div className="px-4 lg:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold">My Book Shelves</h1>
                  <p className="text-muted-foreground">Organize your reading collection</p>
                </div>
                <Button>
                  <IconPlus className="h-4 w-4 mr-2" />
                  Add Book
                </Button>
              </div>
              
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <IconSearch className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search books or authors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by genre" />
                  </SelectTrigger>
                  <SelectContent>
                    {genres.map((genre) => (
                      <SelectItem key={genre} value={genre}>
                        {genre === "all" ? "All Genres" : genre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Book Tabs */}
          <div className="px-4 lg:px-6">
            <div className="max-w-6xl mx-auto">
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "reading" | "completed" | "wishlist")}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="reading" className="flex items-center gap-2">
                    <IconBook className="h-4 w-4" />
                    Currently Reading ({mockBooks.filter(b => b.status === "reading").length})
                  </TabsTrigger>
                  <TabsTrigger value="completed" className="flex items-center gap-2">
                    <IconBookmark className="h-4 w-4" />
                    Completed ({mockBooks.filter(b => b.status === "completed").length})
                  </TabsTrigger>
                  <TabsTrigger value="wishlist" className="flex items-center gap-2">
                    <IconStar className="h-4 w-4" />
                    Want to Read ({mockBooks.filter(b => b.status === "wishlist").length})
                  </TabsTrigger>
                </TabsList>

                {/* Books Grid */}
                <TabsContent value={activeTab} className="mt-6">
                  {filteredBooks.length === 0 ? (
                    <div className="text-center py-12">
                      <IconBooks className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium">No books found</h3>
                      <p className="text-muted-foreground">
                        {searchQuery || selectedGenre !== "all" 
                          ? "Try adjusting your search or filters"
                          : "Start building your reading collection"
                        }
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {filteredBooks.map((book) => (
                        <Card key={book.id} className="overflow-hidden">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3 mb-3">
                              <div className="text-3xl">{book.cover}</div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold truncate">{book.title}</h3>
                                <p className="text-sm text-muted-foreground truncate">by {book.author}</p>
                                <Badge variant="secondary" className="text-xs mt-1">
                                  {book.genre}
                                </Badge>
                              </div>
                            </div>
                            
                            {activeTab === "reading" && (
                              <div className="space-y-2">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                  <span>Progress</span>
                                  <span>{book.progress}%</span>
                                </div>
                                <div className="w-full bg-secondary rounded-full h-1.5">
                                  <div 
                                    className="bg-primary h-1.5 rounded-full transition-all" 
                                    style={{ width: `${book.progress}%` }}
                                  ></div>
                                </div>
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                  <span>Page {book.currentPage} of {book.totalPages}</span>
                                  <span>{book.timeLeft} left</span>
                                </div>
                              </div>
                            )}
                            
                            {activeTab === "completed" && (
                              <div className="flex items-center justify-between">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <IconStar 
                                      key={i} 
                                      className={`h-4 w-4 ${i < book.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                    />
                                  ))}
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(book.addedDate).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                            
                            {activeTab === "wishlist" && (
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>Added {new Date(book.addedDate).toLocaleDateString()}</span>
                                <Button size="sm" variant="outline">
                                  Start Reading
                                </Button>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}