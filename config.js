// config.js
module.exports = {
  // PDF layout settings
  pdf: {
    format: 'A4',
    printBackground: true,
    margin: {
      top: '20mm',
      right: '15mm',
      bottom: '20mm',
      left: '15mm'
    },
  },
  // Page CSS (optional). This CSS will be injected into the page before rendering the PDF.
  css: `
    @font-face {
      font-family: 'Inter';
      src: local('Inter'), local('Arial');
    }
    body { font-family: 'Inter', sans-serif; font-size: 12pt; padding: 0; margin: 0; }
    .page-content { padding: 16px; }
  `,
  // Header & footer templates (HTML strings)
  header: {
    height: '40px',
    contents: `
      <div style="font-family: Arial, sans-serif; font-size: 12px; width: 100%; display: flex; align-items: center;">
        <img src="${`${__dirname}/public/logo.png`}" alt="Logo" style="height: 28px; margin-right: 8px;" />
        <div>My Company - Report</div>
      </div>
    `
  },
  footer: {
    height: '40px',
    contents: `
      <div style="font-family: Arial, sans-serif; font-size: 10px; width: 100%; text-align: center;">
        <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
      </div>
    `
  },
  // Public assets (logo) path if you want to externalize it
  assetsPath: `${__dirname}/public`
};
