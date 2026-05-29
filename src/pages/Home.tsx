import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Plus, BookMarked } from "lucide-react";
import { getTodayEntry, saveWerdEntry, getSettings, calculateStreak } from "@/lib/storage";
import werdLogo from "@/assets/werd-logo.png";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [todayEntry, setTodayEntry] = useState(getTodayEntry());
  const [settings, setSettings] = useState(getSettings());
  const [pagesInput, setPagesInput] = useState("");
  const [fromPage, setFromPage] = useState("");
  const [toPage, setToPage] = useState("");
  const [streak, setStreak] = useState(0);
  const [logMode, setLogMode] = useState<"count" | "range">("count");

  useEffect(() => {
    setStreak(calculateStreak());
  }, [todayEntry]);

  const progress = todayEntry ? (todayEntry.pagesRead / settings.goal.dailyPages) * 100 : 0;
  const remaining = settings.goal.dailyPages - (todayEntry?.pagesRead || 0);

  const handleLogPages = () => {
    const pages = parseInt(pagesInput);
    if (isNaN(pages) || pages <= 0) {
      toast.error("Please enter a valid number of pages");
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const currentPages = todayEntry?.pagesRead || 0;
    const newPages = currentPages + pages;
    
    const entry = {
      date: today,
      pagesRead: newPages,
      completed: newPages >= settings.goal.dailyPages,
    };

    saveWerdEntry(entry);
    setTodayEntry(entry);
    setPagesInput("");
    toast.success(`Logged ${pages} pages! MashAllah`);
  };

  const handleLogPageRange = () => {
    const from = parseInt(fromPage);
    const to = parseInt(toPage);
    
    if (isNaN(from) || isNaN(to) || from <= 0 || to <= 0 || from > to) {
      toast.error("Please enter a valid page range");
      return;
    }

    const pagesCount = to - from + 1;
    const today = new Date().toISOString().split('T')[0];
    const currentPages = todayEntry?.pagesRead || 0;
    const newPages = currentPages + pagesCount;
    
    const entry = {
      date: today,
      pagesRead: newPages,
      completed: newPages >= settings.goal.dailyPages,
      fromPage: from,
      toPage: to,
    };

    saveWerdEntry(entry);
    setTodayEntry(entry);
    setFromPage("");
    setToPage("");
    toast.success(`Logged pages ${from}-${to} (${pagesCount} pages)! MashAllah`);
  };

  return (
    <div className="min-h-screen bg-background pb-24 px-4 pt-6">
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-2 pt-4">
          <img src={werdLogo} alt="Werd logo" className="mx-auto h-24 w-auto" />
          <p className="text-muted-foreground">Track your daily Qur'an reading</p>
        </div>

        {/* Streak Card */}
        {streak > 0 && (
          <Card className="bg-gradient-card shadow-soft">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Current Streak</p>
                  <p className="text-3xl font-bold text-primary">{streak} days</p>
                </div>
                <div className="text-4xl">🔥</div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Today's Progress */}
        <Card className="bg-gradient-card shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Today's Werd
            </CardTitle>
            <CardDescription>
              {todayEntry?.completed ? (
                <span className="text-primary font-medium">Completed! AlhamdulIllah ✓</span>
              ) : (
                `${remaining} pages remaining`
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{todayEntry?.pagesRead || 0} / {settings.goal.dailyPages} pages</span>
              </div>
              <Progress value={Math.min(progress, 100)} className="h-3" />
            </div>

            {/* Log Pages */}
            <Tabs value={logMode} onValueChange={(v) => setLogMode(v as "count" | "range")}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="count">Page Count</TabsTrigger>
                <TabsTrigger value="range">Page Range</TabsTrigger>
              </TabsList>
              
              <TabsContent value="count" className="mt-0">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      type="number"
                      placeholder="Pages read..."
                      value={pagesInput}
                      onChange={(e) => setPagesInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleLogPages()}
                      className="text-lg"
                    />
                  </div>
                  <Button onClick={handleLogPages} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Log
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="range" className="mt-0 space-y-2">
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="From page"
                    value={fromPage}
                    onChange={(e) => setFromPage(e.target.value)}
                    className="flex-1"
                  />
                  <span className="flex items-center text-muted-foreground">-</span>
                  <Input
                    type="number"
                    placeholder="To page"
                    value={toPage}
                    onChange={(e) => setToPage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleLogPageRange()}
                    className="flex-1"
                  />
                </div>
                <Button onClick={handleLogPageRange} className="w-full gap-2">
                  <Plus className="w-4 h-4" />
                  Log Range
                </Button>
              </TabsContent>
            </Tabs>

            {todayEntry?.fromPage && todayEntry?.toPage && (
              <p className="text-sm text-muted-foreground text-center">
                Last read: Pages {todayEntry.fromPage}-{todayEntry.toPage}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-gradient-card shadow-soft">
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold text-primary">{todayEntry?.pagesRead || 0}</p>
              <p className="text-sm text-muted-foreground">Pages Today</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card shadow-soft">
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold text-accent">{settings.goal.dailyPages}</p>
              <p className="text-sm text-muted-foreground">Daily Goal</p>
            </CardContent>
          </Card>
        </div>

        {/* Quran Viewer Card */}
        <Card className="bg-gradient-card shadow-soft cursor-pointer hover:shadow-medium transition-shadow" onClick={() => navigate('/quran')}>
          <CardContent className="pt-6 text-center space-y-3">
            <BookMarked className="w-12 h-12 mx-auto text-primary" />
            <div>
              <p className="font-semibold text-foreground">Open Quran Viewer</p>
              <p className="text-sm text-muted-foreground">Read the Noble Quran</p>
            </div>
          </CardContent>
        </Card>

        {/* Quranic Verse */}
        <Card className="bg-card shadow-soft border-primary/20">
          <CardContent className="pt-6 text-center space-y-2">
            <p className="font-arabic text-2xl leading-relaxed text-foreground">
              إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ
            </p>
            <p className="text-sm text-muted-foreground italic">
              "Indeed, this Qur'an guides to that which is most suitable"
            </p>
            <p className="text-xs text-muted-foreground">- Surah Al-Isra, 17:9</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
