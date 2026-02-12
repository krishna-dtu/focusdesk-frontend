import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Settings, Save, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import API from "@/api/api";

const SystemSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [restrictionDuration, setRestrictionDuration] = useState<number>(10);
  const [originalDuration, setOriginalDuration] = useState<number>(10);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/admin/settings/restriction");
      const duration = res.data.restrictionDurationMinutes;
      setRestrictionDuration(duration);
      setOriginalDuration(duration);
    } catch (err: any) {
      toast.error("Failed to load settings");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    // Validation
    if (restrictionDuration < 1 || restrictionDuration > 120) {
      toast.error("Duration must be between 1 and 120 minutes");
      return;
    }

    if (restrictionDuration === originalDuration) {
      toast.info("No changes to save");
      return;
    }

    try {
      setSaving(true);
      await API.put("/api/admin/settings/restriction", {
        durationMinutes: restrictionDuration,
      });

      setOriginalDuration(restrictionDuration);
      toast.success("Restriction duration updated successfully");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update settings");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setRestrictionDuration(originalDuration);
  };

  const hasChanges = restrictionDuration !== originalDuration;

  if (loading) {
    return (
      <div className="p-20 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
        <p className="text-muted-foreground mt-4">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Settings className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">System Settings</h2>
          <p className="text-sm text-muted-foreground">
            Configure system-wide behavior and restrictions
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Scan Abuse Restriction</CardTitle>
          <CardDescription>
            Configure the temporary restriction duration applied when users perform rapid scans
            (IN and OUT within 1 minute)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              When a user scans IN and OUT within 1 minute, they will be temporarily restricted
              from scanning for the duration specified below.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Restriction Duration (minutes)</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="duration"
                  type="number"
                  min={1}
                  max={120}
                  value={restrictionDuration}
                  onChange={(e) => setRestrictionDuration(parseInt(e.target.value) || 1)}
                  className="max-w-[200px]"
                  disabled={saving}
                />
                <span className="text-sm text-muted-foreground">
                  (Min: 1, Max: 120 minutes)
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Current: {restrictionDuration} minute{restrictionDuration !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={handleSave}
                disabled={saving || !hasChanges}
                className="min-w-[120px]"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>

              {hasChanges && (
                <Button variant="outline" onClick={handleReset} disabled={saving}>
                  Reset
                </Button>
              )}
            </div>
          </div>

          <div className="pt-4 border-t">
            <h4 className="text-sm font-semibold mb-2">How it works:</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>User scans IN at gate</li>
              <li>User scans OUT within 1 minute</li>
              <li>System flags as potential abuse</li>
              <li>User is restricted for {restrictionDuration} minute{restrictionDuration !== 1 ? "s" : ""}</li>
              <li>Activity appears in "Flagged Activities" page</li>
              <li>Attendance log shows red highlight</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemSettings;
