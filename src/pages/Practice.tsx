import { Card, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export default function Practice() {
  return (
    <div>
      <h1 className="mb-2 text-2xl">Practice</h1>
      <p className="mb-10 text-muted-foreground">Sharpen your skills with targeted exercises.</p>
      <Card>
        <CardContent className="flex flex-col items-center py-16 text-center">
          <BookOpen size={40} className="mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Practice problems are coming soon.</p>
          <p className="mt-1 text-sm text-muted-foreground">Start by analyzing a JD to see what to focus on.</p>
        </CardContent>
      </Card>
    </div>
  );
}
