import { Card, CardContent } from "@/components/ui/card";
import { ClipboardCheck } from "lucide-react";

export default function Assessments() {
  return (
    <div>
      <h1 className="mb-2 text-2xl">Assessments</h1>
      <p className="mb-10 text-muted-foreground">Evaluate your readiness with mock assessments.</p>
      <Card>
        <CardContent className="flex flex-col items-center py-16 text-center">
          <ClipboardCheck size={40} className="mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Assessments module coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
