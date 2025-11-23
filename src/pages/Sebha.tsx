import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RotateCcw, Vibrate } from "lucide-react";
import { getTasbeehCount, saveTasbeehCount } from "@/lib/storage";

const Sebha = () => {
  const [count, setCount] = useState(getTasbeehCount());

  useEffect(() => {
    saveTasbeehCount(count);
  }, [count]);

  const handleIncrement = () => {
    // Haptic feedback (if supported)
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    setCount(count + 1);
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset the counter?")) {
      setCount(0);
    }
  };

  const getCountColor = () => {
    if (count >= 99) return "text-accent";
    if (count >= 33) return "text-primary";
    return "text-foreground";
  };

  return (
    <div className="min-h-screen bg-background pb-24 px-4 pt-6">
      <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Tasbeeh Counter</h1>
          <p className="text-muted-foreground">Digital Sebha for dhikr</p>
        </div>

        {/* Main Counter Card */}
        <Card className="bg-gradient-card shadow-medium">
          <CardContent className="pt-12 pb-12">
            <div className="text-center space-y-8">
              {/* Count Display */}
              <div 
                className={`text-8xl font-bold transition-all duration-200 ${getCountColor()} animate-scale-in`}
                key={count}
              >
                {count}
              </div>

              {/* Milestones */}
              <div className="flex justify-center gap-4 text-sm">
                <div className={`px-3 py-1 rounded-full ${count >= 33 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  33
                </div>
                <div className={`px-3 py-1 rounded-full ${count >= 66 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  66
                </div>
                <div className={`px-3 py-1 rounded-full ${count >= 99 ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}`}>
                  99
                </div>
              </div>

              {/* Tap Area */}
              <button
                onClick={handleIncrement}
                className="w-48 h-48 mx-auto rounded-full bg-gradient-primary text-primary-foreground shadow-medium hover:shadow-lg active:scale-95 transition-all duration-200 flex items-center justify-center text-xl font-semibold"
              >
                Tap to Count
              </button>

              {/* Reset Button */}
              <Button
                onClick={handleReset}
                variant="outline"
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Common Dhikr Suggestions */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground">Common Dhikr:</h3>
          <Card className="bg-card shadow-soft">
            <CardContent className="pt-4 pb-4 space-y-3">
              <div className="text-center space-y-1">
                <p className="font-arabic text-xl text-foreground">سُبْحَانَ اللّهِ</p>
                <p className="text-sm text-muted-foreground">SubhanAllah (Glory be to Allah) - 33x</p>
              </div>
              <div className="text-center space-y-1">
                <p className="font-arabic text-xl text-foreground">الْحَمْدُ لِلّهِ</p>
                <p className="text-sm text-muted-foreground">Alhamdulillah (All praise to Allah) - 33x</p>
              </div>
              <div className="text-center space-y-1">
                <p className="font-arabic text-xl text-foreground">اللّهُ أَكْبَرُ</p>
                <p className="text-sm text-muted-foreground">Allahu Akbar (Allah is the Greatest) - 34x</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Sebha;
