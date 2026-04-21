import puppeteer from 'puppeteer';

const generateFromHtml = async (html: string): Promise<Buffer> => {
  const browser = await puppeteer.launch({
    headless: true,
  });

  try {
    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: 'networkidle0',
    });

    const pdfUint8Array = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px',
      },
    });

    return Buffer.from(pdfUint8Array);
  } finally {
    await browser.close();
  }
};

export const PdfService = {
  generateFromHtml,
};