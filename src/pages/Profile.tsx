import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";

export default function Profile() {
  return (
    <div>
      <h1 className="mb-2 text-2xl">Profile</h1>
      <p className="mb-10 text-muted-foreground">Manage your account and preferences.</p>
      <Card>
        <CardContent className="flex flex-col items-center py-16 text-center">
          <User size={40} className="mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Profile settings coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
