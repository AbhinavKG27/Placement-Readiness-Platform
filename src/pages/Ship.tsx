import { getTestChecklist } from "@/lib/storage";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, Rocket } from "lucide-react";

export default function Ship() {
  const navigate = useNavigate();
  const checklist = getTestChecklist();
  const allPassed = checklist.every(Boolean);

  if (!allPassed) {
    return (
      <div>
        <h1 className="mb-2 text-2xl">Ship</h1>
        <p className="mb-10 text-muted-foreground">Deploy your project to the world.</p>
        <Card>
          <CardContent className="flex flex-col items-center py-16 text-center">
            <Lock size={40} className="mb-4 text-muted-foreground" />
            <p className="mb-2 font-medium">Locked</p>
            <p className="mb-6 text-sm text-muted-foreground">
              Complete all 10 items on the Test Checklist before shipping.
            </p>
            <button
              onClick={() => navigate("/prp/07-test")}
              className="rounded-md border border-primary px-4 py-2 text-sm font-semibold text-primary transition-default hover:bg-primary/5"
            >
              Go to Test Checklist
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-2 text-2xl">Ship</h1>
      <p className="mb-10 text-muted-foreground">All tests passed. You're ready.</p>
      <Card>
        <CardContent className="flex flex-col items-center py-16 text-center">
          <Rocket size={40} className="mb-4 text-primary" />
          <p className="mb-2 font-serif text-xl font-bold">Ready to Ship</p>
          <p className="mb-6 text-sm text-muted-foreground">
            Head to the Proof page to submit your deployment links.
          </p>
          <button
            onClick={() => navigate("/prp/proof")}
            className="rounded-md bg-primary px-6 py-2 font-semibold text-primary-foreground transition-default hover:opacity-90"
          >
            Complete Proof
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
