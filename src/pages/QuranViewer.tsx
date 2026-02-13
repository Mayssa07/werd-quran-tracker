import { useState, useEffect, useCallback, useMemo } from "react";
import { BookOpen, ChevronLeft, ChevronRight, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
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

  // Temp state for werd dialog
  const [startSurah, setStartSurah] = useState("1");
  const [startAyah, setStartAyah] = useState("1");
  const [endSurah, setEndSurah] = useState("1");
  const [endAyah, setEndAyah] = useState("7");

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
      setWerdRange(settings.werdRange);
      setStartSurah(String(settings.werdRange.startSurah));
      setStartAyah(String(settings.werdRange.startAyah));
      setEndSurah(String(settings.werdRange.endSurah));
      setEndAyah(String(settings.werdRange.endAyah));
    }
  }, []);

  // Flatten all verses into pages
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

  // Filter to werd range if set
  const werdVerses = useMemo(() => {
    if (!werdRange || allVerses.length === 0) return allVerses;
    return allVerses.filter((v) => {
      const pos = v.surahId * 1000 + v.verse.id;
      const startPos = werdRange.startSurah * 1000 + werdRange.startAyah;
      const endPos = werdRange.endSurah * 1000 + werdRange.endAyah;
      return pos >= startPos && pos <= endPos;
    });
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
  }, [totalPages]);

  const goPrev = useCallback(() => {
    setCurrentPage((p) => Math.max(p - 1, 0));
  }, []);

  // Get max ayah for a given surah
  const getMaxAyah = (surahId: number) => {
    if (!quranData) return 1;
    const surah = quranData.find((s) => s.id === surahId);
    return surah ? surah.total_verses : 1;
  };

  const handleSaveWerd = () => {
    const range: WerdRange = {
      startSurah: parseInt(startSurah),
      startAyah: parseInt(startAyah),
      endSurah: parseInt(endSurah),
      endAyah: parseInt(endAyah),
    };

    // Validate
    const startPos = range.startSurah * 1000 + range.startAyah;
    const endPos = range.endSurah * 1000 + range.endAyah;
    if (endPos < startPos) {
      toast.error("End position must come after start position");
      return;
    }

    const settings = getSettings();
    settings.werdRange = range;
    saveSettings(settings);
    setWerdRange(range);
    setCurrentPage(0);
    setWerdSettingsOpen(false);
    toast.success("Werd range saved!");
  };

  const handleClearWerd = () => {
    const settings = getSettings();
    delete settings.werdRange;
    saveSettings(settings);
    setWerdRange(undefined);
    setCurrentPage(0);
    setWerdSettingsOpen(false);
    toast.success("Showing full Quran");
  };

  // Detect surah changes on current page for headers
  const surahHeaders = useMemo(() => {
    const headers = new Set<number>();
    for (const v of currentVerses) {
      if (v.verse.id === 1) {
        headers.add(v.surahId);
      }
    }
    // Also add the surah of the first verse if it's the first page or first verse on page
    if (currentVerses.length > 0) {
      headers.add(currentVerses[0].surahId);
    }
    return headers;
  }, [currentVerses]);

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
                Werd Active
              </span>
            )}
            <Dialog open={werdSettingsOpen} onOpenChange={setWerdSettingsOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings2 className="w-5 h-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm">
                <DialogHeader>
                  <DialogTitle>Set Your Werd</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  {/* Start */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Start From</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Select value={startSurah} onValueChange={(v) => { setStartSurah(v); setStartAyah("1"); }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Surah" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60 bg-popover z-50">
                          {quranData.map((s) => (
                            <SelectItem key={s.id} value={String(s.id)}>
                              {s.id}. {s.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={startAyah} onValueChange={setStartAyah}>
                        <SelectTrigger>
                          <SelectValue placeholder="Ayah" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60 bg-popover z-50">
                          {Array.from({ length: getMaxAyah(parseInt(startSurah)) }, (_, i) => (
                            <SelectItem key={i + 1} value={String(i + 1)}>
                              Ayah {i + 1}
                            </SelectItem>
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
                        <SelectTrigger>
                          <SelectValue placeholder="Surah" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60 bg-popover z-50">
                          {quranData.map((s) => (
                            <SelectItem key={s.id} value={String(s.id)}>
                              {s.id}. {s.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={endAyah} onValueChange={setEndAyah}>
                        <SelectTrigger>
                          <SelectValue placeholder="Ayah" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60 bg-popover z-50">
                          {Array.from({ length: getMaxAyah(parseInt(endSurah)) }, (_, i) => (
                            <SelectItem key={i + 1} value={String(i + 1)}>
                              Ayah {i + 1}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button onClick={handleSaveWerd} className="flex-1">
                      Save Werd
                    </Button>
                    {werdRange && (
                      <Button variant="outline" onClick={handleClearWerd}>
                        Clear
                      </Button>
                    )}
                  </div>
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
              const showSurahHeader =
                item.verse.id === 1 ||
                (idx === 0 && !currentVerses.some((v, i) => i < idx && v.surahId === item.surahId));

              const isFirstOnPage = idx === 0;
              const prevItem = idx > 0 ? currentVerses[idx - 1] : null;
              const surahChanged = prevItem && prevItem.surahId !== item.surahId;

              return (
                <div key={`${item.surahId}-${item.verse.id}`}>
                  {(item.verse.id === 1 || (isFirstOnPage && !prevItem) || surahChanged) && (
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
                      <p
                        className="flex-1 text-right font-arabic text-xl leading-[2.2] text-foreground"
                        dir="rtl"
                      >
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
            <Button
              variant="ghost"
              size="sm"
              onClick={goPrev}
              disabled={currentPage === 0}
              className="gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              {currentPage + 1} / {totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={goNext}
              disabled={currentPage === totalPages - 1}
              className="gap-1"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuranViewer;
