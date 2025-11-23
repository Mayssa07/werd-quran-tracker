import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";

const QuranViewer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState("1");

  const totalPages = 604; // Total pages in Mushaf

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      setPageInput(newPage.toString());
    }
  };

  const handleInputChange = () => {
    const page = parseInt(pageInput);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    } else {
      setPageInput(currentPage.toString());
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24 px-4 pt-6">
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground flex items-center justify-center gap-2">
            <BookOpen className="w-8 h-8 text-primary" />
            Quran Viewer
          </h1>
          <p className="text-muted-foreground">Read the Noble Quran</p>
        </div>

        {/* Page Navigation */}
        <Card className="bg-gradient-card shadow-medium">
          <CardHeader>
            <CardTitle className="text-center">Page {currentPage} of {totalPages}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Page Display Area */}
            <div className="bg-background/50 rounded-lg p-8 min-h-[400px] flex items-center justify-center border-2 border-primary/20">
              <div className="text-center space-y-4">
                <p className="font-arabic text-3xl leading-relaxed text-foreground">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
                <p className="text-muted-foreground">
                  Quran page content will be displayed here
                </p>
                <p className="text-sm text-muted-foreground">
                  Page {currentPage}
                </p>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>

              <div className="flex-1 flex items-center gap-2">
                <Input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={pageInput}
                  onChange={(e) => setPageInput(e.target.value)}
                  onBlur={handleInputChange}
                  onKeyPress={(e) => e.key === 'Enter' && handleInputChange()}
                  className="text-center"
                />
                <Button onClick={handleInputChange} variant="secondary">
                  Go
                </Button>
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </div>

            {/* Quick Jump */}
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(1)}
              >
                Al-Fatiha
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(2)}
              >
                Al-Baqarah
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(582)}
              >
                Juz' Amma
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-soft border-primary/20">
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">
              📖 Note: Full Quran text integration coming soon. This is a placeholder viewer.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuranViewer;
