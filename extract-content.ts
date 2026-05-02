import fs from "fs";
import { company } from "./packages/content/src/company";
import {
  trustPoints,
  whyChoose,
  servicesCopy,
  serviceCardCopy,
  areasWeCover,
  hero,
  about,
  ctas,
  ctaBanner,
} from "./packages/content/src/copy";
import { services } from "./packages/content/src/services";

const markdown = `
# TPPS Landscapes - Content Review

## 1. Company Identity

**Name:** 
${company.name}

**Short Name:** 
${company.shortName}

**Description (Short):** 
${company.description.short}

**Description (Long):** 
${company.description.long}

## 2. Contact & Location

**Email:** 
${company.contact.email}

**Phone:** 
${company.contact.phone}

**Area:** 
${company.location.area}

**Towns:** 
${company.location.towns.join(", ")}

### Areas We Cover Marketing Text

**Heading:** 
${areasWeCover.heading}

**Primary Towns:** 
${areasWeCover.primary.join(", ")}

**Full Sentence:** 
${areasWeCover.fullSentence}

**Marketing Description:** 
${areasWeCover.marketingDescription}

**Additional Text:** 
${areasWeCover.additionalText}

## 3. Trust Points (Badges/Bullets)

${trustPoints.map((t) => `- ${t}`).join("\n")}

## 4. Hero Sections

**Eyebrow:** 
${hero.eyebrow}

**Company Name:** 
${hero.companyName}

**Tagline:** 
${hero.tagline}

**Intro Variation (Default):**

- Heading: ${hero.intro.heading}
- Body: ${hero.intro.body}
- CTA: ${hero.intro.cta}

**Intro Variation (Option 1):**

- Heading: ${hero.options.option1.heading}
- Body: ${hero.options.option1.body}
- CTA: ${hero.options.option1.cta}

**Intro Variation (Option 2):**

- Heading: ${hero.options.option2.heading}
- Body: ${hero.options.option2.body}
- CTA: ${hero.options.option2.cta}

**Intro Variation (Option 3):**

- Heading: ${hero.options.option3.heading}
- Body: ${hero.options.option3.body}
- CTA: ${hero.options.option3.cta}

## 5. About Section

**Short:** 
${about.short}

**Full:** 
${about.full}

**Closing:** 
${about.closing}

## 6. Calls To Action

**Primary:** 
${ctas.primary}

**Secondary:** 
${ctas.secondary}

**Planning:** 
${ctas.planning}

**Areas:** 
${ctas.areas}

**Open:** 
${ctas.open}

**Banner Subtitle:** 
${ctaBanner.subtitle}

## 7. Why Choose Us Section

**Heading:** 
${whyChoose.heading}

**Subtitle:** 
${whyChoose.subtitle}

**Points:**

${whyChoose.points.map((p) => `- ${p}`).join("\n")}

*Featured Project:*

- Badge: ${whyChoose.featuredProject.badge}
- Title: ${whyChoose.featuredProject.title}
- Description: ${whyChoose.featuredProject.description}

## 8. Services Overview (Main Page)

**Heading:** 
${servicesCopy.heading}

**Subtitle:** 
${servicesCopy.subtitle}

**Additional Services Label:** 
${servicesCopy.additionalServicesLabel}

## 9. Individual Service Capabilities & Copy

${services
  .map((s) => {
    const copy = serviceCardCopy[s.id] || { heading: s.name, short: s.description, full: "N/A" };
    const pNote = Array.isArray(s.pricing)
      ? s.pricing
          .map((p) => "£" + p.min + "-£" + p.max + " " + p.unit + " (" + (p.notes || "") + ")")
          .join(", ")
      : "N/A";
    return (
      "### " +
      s.name +
      " (Live: " +
      s.live +
      ")\n\n" +
      "**Marketing Heading:** \n" +
      copy.heading +
      "\n\n" +
      "**Short Description:** \n" +
      copy.short +
      "\n\n" +
      "**Full Text:** \n" +
      copy.full +
      "\n\n" +
      "**Pricing Note:** \n" +
      pNote +
      "\n\n"
    );
  })
  .join("\n")}
`;

fs.writeFileSync("CONTENT_REVIEW.md", markdown);
console.log(
  "Successfully retrieved ALL marketing blocks and wrote CONTENT_REVIEW.md with newlines",
);
