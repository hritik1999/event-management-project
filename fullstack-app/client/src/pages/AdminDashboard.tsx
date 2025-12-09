import { useEffect, useState } from "react";
import api from "../lib/api";
import { Button } from "../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";

interface HelperUser {
    id: string;
    username: string;
    email: string;
    role: string;
    isApproved: boolean;
}

export function AdminDashboard() {
    const [pendingOrganizers, setPendingOrganizers] = useState<HelperUser[]>([]);

    const fetchPending = async () => {
        try {
            const { data } = await api.get("/users/pending-organizers");
            setPendingOrganizers(data);
        } catch (error) {
            toast.error("Failed to fetch pending organizers");
        }
    };

    useEffect(() => {
        fetchPending();
    }, []);

    const handleApprove = async (id: string) => {
        try {
            await api.put(`/users/${id}/approve`);
            toast.success("Organizer approved");
            fetchPending();
        } catch (error) {
            toast.error("Failed to approve organizer");
        }
    };

    return (
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle>Admin Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                    <h3 className="text-lg font-semibold mb-4">Pending Organizer Approvals</h3>
                    {pendingOrganizers.length === 0 ? (
                        <p className="text-muted-foreground">No pending approvals.</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Username</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pendingOrganizers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.username}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell><Badge variant="outline">{user.role}</Badge></TableCell>
                                        <TableCell><Badge variant="secondary">Pending</Badge></TableCell>
                                        <TableCell>
                                            <Button size="sm" onClick={() => handleApprove(user.id)}>Approve</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
