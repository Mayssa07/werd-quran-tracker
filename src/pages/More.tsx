import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Compass, History, Settings as SettingsIcon, Bell, Target, RefreshCw } from "lucide-react";
import { getSettings, saveSettings, getWerdEntries, calculateStreak } from "@/lib/storage";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

const More = () => {
  const [settings, setSettings] = useState(getSettings());
  const [goalPages, setGoalPages] = useState(settings.goal.dailyPages.toString());
  const [reminderTime, setReminderTime] = useState(settings.reminderTime);
  const entries = getWerdEntries().sort((a, b) => b.date.localeCompare(a.date));
  const streak = calculateStreak();

  const handleSaveGoal = () => {
    const pages = parseInt(goalPages);
    if (isNaN(pages) || pages <= 0) {
      toast.error("Please enter a valid number");
      return;
    }

    const newSettings = {
      ...settings,
      goal: { ...settings.goal, dailyPages: pages },
    };
    saveSettings(newSettings);
    setSettings(newSettings);
    toast.success("Goal updated successfully!");
  };

  const handleToggleReminder = (enabled: boolean) => {
    const newSettings = {
      ...settings,
      reminderEnabled: enabled,
    };
    saveSettings(newSettings);
    setSettings(newSettings);
    toast.success(enabled ? "Reminders enabled" : "Reminders disabled");
  };

  return (
    <div className="min-h-screen bg-background pb-24 px-4 pt-6">
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">More</h1>
          <p className="text-muted-foreground">Settings, history & tools</p>
        </div>

        {/* Streak Card */}
        <Card className="bg-gradient-primary text-primary-foreground shadow-medium">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Your Current Streak</p>
                <p className="text-4xl font-bold">{streak} days</p>
                <p className="text-sm opacity-75 mt-1">Keep it going! 🔥</p>
              </div>
              <div className="text-6xl opacity-90">📖</div>
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card className="bg-gradient-card shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5" />
              Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Daily Goal */}
            <div className="space-y-2">
              <Label>Daily Goal (Pages)</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={goalPages}
                  onChange={(e) => setGoalPages(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleSaveGoal}>Save</Button>
              </div>
            </div>

            {/* Reminders */}
            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Daily Reminders
                </Label>
                <p className="text-sm text-muted-foreground">Get notified to read Quran</p>
              </div>
              <Switch
                checked={settings.reminderEnabled}
                onCheckedChange={handleToggleReminder}
              />
            </div>

            {settings.reminderEnabled && (
              <div className="space-y-2 pl-6">
                <Label>Reminder Time</Label>
                <Input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => {
                    setReminderTime(e.target.value);
                    const newSettings = { ...settings, reminderTime: e.target.value };
                    saveSettings(newSettings);
                    setSettings(newSettings);
                  }}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* History */}
        <Dialog>
          <DialogTrigger asChild>
            <Card className="bg-gradient-card shadow-soft cursor-pointer hover:shadow-medium transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Reading History
                </CardTitle>
                <CardDescription>View your past entries</CardDescription>
              </CardHeader>
            </Card>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Reading History</DialogTitle>
              <DialogDescription>Your Qur'an reading log</DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-3">
                {entries.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No entries yet</p>
                ) : (
                  entries.map((entry) => (
                    <div
                      key={entry.date}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{new Date(entry.date).toLocaleDateString()}</p>
                        <p className="text-sm text-muted-foreground">{entry.pagesRead} pages</p>
                      </div>
                      {entry.completed && (
                        <span className="text-primary font-medium">✓ Goal met</span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* Qibla Direction - Placeholder */}
        <Card className="bg-gradient-card shadow-soft opacity-60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Compass className="w-5 h-5" />
              Qibla Direction
            </CardTitle>
            <CardDescription>Coming soon in the next update</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default More;
