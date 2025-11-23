import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sunrise, Sunset, Heart, User, Plus, Trash2, Edit } from "lucide-react";
import { getCustomAdhkar, saveCustomDhikr, deleteCustomDhikr, CustomDhikr } from "@/lib/storage";

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
    arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ رَبِّ الْعَالَمِينَ",
    transliteration: "Asbahna wa asbahal-mulku lillahi rabbil-'alamin",
    translation: "We have entered the morning and the dominion has entered into the domain of Allah, Lord of the worlds",
    repetitions: "1x"
  },
  {
    id: 2,
    arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ",
    transliteration: "Allahumma bika asbahna wa bika amsayna wa bika nahya wa bika namutu wa ilaykan-nushur",
    translation: "O Allah, by You we enter the morning and by You we enter the evening, by You we live and by You we die, and to You is the resurrection",
    repetitions: "1x"
  },
  {
    id: 3,
    arabic: "اللَّهُمَّ إِنِّي أَصْبَحْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ",
    transliteration: "Allahumma inni asbahtu ushhiduka wa ushhidu hamalata 'arshika",
    translation: "O Allah, I have entered the morning and I bear witness to You and I bear witness to the carriers of Your Throne",
    repetitions: "1x"
  },
  {
    id: 4,
    arabic: "رَضِيتُ بِاللَّهِ رَبًّا وَبِالْإِسْلَامِ دِينًا وَبِمُحَمَّدٍ نَبِيًّا",
    transliteration: "Raditu billahi rabban wa bil-islami dinan wa bi-muhammadin nabiyyan",
    translation: "I am pleased with Allah as my Lord, with Islam as my religion, and with Muhammad as my Prophet",
    repetitions: "3x"
  },
  {
    id: 5,
    arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
    transliteration: "Subhanallahi wa bihamdihi",
    translation: "Glory is to Allah and praise is to Him",
    repetitions: "100x"
  },
  {
    id: 6,
    arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
    transliteration: "A'udhu bikalimatillahit-tammati min sharri ma khalaq",
    translation: "I seek refuge in the perfect words of Allah from the evil of what He has created",
    repetitions: "3x"
  },
];

const eveningAdhkar: Dhikr[] = [
  {
    id: 1,
    arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ رَبِّ الْعَالَمِينَ",
    transliteration: "Amsayna wa amsal-mulku lillahi rabbil-'alamin",
    translation: "We have entered the evening and the dominion has entered into the domain of Allah, Lord of the worlds",
    repetitions: "1x"
  },
  {
    id: 2,
    arabic: "اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ",
    transliteration: "Allahumma bika amsayna wa bika asbahna wa bika nahya wa bika namutu wa ilaykal-masir",
    translation: "O Allah, by You we enter the evening and by You we enter the morning, by You we live and by You we die, and to You is the final return",
    repetitions: "1x"
  },
  {
    id: 3,
    arabic: "اللَّهُمَّ إِنِّي أَمْسَيْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ",
    transliteration: "Allahumma inni amsaytu ushhiduka wa ushhidu hamalata 'arshika",
    translation: "O Allah, I have entered the evening and I bear witness to You and I bear witness to the carriers of Your Throne",
    repetitions: "1x"
  },
  {
    id: 4,
    arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
    transliteration: "A'udhu bikalimatillahit-tammati min sharri ma khalaq",
    translation: "I seek refuge in the perfect words of Allah from the evil of what He has created",
    repetitions: "3x"
  },
  {
    id: 5,
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ",
    transliteration: "Allahumma inni a'udhu bika minal-hammi wal-hazan",
    translation: "O Allah, I seek refuge in You from worry and grief",
    repetitions: "3x"
  },
  {
    id: 6,
    arabic: "اللَّهُمَّ عَافِنِي فِي بَدَنِي اللَّهُمَّ عَافِنِي فِي سَمْعِي اللَّهُمَّ عَافِنِي فِي بَصَرِي",
    transliteration: "Allahumma 'afini fi badani, Allahumma 'afini fi sam'i, Allahumma 'afini fi basari",
    translation: "O Allah, grant me health in my body, O Allah, grant me health in my hearing, O Allah, grant me health in my sight",
    repetitions: "3x"
  },
];

const generalDuas: Dhikr[] = [
  {
    id: 1,
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    transliteration: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina 'adhaban-nar",
    translation: "Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire",
  },
  {
    id: 2,
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ",
    transliteration: "Allahumma inni as'alukal-'afwa wal-'afiyah fid-dunya wal-akhirah",
    translation: "O Allah, I ask You for pardon and well-being in this world and the Hereafter",
  },
  {
    id: 3,
    arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
    transliteration: "Hasbunallahu wa ni'mal wakeel",
    translation: "Sufficient for us is Allah, and [He is] the best Disposer of affairs",
  },
  {
    id: 4,
    arabic: "اللَّهُمَّ اغْفِرْ لِي وَارْحَمْنِي وَاهْدِنِي وَعَافِنِي وَارْزُقْنِي",
    transliteration: "Allahummaghfir li warhamni wahdini wa 'afini warzuqni",
    translation: "O Allah, forgive me, have mercy on me, guide me, grant me health, and provide for me",
  },
  {
    id: 5,
    arabic: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي",
    transliteration: "Rabbish-rah li sadri wa yassir li amri",
    translation: "My Lord, expand for me my breast and ease for me my task",
  },
  {
    id: 6,
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عِلْمٍ لَا يَنْفَعُ",
    transliteration: "Allahumma inni a'udhu bika min 'ilmin la yanfa'",
    translation: "O Allah, I seek refuge in You from knowledge that does not benefit",
  },
];

const DhikrCard = ({ dhikr, onEdit, onDelete, isCustom }: { 
  dhikr: Dhikr | CustomDhikr; 
  onEdit?: () => void;
  onDelete?: () => void;
  isCustom?: boolean;
}) => (
  <Card className="bg-gradient-card shadow-soft animate-fade-in">
    <CardContent className="pt-6 space-y-3">
      <div className="text-right">
        <div className="flex justify-between items-start gap-2">
          <div className="flex gap-1">
            {isCustom && onEdit && (
              <Button variant="ghost" size="sm" onClick={onEdit} className="h-8 w-8 p-0">
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {isCustom && onDelete && (
              <Button variant="ghost" size="sm" onClick={onDelete} className="h-8 w-8 p-0 text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="flex-1">
            <p className="font-arabic text-2xl leading-relaxed text-foreground mb-2">
              {dhikr.arabic}
            </p>
            {dhikr.repetitions && (
              <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                {dhikr.repetitions}
              </span>
            )}
          </div>
        </div>
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

const AddDhikrDialog = ({ category, onSave, editDhikr }: { 
  category: 'morning' | 'evening' | 'general' | 'personal';
  onSave: () => void;
  editDhikr?: CustomDhikr;
}) => {
  const [open, setOpen] = useState(false);
  const [arabic, setArabic] = useState(editDhikr?.arabic || "");
  const [transliteration, setTransliteration] = useState(editDhikr?.transliteration || "");
  const [translation, setTranslation] = useState(editDhikr?.translation || "");
  const [repetitions, setRepetitions] = useState(editDhikr?.repetitions || "");

  const handleSave = () => {
    if (arabic && transliteration && translation) {
      const dhikr: CustomDhikr = {
        id: editDhikr?.id || Date.now().toString(),
        arabic,
        transliteration,
        translation,
        repetitions: repetitions || undefined,
        category,
      };
      saveCustomDhikr(dhikr);
      setOpen(false);
      setArabic("");
      setTransliteration("");
      setTranslation("");
      setRepetitions("");
      onSave();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Dhikr
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{editDhikr ? 'Edit' : 'Add'} Dhikr</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="arabic">Arabic Text</Label>
            <Input
              id="arabic"
              value={arabic}
              onChange={(e) => setArabic(e.target.value)}
              placeholder="Enter Arabic text"
              className="font-arabic text-xl text-right"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="transliteration">Transliteration</Label>
            <Input
              id="transliteration"
              value={transliteration}
              onChange={(e) => setTransliteration(e.target.value)}
              placeholder="Enter transliteration"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="translation">Translation</Label>
            <Input
              id="translation"
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
              placeholder="Enter translation"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="repetitions">Repetitions (optional)</Label>
            <Input
              id="repetitions"
              value={repetitions}
              onChange={(e) => setRepetitions(e.target.value)}
              placeholder="e.g., 3x, 7x, 100x"
            />
          </div>
          <Button onClick={handleSave} className="w-full">
            Save Dhikr
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Adhkar = () => {
  const [customAdhkar, setCustomAdhkar] = useState<CustomDhikr[]>([]);
  const [editingDhikr, setEditingDhikr] = useState<CustomDhikr | undefined>();

  useEffect(() => {
    setCustomAdhkar(getCustomAdhkar());
  }, []);

  const refreshCustomAdhkar = () => {
    setCustomAdhkar(getCustomAdhkar());
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this dhikr?")) {
      deleteCustomDhikr(id);
      refreshCustomAdhkar();
    }
  };

  const getCustomByCategory = (category: 'morning' | 'evening' | 'general' | 'personal') => {
    return customAdhkar.filter(d => d.category === category);
  };

  return (
    <div className="min-h-screen bg-background pb-24 px-4 pt-6">
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Adhkar & Duas</h1>
          <p className="text-muted-foreground">Daily remembrance and supplications</p>
        </div>

        <Tabs defaultValue="morning" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
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
            <TabsTrigger value="personal" className="gap-2">
              <User className="w-4 h-4" />
              Personal
            </TabsTrigger>
          </TabsList>

          <TabsContent value="morning" className="mt-6">
            <div className="mb-4">
              <AddDhikrDialog category="morning" onSave={refreshCustomAdhkar} />
            </div>
            <ScrollArea className="h-[calc(100vh-280px)]">
              <div className="space-y-4 pr-4">
                {morningAdhkar.map((dhikr) => (
                  <DhikrCard key={dhikr.id} dhikr={dhikr} />
                ))}
                {getCustomByCategory('morning').map((dhikr) => (
                  <DhikrCard 
                    key={dhikr.id} 
                    dhikr={dhikr} 
                    isCustom
                    onDelete={() => handleDelete(dhikr.id)}
                  />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="evening" className="mt-6">
            <div className="mb-4">
              <AddDhikrDialog category="evening" onSave={refreshCustomAdhkar} />
            </div>
            <ScrollArea className="h-[calc(100vh-280px)]">
              <div className="space-y-4 pr-4">
                {eveningAdhkar.map((dhikr) => (
                  <DhikrCard key={dhikr.id} dhikr={dhikr} />
                ))}
                {getCustomByCategory('evening').map((dhikr) => (
                  <DhikrCard 
                    key={dhikr.id} 
                    dhikr={dhikr} 
                    isCustom
                    onDelete={() => handleDelete(dhikr.id)}
                  />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="general" className="mt-6">
            <div className="mb-4">
              <AddDhikrDialog category="general" onSave={refreshCustomAdhkar} />
            </div>
            <ScrollArea className="h-[calc(100vh-280px)]">
              <div className="space-y-4 pr-4">
                {generalDuas.map((dhikr) => (
                  <DhikrCard key={dhikr.id} dhikr={dhikr} />
                ))}
                {getCustomByCategory('general').map((dhikr) => (
                  <DhikrCard 
                    key={dhikr.id} 
                    dhikr={dhikr} 
                    isCustom
                    onDelete={() => handleDelete(dhikr.id)}
                  />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="personal" className="mt-6">
            <div className="mb-4">
              <AddDhikrDialog category="personal" onSave={refreshCustomAdhkar} />
            </div>
            <ScrollArea className="h-[calc(100vh-280px)]">
              <div className="space-y-4 pr-4">
                {getCustomByCategory('personal').length === 0 ? (
                  <Card className="bg-gradient-card shadow-soft">
                    <CardContent className="pt-6 text-center text-muted-foreground">
                      No personal adhkar yet. Click "Add Dhikr" to create your own.
                    </CardContent>
                  </Card>
                ) : (
                  getCustomByCategory('personal').map((dhikr) => (
                    <DhikrCard 
                      key={dhikr.id} 
                      dhikr={dhikr} 
                      isCustom
                      onDelete={() => handleDelete(dhikr.id)}
                    />
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Adhkar;
