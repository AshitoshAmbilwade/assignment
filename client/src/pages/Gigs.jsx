import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchGigs } from "../store/gig.slice";
import { logout } from "../store/auth.slice";
import { toast } from "sonner";

// shadcn components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// icons
import { Search, Plus, Briefcase, LogOut, User } from "lucide-react";

const Gigs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { list: gigs, loading, error } = useSelector((state) => state.gigs);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchGigs(searchQuery));
  }, [dispatch, searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(fetchGigs(searchQuery));
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl flex items-center gap-2 font-bold">
              <Briefcase className="h-8 w-8" />
              GigFlow
            </h1>
            <p className="text-gray-600 mt-1">
              Find freelance opportunities or hire talent
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4" />
                  <span>{user?.name}</span>
                </div>

                <Link to="/post-gig">
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Post a Gig
                  </Button>
                </Link>

                <Button size="sm" variant="outline" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button size="sm" variant="outline" onClick={() => navigate("/login")}>
                  Login
                </Button>
                <Button size="sm" onClick={() => navigate("/register")}>
                  Register
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search gigs by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </form>

        {/* Error */}
        {error && (
          <p className="text-center text-red-600">{error}</p>
        )}

        {/* Skeleton Loading */}
        {loading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-8 w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && gigs.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl text-gray-700 mb-2">
              No gigs found
            </h3>
            <p className="text-gray-500">
              {searchQuery
                ? "Try a different search term"
                : "Be the first to post a gig!"}
            </p>

            {isAuthenticated && (
              <Link to="/post-gig">
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Post a Gig
                </Button>
              </Link>
            )}
          </div>
        )}

        {/* Gigs Grid */}
        {!loading && gigs.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {gigs.map((gig) => (
              <Link key={gig._id} to={`/gigs/${gig._id}`}>
                <Card className="hover:shadow-lg transition-shadow h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <CardTitle className="text-lg sm:text-xl">
                          {gig.title}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          by {gig.ownerId?.name || "Anonymous"}
                        </CardDescription>
                      </div>

                      <Badge
                        variant={gig.status === "open" ? "default" : "secondary"}
                      >
                        {gig.status}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <p className="text-gray-600 line-clamp-3 mb-4">
                      {gig.description}
                    </p>

                    <div>
                      <p className="text-sm text-gray-500">Budget</p>
                      <p className="text-2xl text-green-600">
                        ₹{gig.budget}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gigs;
