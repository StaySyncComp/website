import type { Data } from "@measured/puck";

export type InfoPageTemplateId =
  | "hotel-welcome"
  | "boutique-guide"
  | "guest-essentials";

export interface InfoPageTemplate {
  id: InfoPageTemplateId;
  nameKey: string;
  descriptionKey: string;
  /** Mini wireframe bars for template picker preview */
  previewLayout: Array<{ h: string; w: string; className: string }>;
  data: Data;
}

export interface InfoPageTemplateContext {
  organizationName?: string;
  organizationLogo?: string;
}

function block(
  id: string,
  type: string,
  props: Record<string, unknown>
): Data["content"][number] {
  return { type, props: { id, ...props } };
}

function brandingBlock(id: string) {
  return block(id, "HotelBranding", {
    logoUrl: "",
    hotelName: "שם המלון",
    tagline:
      "שמחים לארח אתכם — כאן מרוכז כל מה שצריך לדעת לשהייה נעימה וחלקה.",
  });
}

/** Welcome page: branding → personal note → hero → facts → services → CTA → contact */
const hotelWelcome: Data = {
  root: { props: { title: "ברוכים הבאים למלון" } },
  content: [
    brandingBlock("hw-brand"),
    block("hw-welcome", "WelcomeNote", {
      message:
        "הגעתם למקום הנכון. הצוות שלנו כאן בשבילכם — בין אם זו שאלה קטנה או בקשה מיוחדת לפני השינה.",
      signature: "— צוות הקבלה, בשמחה",
    }),
    block("hw-hero", "Hero", {
      greeting: "שלום וברוכים הבאים",
      title: "השהייה שלכם מתחילה כאן",
      subtitle:
        "ריכזנו עבורכם שעות, שירותים ודרכי התקשרות — כדי שתוכלו להתמקד במה שחשוב באמת.",
      align: "center",
    }),
    block("hw-facts", "QuickFacts", {
      label1: "צ'ק-אין",
      value1: "מ-15:00",
      label2: "צ'ק-אאוט",
      value2: "עד 11:00",
      label3: "ארוחת בוקר",
      value3: "07:00–10:30",
    }),
    block("hw-sh1", "SectionHeader", {
      title: "שירותי המלון",
      subtitle: "זמינים לאורחים שלנו במהלך השהייה",
    }),
    block("hw-list", "FeatureList", {
      items:
        "קבלה 24 שעות — לכל שאלה או בקשה, אנחנו כאן\nחדר כושר — פתוח כל השבוע\nחניה — לפי זמינות (שאלו בקבלה)\nהעברות — נשמח לתאם מראש",
    }),
    block("hw-hl", "HighlightBox", {
      title: "צריכים משהו?",
      body: "הצוות בקבלה זמין בכל שעה. התקשרו או שלחו הודעה — נשמח לעזור.",
      style: "accent",
    }),
    block("hw-btn", "ButtonLink", {
      label: "התקשרות לקבלה",
      href: "tel:+972300000000",
      variant: "primary",
    }),
    block("hw-contact", "ContactRow", {
      title: "פרטי התקשרות",
      phone: "03-0000000",
      email: "reception@hotel.com",
      address: "רחוב הדוגמה 1, תל אביב",
      mapsUrl: "https://maps.google.com",
      variant: "footer",
    }),
  ],
};

/** Boutique guide: branding → story → image → explore → hours → contact */
const boutiqueGuide: Data = {
  root: { props: { title: "מדריך האורח" } },
  content: [
    brandingBlock("bg-brand"),
    block("bg-welcome", "WelcomeNote", {
      message:
        "בחרתם להתארח אצלנו, וזה מחמם את הלב. הכנו עבורכם מדריך קצר עם טיפים מהצוות — כדי שתרגישו מקומיים מהרגע הראשון.",
      signature: "— הצוות שלכם",
    }),
    block("bg-hero", "Hero", {
      greeting: "השהייה שלכם מתחילה כאן",
      title: "מדריך האורח",
      subtitle:
        "מלון בוטיק עם אווירה אישית — שעות, המלצות בסביבה וכל מה שכדאי לדעת.",
      align: "center",
    }),
    block("bg-intro", "Text", {
      content:
        "אנחנו מאמינים שכל אורח שונה. אם חסר לכם משהו בעמוד הזה — דברו איתנו בקבלה, ונשמח להשלים.",
    }),
    block("bg-img", "Image", {
      src: "",
      alt: "תמונה מהמלון",
      caption: "החליפו בתמונה מהנכס שלכם — לובי, חדר או נוף",
    }),
    block("bg-sh1", "SectionHeader", {
      title: "מה לעשות בסביבה",
      subtitle: "המלצות אישיות מהצוות שלנו",
    }),
    block("bg-list", "FeatureList", {
      items:
        "מסעדות מומלצות במרחק הליכה\nשבילי טיול ונקודות תצפית\nאטרקציות למשפחות\nהעברות — תיאום דרך הקבלה",
    }),
    block("bg-hl", "HighlightBox", {
      title: "שעות מסעדה ובר",
      body: "מסעדה: 12:00–22:30\nבר בלובי: 17:00–01:00\nארוחת בוקר: 07:30–10:30",
      style: "neutral",
    }),
    block("bg-btn", "ButtonLink", {
      label: "שליחת הודעה לצוות",
      href: "mailto:hello@hotel.com",
      variant: "outline",
    }),
    block("bg-contact", "ContactRow", {
      title: "נשמח לשמוע מכם",
      phone: "03-0000000",
      email: "hello@hotel.com",
      address: "",
      mapsUrl: "",
      variant: "footer",
    }),
  ],
};

/** Essentials: branding → WiFi highlight → facts → policies → contact */
const guestEssentials: Data = {
  root: { props: { title: "מידע חיוני לאורח" } },
  content: [
    brandingBlock("ge-brand"),
    block("ge-hero", "Hero", {
      greeting: "מידע מהיר ושימושי",
      title: "כל מה שצריך לדעת",
      subtitle: "WiFi, שעות ומדיניות — במקום אחד, בלי לחפש.",
      align: "center",
    }),
    block("ge-wifi", "HighlightBox", {
      title: "חיבור WiFi",
      body: "שם הרשת: Hotel-Guest\nסיסמה: Welcome2024\n\nהרשת זמינה בכל חדרי המלון ובאזורי הציבור. שמרו את הפרטים — ותהנו.",
      style: "accent",
    }),
    block("ge-facts", "QuickFacts", {
      label1: "ארוחת בוקר",
      value1: "07:00–10:00",
      label2: "שעות שקט",
      value2: "22:00–08:00",
      label3: "צ'ק-אאוט",
      value3: "עד 11:00",
    }),
    block("ge-div", "Divider", {}),
    block("ge-sh1", "SectionHeader", {
      title: "מדיניות המלון",
      subtitle: "לנוחיות כל האורחים — תודה על ההבנה",
    }),
    block("ge-pol", "FeatureList", {
      items:
        "עישון — רק באזורים מיועדים בחוץ\nחיות מחמד — בתיאום מראש עם הקבלה\nאורחים — לפי מדיניות המלון",
    }),
    block("ge-em", "HighlightBox", {
      title: "חירום",
      body: "במקרה חירום: התקשרו 100 או פנו לדלפק הקבלה (קומה 0, 24 שעות). אנחנו כאן.",
      style: "neutral",
    }),
    block("ge-contact", "ContactRow", {
      title: "קבלה",
      phone: "03-0000000",
      email: "reception@hotel.com",
      address: "דלפק קבלה · קומה 0",
      mapsUrl: "",
      variant: "footer",
    }),
  ],
};

export const INFO_PAGE_TEMPLATES: InfoPageTemplate[] = [
  {
    id: "hotel-welcome",
    nameKey: "info_page_template_welcome_name",
    descriptionKey: "info_page_template_welcome_desc",
    previewLayout: [
      { h: "h-5", w: "w-full", className: "bg-accent/35 rounded flex gap-1" },
      { h: "h-8", w: "w-full", className: "bg-accent/40 rounded" },
      { h: "h-4", w: "w-3/4", className: "bg-muted rounded mx-auto" },
      { h: "h-6", w: "w-full", className: "bg-accent/20 rounded" },
      { h: "h-5", w: "w-full", className: "bg-foreground/80 rounded" },
    ],
    data: hotelWelcome,
  },
  {
    id: "boutique-guide",
    nameKey: "info_page_template_boutique_name",
    descriptionKey: "info_page_template_boutique_desc",
    previewLayout: [
      { h: "h-5", w: "w-full", className: "bg-accent/35 rounded" },
      { h: "h-7", w: "w-full", className: "bg-accent/35 rounded" },
      { h: "h-10", w: "w-full", className: "bg-muted/80 rounded border border-dashed border-border" },
      { h: "h-5", w: "w-full", className: "bg-muted/60 rounded" },
      { h: "h-5", w: "w-full", className: "bg-foreground/80 rounded" },
    ],
    data: boutiqueGuide,
  },
  {
    id: "guest-essentials",
    nameKey: "info_page_template_essentials_name",
    descriptionKey: "info_page_template_essentials_desc",
    previewLayout: [
      { h: "h-5", w: "w-full", className: "bg-accent/30 rounded" },
      { h: "h-6", w: "w-full", className: "bg-accent/30 rounded" },
      { h: "h-8", w: "w-full", className: "bg-accent/25 rounded border border-accent/40" },
      { h: "h-5", w: "w-full", className: "bg-muted rounded" },
      { h: "h-5", w: "w-full", className: "bg-foreground/80 rounded" },
    ],
    data: guestEssentials,
  },
];

export function getInfoPageTemplate(
  id: InfoPageTemplateId
): InfoPageTemplate | undefined {
  return INFO_PAGE_TEMPLATES.find((t) => t.id === id);
}

function applyOrganizationToContent(
  content: Data["content"],
  context?: InfoPageTemplateContext
): Data["content"] {
  if (!context?.organizationName && !context?.organizationLogo) {
    return content;
  }
  return content.map((item) => {
    if (item.type !== "HotelBranding") return item;
    return {
      type: item.type,
      props: {
        ...item.props,
        ...(context.organizationName
          ? { hotelName: context.organizationName }
          : {}),
        ...(context.organizationLogo
          ? { logoUrl: context.organizationLogo }
          : {}),
      },
    };
  });
}

/** Fresh block IDs on each apply — prevents Puck duplicate/glitch issues */
export function cloneTemplateData(
  template: InfoPageTemplate,
  context?: InfoPageTemplateContext
): Data {
  const data = JSON.parse(JSON.stringify(template.data)) as Data;
  const prefix = `${template.id}-${Date.now()}`;
  data.content = data.content.map((item, index) => {
    const newId = `${prefix}-${String(item.type)}-${index}`;
    return {
      type: item.type,
      props: {
        ...item.props,
        id: newId,
      },
    };
  });
  data.content = applyOrganizationToContent(data.content, context);
  return data;
}
