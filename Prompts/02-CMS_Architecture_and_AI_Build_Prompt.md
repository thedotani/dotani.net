# 02: CMS Architecture and Build

I want **fully composable, block-based, CMS-driven pages**, where *everything* (including header, footer, sections, buttons, layouts) is controlled from Sanity — and the frontend just renders what it’s told.

---

## 🧠 Content Architecture (Sanity)

### 1️⃣ Global Configuration (Singleton)

Create a `siteSettings` schema to control:

**Header**

* Logo (image + alt) / Title (text-based if no image-based logo is available)
* Menu builder (repeatable nav items with icon + label + URL)
* CTA buttons (repeatable)
* Header variants (default / compact / transparent)
* Dark / Light mode toggle (boolean)
* Mobile menu behaviour
* Mobile header: menu icon + logo/title + cta + mode-icon
* Mobile Menu: Menu items + social icons + custom copyright text

**Footer**

* Footer columns (repeatable blocks), first column must have custom width option
* Social media links (icon + URL)
* Copyright text
* Optional newsletter block toggle

**Global UI**

* Brand colours (primary, secondary, accent). Body text, headings, accent, buttons, etc etc.
* Typography scale
* Button styles
* Container width
* Global padding presets
* Dark / light mode defaults

---

### 2️⃣ Page Model (Composable Pages)

Create a `page` schema (used for Home, About, etc.) with:

* Page title
* Slug (auto-generated if possible with custom slug editable)
* Page excerpt (2-3 lines)
* **Sections array** (this is the key)
* SEO fields
* Page custom colors scheme (if checked, replace global colors with custom color and custom colors to be picked for body text, headings, buttons, accent, background gradient)

Each page is built by stacking sections dynamically.

---

### 3️⃣ Section System (Block-Based)

Create **individual section schemas** and allow them inside the `sections` array using `of: []`.

Each section must include:

* Section ID (for anchors)
* Visibility toggle
* Padding controls (top/bottom)
* Background options:

  * Solid colour
  * Gradient
  * Background image
  * Background image opacity
* Alignment options
* Optional container width override

---

## 🧩 Required Section Schemas

### 🔹 Hero Section

Fields:

* Eyebrow / small line
* Main heading
* Tagline / subtitle
* Rich text description
* Buttons (repeatable: label + URL + style)
* Hero image (optional)
* Content alignment:

  * content left / image right
  * image left / content right
  * centred (if no image)
* Vertical & horizontal alignment
* Inner padding controls

---

### 🔹 Numbers / Stats Row

Fields:

* Items (repeatable):

  * Number
  * Short label
* Layout options:

  * Inline
  * Grid
* Optional divider
* Optional animation toggle

---

### 🔹 Services Section

Fields:

* Section title
* Section tagline
* Optional header button (label + URL)
* Display mode:

  * Manual select
  * Auto-fetch from `service` schema
* Card layout options

---

### 🔹 Portfolio / Case Studies Section

Fields:

* Section title
* Section tagline
* Optional CTA button
* Manual or auto content
* Card layout variant

---

### 🔹 “Why Me” Section

Fields:

* Heading
* Description
* Bullet points or feature cards
* Optional image
* Layout alignment

---

### 🔹 Profile Highlight Section (Homepage only)

Fields:

* Profile image
* Name
* Short bio
* Highlight points
* Optional CTA

---

### 🔹 Testimonials Section

Fields:

* Section title
* Tagline
* Testimonials source (manual or auto)
* Card style options

Testimonials themselves are a **separate document type**.

---

### 🔹 Final CTA Section

Fields:

* Headline
* Supporting text
* Buttons (repeatable)
* Background options
* Centered or split layout

---

## 📦 Content Types (Documents)

Create separate schemas for:

* `service`
* `portfolio`
* `caseStudy`
* `testimonial`
* `blogPost`
* `tool`

Each should be **content-only**, no layout logic.

---

## 🧱 Frontend Requirements (Astro)

* One Astro component per section type
* Sections rendered dynamically using a switch/map
* No hardcoded copy
* No layout duplication
* Styles scoped per component
* CMS controls everything

Example flow:

Page → sections[] → section type → Astro component → render props

---

## 🚫 What NOT to Do

* No static page layouts
* No hardcoded hero sections
* No duplicated CSS logic
* No “this page is special” exceptions
* No CMS logic in frontend components

---

## 🏁 End Goal

A system where:

* Non-developers can build full pages visually
* Sections are reusable across pages
* Layout changes require **zero code**
* The website scales without refactors

---

END of the cms architecture