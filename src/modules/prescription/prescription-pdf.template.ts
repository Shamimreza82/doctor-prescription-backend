import { TPrescriptionPrintData } from './prescription.types';

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const generateHtml = (data: TPrescriptionPrintData) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Prescription ${escapeHtml(data.prescriptionNo)}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 24px;
          color: #222;
          font-size: 14px;
        }

        .header {
          border-bottom: 2px solid #333;
          padding-bottom: 12px;
          margin-bottom: 20px;
        }

        .title {
          text-align: center;
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 8px;
        }

        .section {
          margin-bottom: 18px;
        }

        .row {
          margin-bottom: 6px;
        }

        .label {
          font-weight: bold;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }

        th, td {
          border: 1px solid #ccc;
          padding: 8px;
          text-align: left;
          vertical-align: top;
        }

        th {
          background: #f3f3f3;
        }

        .footer {
          margin-top: 40px;
          display: flex;
          justify-content: space-between;
        }

        .signature {
          margin-top: 50px;
          text-align: right;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="title">Prescription</div>
        <div class="row"><span class="label">Prescription No:</span> ${escapeHtml(data.prescriptionNo)}</div>
        <div class="row"><span class="label">Issued At:</span> ${escapeHtml(data.issuedAt)}</div>
      </div>

      <div class="section">
        <div class="row"><span class="label">Patient:</span> ${escapeHtml(data.patient.name)}</div>
        <div class="row"><span class="label">Age:</span> ${data.patient.age}</div>
        <div class="row"><span class="label">Gender:</span> ${escapeHtml(data.patient.gender)}</div>
        <div class="row"><span class="label">Phone:</span> ${escapeHtml(data.patient.phone ?? '')}</div>
      </div>

      <div class="section">
        <div class="row"><span class="label">Doctor:</span> ${escapeHtml(data.doctor.name)}</div>
        <div class="row"><span class="label">Designation:</span> ${escapeHtml(data.doctor.designation ?? '')}</div>
        <div class="row"><span class="label">Registration No:</span> ${escapeHtml(data.doctor.registrationNo ?? '')}</div>
      </div>

      <div class="section">
        <div class="row"><span class="label">Diagnosis:</span> ${escapeHtml(data.diagnosis ?? '')}</div>
      </div>

      <div class="section">
        <div class="label">Medicines</div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Strength</th>
              <th>Dosage</th>
              <th>Duration</th>
              <th>Instructions</th>
            </tr>
          </thead>
          <tbody>
            ${data.medicines
              .map(
                (m) => `
              <tr>
                <td>${escapeHtml(m.name)}</td>
                <td>${escapeHtml(m.strength ?? '')}</td>
                <td>${escapeHtml(m.dosage)}</td>
                <td>${escapeHtml(m.duration)}</td>
                <td>${escapeHtml(m.instructions ?? '')}</td>
              </tr>
            `,
              )
              .join('')}
          </tbody>
        </table>
      </div>

      <div class="section">
        <div class="label">Advice</div>
        <ul>
          ${(data.advice ?? []).map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
        </ul>
      </div>

      <div class="section">
        <div class="row"><span class="label">Follow Up Date:</span> ${escapeHtml(data.followUpDate ?? '')}</div>
      </div>

      <div class="signature">
        <div>______________________</div>
        <div>${escapeHtml(data.doctor.name)}</div>
      </div>
    </body>
  </html>
  `;
};

export const PrescriptionPdfTemplate = {
  generateHtml,
};
