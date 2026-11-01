import "server-only";

import type { HomepageData } from "@/lib/data";

export const heroContent: HomepageData["hero"] = {
  eyebrow: "العزل المائي والحراري المعتمد",
  title: "حلول عزل متكاملة",
  highlight: "لحماية مبانيك واستدامتها",
  description:
    "ننفّذ أنظمة العزل المائي والحراري للأسطح والأساسات والخزانات والواجهات، بمواد معتمدة وفريق هندسي ميداني يضمن تنفيذاً دقيقاً وضماناً موثقاً.",
  primaryAction: { label: "اطلب استشارة مجانية", href: "/contact" },
  secondaryAction: { label: "استكشف خدماتنا", href: "/services" },
  highlights: [
    {
      id: "sbc",
      label: "تنفيذ مطابق للكود السعودي (SBC)",
      icon: "compliance",
    },
    {
      id: "quality",
      label: "معايير السلامة والجودة العالية",
      icon: "quality",
    },
    {
      id: "supervision",
      label: "إشراف فني وهندسي معتمد",
      icon: "supervision",
    },
  ],
  image: {
    src: "/1.jpg",
    alt: "فريق فني متخصص أثناء تنفيذ أعمال العزل على سطح أحد المباني",
    objectPosition: "center",
  },
  panel: {
    status: "نشاط ميداني مستمر",
    location: "الرياض والمناطق المجاورة",
    title: "رش بولي يوريثان فوم وحماية الأكريليك المعتمدة",
  },
};

export const approvalsContent: HomepageData["approvals"] = {
  heading: {
    eyebrow: "اعتمادات موثوقة",
    title: "اعتمادات وشهادات موثوقة",
    description:
      "نعمل وفق معايير ومواصفات معتمدة، ونوثّق كل مرحلة لضمان جودة التنفيذ وسلامة المنشأة.",
    action: { label: "عرض الاعتمادات", href: "/certificates" },
  },
  items: [
    {
      id: "iso-9001",
      title: "نظام إدارة الجودة",
      issuer: "ISO 9001:2015",
      description:
        "إطار موثق لإدارة جودة التنفيذ والفحص والتسليم في جميع مراحل المشروع.",
      badge: "ISO 9001",
      icon: "award",
      status: { label: "سارية حتى 2027", tone: "valid" },
    },
    {
      id: "iso-14001",
      title: "الإدارة البيئية",
      issuer: "ISO 14001:2015",
      description:
        "إجراءات للحد من الأثر البيئي واستخدام مواد منخفضة الانبعاثات.",
      badge: "ISO 14001",
      icon: "leaf",
      status: { label: "سارية حتى 2027", tone: "valid" },
    },
    {
      id: "sbc",
      title: "اعتماد كود البناء",
      issuer: "SBC 601 / 602",
      description:
        "مطابقة متطلبات العزل المائي والحراري لأنظمة البناء المعتمدة.",
      badge: "كود البناء",
      icon: "badge",
      status: { label: "مطابقة معتمدة", tone: "valid" },
    },
    {
      id: "hse",
      title: "السلامة المهنية",
      issuer: "HSE",
      description:
        "تطبيق إجراءات السلامة في المواقع وحماية فرق التنفيذ والزوار.",
      badge: "السلامة",
      icon: "shield",
      status: { label: "سارية", tone: "valid" },
    },
  ],
};

export const servicesContent: HomepageData["services"] = {
  heading: {
    eyebrow: "خدماتنا",
    title: "حلول العزل المناسبة حسب طبيعة المنشأة والتطبيق",
    description:
      "نختار النظام الأنسب بعد فحص الموقع، مع مواد معتمدة وتنفيذ دقيق واختبارات تسليم موثقة.",
    action: { label: "عرض جميع الخدمات", href: "/services" },
  },
  items: [
    {
      id: "roofs",
      title: "عزل الأسطح",
      description:
        "أنظمة عزل مائي وحراري للأسطح الخرسانية والمعدنية مع معالجة الميول والتصريف.",
      icon: "house",
      href: "/services/roof-waterproofing",
      linkLabel: "تفاصيل الخدمة",
      code: "SVC-01",
      tags: [
        { id: "water", label: "عزل مائي" },
        { id: "thermal", label: "عزل حراري" },
        { id: "uv", label: "حماية UV" },
      ],
    },
    {
      id: "foundations",
      title: "عزل الأساسات",
      description:
        "حماية القواعد والجدران الاستنادية من المياه الجوفية والأملاح والرطوبة.",
      icon: "building",
      href: "/services/foundation-waterproofing",
      linkLabel: "تفاصيل الخدمة",
      code: "SVC-02",
      tags: [
        { id: "foundations", label: "أساسات" },
        { id: "groundwater", label: "مياه جوفية" },
      ],
    },
    {
      id: "tanks",
      title: "عزل الخزانات",
      description:
        "تبطين خزانات المياه بمواد إيبوكسية آمنة ومعتمدة للاستخدام الغذائي.",
      icon: "droplets",
      href: "/services/tank-lining",
      linkLabel: "تفاصيل الخدمة",
      code: "SVC-03",
      tags: [
        { id: "tanks", label: "خزانات" },
        { id: "epoxy", label: "إيبوكسي" },
      ],
    },
    {
      id: "thermal",
      title: "العزل الحراري",
      description:
        "أنظمة عزل حراري متكاملة تقلل انتقال الحرارة وتحسّن كفاءة التكييف.",
      icon: "thermometer",
      href: "/services/thermal-insulation",
      linkLabel: "تفاصيل الخدمة",
      code: "SVC-04",
      tags: [
        { id: "thermal", label: "عزل حراري" },
        { id: "energy", label: "كفاءة الطاقة" },
      ],
    },
    {
      id: "facades",
      title: "عزل الواجهات",
      description:
        "معالجة شروخ الواجهات وحمايتها من الرطوبة والعوامل الجوية.",
      icon: "layers",
      href: "/services/facade-waterproofing",
      linkLabel: "تفاصيل الخدمة",
      code: "SVC-05",
      tags: [
        { id: "facades", label: "واجهات" },
        { id: "moisture", label: "مقاومة الرطوبة" },
      ],
    },
    {
      id: "floors",
      title: "عزل الأرضيات",
      description:
        "أنظمة عزل للأرضيات والبلاطات الخرسانية في المباني والمنشآت الصناعية.",
      icon: "target",
      href: "/services/floor-waterproofing",
      linkLabel: "تفاصيل الخدمة",
      code: "SVC-06",
      tags: [
        { id: "floors", label: "أرضيات" },
        { id: "industrial", label: "منشآت صناعية" },
      ],
    },
  ],
};
