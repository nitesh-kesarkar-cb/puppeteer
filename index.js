// index.js (update the buildHtml function and usage)

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

// Load HTML content from assets/stage-A-report.html
async function loadMainHtml() {
    const htmlPath = path.resolve(__dirname, 'assets', 'stage-A-report.html');
    if (!fs.existsSync(htmlPath)) {
        throw new Error(`Main HTML not found at ${htmlPath}`);
    }
    // Read the HTML as a string. If your HTML references relative CSS/JS,
    // ensure those assets are accessible (you may inline CSS if needed).
    return fs.readFileSync(htmlPath, 'utf8');
}

async function generatePdf() {
    const reportsDir = await ensureReportsDir();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputPath = path.join(reportsDir, `report-${timestamp}.pdf`);

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    try {
        const page = await browser.newPage();

        // Load main HTML content from file
        const mainHtml = await loadMainHtml();

        // Inject any additional CSS if needed
        const fullHtml = `
      <html>
        <head>
          <meta charset="utf-8" />
          <style>${config.css || ''}</style>
        </head>
        <body style="margin:0; padding:0;">
          ${mainHtml}
        </body>
      </html>
    `;

        await page.setContent(fullHtml, { waitUntil: 'networkidle0' });


        await page.setViewport({ width: config.pdf.width, height: config.pdf.height });

        // Ensure print CSS is respected
        await page.emulateMediaType('print');

        // Prepare header/footer templates
        const headerTemplate = `<div  style="
            background: #c9e3e3;
            border-bottom: 1px solid #dbeaea;
            padding: 6px 0;border: 1px solid red;">
            <div style="padding: 0 12px;
            display: flex;
            align-items: center;
            gap: 6px; border: 1px solid red;">
          <span style=" height: 26px;
            width: auto;
            display: block;">
              <img src="${config.header.logoDataUrl}"  style="height: 40px" />
          </span>
      </div>`

        const footerTemplate = `<div style="border: 1px solid red;"> <div><span><b>Powered by</b></span> <img src="${config.footer.footerLogoDataUrl}"  style="height: 20px; border: 1px solid red;" /></div>`;

        // console.log('=========================');
        // console.log('headerTemplate', headerTemplate);
        // console.log('=========================');
        // console.log('footerTemplate', footerTemplate);
        // console.log('=========================');
        // console.log('fullHtml', fullHtml);

        // console.log('=========================');
        // Generate PDF with header/footer and the configured margins
        const pdfBuffer = await page.pdf({
            ...config.pdf,
            displayHeaderFooter: true,
            headerTemplate: headerTemplate,
            footerTemplate: footerTemplate
        });

        // Save PDF
        fs.writeFileSync(outputPath, pdfBuffer);
        console.log(`PDF generated: ${outputPath} `);
    } catch (err) {
        console.error('Error generating PDF:', err);
    } finally {
        await browser.close();
    }
}

// Run on startup
generatePdf();
