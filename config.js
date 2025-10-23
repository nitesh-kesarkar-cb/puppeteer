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
const logoDataUrl = toDataUrl("./assets/euro-logo.png");
const footerLogoDataUrl = toDataUrl("./assets/nutricia-logo.png");

const dinamitRegular = dataUrlFromFont("./assets/Dinamit Regular.otf");
const dinamitSemi = dataUrlFromFont("./assets/Dinamit SemiBold.otf");

const fontCss = `
@font-face {
  font-family: 'Dinamit';
  src: url('${dinamitRegular}') format('opentype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Dinamit';
  src: url('${dinamitSemi}') format('opentype');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
body { font-family: 'Dinamit', Arial, sans-serif; }

* {
 line-height: 1.75;
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
            bottom: "70px",
        },
        height: 793,
        width: 1123,
    },
    // Optional global CSS injected into the page
    css:
        fontCss +
        `

    :root {
            --bg: #ffffff;
            --ink: #303030;
            --muted: #6b6b6b;
            --border: #ededed;
            --teal-100: #c9e3e3;
            --teal-50: #ecf3f3;
            --pill-bg: #fff9e9;
            --pill-bd: #f4e1aa;
            --pill-fg: #a87a00;
            --card: #ffffff;
            --note: #f7f7f7;
            --radius: 8px;
            --radius-sm: 6px;
        }


        @page {
            size: A4;
            margin-top: 110px;
            /* MUST match header height */
            margin-bottom: 70px;
            /* Footer space */
        }



        .topbar {
            
        }

        .wrap {
            padding: 0 12px;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .logo img {
            height: 26px;
            width: auto;
            display: block;
        }



        .card {
            background: var(--card);
            border: 1px solid var(--border);
            border-radius: var(--radius);
            overflow: hidden;
            margin: 8px 0;
            page-break-inside: avoid;
        }

        .card-head {
            background: var(--teal-50);
            padding: 6px 10px;
            border-bottom: 1px solid var(--border);
            font-weight: 700;
            font-size: 13.5px;
        }

        .card-body {
            padding: 8px 10px;
            font-size: 13px;
        }

        .kv {
            margin: 4px 0 6px;
        }

        .kv-row {
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .kv .label {
            color: var(--ink);
            font-weight: 600;
        }

        .kv .value {
            font-weight: 700;
        }

        .divider {
            height: 1px;
            background: var(--border);
            margin: 6px 0;
        }

        .note {
            background: var(--note);
            border: 1px solid var(--border);
            border-radius: var(--radius-sm);
            padding: 6px 10px;
            color: var(--muted);
            font-size: 12px;
        }

        p {
            margin: 4px 0 6px;
        }

        ul,
        ol {
            margin: 4px 0 6px 16px;
            padding: 0;
        }

        li {
            margin: 1px 0;
        }

        h4 {
            margin: 6px 0 2px;
            font-size: 13.5px;
            font-weight: 700;
        }

        .muted {
            color: var(--muted);
        }

        .pill {
            display: inline-flex;
            align-items: center;
            padding: 6px 10px;
            border-radius: 6px;
            background: var(--pill-bg);
            border: 1px solid var(--pill-bd);
            color: var(--pill-fg);
            font-weight: 700;
            margin-top: 6px;
            font-size: 13px;
        }

        .subhead {
            font-weight: 700;
            margin: 6px 0 4px;
        }

        .powered {
            display: flex;
            align-items: center;
            gap: 6px;
            color: var(--muted);
            font-size: 12px;
            margin: 10px 0 6px;
            padding-left: 6px;
        }

        .hr-soft {
            height: 1px;
            background: #e3eeee;
            border: 0;
        }

        .b {
            font-weight: 800;
        }
  `,
    // Header HTML (fixed height area that stays at the top)
    header: {
        height: "22px",
        logoDataUrl: logoDataUrl,
    },
    // Footer HTML (page footer with centered text and logo)
    footer: {
        height: "20px",
        footerLogoDataUrl: footerLogoDataUrl,
    },
    // Optional: path to assets if you need in code
    assetsPath: path.join(__dirname, "assets"),
};
