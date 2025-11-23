import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen } from "lucide-react";

interface Ayah {
  number: number;
  text: string;
}

interface Surah {
  number: number;
  name: string;
  ayahs: Ayah[];
}

interface QuranData {
  surahs: Surah[];
}

const QuranViewer = () => {
  const [quranData, setQuranData] = useState<QuranData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuranData = async () => {
      try {
        const response = await fetch('/quran.json');
        const data = await response.json();
        setQuranData(data);
      } catch (error) {
        console.error('Error loading Quran data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadQuranData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-24 px-4 pt-6 flex items-center justify-center">
        <p className="text-muted-foreground">Loading Quran...</p>
      </div>
    );
  }

  if (!quranData || !quranData.surahs || quranData.surahs.length === 0) {
    return (
      <div className="min-h-screen bg-background pb-24 px-4 pt-6">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <BookOpen className="w-16 h-16 text-primary mx-auto" />
          <h1 className="text-2xl font-bold text-foreground">Quran Data Not Found</h1>
          <p className="text-muted-foreground">
            Please add Quran data to public/quran.json
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-2">
          <BookOpen className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">القرآن الكريم</h1>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
          {quranData.surahs.map((surah) => (
            <div key={surah.number} className="space-y-4">
              {/* Surah Header */}
              <div className="bg-gradient-card rounded-lg p-4 text-center border border-primary/20">
                <h2 className="text-2xl font-bold text-foreground">
                  {surah.name}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  سورة {surah.name} - Surah {surah.number}
                </p>
              </div>

              {/* Ayahs */}
              <div className="space-y-4">
                {surah.ayahs.map((ayah) => (
                  <div
                    key={ayah.number}
                    className="bg-card/50 rounded-lg p-4 border border-border/50 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
                        {ayah.number}
                      </span>
                      <p
                        className="flex-1 text-right font-arabic text-2xl leading-loose text-foreground"
                        dir="rtl"
                      >
                        {ayah.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default QuranViewer;
