import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function Resources() {
  return (
    <div>
      <h1 className="mb-2 text-2xl">Resources</h1>
      <p className="mb-10 text-muted-foreground">Curated materials to accelerate your preparation.</p>
      <Card>
        <CardContent className="flex flex-col items-center py-16 text-center">
          <FileText size={40} className="mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Resource library coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
