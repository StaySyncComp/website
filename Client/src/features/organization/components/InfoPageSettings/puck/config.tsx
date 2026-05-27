import type { Config } from "@measured/puck";

export const emptyPuckData = {
  content: [],
  root: { props: { title: "" } },
};

export const puckConfig: Config = {
  root: {
    fields: {
      title: { type: "text", label: "כותרת עמוד (SEO)" },
    },
    render: ({ children }) => (
      <div className="min-h-screen bg-background text-foreground">{children}</div>
    ),
  },
  categories: {
    content: {
      title: "תוכן",
      components: ["Hero", "Heading", "Text", "Image", "ButtonLink", "Divider", "ContactRow"],
    },
  },
  components: {
    Hero: {
      label: "כותרת ראשית",
      fields: {
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
        title: "ברוכים הבאים",
        subtitle: "",
        align: "center",
      },
      render: ({ title, subtitle, align }) => {
        const alignClass =
          align === "left"
            ? "text-left"
            : align === "right"
              ? "text-right"
              : "text-center";
        return (
          <section
            className={`px-6 py-12 md:py-16 bg-accent/10 ${alignClass}`}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              {title}
            </h1>
            {subtitle ? (
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto whitespace-pre-wrap">
                {subtitle}
              </p>
            ) : null}
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
          <section className="px-6 py-4">
            <Tag className={`font-semibold ${size}`}>{text}</Tag>
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
        <section className="px-6 py-4">
          <p className="text-base md:text-lg leading-relaxed whitespace-pre-wrap text-foreground/90">
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
        <section className="px-6 py-4">
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
            <div className="h-40 bg-muted rounded-xl flex items-center justify-center text-muted-foreground text-sm">
              הוסף קישור לתמונה
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
          <section className="px-6 py-4 flex justify-center">
            <a href={href || "#"} className={className} target="_blank" rel="noopener noreferrer">
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
        <section className="px-6 py-2">
          <hr className="border-border" />
        </section>
      ),
    },
    ContactRow: {
      label: "פרטי קשר",
      fields: {
        phone: { type: "text", label: "טלפון" },
        email: { type: "text", label: "אימייל" },
        address: { type: "textarea", label: "כתובת" },
        mapsUrl: { type: "text", label: "קישור למפות" },
      },
      defaultProps: {
        phone: "",
        email: "",
        address: "",
        mapsUrl: "",
      },
      render: ({ phone, email, address, mapsUrl }) => (
        <section className="px-6 py-8 bg-surface rounded-none">
          <div className="max-w-xl mx-auto space-y-3 text-center md:text-right">
            {phone ? (
              <p>
                <span className="font-medium">טלפון: </span>
                <a href={`tel:${phone}`} className="text-accent">
                  {phone}
                </a>
              </p>
            ) : null}
            {email ? (
              <p>
                <span className="font-medium">אימייל: </span>
                <a href={`mailto:${email}`} className="text-accent">
                  {email}
                </a>
              </p>
            ) : null}
            {address ? (
              <p className="whitespace-pre-wrap">
                <span className="font-medium">כתובת: </span>
                {address}
              </p>
            ) : null}
            {mapsUrl ? (
              <p>
                <a
                  href={mapsUrl}
                  className="text-accent underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  פתיחה במפות
                </a>
              </p>
            ) : null}
          </div>
        </section>
      ),
    },
  },
};
