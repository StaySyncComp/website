import type { Config } from "@measured/puck";
import { SECTION_PX, SECTION_PROSE_MAX } from "./layout";
import {
  INFO_PAGE_EDITOR_ROOT_INNER,
  INFO_PAGE_EDITOR_ROOT_OUTER,
  INFO_PAGE_PUBLIC_ROOT_CLASS,
} from "./viewports";

export const emptyPuckData = {
  content: [],
  root: { props: { title: "" } },
};

const rootFields = {
  title: { type: "text" as const, label: "כותרת עמוד (SEO)" },
};

const componentCategories = {
  content: {
    title: "תוכן",
    components: [
      "HotelBranding",
      "Hero",
      "WelcomeNote",
      "SectionHeader",
      "QuickFacts",
      "HighlightBox",
      "FeatureList",
      "Heading",
      "Text",
      "Image",
      "ButtonLink",
      "Divider",
      "ContactRow",
    ],
  },
};

const infoPageComponents: Config["components"] = {
  HotelBranding: {
      label: "מיתוג מלון",
      fields: {
        logoUrl: { type: "text", label: "קישור ללוגו (URL)" },
        hotelName: { type: "text", label: "שם המלון" },
        tagline: { type: "textarea", label: "משפט פתיחה" },
      },
      defaultProps: {
        logoUrl: "",
        hotelName: "שם המלון",
        tagline: "שמחים לארח אתכם — כאן תמצאו את כל מה שצריך לשהייה נעימה.",
      },
      render: ({ logoUrl, hotelName, tagline }) => (
        <header
          className={`${SECTION_PX} pt-8 pb-6 md:pt-10 md:pb-8 border-b border-border/60 bg-gradient-to-b from-background to-muted/20`}
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 text-center sm:text-right">
            {logoUrl ? (
              <div className="shrink-0 rounded-2xl border border-border/80 bg-surface p-3 shadow-sm">
                <img
                  src={logoUrl}
                  alt={hotelName || ""}
                  className="h-16 w-16 md:h-20 md:w-20 object-contain"
                />
              </div>
            ) : (
              <div className="shrink-0 h-16 w-16 md:h-20 md:w-20 rounded-2xl border border-dashed border-border bg-muted/40 flex items-center justify-center text-2xl text-muted-foreground">
                ✦
              </div>
            )}
            <div className="flex-1 min-w-0">
              {hotelName ? (
                <p className="text-xs font-medium uppercase tracking-widest text-accent mb-1">
                  ברוכים הבאים
                </p>
              ) : null}
              <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
                {hotelName || "שם המלון"}
              </h1>
              {tagline ? (
                <p
                  className={`text-sm md:text-base lg:text-lg text-muted-foreground mt-2 leading-relaxed ${SECTION_PROSE_MAX} whitespace-pre-wrap`}
                >
                  {tagline}
                </p>
              ) : null}
            </div>
          </div>
        </header>
      ),
    },
    Hero: {
      label: "כותרת ראשית",
      fields: {
        greeting: { type: "text", label: "ברכה קצרה (אופציונלי)" },
        title: { type: "text", label: "כותרת" },
        subtitle: { type: "textarea", label: "תת-כותרת" },
        align: {
          type: "select",
          label: "יישור",
          options: [
            { label: "ימין", value: "right" },
            { label: "מרכז", value: "center" },
            { label: "שמאל", value: "left" },
          ],
        },
      },
      defaultProps: {
        greeting: "",
        title: "ברוכים הבאים",
        subtitle: "",
        align: "center",
      },
      render: ({ greeting, title, subtitle, align }) => {
        const alignClass =
          align === "left"
            ? "text-left"
            : align === "right"
              ? "text-right"
              : "text-center";
        const centerMax = align === "center" ? "mx-auto" : "";
        return (
          <section
            className={`${SECTION_PX} py-12 md:py-16 lg:py-20 bg-gradient-to-b from-accent/15 via-accent/5 to-background ${alignClass}`}
          >
            {greeting ? (
              <p
                className={`text-sm md:text-base font-medium text-accent mb-3 ${centerMax} max-w-2xl`}
              >
                {greeting}
              </p>
            ) : null}
            <h2 className="text-3xl md:text-4xl lg:text-[2.5rem] font-bold text-foreground mb-4 leading-tight">
              {title}
            </h2>
            {subtitle ? (
              <p
                className={`text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl lg:max-w-4xl whitespace-pre-wrap leading-relaxed ${centerMax}`}
              >
                {subtitle}
              </p>
            ) : null}
          </section>
        );
      },
    },
    WelcomeNote: {
      label: "הודעה אישית",
      fields: {
        message: { type: "textarea", label: "הודעה" },
        signature: { type: "text", label: "חתימה" },
      },
      defaultProps: {
        message:
          "אנחנו כאן כדי שהשהייה שלכם תהיה נעימה וחלקה. אל תהססו לפנות אלינו — נשמח לעזור.",
        signature: "— צוות המלון",
      },
      render: ({ message, signature }) => (
        <section className={`${SECTION_PX} py-6 md:py-8`}>
          <div className="rounded-2xl border border-border/80 bg-surface/80 px-6 py-6 md:px-8 md:py-7 shadow-sm">
            <p className="text-base md:text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap">
              {message}
            </p>
            {signature ? (
              <p className="mt-4 text-sm font-medium text-muted-foreground">
                {signature}
              </p>
            ) : null}
          </div>
        </section>
      ),
    },
    SectionHeader: {
      label: "כותרת מקטע",
      fields: {
        title: { type: "text", label: "כותרת" },
        subtitle: { type: "textarea", label: "תת-כותרת (אופציונלי)" },
      },
      defaultProps: {
        title: "כותרת מקטע",
        subtitle: "",
      },
      render: ({ title, subtitle }) => (
        <section className={`${SECTION_PX} pt-10 pb-3`}>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            {title}
          </h2>
          {subtitle ? (
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed whitespace-pre-wrap">
              {subtitle}
            </p>
          ) : null}
          <div className="h-1 w-12 bg-accent rounded-full mt-4" />
        </section>
      ),
    },
    QuickFacts: {
      label: "שורת עובדות",
      fields: {
        label1: { type: "text", label: "תווית 1" },
        value1: { type: "text", label: "ערך 1" },
        label2: { type: "text", label: "תווית 2" },
        value2: { type: "text", label: "ערך 2" },
        label3: { type: "text", label: "תווית 3" },
        value3: { type: "text", label: "ערך 3" },
      },
      defaultProps: {
        label1: "צ'ק-אין",
        value1: "מ-15:00",
        label2: "צ'ק-אאוט",
        value2: "עד 11:00",
        label3: "ארוחת בוקר",
        value3: "07:00–10:00",
      },
      render: ({ label1, value1, label2, value2, label3, value3 }) => {
        const facts = [
          { label: label1, value: value1 },
          { label: label2, value: value2 },
          { label: label3, value: value3 },
        ].filter((f) => f.label && f.value);
        return (
          <section className={`${SECTION_PX} py-6 md:py-8 lg:py-10`}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-5 lg:gap-6 w-full">
              {facts.map((fact, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border bg-surface px-4 py-5 md:py-6 text-center min-h-[88px] flex flex-col justify-center"
                >
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {fact.label}
                  </p>
                  <p className="text-lg font-semibold text-foreground mt-1">
                    {fact.value}
                  </p>
                </div>
              ))}
            </div>
          </section>
        );
      },
    },
    HighlightBox: {
      label: "תיבת הדגשה",
      fields: {
        title: { type: "text", label: "כותרת" },
        body: { type: "textarea", label: "תוכן" },
        style: {
          type: "select",
          label: "סגנון",
          options: [
            { label: "מודגש (כחול)", value: "accent" },
            { label: "נייטרלי", value: "neutral" },
          ],
        },
      },
      defaultProps: {
        title: "חשוב לדעת",
        body: "הוסיפו כאן מידע בולט — למשל סיסמת WiFi או הודעה מהקבלה.",
        style: "accent",
      },
      render: ({ title, body, style }) => (
        <section className={`${SECTION_PX} py-4 md:py-6`}>
          <div
            className={`rounded-xl px-5 py-5 border ${
              style === "accent"
                ? "bg-accent/10 border-accent/30"
                : "bg-muted/50 border-border"
            }`}
          >
            {title ? (
              <p className="font-semibold text-foreground mb-2">{title}</p>
            ) : null}
            <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap text-foreground/90">
              {body}
            </p>
          </div>
        </section>
      ),
    },
    FeatureList: {
      label: "רשימת נקודות",
      fields: {
        items: {
          type: "textarea",
          label: "פריטים (שורה לכל פריט)",
        },
      },
      defaultProps: {
        items: "פריט ראשון\nפריט שני\nפריט שלישי",
      },
      render: ({ items }) => {
        const lines = String(items || "")
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean);
        return (
          <section className={`${SECTION_PX} py-2 pb-6 md:pb-8`}>
            <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 md:gap-3 lg:gap-4">
              {lines.map((line, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-lg border border-border/80 bg-surface/80 px-4 py-3 text-sm md:text-base leading-relaxed"
                >
                  <span className="mt-1.5 size-2 shrink-0 rounded-full bg-accent" />
                  <span className="flex-1">{line}</span>
                </li>
              ))}
            </ul>
          </section>
        );
      },
    },
    Heading: {
      label: "כותרת",
      fields: {
        text: { type: "text", label: "טקסט" },
        level: {
          type: "select",
          label: "גודל",
          options: [
            { label: "גדול", value: "h2" },
            { label: "בינוני", value: "h3" },
            { label: "קטן", value: "h4" },
          ],
        },
      },
      defaultProps: { text: "כותרת", level: "h2" },
      render: ({ text, level }) => {
        const Tag = level as "h2" | "h3" | "h4";
        const size =
          level === "h2"
            ? "text-2xl md:text-3xl"
            : level === "h3"
              ? "text-xl md:text-2xl"
              : "text-lg md:text-xl";
        return (
          <section className={`${SECTION_PX} py-3`}>
            <Tag className={`font-semibold ${size} text-foreground`}>
              {text}
            </Tag>
          </section>
        );
      },
    },
    Text: {
      label: "טקסט",
      fields: {
        content: { type: "textarea", label: "תוכן" },
      },
      defaultProps: {
        content: "הוסף כאן את התוכן שלך.",
      },
      render: ({ content }) => (
        <section className={`${SECTION_PX} py-3 md:py-4`}>
          <p className="text-base leading-relaxed whitespace-pre-wrap text-foreground/85">
            {content}
          </p>
        </section>
      ),
    },
    Image: {
      label: "תמונה",
      fields: {
        src: { type: "text", label: "קישור לתמונה (URL)" },
        alt: { type: "text", label: "תיאור נגישות" },
        caption: { type: "text", label: "כיתוב" },
      },
      defaultProps: {
        src: "",
        alt: "",
        caption: "",
      },
      render: ({ src, alt, caption }) => (
        <section className={`${SECTION_PX} py-4 md:py-6`}>
          {src ? (
            <figure className="max-w-3xl mx-auto">
              <img
                src={src}
                alt={alt || ""}
                className="w-full rounded-xl object-cover max-h-[480px]"
              />
              {caption ? (
                <figcaption className="text-sm text-muted-foreground mt-2 text-center">
                  {caption}
                </figcaption>
              ) : null}
            </figure>
          ) : (
            <div className="aspect-[16/9] max-h-56 bg-gradient-to-br from-muted to-muted/50 rounded-xl flex flex-col items-center justify-center text-muted-foreground border border-dashed border-border">
              <span className="text-3xl mb-2 opacity-40">🖼</span>
              <span className="text-sm">הוסיפו קישור לתמונה למעלה</span>
            </div>
          )}
        </section>
      ),
    },
    ButtonLink: {
      label: "כפתור קישור",
      fields: {
        label: { type: "text", label: "טקסט כפתור" },
        href: { type: "text", label: "קישור (URL)" },
        variant: {
          type: "select",
          label: "סגנון",
          options: [
            { label: "ראשי", value: "primary" },
            { label: "מסגרת", value: "outline" },
          ],
        },
      },
      defaultProps: {
        label: "לחצו כאן",
        href: "#",
        variant: "primary",
      },
      render: ({ label, href, variant }) => {
        const className =
          variant === "outline"
            ? "inline-block px-6 py-3 rounded-lg border-2 border-accent text-accent font-medium"
            : "inline-block px-6 py-3 rounded-lg bg-accent text-white font-medium";
        return (
          <section className={`${SECTION_PX} py-6 md:py-8 flex justify-center md:justify-start`}>
            <a
              href={href || "#"}
              className={`${className} w-full sm:w-auto min-w-[200px] max-w-md text-center px-8`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {label}
            </a>
          </section>
        );
      },
    },
    Divider: {
      label: "מפריד",
      fields: {},
      render: () => (
        <section className={`${SECTION_PX} py-4`}>
          <hr className="border-border/80" />
        </section>
      ),
    },
    ContactRow: {
      label: "פרטי קשר",
      fields: {
        title: { type: "text", label: "כותרת (אופציונלי)" },
        phone: { type: "text", label: "טלפון" },
        email: { type: "text", label: "אימייל" },
        address: { type: "textarea", label: "כתובת" },
        mapsUrl: { type: "text", label: "קישור למפות" },
        variant: {
          type: "select",
          label: "עיצוב",
          options: [
            { label: "פוטר מלא", value: "footer" },
            { label: "כרטיס", value: "card" },
          ],
        },
      },
      defaultProps: {
        title: "יצירת קשר",
        phone: "",
        email: "",
        address: "",
        mapsUrl: "",
        variant: "footer",
      },
      render: ({ title, phone, email, address, mapsUrl, variant }) => {
        const isFooter = variant === "footer";
        const linkClass = isFooter
          ? "underline font-medium"
          : "text-accent font-medium";
        const rowClass = isFooter ? "text-background/90" : "";

        return (
          <section
            className={
              isFooter
                ? `mt-8 ${SECTION_PX} py-10 md:py-12 bg-foreground text-background`
                : `${SECTION_PX} py-6`
            }
          >
            <div
              className={
                isFooter
                  ? "space-y-5 text-center md:text-right"
                  : "rounded-xl border border-border bg-surface p-6 md:p-8 space-y-3 text-right w-full max-w-3xl md:max-w-4xl"
              }
            >
              {title ? (
                <p
                  className={`font-semibold text-lg md:text-xl ${isFooter ? "text-background" : "text-foreground"}`}
                >
                  {title}
                </p>
              ) : null}
              {phone || email ? (
                <div
                  className={
                    isFooter
                      ? "grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-8"
                      : "space-y-3"
                  }
                >
                  {phone ? (
                    <p className={rowClass}>
                      <span className="font-medium opacity-80">טלפון · </span>
                      <a href={`tel:${phone}`} className={linkClass}>
                        {phone}
                      </a>
                    </p>
                  ) : null}
                  {email ? (
                    <p className={rowClass}>
                      <span className="font-medium opacity-80">אימייל · </span>
                      <a href={`mailto:${email}`} className={linkClass}>
                        {email}
                      </a>
                    </p>
                  ) : null}
                </div>
              ) : null}
              {address ? (
                <p
                  className={`whitespace-pre-wrap ${isFooter ? "text-background/80 text-sm md:text-base" : "text-muted-foreground text-sm"}`}
                >
                  {address}
                </p>
              ) : null}
              {mapsUrl ? (
                <p className="pt-1">
                  <a
                    href={mapsUrl}
                    className={
                      isFooter
                        ? "inline-block mt-2 px-5 py-2.5 rounded-lg bg-background text-foreground text-sm font-medium"
                        : "text-accent underline text-sm"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    פתיחה במפות
                  </a>
                </p>
              ) : null}
            </div>
          </section>
        );
      },
    },
};

function buildInfoPageConfig(
  rootRender: (props: { children: React.ReactNode }) => React.ReactElement
): Config {
  return {
    root: {
      fields: rootFields,
      render: rootRender,
    },
    categories: componentCategories,
    components: infoPageComponents,
  };
}

/** Editor: full-width page inside preview iframe */
export const puckConfig = buildInfoPageConfig(({ children }) => (
  <div className={INFO_PAGE_EDITOR_ROOT_OUTER}>
    <div className={INFO_PAGE_EDITOR_ROOT_INNER}>{children}</div>
  </div>
));

/** Public guest page: edge-to-edge on desktop */
export const publicPuckConfig = buildInfoPageConfig(({ children }) => (
  <div className={INFO_PAGE_PUBLIC_ROOT_CLASS}>{children}</div>
));
