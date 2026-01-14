import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { createBid, getBidsByGig, hireBid } from "../api/bid.api";
import { toast } from "sonner";

// shadcn
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

import { ArrowLeft, User } from "lucide-react";

const GigDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [gig, setGig] = useState(null);
  const [bids, setBids] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);

  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [hiring, setHiring] = useState(false);

  const loadData = async () => {
    try {
      const res = await getBidsByGig(id);

      setGig(res.data.gig);
      setBids(res.data.bids);
      setIsOwner(res.data.isOwner);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load gig");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const userBid = bids.find(
    (b) => String(b.freelancerId?._id) === String(user?._id)
  );

  const canBid =
    user &&
    !isOwner &&
    gig?.status === "open" &&
    !userBid;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await createBid({
        gigId: id,
        price: Number(price),
        message,
      });

      toast.success("Bid submitted successfully");
      setPrice("");
      setMessage("");
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleHire = async (bidId) => {
    if (!window.confirm("Hire this freelancer?")) return;

    setHiring(true);
    try {
      await hireBid(bidId);
      toast.success("Freelancer hired");
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setHiring(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-4 space-y-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!gig) {
    return <p className="text-center mt-10">Gig not found</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-6xl mx-auto px-4">
        <Button variant="ghost" onClick={() => navigate("/")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          {/* ================= BIDS ================= */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Bids</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {bids.length === 0 && (
                  <p className="text-sm text-gray-500">No bids yet</p>
                )}

                {bids.map((bid) => (
                  <Card key={bid._id}>
                    <CardContent className="pt-4 space-y-3">
                      <div className="flex justify-between">
                        <div className="flex gap-2 items-center">
                          <User className="h-4 w-4" />
                          <span>{bid.freelancerId?.name}</span>
                        </div>
                        <Badge>{bid.status}</Badge>
                      </div>

                      <Separator />
                      <p>{bid.message}</p>

                      {/* OWNER ONLY */}
                      {isOwner &&
                        gig.status === "open" &&
                        bid.status === "pending" && (
                          <Button
                            onClick={() => handleHire(bid._id)}
                            disabled={hiring}
                            className="w-full"
                          >
                            Hire Freelancer
                          </Button>
                        )}

                      {/* FREELANCER ONLY */}
                      {bid.status === "hired" &&
                        String(bid.freelancerId?._id) ===
                          String(user?._id) && (
                          <Badge className="bg-green-600">
                            You are hired 🎉
                          </Badge>
                        )}
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* ================= BID FORM (FREELANCER ONLY) ================= */}
          {canBid && (
            <Card>
              <CardHeader>
                <CardTitle>Submit Bid</CardTitle>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label>Price</Label>
                    <Input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label>Message</Label>
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full"
                  >
                    {submitting ? "Submitting..." : "Submit Bid"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default GigDetails;
