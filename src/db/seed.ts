import "dotenv/config";
import { db } from "./index";
import { categories, products, reviews, orders } from "./schema";

const px = (id: number, w = 800, h = 1200) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${w}&h=${h}`;

const gallery = (id: number, id2?: number) => [px(id), id2 ? px(id2) : px(id, 1200, 1000)];

type SeedProduct = {
  name: string;
  slug: string;
  cat: string;
  shortDesc: string;
  longDesc: string;
  price: number;
  compareAt?: number;
  rating: number;
  ratingCount: number;
  sizes: string[];
  colors: [string, string][];
  collections?: string[];
  featured?: boolean;
  newArrival?: boolean;
  img: number;
  img2?: number;
  details: [string, string][];
};

const C = {
  ink: "#1b2a3a",
  navy: "#1c3a5e",
  olive: "#5c6b3c",
  maroon: "#6d2434",
  sand: "#cbb58b",
  white: "#f7f5f0",
  black: "#1b1b1b",
  mocha: "#a57957",
  grey: "#9aa0a6",
  pink: "#d9a6a0",
  denim: "#4a6b8a",
  gold: "#c19a49",
  teal: "#2f5d50",
  ivory: "#ece3cf",
  blush: "#c98d7a",
};

const STD = ["S", "M", "L", "XL", "XXL"];
const ABAYA = ["52", "54", "56", "58", "60"];
const KIDS = ["2-3", "4-5", "6-7", "8-9"];

const SEED: SeedProduct[] = [
  // ─── نساء ───────────────────────────────────────────────
  {
    name: "فستان ماكسي «ليالي الفرات»",
    slug: "maxi-dress-euphrates",
    cat: "women",
    shortDesc: "فستان ماكسي انسيابي بقصّة صحراوية ولمسة ذهبية خفيفة.",
    longDesc:
      "فستان ماكسي مصمم ليتحرك معكِ بنعومة. قماش كريب خفيف يمنح انسيابية فاخرة، بأكمام واسعة وخصر مشدود بلُفّة قابلة للتعديل. قطعة تليق بالعزائم النهارية والسهرات الهادئة على حد سواء.",
    price: 89000,
    compareAt: 129000,
    rating: 4.8,
    ratingCount: 127,
    sizes: STD,
    colors: [["كحلي", C.navy], ["زيتي", C.olive], ["عنابي", C.maroon]],
    collections: ["summer"],
    featured: true,
    img: 7736224,
    details: [
      ["الخامة", "كريب مُزخرف خفيف، بطانة قطن"],
      ["القصّة", "ماكسي انسيابية، خصر لُفّة"],
      ["العناية", "غسيل بارد بيد واحدة، تجفيف بظل"],
      ["الموديل", "الطول 170سم ترتدي مقاس M"],
    ],
  },
  {
    name: "فستان سهرة «سنحاريب»",
    slug: "evening-dress-sargarib",
    cat: "women",
    shortDesc: "فستان سهرة أسود بقصّة ملكية وأكتاف منسدلة بنعومة.",
    longDesc:
      "حين تحتاج السهرة إلى حضور لا يُنسى. فستان أسود بقصّة مُهيكلة تُظهر القوام بأناقة محتشمة، قماش سكوبة فاخر يحافظ على الشكل، مع فتحة خصر جانبية مدروسة. اسمٌ من ملوك بابل لفستان يليق بالمناسبات الكبرى.",
    price: 115000,
    rating: 4.7,
    ratingCount: 89,
    sizes: ["S", "M", "L", "XL"],
    colors: [["أسود", C.black], ["عنابي", C.maroon], ["نيلي", C.ink]],
    collections: ["gold"],
    featured: true,
    img: 37672390,
    details: [
      ["الخامة", "سكوبة كريب مُبطّنة"],
      ["القصّة", "A-Line بطول كامل 150سم"],
      ["العناية", "تنظيف جاف فقط"],
      ["الموديل", "الطول 168سم ترتدي مقاس S"],
    ],
  },
  {
    name: "طقم كتان أبيض «بغداد»",
    slug: "linen-set-baghdad",
    cat: "women",
    shortDesc: "طقم كتاني من قطعتين بروح بيوت بغداد القديمة.",
    longDesc:
      "قطعتان متناغمتان من الكتان المُغسّل: قميص فضفاض بأزرار صدف طبيعي وبنطال واسع بخصر مطاطي. تنفّس مثالي لصيف العراق، ومظهر مُرتّب بلا مجهود. الاختيار الأول لمن يبحث عن البساطة الفاخرة.",
    price: 119000,
    compareAt: 145000,
    rating: 4.9,
    ratingCount: 203,
    sizes: STD,
    colors: [["أبيض", C.white], ["رملي", C.sand], ["زيتي", C.olive]],
    collections: ["essentials", "summer"],
    featured: true,
    img: 26729078,
    details: [
      ["الخامة", "كتان أوروبي مُغسّل 100%"],
      ["القطع", "قميص + بنطال واسع"],
      ["العناية", "غسيل بارد، كيّ متوسط"],
      ["الموديل", "الطول 167سم ترتدي مقاس M"],
    ],
  },
  {
    name: "معطف «شهد» الطويل",
    slug: "shahd-long-coat",
    cat: "women",
    shortDesc: "معطف رمادي طويل بقصّة مستقيمة لأيام الشتاء الأنيقة.",
    longDesc:
      "معطف من صوف المزيج بطول 120سم، ياقة كلاسيكية بلا أزرار ظاهرة وجيوب مبطنة. طبقة ثالثة ترفع أي إطلالة يومية لمستوى آخر، ببطانة حريرية ناعمة تنساب فوق ملابسك.",
    price: 95000,
    compareAt: 120000,
    rating: 4.6,
    ratingCount: 54,
    sizes: ["S", "M", "L", "XL"],
    colors: [["رمادي", C.grey], ["كاميل", C.sand], ["أسود", C.black]],
    collections: ["essentials"],
    img: 20876211,
    details: [
      ["الخامة", "صوف مُعاد تدويره 60% + بوليستر"],
      ["البطانة", "فيسكوز ناعم"],
      ["الطول", "120سم"],
      ["العناية", "تنظيف جاف"],
    ],
  },
  {
    name: "فستان الدنيم الأزرق",
    slug: "blue-denim-dress",
    cat: "women",
    shortDesc: "فستان دنيم شبابي بغسلة فاتحة وأزرار نحاسية.",
    longDesc:
      "دنيم قطني متوسط الوزن بقصّة قميص مطوّلة، أزرار نحاسية على كامل الجبهة وجيوب صدر عملية. ارتديه كفستان أو كطبقة مفتوحة فوق تيشيرت أبيض لإطلالة كاجوال عراقية أصيلة.",
    price: 79000,
    rating: 4.5,
    ratingCount: 38,
    sizes: STD,
    colors: [["دنيم فاتح", C.denim], ["دنيم غامق", C.navy]],
    collections: ["summer"],
    newArrival: true,
    img: 33743291,
    details: [
      ["الخامة", "دنيم قطن 100% بوزن 10oz"],
      ["الإغلاق", "أزرار نحاسية كاملة"],
      ["العناية", "غسيل مقلوب بماء بارد"],
    ],
  },
  {
    name: "فستان قطني مزركش «نرجس»",
    slug: "nargis-cotton-dress",
    cat: "women",
    shortDesc: "فستان قطني بنقشة وردية هادئة لأيام الربيع والصيف.",
    longDesc:
      "قطن إسكوتش مُزركش بوردات دقيقة، ياقة دائرية وأكمام نصفية بأطراف مكشكشة. خفيف كنسيم النارجيلة، مبطن جزئياً لثقة كاملة طوال اليوم.",
    price: 62000,
    compareAt: 78000,
    rating: 4.6,
    ratingCount: 71,
    sizes: STD,
    colors: [["عاجي مزركش", C.ivory], ["وردي", C.pink]],
    collections: ["summer"],
    img: 33226868,
    img2: 31374235,
    details: [
      ["الخامة", "قطن إسكوتش 100%"],
      ["القصّة", "ميدي مرحة بطول 115سم"],
      ["العناية", "غسيل 30 درجة"],
    ],
  },
  {
    name: "كارديغان «غرّيدة» المحبوك",
    slug: "gharida-knit-cardigan",
    cat: "women",
    shortDesc: "كارديغان طويل محبوك بغزل سميك دافئ.",
    longDesc:
      "كارديغان مفتوح بطول 100سم محبوك بخيوط أكريليك-صوف ناعمة لا تسبب حكة. أزرار قرن كبيرة وجيوب سُلّمية عملية. رفيق مقاهي الشتاء وقراءات الليل.",
    price: 69000,
    rating: 4.7,
    ratingCount: 95,
    sizes: ["S", "M", "L", "XL"],
    colors: [["عسلي", C.sand], ["رمادي", C.grey], ["زيتي", C.olive]],
    collections: ["essentials"],
    img: 9603624,
    details: [
      ["الخامة", "أكريليك-صوف مُعالج ضد الوبر"],
      ["الطول", "100سم"],
      ["العناية", "غسيل يدوي بارد"],
    ],
  },
  {
    name: "بلوزة «لؤلؤة» البيضاء",
    slug: "luqluq-blouse",
    cat: "women",
    shortDesc: "بلوزة بيضاء بياقة عالية وأزرار لؤلؤية خلفية.",
    longDesc:
      "بساطة بيضاء تُلبس مع كل شيء. بلوزة ساتان مطفي بياقة صينية عالية، كُمّ طويل بأزرار كبس، وإغلاق خلفي بأزرار لؤلؤية صغيرة كتوقيع أخير. تحت البليزر أو وحيدة — لا تخطئ أبداً.",
    price: 55000,
    rating: 4.5,
    ratingCount: 33,
    sizes: STD,
    colors: [["أبيض", C.white], ["عاجي", C.ivory], ["أسود", C.black]],
    newArrival: true,
    img: 23432454,
    details: [
      ["الخامة", "ساتان مطفي متوسط الوزن"],
      ["الإغلاق", "أزرار خلفية لؤلؤية"],
      ["العناية", "غسيل بارد، كيّ خفيف"],
    ],
  },
  // ─── عبايات ─────────────────────────────────────────────
  {
    name: "عباية «سنحرّة» بتطريز ذهبي",
    slug: "sinharib-gold-abaya",
    cat: "abaya",
    shortDesc: "عباية فاخرة بتطريز ذهبي مستوحى من زخارف بوابة عشتار.",
    longDesc:
      "تحفتنا الفنية هذا الموسم. عباية كريب أسود يابانية بتطريز خيوط ذهبية على الأكتاف والأكمام مستوحى من وردات بوابة عشتار. قصّة انسيابية ملكية تفتح بلمحة من بطانة شمبين داخلية. تُصنع عند الطلب في ورشتنا ببغداد.",
    price: 145000,
    compareAt: 185000,
    rating: 4.9,
    ratingCount: 176,
    sizes: ABAYA,
    colors: [["أسود وذهبي", C.black], ["كحلي وذهبي", C.navy]],
    collections: ["gold"],
    featured: true,
    img: 32178223,
    details: [
      ["الخامة", "كريب ندى ياباني"],
      ["التطريز", "خيط ذهبي مقاوم للأكسدة"],
      ["الإغلاق", "أزرار كبس مخفية"],
      ["العناية", "تنظيف جاف فقط"],
    ],
  },
  {
    name: "عباية «ليلة» المرصعة",
    slug: "layla-embellished-abaya",
    cat: "abaya",
    shortDesc: "عباية سهرة بلمعة خافتة وترصيع كريستالي على الأطراف.",
    longDesc:
      "لمناسباتك المسائية الرسمية: عباية سوداء بقماش «شاين» خافت اللمعان، حواف الأكمام والجيوب مرصعة بكريستال مثبّت يدوياً. قصّة كاب انسيابية تمنح حضوراً مهيباً دون جهد.",
    price: 139000,
    rating: 4.8,
    ratingCount: 88,
    sizes: ABAYA,
    colors: [["أسود", C.black], ["عنابي", C.maroon]],
    collections: ["gold"],
    img: 13838842,
    details: [
      ["الخامة", "كريب شاين فاخر"],
      ["الترصيع", "كريستال تشيكي مثبّت يدوياً"],
      ["العناية", "تنظيف جاف"],
    ],
  },
  {
    name: "العباية الخليجية الكلاسيكية",
    slug: "classic-gulf-abaya",
    cat: "abaya",
    shortDesc: "العباية اليومية المثالية: قماش بارد وقصة مظبوطة.",
    longDesc:
      "القطعة التي لا تخذل. قماش كريب «حرير الملكة» بارد الملمس مناسب لحرارة الصيف، قصّة خُليجية كلاسيكية بأكتاف طبيعية وجيبين مخفيين. متوفرة بخمسة أطوال لتناسب الجميع.",
    price: 125000,
    rating: 4.7,
    ratingCount: 143,
    sizes: ABAYA,
    colors: [["أسود", C.black], ["بني داكن", C.ink]],
    collections: ["essentials"],
    img: 32279501,
    details: [
      ["الخامة", "كريب حرير الملكة (ندى كوري)"],
      ["الجيوب", "جيبان جانبيان مخفيان"],
      ["العناية", "غسيل 30 درجة مقلوبة"],
    ],
  },
  {
    name: "عباية «الموكا» اليومية",
    slug: "mocha-daily-abaya",
    cat: "abaya",
    shortDesc: "عباية بلون الموكا الدافئ للإطلالات النهارية الهادئة.",
    longDesc:
      "لون يصفح مع كل شيء في خزانتك. عباية موكا بقماش مودال مطاطي خفيف، قصّة مستقيمة عملية بأكمام واسعة وإغلاق أمامي بأزرار كبس. خيار ذكي للدوام والجامعة.",
    price: 105000,
    rating: 4.6,
    ratingCount: 66,
    sizes: ABAYA,
    colors: [["موكا", C.mocha], ["عاجي", C.ivory], ["أسود", C.black]],
    newArrival: true,
    img: 35324598,
    details: [
      ["الخامة", "مودال-قطن مطاطي"],
      ["القصّة", "مستقيمة نهارية"],
      ["العناية", "غسيل بارد"],
    ],
  },
  {
    name: "عباية «غَسَق» الفاخرة",
    slug: "ghasaq-luxe-abaya",
    cat: "abaya",
    shortDesc: "عباية دراماتيكية بقماش شامل اللمعة لسهرات أسبوع العظمة.",
    longDesc:
      "صُممت للظهور. قماش «غسق» الملكي بسطح ناعم كالماء يعكس الضوء بخفة، قصّة كاملة بذيل انسيابي خلفي، وأكمام كيمونو واسعة. قطعة استثمارية في خزانتك الرسمية.",
    price: 129000,
    compareAt: 159000,
    rating: 4.8,
    ratingCount: 97,
    sizes: ABAYA,
    colors: [["أسود", C.black], ["ليلكي", C.ink]],
    collections: ["gold"],
    featured: true,
    img: 33448124,
    details: [
      ["الخامة", "غسق ملكي مطفي اللمعة"],
      ["الذيل", "انسيابي 15سم إضافي"],
      ["العناية", "تنظيف جاف"],
    ],
  },
  {
    name: "عباية رمادية نهارية",
    slug: "grey-day-abaya",
    cat: "abaya",
    shortDesc: "عباية رمادية عملية بجيوب ظاهرة وحزام اختياري.",
    longDesc:
      "لأيام العمل الطويلة: عباية رمادية بقماش جوارب متين لا يتجعد بسهولة، جيوب أمامية عملية تحفظ هاتفك، وحزام قماشي اختياري لتغيير الشكل. ملبس يومي موثوق.",
    price: 95000,
    rating: 4.5,
    ratingCount: 41,
    sizes: ABAYA,
    colors: [["رمادي", C.grey], ["أبيض رمادي", C.white]],
    img: 13776830,
    details: [
      ["الخامة", "كريب جوارب متين"],
      ["الجيوب", "جيبان أماميان ظاهران"],
      ["العناية", "غسيل 30 درجة"],
    ],
  },
  {
    name: "جلابية «وِرد» الدمشقية",
    slug: "wrd-damascene-jalabiya",
    cat: "abaya",
    shortDesc: "جلابية مزخرفة تقرُّب فيها الضيافة العراقية والذوق الدمشقي.",
    longDesc:
      "جلابية بيت-ضيافة بروح الشام بنيات دمشقية على صدر وأطرافها. قماش جاكار قطني مطرّز، كمّ ماركوف واسع وحزام قماشي نفس اللون. للعزائم البيتية التي تحتاج لمسة من القِدم الجميل.",
    price: 79000,
    compareAt: 99000,
    rating: 4.6,
    ratingCount: 58,
    sizes: ["S", "M", "L", "XL"],
    colors: [["عنابي مزخرف", C.maroon], ["زيتي", C.olive]],
    collections: ["gold"],
    img: 31374235,
    details: [
      ["الخامة", "جاكار قطني مطرز"],
      ["الحزام", "قماشي قابل للفصل"],
      ["العناية", "غسيل رقيق بماء بارد"],
    ],
  },
  // ─── رجال ───────────────────────────────────────────────
  {
    name: "قميص أكسفورد «النهرين»",
    slug: "mesopotamia-oxford-shirt",
    cat: "men",
    shortDesc: "قميص أكسفورد كلاسيكي لا يشيخ أبداً.",
    longDesc:
      "قطن أكسفورد مُحبك بغرامة، ياقة بأزرار مخفية، ظهر مُفصّل بكسرات صندوق تمنح حرية حركة. يُلبس بعلاك أو بدون — رصيد دائم في خزانة الرجل العراقي الأنيق.",
    price: 48000,
    rating: 4.7,
    ratingCount: 154,
    sizes: STD,
    colors: [["أبيض", C.white], ["سماوي", C.denim], ["عاجي", C.ivory]],
    collections: ["essentials"],
    featured: true,
    img: 17668938,
    img2: 24453811,
    details: [
      ["الخامة", "قطن أكسفورد 100% مُغسّل مسبقاً"],
      ["الياقة", "أزرار مخفية Button-Down"],
      ["العناية", "غسيل عادي 40 درجة"],
      ["الموديل", "الطول 180سم يلبس مقاس L"],
    ],
  },
  {
    name: "قميص الكتان الوردي",
    slug: "rose-linen-shirt",
    cat: "men",
    shortDesc: "قميص كتان بلون وردي مُغبر يكسر رتابة الألوان.",
    longDesc:
      "لونٌ يُجمل البرونز الصيفي. كتان مطلي بغسلة إنزيمية تمنحه ملمساً ناعماً منذ أول يوم، ياقة صينية وأزرار خشبية. كنزة صيفك الرسمي بلا تعب.",
    price: 42000,
    compareAt: 55000,
    rating: 4.5,
    ratingCount: 63,
    sizes: STD,
    colors: [["وردي مُغبر", C.blush], ["أبيض", C.white], ["رملي", C.sand]],
    collections: ["summer"],
    img: 15766142,
    details: [
      ["الخامة", "كتان-قطن 55/45"],
      ["الياقة", "صينية"],
      ["العناية", "غسيل بارد"],
    ],
  },
  {
    name: "قميص القطن اليومي",
    slug: "daily-cotton-shirt",
    cat: "men",
    shortDesc: "قميص أبيض عملي سريع الجفاف للدوام واليومي.",
    longDesc:
      "قميص عملي بكل معنى الكلمة: قطن مصري بخيوط مزدوجة مقاومة للتجعد، ياقة كلاسيكية وجيب صدر واحد. خيارك الصباحي الذكي لأيام الدوام الساخنة.",
    price: 39000,
    rating: 4.4,
    ratingCount: 47,
    sizes: STD,
    colors: [["أبيض", C.white], ["سماوي", C.denim]],
    collections: ["essentials"],
    img: 27302850,
    details: [
      ["الخامة", "قطن مصري مُعالج ضد التجعد"],
      ["الجيب", "صدر واحد"],
      ["العناية", "غسيل عادي"],
    ],
  },
  {
    name: "طقم الكتان الصيفي",
    slug: "summer-linen-suit",
    cat: "men",
    shortDesc: "طقم كتان قميص وبنطال لصيف أنيق بلا مجهود.",
    longDesc:
      "قميص كتان فضفاض + بنطال كتان بخصر مطاطي مخفي وسحّاب داخلي. الطقم الذي يجعلك تبدو مهتماً بمظهرك دون أن تتعب — من التشاي الصباحي حتى عشاء الصيف.",
    price: 85000,
    compareAt: 105000,
    rating: 4.8,
    ratingCount: 82,
    sizes: STD,
    colors: [["أبيض", C.white], ["رملي", C.sand], ["زيتي فاتح", C.olive]],
    collections: ["summer", "essentials"],
    featured: true,
    img: 32778911,
    details: [
      ["الخامة", "كتان أوروبي مُغسّل"],
      ["القطع", "قميص + بنطال"],
      ["العناية", "غسيل بارد منفصل"],
    ],
  },
  {
    name: "بولو «الزوراء» المخطط",
    slug: "zawra-striped-polo",
    cat: "men",
    shortDesc: "بولو مخطط بقماش بيكيه متنفّس وطوق محبوك.",
    longDesc:
      "بولو كلاسيكي بخطوط عريضة بألوان محايدة، قماش بيكيه قطني يتحمل الغسيل المتكرر دون تشوه، أكمام مطاطية لطيفة وشقّان جانبيان لحرية الحركة.",
    price: 35000,
    rating: 4.6,
    ratingCount: 91,
    sizes: STD,
    colors: [["كحلي مخطط", C.navy], ["أبيض مخطط", C.white]],
    collections: ["essentials"],
    img: 8058758,
    details: [
      ["الخامة", "بيكيه قطن 100%"],
      ["الطوق", "محبوك مُقوّى"],
      ["العناية", "غسيل 30 درجة"],
    ],
  },
  {
    name: "قميص «ياسمين» الصيفي",
    slug: "yasmin-summer-shirt",
    cat: "men",
    shortDesc: "قميص صيفي فاتح بطوق كوبي استوائي.",
    longDesc:
      "طوق كوبي مفتوح يمنح إطلالة إجازة دائمة. قماش قطن-فيسكوز فائق النعومة بأزرار صدف، مناسب مع الدنيم أو كتان النهار.",
    price: 44000,
    rating: 4.5,
    ratingCount: 36,
    sizes: STD,
    colors: [["أبيض", C.white], ["عاجي", C.ivory]],
    collections: ["summer"],
    newArrival: true,
    img: 18159461,
    details: [
      ["الخامة", "قطن-فيسكوز خفيف"],
      ["الياقة", "كوبية مفتوحة"],
      ["العناية", "غسيل بارد"],
    ],
  },
  {
    name: "جاكيت الدنيم الكلاسيكي",
    slug: "classic-denim-jacket",
    cat: "men",
    shortDesc: "جاكيت دنيم بغسلة متوسطة وأزرار نحاسية — عمر مع لبّس.",
    longDesc:
      "الدنيم الذي يتحسن مع الوقت. قماش 12oz متين بحواف مُدعمة، أزرار نحاسية مصقولة وجيوب صدر وظيفية. غسلة متوسطة جاهزة للبس من اليوم الأول.",
    price: 89000,
    compareAt: 115000,
    rating: 4.9,
    ratingCount: 131,
    sizes: STD,
    colors: [["دنيم", C.denim], ["دنيم غامق", C.navy]],
    collections: ["essentials"],
    featured: true,
    img: 36620292,
    img2: 16306312,
    details: [
      ["الخامة", "دنيم قطن 12oz"],
      ["الخياطة", "خيوط تباين برتقالية كلاسيكية"],
      ["العناية", "غسيل منفصل أول 3 مرات"],
      ["الموديل", "الطول 182سم يلبس مقاس L"],
    ],
  },
  {
    name: "جاكيت «الكلاسيك» ميد-واش",
    slug: "mid-wash-denim-jacket",
    cat: "men",
    shortDesc: "جاكيت جينز بغسلة ميد-واش عصرية وقصة مستقيمة.",
    longDesc:
      "نسخة عصرية من الجينز-جاكيت: غسلة فاتحة متدرجة، قصّة مستقيمة أضيق قليلاً عند الخصر، وياقة محبوكة. طبقة المواسم الانتقالية الأولى في قائمتنا.",
    price: 79000,
    rating: 4.6,
    ratingCount: 37,
    sizes: STD,
    colors: [["ميد-واش", C.denim]],
    newArrival: true,
    img: 28368104,
    details: [
      ["الخامة", "دنيم مرن 98% قطن"],
      ["الغسلة", "ميد-واش متدرّجة"],
      ["العناية", "غسيل مقلوب"],
    ],
  },
  // ─── أطفال ──────────────────────────────────────────────
  {
    name: "طقم البحّارة للصغار",
    slug: "sailor-kids-set",
    cat: "kids",
    shortDesc: "طقم قطني بنقوش بحري مرحة للعب والعزائم.",
    longDesc:
      "تيشيرت وشورت بنقوش بحّارة مرحة، قطن عضوي ناعم على بشرة الأطفال، خصر مطاطي مريح وألوان لا تبهت مع الغسيل المتكرر.",
    price: 45000,
    compareAt: 59000,
    rating: 4.9,
    ratingCount: 74,
    sizes: KIDS,
    colors: [["كحلي", C.navy], ["أبيض", C.white]],
    newArrival: true,
    img: 1620759,
    details: [
      ["الخامة", "قطن عضوي معتمد GOTS"],
      ["القطع", "تيشيرت + شورت"],
      ["العناية", "غسيل 30 درجة"],
    ],
  },
  {
    name: "فستان «فراشة» البناتي",
    slug: "butterfly-girls-dress",
    cat: "kids",
    shortDesc: "فستان بناتي مرح بطبقة تول خفيفة وجيب سري.",
    longDesc:
      "فستان بطبقة تول ناعمة فوق بطانة قطنية كاملة، خصر مطاطي وجيب جانبي صغير للكنوز. مصمم ليتحمل الجري والقفز ثم يبدو مرتباً في الصور العائلية.",
    price: 39000,
    rating: 4.7,
    ratingCount: 45,
    sizes: KIDS,
    colors: [["وردي", C.pink], ["عاجي", C.ivory]],
    img: 8084066,
    details: [
      ["الطبقات", "تول + بطانة قطن"],
      ["الخصر", "مطاطي مريح"],
      ["العناية", "غسيل رقيق"],
    ],
  },
  {
    name: "طقم الدنيم للأطفال",
    slug: "denim-kids-set",
    cat: "kids",
    shortDesc: "دنيم ناعم مرن مصمم للحركة الحرة طوال اليوم.",
    longDesc:
      "جاكيت وبنطال دنيم مرن بنسبة 2% إيلاستين، يتحمل اللعب الخشن ويبقى شكله مرتباً. أزرار كبس سهلة بأصابع صغيرة.",
    price: 55000,
    rating: 4.8,
    ratingCount: 60,
    sizes: KIDS,
    colors: [["دنيم", C.denim]],
    img: 38778561,
    details: [
      ["الخامة", "دنيم مرن 98% قطن"],
      ["القطع", "جاكيت + بنطال"],
      ["العناية", "غسيل عادي"],
    ],
  },
  {
    name: "تيشيرت الصيف المرح",
    slug: "fun-summer-kids-tee",
    cat: "kids",
    shortDesc: "تيشيرت قطني بطبعة صيفية تتحمل غسيل المدارس.",
    longDesc:
      "قطن سنجل جيرسي ثقيل 220غ بطابعات بلاستيسول ناعمة لا تتشقق. أكمام مُدعّمة عند الأكتاف وألوان ثابتة مغسولة.",
    price: 25000,
    rating: 4.6,
    ratingCount: 33,
    sizes: KIDS,
    colors: [["أصفر", C.gold], ["كحلي", C.navy], ["أبيض", C.white]],
    img: 7330390,
    details: [
      ["الخامة", "جيرسي قطن 220غ"],
      ["الطبعة", "بلاستيسول ناعم"],
      ["العناية", "غسيل مقلوب بارد"],
    ],
  },
  // ─── إكسسوارات ──────────────────────────────────────────
  {
    name: "طقم «لمستك» المحبوك",
    slug: "lamastak-knit-set",
    cat: "accessories",
    shortDesc: "طقم كنزة ناعمة مع إكسسوارات متناسقة للخريف.",
    longDesc:
      "كنزة هودي محبوكة خفيفة مرفقة بلفحة مطابقة وحقيبة يد صغيرة نفس اللون. ثلاثية متناسقة تختصر سؤال «شنو ألبس وياها» لمواسم التبدل.",
    price: 35000,
    rating: 4.5,
    ratingCount: 22,
    sizes: ["مقاس واحد"],
    colors: [["عسلي", C.sand], ["رمادي", C.grey]],
    img: 5405606,
    details: [
      ["المحتويات", "كنزة + لفحة + حقيبة يد"],
      ["الخامة", "أكريليك ناعم"],
      ["العناية", "غسيل يدوي"],
    ],
  },
  {
    name: "حقيبة «لؤلؤة كربلاء»",
    slug: "karbala-pearl-bag",
    cat: "accessories",
    shortDesc: "حقيبة سهرة مرصعة بلآلئ صناعية بإطار ذهبي.",
    longDesc:
      "حقيبة يد سهرة بحجم الهاتف، مرصعة بلآلئ راتنجية مخيطة يدوياً على قاعدة ساتان، إطار وحزام ذهبي قابل للفصل لتحميلها كروس. قطعة الأعراس والخطوبات.",
    price: 55000,
    rating: 4.8,
    ratingCount: 51,
    sizes: ["مقاس واحد"],
    colors: [["عاجي ذهبي", C.ivory]],
    collections: ["gold"],
    newArrival: true,
    img: 27495835,
    details: [
      ["الأبعاد", "18 سم × 12 سم"],
      ["الحزام", "معدني ذهبي قابل للفصل"],
      ["البطانة", "ساتان داخلي"],
    ],
  },
  {
    name: "حجاب الشيفون «الياقوت»",
    slug: "yaqut-chiffon-hijab",
    cat: "accessories",
    shortDesc: "حجاب شيفون فائق الخفة بلون ياقوتي عميق.",
    longDesc:
      "شيفون جورجيت خفيف جداً لا يسلّط الحرارة، حواف مخيطة بدقة، ثبات ممتاز بلا دبابيس كثيرة. يلفّ بسهولة ويحافظ على شكله طوال اليوم.",
    price: 30000,
    rating: 4.7,
    ratingCount: 88,
    sizes: ["180 سم × 70 سم"],
    colors: [["ياقوتي", C.teal], ["أسود", C.black], ["رملي", C.sand], ["عنابي", C.maroon]],
    img: 38795851,
    details: [
      ["الخامة", "شيفون جورجيت"],
      ["الأبعاد", "180 × 70 سم"],
      ["العناية", "غسيل يدوي بارد"],
    ],
  },
  {
    name: "شال الساتان المرصع",
    slug: "embellished-satin-shawl",
    cat: "accessories",
    shortDesc: "شال ساتان بلمعة مخملية وتطريز جوهري عند الأطراف.",
    longDesc:
      "ساتان كثيف بلمعة داخلية مخملية، أطرافه مطرزة بجرارات كريستالية صغيرة. للسهرات التي تحتاج الشال أن يكون جزءاً من الإطلالة لا مجرد إضافة.",
    price: 32000,
    compareAt: 42000,
    rating: 4.6,
    ratingCount: 39,
    sizes: ["200 سم × 75 سم"],
    colors: [["أسود", C.black], ["عنابي", C.maroon], ["كحلي", C.navy]],
    collections: ["gold"],
    img: 38795836,
    details: [
      ["الخامة", "ساتان كثيف مطفي"],
      ["التطريز", "كريستال مثبّت"],
      ["العناية", "تنظيف جاف"],
    ],
  },
  {
    name: "طرحة القطن اليومية",
    slug: "daily-cotton-wrap",
    cat: "accessories",
    shortDesc: "طرحة قطنية مطاطة بثبات ممتاز للاستخدام اليومي.",
    longDesc:
      "قطن جيرسي مطاط بنسبة مدروسة: يلف ويثبت بلا تحرك، يتنفس في الحر، ولا يترك أثراً عند الجبين. متوفر بأربعة ألوان أساسية تليق بكل خزانة.",
    price: 24000,
    rating: 4.5,
    ratingCount: 61,
    sizes: ["180 سم × 75 سم"],
    colors: [["أسود", C.black], ["عاجي", C.ivory], ["رمادي", C.grey], ["زيتي", C.olive]],
    img: 19547368,
    details: [
      ["الخامة", "جيرسي قطن-ليكرا"],
      ["الأبعاد", "180 × 75 سم"],
      ["العناية", "غسيل 30 درجة"],
    ],
  },
];

const REVIEWS: Record<string, { author: string; city: string; rating: number; comment: string }[]> = {
  "sinharib-gold-abaya": [
    { author: "زينب علي", city: "بغداد", rating: 5, comment: "التطريز الذهبي أحلى من الصور بكثير، لبسته بعزيمة وكل اللي شافوه سألوني من وين. الخامة بردانة وثقيلة بنفس الوقت." },
    { author: "أم عباس", city: "كربلاء", rating: 5, comment: "طلبتها هدية لابنتي بمناسبة تخرجها. التغليف فخم يستاهل، والمقاس طلع مضبوط حسب جدول المقاسات." },
    { author: "نور الهدى", city: "النجف", rating: 4, comment: "العباية راقية بس وصلتني متأخرة يوم واحد عن الموعد. بالمجمل تجربة ممتازة والقماش يستاهل سعره." },
  ],
  "ghasaq-luxe-abaya": [
    { author: "مريم حسن", city: "البصرة", rating: 5, comment: "قماشها يعكس الضوء بطريقة حلوة جداً بالسهرات. الذيل الإضافي يضيف فخامة. من أجمل عباياتي." },
    { author: "رسل محمود", city: "أربيل", rating: 5, comment: "الدفع عند الاستلام هنا يسهّل كثير. جربتها قبل ما أدفع والمقاس كان تام." },
  ],
  "layla-embellished-abaya": [
    { author: "سجى إبراهيم", city: "بغداد", rating: 5, comment: "الترصيع ثابت وما يتساقط حتى بعد الغسيل الجاف مرتين. تظهر فخمة جداً على المسرح." },
    { author: "بتول ناصر", city: "الموصل", rating: 4, comment: "حلوة ومناسبة للمناسبات الرسمية، بس ياليت يكون فيها جيب داخلي صغير للموبايل." },
  ],
  "classic-denim-jacket": [
    { author: "حيدر الكعبي", city: "بغداد", rating: 5, comment: "الدنيم متين والأزرار نحاس أصلي. بعد شهرين من اللبس اليومي ما تغير لونه ولا خفت خياطته." },
    { author: "عمر الطائي", city: "كركوك", rating: 5, comment: "مقاساته شي قليل تكون دقيقة بهاي الدقة. L كان مظبوط تماماً عليّ. أنصح بيه." },
    { author: "يوسف حميد", city: "الناصرية", rating: 4, comment: "الجاكيت حلو بس لونه أغمق شوية من الصورة بالموقع. كجودة تعامل ممتاز." },
  ],
  "mesopotamia-oxford-shirt": [
    { author: "محمد الشمري", city: "بغداد", rating: 5, comment: "اشتريت ثلاثة ألوان بعد ما جربت الأولى. القماش يروى مع كل غسلة وما يتجعد بسرعة." },
    { author: "باقر الربيعي", city: "الحلة", rating: 4, comment: "قياس الأكمام أطول بسنتيم من المتوقع، بس مع ثنية صغيرة صار تام. القماش ممتاز." },
  ],
  "linen-set-baghdad": [
    { author: "فاطمة عباس", city: "بغداد", rating: 5, comment: "الكتان حرفياً يلفح بيه بحرارة تموز. طقم يجنن للدوام والطلعات. طلبت دزت لأختي بنفس اليوم." },
    { author: "رقية سالم", city: "السليمانية", rating: 5, comment: "بنطاله ما يسلّط الحرارة ولا ينسدل على النعلة. قطعة استثمار حقيقية لخزانتك." },
    { author: "آلاء النجفي", city: "النجف", rating: 4, comment: "أبيض شيّة شفاف قليلاً بالضوء القوي، يالبس مع لباس داخلي فاتح. غير هيك مثالي." },
  ],
  "maxi-dress-euphrates": [
    { author: "شهد كاظم", city: "أربيل", rating: 5, comment: "الخصر اللفّة يخليكي تضبطين القصة على جسمك. لبست بحفل عائلي وحسيت ملكة." },
    { author: "دعاء طالب", city: "بغداد", rating: 4, comment: "القماش خفيف ومناسب، بس الطول احتاج قصّه لأني قصيرة. بالمجمل سعيدة بالشراء." },
  ],
  "summer-linen-suit": [
    { author: "جعفر الساعدي", city: "النجف", rating: 5, comment: "لبسته بعزيمة صيفية وكان ملفات النظر. الكتان فعلاً يتنفس بحرارة الرطبة." },
    { author: "حسين علاوي", city: "البصرة", rating: 5, comment: "أول مرة أشتري طقم أونلاين ويطلع مثل الصورة تماماً. خدمة التوصيل سريعة أيضاً." },
  ],
  "rose-linen-shirt": [
    { author: "كرار حسين", city: "بغداد", rating: 4, comment: "اللون أجمل من الصورة، وردي مغبر مش زهري صارخ. القصة مريحة شوية فخذوا حسب جدولكم." },
  ],
  "zawra-striped-polo": [
    { author: "مصطفى الرفاعي", city: "بغداد", rating: 5, comment: "بولو ما يتشوه بعد الغسيل، الطوق يضل ثابت. سعر 35 ألف صدك رخيص بهيك جودة." },
    { author: "طه اللامي", city: "ديالى", rating: 4, comment: "جيد للدوام والكاجوال، خطوطه مشدودة متساوية. المقاس عادي شوية صاير أضيق." },
  ],
  "gallery-kids-sailor": [],
  "sailor-kids-set": [
    { author: "أسماء لطيف", city: "بغداد", rating: 5, comment: "ولدي عمره 4 سنين ما يريد يخلعه. القماش ناعم على الجلد وبعد 6 غسلات ما بهت." },
  ],
  "denim-kids-set": [
    { author: "أحمد الجبوري", city: "صلاح الدين", rating: 5, comment: "اشتريته لابنتي وطلعت حبايب بيه. الأزرار كبس سهلة تقدر تفتحها بروحها." },
  ],
  "karbala-pearl-bag": [
    { author: "زهراء عبد", city: "كربلاء", rating: 5, comment: "أخذتها لخطوبة أختي وكانت تكمّل الفستان تماماً. اللآلئ مخيطة بدقة وما تتحرك." },
  ],
  "yaqut-chiffon-hijab": [
    { author: "نورس حامد", city: "بغداد", rating: 5, comment: "أخف شيفون جربته، وما يحتاج ألف دبوس ليثبت. اللون الياقوتي فخم جداً." },
    { author: "حنة صلاح", city: "دهوك", rating: 4, comment: "حلو وخفيف، بس أحتاج أضبطّه مرة باليوم. طلبت لونين زيادة." },
  ],
  "evening-dress-sargarib": [
    { author: "مريم حسين", city: "الموصل", rating: 5, comment: "قصّته تُظهر القوام بشكل محتشم وأنيق. لبسته سهرة عرس وكان أفضل اختيار." },
  ],
  "gharida-knit-cardigan": [
    { author: "سحر عادل", city: "أربيل", rating: 5, comment: "محبوك سميك بس مش تقيل، وأزراره الكبيرة تضيف فخامة. خزانتي الشتوية متكملة هسة." },
  ],
};

async function main() {
  console.log("Seeding Bably storefront…");

  // Safety: never wipe a live store by accident. If products already exist, only reseed
  // when explicitly asked (SEED_FORCE=1 or --force). Orders are kept unless --force is used.
  const force = process.env.SEED_FORCE === "1" || process.argv.includes("--force");
  const existing = await db.select({ id: products.id }).from(products).limit(1);
  if (existing.length && !force) {
    console.log("Database already has products — skipping seed. Run with --force to reseed.");
    process.exit(0);
  }

  if (force) await db.delete(orders);
  await db.delete(reviews);
  await db.delete(products);
  await db.delete(categories);

  const catSeed = await db
    .insert(categories)
    .values([
      { name: "نساء", slug: "women", tagline: "فساتين، أطقم وأناقة يومية", image: px(7736224, 900, 1100), sort: 1 },
      { name: "عبايات وجلابيات", slug: "abaya", tagline: "فخامة محتشمة بإرث بابلي", image: px(32178223, 900, 1100), sort: 2 },
      { name: "رجال", slug: "men", tagline: "قمصان، دنيم وأطقم كتان", image: px(17668938, 900, 1100), sort: 3 },
      { name: "أطفال", slug: "kids", tagline: "قطن ناعم يتحمل اللعب", image: px(1620759, 900, 1100), sort: 4 },
      { name: "إكسسوارات", slug: "accessories", tagline: "حجاب، شالات وحقائب", image: px(38795851, 900, 1100), sort: 5 },
    ])
    .returning();

  const catBySlug = Object.fromEntries(catSeed.map((c) => [c.slug, c.id]));

  const inserted = await db
    .insert(products)
    .values(
      SEED.map((p) => ({
        name: p.name,
        slug: p.slug,
        categoryId: catBySlug[p.cat],
        shortDesc: p.shortDesc,
        longDesc: p.longDesc,
        details: p.details.map(([label, value]) => ({ label, value })),
        images: gallery(p.img, p.img2),
        price: p.price,
        compareAt: p.compareAt ?? null,
        rating: p.rating,
        ratingCount: p.ratingCount,
        sizes: p.sizes,
        colors: p.colors.map(([name, hex]) => ({ name, hex })),
        collections: p.collections ?? [],
        featured: p.featured ?? false,
        newArrival: p.newArrival ?? false,
        inStock: true,
      }))
    )
    .returning({ id: products.id, slug: products.slug });

  const idBySlug = Object.fromEntries(inserted.map((r) => [r.slug, r.id]));

  const reviewRows = Object.entries(REVIEWS).flatMap(([slug, list]) =>
    list
      .filter((r) => idBySlug[slug])
      .map((r) => ({
        productId: idBySlug[slug],
        author: r.author,
        city: r.city,
        rating: r.rating,
        comment: r.comment,
        verified: true,
      }))
  );

  await db.insert(reviews).values(reviewRows);

  console.log(`Done: ${catSeed.length} categories, ${inserted.length} products, ${reviewRows.length} reviews.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
