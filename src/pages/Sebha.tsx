import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RotateCcw, Plus, Trash2 } from "lucide-react";
import { getTasbeehCount, saveTasbeehCount, getTasbeehPhrases, saveTasbeehPhrase, deleteTasbeehPhrase, TasbeehPhrase } from "@/lib/storage";

const Sebha = () => {
  const [count, setCount] = useState(getTasbeehCount());
  const [phrases, setPhrases] = useState<TasbeehPhrase[]>([]);
  const [selectedPhrase, setSelectedPhrase] = useState<TasbeehPhrase | null>(null);

  useEffect(() => {
    const loadedPhrases = getTasbeehPhrases();
    setPhrases(loadedPhrases);
    if (loadedPhrases.length > 0) {
      setSelectedPhrase(loadedPhrases[0]);
    }
  }, []);

  useEffect(() => {
    saveTasbeehCount(count);
  }, [count]);

  const handleIncrement = () => {
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

  const refreshPhrases = () => {
    const loadedPhrases = getTasbeehPhrases();
    setPhrases(loadedPhrases);
  };

  const handleDeletePhrase = (id: string) => {
    if (confirm("Are you sure you want to delete this phrase?")) {
      deleteTasbeehPhrase(id);
      refreshPhrases();
      if (selectedPhrase?.id === id) {
        const remaining = getTasbeehPhrases();
        setSelectedPhrase(remaining.length > 0 ? remaining[0] : null);
      }
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

        {/* Current Phrase Display */}
        {selectedPhrase && (
          <Card className="bg-gradient-card shadow-soft">
            <CardContent className="pt-6 pb-6 text-center space-y-2">
              <p className="font-arabic text-3xl text-foreground">{selectedPhrase.arabic}</p>
              <p className="text-sm text-muted-foreground italic">{selectedPhrase.transliteration}</p>
            </CardContent>
          </Card>
        )}

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

        {/* Phrases List */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-foreground">Tasbeeh Phrases:</h3>
            <AddPhraseDialog onSave={refreshPhrases} />
          </div>
          
          <Card className="bg-card shadow-soft">
            <CardContent className="pt-4 pb-4">
              <ScrollArea className="max-h-[300px]">
                <div className="space-y-2">
                  {phrases.map((phrase) => (
                    <div
                      key={phrase.id}
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedPhrase?.id === phrase.id
                          ? 'bg-primary/10 border border-primary'
                          : 'hover:bg-muted'
                      }`}
                      onClick={() => setSelectedPhrase(phrase)}
                    >
                      <div className="flex-1 text-center space-y-1">
                        <p className="font-arabic text-xl text-foreground">{phrase.arabic}</p>
                        <p className="text-sm text-muted-foreground">{phrase.transliteration}</p>
                      </div>
                      {phrases.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePhrase(phrase.id);
                          }}
                          className="ml-2 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const AddPhraseDialog = ({ onSave }: { onSave: () => void }) => {
  const [open, setOpen] = useState(false);
  const [arabic, setArabic] = useState("");
  const [transliteration, setTransliteration] = useState("");

  const handleSave = () => {
    if (arabic && transliteration) {
      const phrase: TasbeehPhrase = {
        id: Date.now().toString(),
        arabic,
        transliteration,
      };
      saveTasbeehPhrase(phrase);
      setOpen(false);
      setArabic("");
      setTransliteration("");
      onSave();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Add Phrase
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Tasbeeh Phrase</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phrase-arabic">Arabic Text</Label>
            <Input
              id="phrase-arabic"
              value={arabic}
              onChange={(e) => setArabic(e.target.value)}
              placeholder="Enter Arabic text"
              className="font-arabic text-xl text-right"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phrase-transliteration">Transliteration</Label>
            <Input
              id="phrase-transliteration"
              value={transliteration}
              onChange={(e) => setTransliteration(e.target.value)}
              placeholder="Enter transliteration"
            />
          </div>
          <Button onClick={handleSave} className="w-full">
            Save Phrase
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Sebha;