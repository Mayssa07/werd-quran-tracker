import { useState, useEffect, useCallback, useMemo } from "react";
import { BookOpen, ChevronLeft, ChevronRight, Settings2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { getSettings, saveSettings } from "@/lib/storage";
import type { WerdRange } from "@/lib/storage";
import { toast } from "sonner";

interface Verse {
  id: number;
  text: string;
}

interface Surah {
  id: number;
  name: string;
  transliteration: string;
  total_verses: number;
  verses: Verse[];
}

const VERSES_PER_PAGE = 15;

const QuranViewer = () => {
  const [quranData, setQuranData] = useState<Surah[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [werdSettingsOpen, setWerdSettingsOpen] = useState(false);
  const [werdRange, setWerdRange] = useState<WerdRange | undefined>();

  // Temp state for range mode
  const [startSurah, setStartSurah] = useState("1");
  const [startAyah, setStartAyah] = useState("1");
  const [endSurah, setEndSurah] = useState("1");
  const [endAyah, setEndAyah] = useState("7");

  // Temp state for surahs mode
  const [selectedSurahs, setSelectedSurahs] = useState<number[]>([]);

  // Tab mode
  const [werdMode, setWerdMode] = useState<"range" | "surahs">("range");

  useEffect(() => {
    const loadQuranData = async () => {
      try {
        const response = await fetch("/quran.json");
        const data = await response.json();
        setQuranData(data);
      } catch (error) {
        console.error("Error loading Quran data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadQuranData();
  }, []);

  useEffect(() => {
    const settings = getSettings();
    if (settings.werdRange) {
      const wr = settings.werdRange;
      setWerdRange(wr);
      setWerdMode(wr.mode || "range");
      if (wr.mode === "surahs" && wr.selectedSurahs) {
        setSelectedSurahs(wr.selectedSurahs);
      } else {
        setStartSurah(String(wr.startSurah || 1));
        setStartAyah(String(wr.startAyah || 1));
        setEndSurah(String(wr.endSurah || 1));
        setEndAyah(String(wr.endAyah || 7));
      }
    }
  }, []);

  // Flatten all verses
  const allVerses = useMemo(() => {
    if (!quranData) return [];
    const verses: { surahId: number; surahName: string; transliteration: string; verse: Verse }[] = [];
    for (const surah of quranData) {
      for (const verse of surah.verses) {
        verses.push({
          surahId: surah.id,
          surahName: surah.name,
          transliteration: surah.transliteration,
          verse,
        });
      }
    }
    return verses;
  }, [quranData]);

  // Filter to werd
  const werdVerses = useMemo(() => {
    if (!werdRange || allVerses.length === 0) return allVerses;

    if (werdRange.mode === "surahs" && werdRange.selectedSurahs?.length) {
      const surahSet = new Set(werdRange.selectedSurahs);
      return allVerses.filter((v) => surahSet.has(v.surahId));
    }

    if (werdRange.mode === "range" && werdRange.startSurah && werdRange.endSurah) {
      return allVerses.filter((v) => {
        const pos = v.surahId * 1000 + v.verse.id;
        const startPos = werdRange.startSurah! * 1000 + (werdRange.startAyah || 1);
        const endPos = werdRange.endSurah! * 1000 + (werdRange.endAyah || 999);
        return pos >= startPos && pos <= endPos;
      });
    }

    return allVerses;
  }, [allVerses, werdRange]);

  // Paginate
  const pages = useMemo(() => {
    const result: typeof werdVerses[] = [];
    for (let i = 0; i < werdVerses.length; i += VERSES_PER_PAGE) {
      result.push(werdVerses.slice(i, i + VERSES_PER_PAGE));
    }
    return result;
  }, [werdVerses]);

  const totalPages = pages.length;
  const currentVerses = pages[currentPage] || [];

  const goNext = useCallback(() => {
    setCurrentPage((p) => Math.min(p + 1, totalPages - 1));
    window.scrollTo({ top: 0 });
  }, [totalPages]);

  const goPrev = useCallback(() => {
    setCurrentPage((p) => Math.max(p - 1, 0));
    window.scrollTo({ top: 0 });
  }, []);

  const getMaxAyah = (surahId: number) => {
    if (!quranData) return 1;
    const surah = quranData.find((s) => s.id === surahId);
    return surah ? surah.total_verses : 1;
  };

  const toggleSurah = (surahId: number) => {
    setSelectedSurahs((prev) =>
      prev.includes(surahId) ? prev.filter((id) => id !== surahId) : [...prev, surahId]
    );
  };

  const handleSaveWerd = () => {
    if (werdMode === "range") {
      const range: WerdRange = {
        mode: "range",
        startSurah: parseInt(startSurah),
        startAyah: parseInt(startAyah),
        endSurah: parseInt(endSurah),
        endAyah: parseInt(endAyah),
      };
      const startPos = range.startSurah! * 1000 + range.startAyah!;
      const endPos = range.endSurah! * 1000 + range.endAyah!;
      if (endPos < startPos) {
        toast.error("End position must come after start position");
        return;
      }
      const settings = getSettings();
      settings.werdRange = range;
      saveSettings(settings);
      setWerdRange(range);
    } else {
      if (selectedSurahs.length === 0) {
        toast.error("Select at least one Surah");
        return;
      }
      const range: WerdRange = {
        mode: "surahs",
        selectedSurahs: [...selectedSurahs].sort((a, b) => a - b),
      };
      const settings = getSettings();
      settings.werdRange = range;
      saveSettings(settings);
      setWerdRange(range);
    }
    setCurrentPage(0);
    setWerdSettingsOpen(false);
    toast.success("Werd saved!");
  };

  const handleClearWerd = () => {
    const settings = getSettings();
    delete settings.werdRange;
    saveSettings(settings);
    setWerdRange(undefined);
    setSelectedSurahs([]);
    setCurrentPage(0);
    setWerdSettingsOpen(false);
    toast.success("Showing full Quran");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-24 px-4 pt-6 flex items-center justify-center">
        <p className="text-muted-foreground">Loading Quran...</p>
      </div>
    );
  }

  if (!quranData || quranData.length === 0) {
    return (
      <div className="min-h-screen bg-background pb-24 px-4 pt-6">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <BookOpen className="w-16 h-16 text-primary mx-auto" />
          <h1 className="text-2xl font-bold text-foreground">Quran Data Not Found</h1>
          <p className="text-muted-foreground">Please add Quran data to public/quran.json</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <h1 className="text-lg font-bold text-foreground">القرآن الكريم</h1>
          </div>

          <div className="flex items-center gap-2">
            {werdRange && (
              <span className="text-xs text-muted-foreground bg-primary/10 px-2 py-1 rounded-full">
                {werdRange.mode === "surahs"
                  ? `${werdRange.selectedSurahs?.length} Surahs`
                  : "Werd Active"}
              </span>
            )}
            <Dialog open={werdSettingsOpen} onOpenChange={setWerdSettingsOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings2 className="w-5 h-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm max-h-[85vh] flex flex-col">
                <DialogHeader>
                  <DialogTitle>Set Your Werd</DialogTitle>
                </DialogHeader>

                <Tabs value={werdMode} onValueChange={(v) => setWerdMode(v as "range" | "surahs")} className="flex-1 flex flex-col min-h-0">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="range">Range</TabsTrigger>
                    <TabsTrigger value="surahs">Pick Surahs</TabsTrigger>
                  </TabsList>

                  <TabsContent value="range" className="space-y-4 pt-2">
                    {/* Start */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Start From</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Select value={startSurah} onValueChange={(v) => { setStartSurah(v); setStartAyah("1"); }}>
                          <SelectTrigger><SelectValue placeholder="Surah" /></SelectTrigger>
                          <SelectContent className="max-h-60 bg-popover z-50">
                            {quranData.map((s) => (
                              <SelectItem key={s.id} value={String(s.id)}>
                                {s.id}. {s.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select value={startAyah} onValueChange={setStartAyah}>
                          <SelectTrigger><SelectValue placeholder="Ayah" /></SelectTrigger>
                          <SelectContent className="max-h-60 bg-popover z-50">
                            {Array.from({ length: getMaxAyah(parseInt(startSurah)) }, (_, i) => (
                              <SelectItem key={i + 1} value={String(i + 1)}>Ayah {i + 1}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    {/* End */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">End At</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Select value={endSurah} onValueChange={(v) => { setEndSurah(v); setEndAyah(String(getMaxAyah(parseInt(v)))); }}>
                          <SelectTrigger><SelectValue placeholder="Surah" /></SelectTrigger>
                          <SelectContent className="max-h-60 bg-popover z-50">
                            {quranData.map((s) => (
                              <SelectItem key={s.id} value={String(s.id)}>
                                {s.id}. {s.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select value={endAyah} onValueChange={setEndAyah}>
                          <SelectTrigger><SelectValue placeholder="Ayah" /></SelectTrigger>
                          <SelectContent className="max-h-60 bg-popover z-50">
                            {Array.from({ length: getMaxAyah(parseInt(endSurah)) }, (_, i) => (
                              <SelectItem key={i + 1} value={String(i + 1)}>Ayah {i + 1}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="surahs" className="flex-1 min-h-0 pt-2">
                    <Label className="text-sm font-semibold mb-2 block">
                      Select Surahs ({selectedSurahs.length} selected)
                    </Label>
                    <ScrollArea className="h-[280px] border border-border rounded-lg">
                      <div className="p-2 space-y-1">
                        {quranData.map((s) => (
                          <button
                            key={s.id}
                            onClick={() => toggleSurah(s.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors text-sm ${
                              selectedSurahs.includes(s.id)
                                ? "bg-primary/10 text-primary"
                                : "hover:bg-muted text-foreground"
                            }`}
                          >
                            <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 ${
                              selectedSurahs.includes(s.id)
                                ? "bg-primary border-primary"
                                : "border-border"
                            }`}>
                              {selectedSurahs.includes(s.id) && (
                                <Check className="w-3 h-3 text-primary-foreground" />
                              )}
                            </div>
                            <span className="flex-shrink-0 text-muted-foreground w-7">{s.id}.</span>
                            <span className="font-arabic">{s.name}</span>
                            <span className="text-xs text-muted-foreground ml-auto">{s.transliteration}</span>
                          </button>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>

                <div className="flex gap-2 pt-3">
                  <Button onClick={handleSaveWerd} className="flex-1">Save Werd</Button>
                  {werdRange && (
                    <Button variant="outline" onClick={handleClearWerd}>Clear</Button>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-4">
        {currentVerses.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No verses in this range. Adjust your Werd settings.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {currentVerses.map((item, idx) => {
              const prevItem = idx > 0 ? currentVerses[idx - 1] : null;
              const surahChanged = !prevItem || prevItem.surahId !== item.surahId;
              const isNewSurah = item.verse.id === 1 || surahChanged;

              return (
                <div key={`${item.surahId}-${item.verse.id}`}>
                  {isNewSurah && (
                    <div className="bg-gradient-card rounded-lg p-3 text-center border border-primary/20 mb-3">
                      <h2 className="text-xl font-bold text-foreground">{item.surahName}</h2>
                      <p className="text-xs text-muted-foreground">
                        {item.transliteration} - Surah {item.surahId}
                      </p>
                    </div>
                  )}
                  <div className="bg-card/50 rounded-lg p-3 border border-border/50">
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
                        {item.verse.id}
                      </span>
                      <p className="flex-1 text-right font-arabic text-xl leading-[2.2] text-foreground" dir="rtl">
                        {item.verse.text}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Page Navigation */}
      {totalPages > 1 && (
        <div className="sticky bottom-20 bg-background/95 backdrop-blur-sm border-t border-border px-4 py-3">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={goPrev} disabled={currentPage === 0} className="gap-1">
              <ChevronLeft className="w-4 h-4" /> Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              {currentPage + 1} / {totalPages}
            </span>
            <Button variant="ghost" size="sm" onClick={goNext} disabled={currentPage === totalPages - 1} className="gap-1">
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuranViewer;
