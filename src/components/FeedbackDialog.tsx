import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface FeedbackDialogProps {
  onFeedbackSubmit: (sentiment: "Positive" | "Neutral" | "Negative", comment: string) => void;
}

export const FeedbackDialog: React.FC<FeedbackDialogProps> = ({ onFeedbackSubmit }) => {
  const [open, setOpen] = useState(false);
  const [sentiment, setSentiment] = useState<"Positive" | "Neutral" | "Negative">("Positive");
  const [comment, setComment] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Log form details
    console.log("Submitting Feedback:", { sentiment, comment });
    
    // Add logic callback
    onFeedbackSubmit(sentiment, comment);

    // Show toast success
    toast({
      title: "Feedback Submitted!",
      description: "Thank you for your valuable insight.",
      variant: "default",
    });

    // Reset and close dialog
    setComment("");
    setSentiment("Positive");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="fixed bottom-6 right-6 h-14 rounded-full px-6 shadow-lg bg-brand-600 hover:bg-brand-700 text-white gap-2 transition-all hover:scale-105">
          <Plus className="h-5 w-5" />
          Give Feedback
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Submit Feedback</DialogTitle>
            <DialogDescription>
              Help us improve by sharing your sentiment and detailed remarks.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-6">
            {/* Sentiment Selector */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Overall Sentiment</Label>
              <RadioGroup
                defaultValue="Positive"
                onValueChange={(val) => setSentiment(val as "Positive" | "Neutral" | "Negative")}
                className="grid grid-cols-3 gap-2"
              >
                <div>
                  <RadioGroupItem
                    value="Positive"
                    id="positive"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="positive"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-emerald-500 [&:has([data-state=checked])]:border-emerald-500 cursor-pointer"
                  >
                    <span className="text-lg">😊</span>
                    <span className="text-xs font-semibold mt-1">Positive</span>
                  </Label>
                </div>

                <div>
                  <RadioGroupItem
                    value="Neutral"
                    id="neutral"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="neutral"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-amber-500 [&:has([data-state=checked])]:border-amber-500 cursor-pointer"
                  >
                    <span className="text-lg">😐</span>
                    <span className="text-xs font-semibold mt-1">Neutral</span>
                  </Label>
                </div>

                <div>
                  <RadioGroupItem
                    value="Negative"
                    id="negative"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="negative"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-rose-500 [&:has([data-state=checked])]:border-rose-500 cursor-pointer"
                  >
                    <span className="text-lg">🙁</span>
                    <span className="text-xs font-semibold mt-1">Negative</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Comment Area */}
            <div className="space-y-2">
              <Label htmlFor="comment" className="text-sm font-semibold">Comments</Label>
              <Textarea
                id="comment"
                placeholder="What can we do to improve? Let us know..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[100px] resize-none"
              />
            </div>
          </div>
          
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white">
              Submit Feedback
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
