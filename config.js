// config.js
const fs = require("fs");
const path = require("path");

function toDataUrl(filePath) {
  if (!filePath) return "";
  const abs = path.resolve(__dirname, filePath);
  if (!fs.existsSync(abs)) return "";
  const mime = "image/png";
  const data = fs.readFileSync(abs).toString("base64");
  return `data:${mime};base64,${data}`;
}

function dataUrlFromFont(filePath) {
  const abs = path.resolve(__dirname, filePath);
  if (!fs.existsSync(abs)) return "";
  const ext = path.extname(abs).toLowerCase();
  const mime = ext === ".otf" ? "font/otf" : "font/ttf";
  const data = fs.readFileSync(abs).toString("base64");
  return `data:${mime};base64,${data}`;
}

// Load your logos from assets and convert to data URLs
const logoDataUrl = toDataUrl("./assets/logo.png");

const dmSansSemiBold = dataUrlFromFont("./assets/DMSans-SemiBold.ttf");
const tiltWarpRegular = dataUrlFromFont("./assets/TiltWarp-Regular.ttf");

const fontCss = `
 @font-face {
        font-family: "DMSans-SemiBold";
        src: url('${dmSansSemiBold}') format("truetype");
        font-weight: normal;
        font-style: normal;
      }

      @font-face {
        font-family: "TiltWarp";
        src: url('${tiltWarpRegular}') format("truetype");
        font-weight: normal;
        font-style: normal;
      }

      *,
      body {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: "DM Sans", sans-serif;
      }
`;

module.exports = {
  // PDF layout settings
  pdf: {
    format: "A4",
    printBackground: true,
    margin: {
      top: "0",
      right: "40px",
      left: "40px",
      bottom: "0",
    },
    height: 793,
    width: 1123,
    logoDataUrl: logoDataUrl,
  },
  // Optional global CSS injected into the page
  css:
    fontCss +
    `
      *,
      body {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: "DM Sans", sans-serif;
      }

      /* Main Container */
      .container {
        margin: 0 auto;
        background-color: white;
        display: flex;
        flex-direction: column;
      }

      /* Content Wrapper */
      .content {
        flex: 1;
        padding: 40px;
      }

      /* Title Section */
      .title-section {
        text-align: center;
        margin-bottom: 32px;
      }

      .title {
        font-size: 28px;
        font-weight: normal;
        color: #0055a8;
        margin-bottom: 8px;
        font-family: "TiltWarp";
      }

      .subtitle {
        color: #4c4c4c;
        text-align: center;
        leading-trim: both;

        text-edge: cap;
        font-family: "DM Sans";
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 128.086%;
      }

      /* Information Header */
      .info-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #d4e6f1;
        padding: 12px 16px;

        border-radius: 6px 6px 0 0;
        font-size: 13px;
        font-weight: 600;
        color: #333;

        border: 1px solid #ccdded;
        background: #edf8fd;
      }

      /* Form Rows */
      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;
        margin-bottom: 16px;
        margin-left: 16px;
        margin-right: 16px;
        padding: 16px;
        border-radius: 4px;
        border: 1px solid #ccdded;
      }

      .form-row.full {
        grid-template-columns: 1fr;
      }

      .form-row.three-col {
        grid-template-columns: 1fr 1fr 1fr;
        gap: 16px;
      }

      /* Form Field */
      .form-field {
        display: flex;
        flex-direction: column;
      }

      .form-field.inline {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 12px;
      }

      .form-label {
        font-size: 11px;
        color: #333;
        font-weight: 500;
      }

      .form-field.inline .form-label {
        margin-bottom: 0;
        min-width: 140px;
        width: 50%;
      }

      .form-value {
        color: #141414;
        leading-trim: both;

        text-edge: cap;
        font-family: "DM Sans";
        font-size: 11px;
        font-style: normal;
        font-weight: 600;
      }

      .form-field.inline .form-value {
        flex: 1;
        width: 50%;
      }

      .form-field.inline .form-value div:not(:first-child) {
        flex: 1;
        width: 50%;
        margin-top: 12px !important;
      }

      .date-of-submission {
        color: #4c4c4c;

        font-family: "DM Sans";
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 120%;
      }

      .content-container {
        background: #fff;
      }

      .info-content {
        border-radius: 0 0 6px 6px;
        border: 1px solid #ededed;
        border-top: none;

        background: #fff;
        padding-top: 24px;
      }
  `,
  // Optional: path to assets if you need in code
  assetsPath: path.join(__dirname, "assets"),
};
