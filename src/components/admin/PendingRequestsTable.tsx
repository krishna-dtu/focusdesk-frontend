import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import API from "@/api/api";
import { Input } from "@/components/ui/input";

/**
 * ✅ Correct Request Type for MongoDB
 */
interface Request {
  _id: string; // ✅ MongoDB uses _id
  fullName: string;
  idNumber: string;
  organisation: string;
  createdAt: string;
  status?: string;
}

const PendingRequestsTable = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");

  /**
   * ✅ Fetch pending requests
   */
  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      setIsLoading(true);

      const res = await API.get("/api/admin/requests");

      // ✅ Backend returns { count, requests }
      setRequests(res.data.requests || []);

      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      toast.error("Failed to fetch requests");
      console.error(err);
    }
  };

  /**
   * ✅ Format date in Indian locale
   */
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const normalized = (value: string) => value.toLowerCase().trim();

  const filteredRequests = searchInput
    ? requests.filter((request) => {
        const query = normalized(searchInput);
        return (
          normalized(request.fullName).includes(query) ||
          normalized(request.idNumber).includes(query) ||
          normalized(request.organisation).includes(query)
        );
      })
    : requests;

  /**
   * ✅ Approve Request
   */
  const handleApprove = async (request: Request) => {
    setLoadingId(request._id);

    try {
      await API.post(`/api/admin/approve/${request._id}`);

      // ✅ Remove approved request from table
      setRequests((prev) => prev.filter((r) => r._id !== request._id));

      toast.success(`Approved access for ${request.fullName}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Approval failed");
    }

    setLoadingId(null);
  };

  /**
   * ✅ Open Reject Modal
   */
  const openRejectModal = (request: Request) => {
    setSelectedRequest(request);
    setRejectReason("");
    setRejectModalOpen(true);
  };

  /**
   * ✅ Reject Request
   */
  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    if (!selectedRequest) return;

    setLoadingId(selectedRequest._id);
    setRejectModalOpen(false);

    try {
      await API.post(`/api/admin/reject/${selectedRequest._id}`, {
        rejectionReason: rejectReason,
      });

      // ✅ Remove rejected request
      setRequests((prev) =>
        prev.filter((r) => r._id !== selectedRequest._id)
      );

      toast.success(`Rejected request from ${selectedRequest.fullName}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Rejection failed");
    }

    setLoadingId(null);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card overflow-hidden"
      >
        <div className="p-6 border-b border-border">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Pending Requests
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Review and approve access requests
              </p>
            </div>
            <div className="flex w-full max-w-md items-center gap-2">
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by name, ID, or organisation"
                className="bg-muted/30"
              />
              <Button type="button" size="sm" className="shrink-0" aria-label="Search">
                <Search className="w-4 h-4 mr-1" /> Search
              </Button>
            </div>
          </div>
        </div>

        {/* ✅ Loading State */}
        {isLoading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-success/10 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
            <p className="text-muted-foreground">No pending requests</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-muted-foreground">
              No results found for "{searchInput}"
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>College ID</TableHead>
                  <TableHead>Organisation</TableHead>
                  <TableHead>Request Time</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request._id}>
                    <TableCell className="font-medium">
                      {request.fullName}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {request.idNumber}
                    </TableCell>
                    <TableCell>{request.organisation}</TableCell>
                    <TableCell>{formatDate(request.createdAt)}</TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* ✅ Approve Button */}
                        <Button
                          size="sm"
                          onClick={() => handleApprove(request)}
                          disabled={loadingId === request._id}
                          className="bg-success hover:bg-success/90 text-success-foreground"
                        >
                          {loadingId === request._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <CheckCircle2 className="w-4 h-4 mr-1" />
                              Approve
                            </>
                          )}
                        </Button>

                        {/* ✅ Reject Button */}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => openRejectModal(request)}
                          disabled={loadingId === request._id}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </motion.div>

      {/* ✅ Reject Modal */}
      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Access Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting{" "}
              <b>{selectedRequest?.fullName}</b>'s request.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Rejection Reason</Label>
              <Textarea
                id="reason"
                placeholder="Write a clear reason for rejection..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={5}
                className="min-h-[120px] resize-none bg-muted/30 border-muted-foreground/20 focus-visible:border-primary focus-visible:ring-primary"
              />
              <p className="text-xs text-muted-foreground">
                This note will be shared with the requester.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PendingRequestsTable;
