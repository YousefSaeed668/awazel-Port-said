import "server-only";

import type { HomepageData } from "@/lib/data";

export const projectsContent: HomepageData["projects"] = {
  heading: {
    eyebrow: "مشاريعنا",
    title: "نماذج من أعمال العزل المنفذة في الميدان",
    description:
      "مشاريع مختارة توضح طريقة التعامل مع اختلاف طبيعة المنشأة ومتطلبات كل موقع.",
    action: { label: "عرض جميع المشاريع", href: "/projects" },
  },
  items: [
    {
      id: "commercial-roof",
      title: "عزل وتأهيل أسطح مجمع تجاري",
      description:
        "تنفيذ عزل مائي وحراري لمساحة 4,250 م² مع اختبار غمر ناجح وتسليم موثق.",
      image: {
        src: "/3.jpg",
        alt: "سطح مجمع تجاري بعد تنفيذ طبقة العزل",
        objectPosition: "center",
      },
      href: "/projects/commercial-roof",
      category: "أسطح تجارية",
      facts: [
        { id: "area", label: "المساحة", value: "4,250 م²" },
        { id: "duration", label: "مدة التنفيذ", value: "8 أيام" },
        { id: "warranty", label: "الضمان", value: "10 سنوات", emphasis: true },
      ],
    },
    {
      id: "residential-foundation",
      title: "حماية أساسات مبنى سكني",
      description:
        "عزل الأساسات والجدران الاستنادية ضد المياه الجوفية والأملاح في منطقة ساحلية.",
      image: {
        src: "/4.jpg",
        alt: "أعمال عزل الأساسات في مبنى سكني",
        objectPosition: "center",
      },
      href: "/projects/residential-foundation",
      category: "أساسات",
      facts: [
        { id: "area", label: "المساحة", value: "1,800 م²" },
        { id: "duration", label: "مدة التنفيذ", value: "12 يوماً" },
        { id: "warranty", label: "الضمان", value: "10 سنوات", emphasis: true },
      ],
    },
    {
      id: "water-tanks",
      title: "تبطين خزانات مياه الشرب",
      description:
        "تطبيق طبقات إيبوكسية معتمدة لخزانين بسعة 500 م³ مع اختبارات سلامة.",
      image: {
        src: "/5.jpg",
        alt: "خزان مياه بعد تطبيق طبقة التبطين الداخلية",
        objectPosition: "center",
      },
      href: "/projects/water-tanks",
      category: "خزانات",
      facts: [
        { id: "capacity", label: "السعة", value: "500 م³" },
        { id: "duration", label: "مدة التنفيذ", value: "6 أيام" },
        { id: "warranty", label: "الضمان", value: "5 سنوات", emphasis: true },
      ],
    },
  ],
};

export const companyContent: HomepageData["company"] = {
  eyebrow: "رؤيتنا ومرحلتنا العملية",
  title: "خبرة هندسية ودقة تنفيذ لحماية منشآتك على المدى الطويل",
  description:
    "تأسست شركة عوازل بورسعيد لتوفير حلول العزل المتخصصة وفق أعلى المعايير الهندسية. ندرك تماماً أن العزل المائي والحراري ليس مجرد طبقة مادة، بل هو الدرع الأساسي لسلامة المبنى الخرساني والحد من استهلاك الطاقة ومنع التآكل الإنشائي الناتج عن الرطوبة والأملاح.",
  image: {
    src: "/2.jpg",
    alt: "مهندس وفني يعاينان طبقات العزل على سطح مبنى",
    objectPosition: "center",
  },
  panel: {
    title: "فحص هندسي موثق",
    description:
      "إشراف ميداني من قبل مهندسين متخصصين لضمان الالتزام بمواصفات المشروع واختبارات الجودة.",
  },
  features: [
    {
      id: "engineering",
      title: "معايير هندسية صارمة",
      description: "فحص دقيق للموقع وتحديد النظام الأنسب لطبيعة السطح والمنشأة.",
      icon: "target",
    },
    {
      id: "materials",
      title: "مواد أصلية معتمدة",
      description:
        "اعتماد حصري لأنظمة الشركات الرائدة (يوتونام، إيروكام، وبوندا) بشهادات توريد رسمية.",
      icon: "badge",
    },
    {
      id: "testing",
      title: "اختبارات جودة إلزامية",
      description:
        "اختبار الغمر المائي وقياسات السماكة والكثافة قبل التسليم النهائي المعتمد.",
      icon: "shield",
    },
  ],
  primaryAction: { label: "اقرأ المزيد عنا ومسيرتنا", href: "/about" },
  secondaryAction: { label: "تحميل ملف الشركة (PDF)", href: "/about/profile" },
};

export const workStagesContent: HomepageData["workStages"] = {
  heading: {
    eyebrow: "آلية العمل",
    title: "مراحل عمل واضحة من الطلب وحتى التسليم المعتمد",
    description:
      "منهجية من خمس مراحل تضمن وضوح المسؤوليات وضبط الجودة في كل خطوة.",
  },
  label: "مراحل العمل",
  items: [
    {
      id: "site-visit",
      title: "زيارة الموقع",
      description: "نستمع لاحتياجك ونحدد موعد زيارة فنية مناسبة.",
      icon: "headset",
      note: { text: "خلال 24 ساعة" },
    },
    {
      id: "assessment",
      title: "الفحص والتشخيص",
      description:
        "فحص السطح أو المنشأة وتحديد مصادر الرطوبة والنظام المناسب.",
      icon: "target",
    },
    {
      id: "proposal",
      title: "العرض والاعتماد",
      description: "تقديم عرض فني ومالي واضح بالمواصفات والمواد والمدة.",
      icon: "file",
    },
    {
      id: "execution",
      title: "التنفيذ",
      description: "تنفيذ الأعمال بفريق متخصص مع متابعة يومية لضبط الجودة.",
      icon: "settings",
    },
    {
      id: "handover",
      title: "الاختبار والتسليم",
      description:
        "اختبار الغمر والتأكد من النتيجة ثم تسليم الضمان والتقرير.",
      icon: "check",
      note: { text: "48 ساعة اختبار", tone: "success" },
    },
  ],
};
