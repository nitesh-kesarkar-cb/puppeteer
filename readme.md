# PDF Report Generator with Puppeteer

A small Node.js utility to generate PDFs from an HTML template with dynamic data placeholders. The workflow reads a stage HTML template, injects mock or real data, renders the final HTML in a headless browser, and outputs a PDF. Includes support for fonts embedded via data URLs and configurable header/footer.

---

## Prerequisites

- Node.js (LTS version recommended)
- npm

---

## Project Structure

- index.js — Main entry that builds HTML, renders, and generates PDF
- config.js — Central configuration (paths, sizes, fonts, header/footer assets)
- assets/
  - stage-A-report.html — HTML template with placeholders (e.g., {PatientID}, {ReportDate}, etc.)
  - stage-A-report.css (optional)
- utils/
  - renderTemplate.js — Lightweight placeholder replacer
- reports/ — Output directory for generated PDFs (created at runtime)
- fonts/ (optional) — If you choose to manage fonts directly

---

## Data Templating

The HTML template uses placeholders in the form of {Key} (e.g., {PatientID}, {ReportDate}). At runtime, these placeholders are replaced with actual values.

- Simple replacement approach: renderTemplate(html, data)
- Data object shape is a mapping of placeholder keys to string values.

Example data structure (JSON):

```json
{
  "PatientID": "ABC12345",
  "ReportDate": "21-Oct-2025",
  "CurrentWeight": "70.00",
  "Height": "172.00",
  "WeightOneMonthAgo": "80.00",
  "WeightSixMonthsAgo": "-",
  "WeightInTwoWeeks": "not changed",
  "WeightInTwoWeeksScore": "0",
  "WeightLossResult": "12.5",
  "WeightLossPoint": "4",
  "foodIntake_desc": "Little solid food",
  "foodIntake_desc_1": "Less than usual",
  "foodIntake_score_sum": "3",
  "symptoms_desc": "No problems eating",
  "symptoms_score": "0",
  "activity_desc": "not feeling up to most things, but in bed or chair less than half the day",
  "activity_score": "2",
  "TotalScore": "13",
  "Interpretation": "A score ≥ 9 indicates a high risk of malnutrition with urgent need for nutritionintervention.",
  "TriageScore": "9",
  "TriageText": "Indicates a critical need for improved symptom management and/or nutrient intervention options."
}
```

---

## Installation

1. Clone the repository or create your project directory.
2. Install dependencies.

Using npm:

```bash
npm install
```

---

## Usage

1. Create or edit your data object with the values you want to render.
2. Run the script to generate a PDF:

```bash
node index.js
```

3. The script will:
   - Load assets/stage-A-report.html
   - Render placeholders with provided data
   - Inject CSS from config.css
   - Render PDF with header/footer templates
   - Save to reports/report-<timestamp>.pdf

---

## Configuration

Open config.js to adjust:

- pdf: { width, height, margin, printBackground, etc. } — Puppeteer PDF options
- header and footer: image data URLs for branding
- css: global CSS to inject into the final HTML
- header/logoDataUrl and footer/footerLogoDataUrl
- stage HTML path (if you change templates)

Example snippet (config.js):

```js
module.exports = {
  pdf: {
    width: 1024,
    height: 1400,
    marginTop: "20mm",
    marginBottom: "20mm",
    marginLeft: "15mm",
    marginRight: "15mm",
    printBackground: true,
  },
  css: `
    /* Your global CSS here, e.g., font-face declarations if inlined */
  `,
  header: {
    logoDataUrl: "data:image/png;base64,...",
  },
  footer: {
    footerLogoDataUrl: "data:image/png;base64,...",
  },
};
```

---

## Rendering Flow (Summary)

- Read HTML template from assets/stage-A-report.html
- Build final HTML by replacing placeholders with data (renderTemplate)
- Wrap final HTML with <html><head> to inject CSS
- Load into Puppeteer page via page.setContent
- Set viewport and emulate print media
- Generate PDF with headerTemplate and footerTemplate
- Write PDF to disk in reports/

---

## PDF Options

- Header/Footer:
  - headerTemplate and footerTemplate are inline HTML strings
  - Adjust height, styling, and logo via config
- Margins and sizes:
  - Tune in config.pdf (width, height, margins)
- printBackground:
  - Ensure backgrounds and borders render; set to true if needed

---

## Font Embedding (Optional)

If you want to embed fonts directly:

- Convert font files to base64 data URLs
- Define @font-face in the injected CSS (config.css)
- Use font-family: 'YourFontName' in final HTML

Example (inlined in config.css):

```css
@font-face {
  font-family: "Dinamit";
  src: url("data:font/opentype;base64,...") format("opentype");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
/* ... */
body {
  font-family: "Dinamit", Arial, sans-serif;
}
```
