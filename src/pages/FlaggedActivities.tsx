import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import API from "@/api/api";

const FlaggedActivities = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [flagged, setFlagged] = useState<any[]>([]);

  useEffect(() => {
    fetchFlagged();
  }, []);

  const fetchFlagged = async () => {
    try {
      const res = await API.get("/api/admin/flagged-activities");
      setFlagged(res.data.flagged);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load flagged activities");
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto">
          <p>Loading flagged activities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-8 h-8 text-destructive" />
            <h1 className="text-3xl font-bold">Flagged Activities</h1>
          </div>
          <p className="text-muted-foreground">
            Users with suspicious activity patterns (multiple scans within 1 minute)
          </p>
        </div>

        {/* Flagged List */}
        {flagged.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">No flagged activities found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {flagged.map((activity) => (
              <Card key={activity.id} className="border-destructive/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {activity.user?.fullName || "Unknown User"}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {activity.user?.idNumber} • {activity.user?.organisation}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/admin/dashboard/user-profile/${activity.requestId}`)}
                    >
                      View Profile
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium">{activity.date}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Duration</p>
                      <p className="font-medium">{formatDuration(activity.totalDuration)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Scan Count</p>
                      <p className="font-medium">{activity.scanCount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Flag Reason</p>
                      <Badge variant="destructive">{activity.flagReason}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FlaggedActivities;
