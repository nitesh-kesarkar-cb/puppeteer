// index.js
const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');
const config = require('./config');

async function ensureReportsDir() {
  const dir = path.resolve(__dirname, 'reports');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  return dir;
}

async function buildHtml(css) {
  // Simple HTML content for the PDF. You can replace this with dynamic data.
  return `
    <html>
      <head>
        <style>${css}</style>
      </head>
      <body>
        <div class="page-content">
          <h1>Sample Report</h1>
          <p>This is an auto-generated PDF using Puppeteer with configurable CSS, fonts, header, and footer.</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.</p>
          <p>Footer/footer will appear with page numbers if header/footer templates are used.</p>
        </div>
      </body>
    </html>
  `;
}

async function generatePdf() {
  const reportsDir = await ensureReportsDir();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outputPath = path.join(reportsDir, `report-${timestamp}.pdf`);

  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage();

    // Prepare HTML content
    const html = await buildHtml(config.css || '');
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // If you have assets like logo, ensure paths are accessible from PDF context
    // Optional: set viewport to a sensible size
    await page.setViewport({ width: 1220, height: 1800 });

    // Header/Footer templates using Puppeteer supports headerTemplate/footerTemplate
    // Note: They accept HTML strings. If you want images in header/footer, use base64 or data URLs.
    const header = config.header ? config.header.contents : '';
    const footer = config.footer ? config.footer.contents : '';

    // Generate PDF with header/footer
    const pdfBuffer = await page.pdf({
      ...config.pdf,
      headerTemplate: `<div style="font-family: Arial, sans-serif; font-size: 10px; width: 100%; text-align: left;">
                         ${header}
                       </div>`,
      footerTemplate: `<div style="font-family: Arial, sans-serif; font-size: 10px; width: 100%; text-align: center;">
                         ${footer}
                       </div>`,
      displayHeaderFooter: true,
    });

    // Write to file
    fs.writeFileSync(outputPath, pdfBuffer);
    console.log(`PDF generated: ${outputPath}`);
  } catch (err) {
    console.error('Error generating PDF:', err);
  } finally {
    await browser.close();
  }
}

// Run on startup
generatePdf();

