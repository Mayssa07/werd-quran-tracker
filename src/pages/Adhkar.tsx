import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sunrise, Sunset, Heart } from "lucide-react";

interface Dhikr {
  id: number;
  arabic: string;
  transliteration: string;
  translation: string;
  repetitions?: string;
}

const morningAdhkar: Dhikr[] = [
  {
    id: 1,
    arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ",
    transliteration: "Asbahna wa asbahal-mulku lillah",
    translation: "We have entered the morning and so has all dominion entered into the domain of Allah",
    repetitions: "1x"
  },
  {
    id: 2,
    arabic: "اللَّهُمَّ إِنِّي أَصْبَحْتُ أُشْهِدُكَ",
    transliteration: "Allahumma inni asbahtu ushhiduka",
    translation: "O Allah, I have entered the morning and I bear witness to You",
    repetitions: "1x"
  },
  {
    id: 3,
    arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
    transliteration: "Subhanallahi wa bihamdihi",
    translation: "Glory is to Allah and praise is to Him",
    repetitions: "100x"
  },
];

const eveningAdhkar: Dhikr[] = [
  {
    id: 1,
    arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ",
    transliteration: "Amsayna wa amsal-mulku lillah",
    translation: "We have entered the evening and so has all dominion entered into the domain of Allah",
    repetitions: "1x"
  },
  {
    id: 2,
    arabic: "اللَّهُمَّ إِنِّي أَمْسَيْتُ أُشْهِدُكَ",
    transliteration: "Allahumma inni amsaytu ushhiduka",
    translation: "O Allah, I have entered the evening and I bear witness to You",
    repetitions: "1x"
  },
  {
    id: 3,
    arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ",
    transliteration: "A'udhu bikalimatillahit-tammati",
    translation: "I seek refuge in the perfect words of Allah",
    repetitions: "3x"
  },
];

const generalDuas: Dhikr[] = [
  {
    id: 1,
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً",
    transliteration: "Rabbana atina fid-dunya hasanatan",
    translation: "Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good",
    repetitions: ""
  },
  {
    id: 2,
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ",
    transliteration: "Allahumma inni as'alukal-'afwa wal-'afiyah",
    translation: "O Allah, I ask You for pardon and well-being",
    repetitions: ""
  },
  {
    id: 3,
    arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
    transliteration: "Hasbunallahu wa ni'mal wakeel",
    translation: "Sufficient for us is Allah, and [He is] the best Disposer of affairs",
    repetitions: ""
  },
];

const DhikrCard = ({ dhikr }: { dhikr: Dhikr }) => (
  <Card className="bg-gradient-card shadow-soft animate-fade-in">
    <CardContent className="pt-6 space-y-3">
      <div className="text-right">
        <p className="font-arabic text-2xl leading-relaxed text-foreground mb-2">
          {dhikr.arabic}
        </p>
        {dhikr.repetitions && (
          <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
            {dhikr.repetitions}
          </span>
        )}
      </div>
      <div className="space-y-1 pt-2 border-t border-border">
        <p className="text-sm italic text-muted-foreground">
          {dhikr.transliteration}
        </p>
        <p className="text-sm text-foreground">
          {dhikr.translation}
        </p>
      </div>
    </CardContent>
  </Card>
);

const Adhkar = () => {
  return (
    <div className="min-h-screen bg-background pb-24 px-4 pt-6">
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Adhkar & Duas</h1>
          <p className="text-muted-foreground">Daily remembrance and supplications</p>
        </div>

        <Tabs defaultValue="morning" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="morning" className="gap-2">
              <Sunrise className="w-4 h-4" />
              Morning
            </TabsTrigger>
            <TabsTrigger value="evening" className="gap-2">
              <Sunset className="w-4 h-4" />
              Evening
            </TabsTrigger>
            <TabsTrigger value="general" className="gap-2">
              <Heart className="w-4 h-4" />
              General
            </TabsTrigger>
          </TabsList>

          <TabsContent value="morning" className="mt-6">
            <ScrollArea className="h-[calc(100vh-240px)]">
              <div className="space-y-4 pr-4">
                {morningAdhkar.map((dhikr) => (
                  <DhikrCard key={dhikr.id} dhikr={dhikr} />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="evening" className="mt-6">
            <ScrollArea className="h-[calc(100vh-240px)]">
              <div className="space-y-4 pr-4">
                {eveningAdhkar.map((dhikr) => (
                  <DhikrCard key={dhikr.id} dhikr={dhikr} />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="general" className="mt-6">
            <ScrollArea className="h-[calc(100vh-240px)]">
              <div className="space-y-4 pr-4">
                {generalDuas.map((dhikr) => (
                  <DhikrCard key={dhikr.id} dhikr={dhikr} />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Adhkar;
