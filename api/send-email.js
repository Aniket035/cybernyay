import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.hostinger.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '465', 10);
const SMTP_SECURE = process.env.SMTP_SECURE !== 'false';
const SMTP_USER = process.env.SMTP_USER || 'help@cybernyaysolution.com';
const SMTP_PASS = process.env.SMTP_PASS || 'Jaylal@4321';

const PRIMARY_EMAIL = process.env.PRIMARY_INTAKE_EMAIL || 'help@cybernyaysolution.com';
const SECONDARY_EMAIL = process.env.SECONDARY_INTAKE_EMAIL || 'jaylalkushwaha5@gmail.com';

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const leadData = req.body || {};
    if (!leadData.fullName || !leadData.phone) {
      return res.status(400).json({ success: false, error: 'Full name and calling phone number are required.' });
    }

    const refId = leadData.referenceId || 'CNY-' + Math.floor(100000 + Math.random() * 900000);
    const timestamp = leadData.timestamp || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    const clientName = (leadData.fullName || 'Client Inquiry').trim();
    const subject = `Client Consultation Dossier #${refId} - ${clientName}`;

    const safePhone = String(leadData.phone || '').trim();
    const safeWhatsapp = String(leadData.whatsapp || safePhone).trim();
    const rawWaDigits = safeWhatsapp.replace(/\D/g, '');
    const waLinkDigits = rawWaDigits.startsWith('91') && rawWaDigits.length === 12 ? rawWaDigits : `91${rawWaDigits}`;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 20px; color: #0f172a; }
    .container { max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }
    .header { background: linear-gradient(135deg, #0a1128 0%, #001f54 100%); color: #ffffff; padding: 28px 32px; border-bottom: 3px solid #00a8e8; }
    .header h1 { margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
    .header p { margin: 4px 0 0; font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }
    .badge { display: inline-block; background: #0284c7; color: #ffffff; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 6px; margin-top: 12px; }
    .content { padding: 32px; }
    .section-title { font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #475569; margin: 24px 0 12px; border-bottom: 2px solid #f1f5f9; padding-bottom: 6px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
    .info-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px 16px; }
    .info-label { font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase; margin-bottom: 3px; }
    .info-value { font-size: 14px; font-weight: 700; color: #0f172a; word-break: break-word; }
    .info-value-highlight { font-size: 16px; font-weight: 800; color: #0284c7; }
    .narrative-box { background: #f8fafc; border-left: 4px solid #001f54; border-radius: 4px; padding: 16px; margin: 16px 0; font-size: 13px; line-height: 1.6; color: #334155; }
    .evidence-badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; margin-right: 6px; margin-bottom: 6px; }
    .evidence-yes { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }
    .evidence-no { background: #f1f5f9; color: #94a3b8; }
    .cta-button { display: inline-block; background: #2563eb; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 13px; padding: 12px 24px; border-radius: 8px; margin-top: 16px; }
    .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 32px; font-size: 11px; color: #64748b; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>CYBERNYAY SOLUTION PRIVATE LIMITED</h1>
      <p>Official Intake Dossier & Client Inquiry</p>
      <div class="badge">CONSULTATION DOSSIER • REF: ${refId}</div>
    </div>
    
    <div class="content">
      <div class="section-title">1. Complainant Information</div>
      <div class="grid">
        <div class="info-box">
          <div class="info-label">Full Name</div>
          <div class="info-value">${leadData.fullName || 'Not specified'}</div>
        </div>
        <div class="info-box">
          <div class="info-label">Calling Phone</div>
          <div class="info-value"><a href="tel:${safePhone}" style="color: #0284c7; text-decoration: none;">${safePhone || 'N/A'}</a></div>
        </div>
      </div>
      <div class="grid">
        <div class="info-box">
          <div class="info-label">WhatsApp Number</div>
          <div class="info-value"><a href="https://wa.me/${waLinkDigits}" style="color: #16a34a; text-decoration: none;">${safeWhatsapp || 'N/A'}</a></div>
        </div>
        <div class="info-box">
          <div class="info-label">Email Address</div>
          <div class="info-value">${leadData.email || 'Not provided'}</div>
        </div>
      </div>
      <div class="info-box">
        <div class="info-label">Location / City</div>
        <div class="info-value">${leadData.cityState || 'Not specified'}</div>
      </div>

      <div class="section-title">2. Incident & Fraud Particulars</div>
      <div class="grid">
        <div class="info-box">
          <div class="info-label">Scam / Case Category</div>
          <div class="info-value" style="color: #b91c1c;">${leadData.scamType || 'Cyber Fraud'}</div>
        </div>
        <div class="info-box">
          <div class="info-label">Disputed / Extorted Amount</div>
          <div class="info-value-highlight">₹${Number(leadData.amountLost || 0).toLocaleString('en-IN')}</div>
        </div>
      </div>
      <div class="grid">
        <div class="info-box">
          <div class="info-label">Timeline / Occurrence</div>
          <div class="info-value">${leadData.incidentTimeline || 'Recent'}</div>
        </div>
        <div class="info-box">
          <div class="info-label">Urgency Level</div>
          <div class="info-value" style="color: #ea580c;">${leadData.urgency || 'High'}</div>
        </div>
      </div>
      <div class="info-box">
        <div class="info-label">Accused App / Website / Entity</div>
        <div class="info-value">${leadData.entityName || 'Not specified'}</div>
      </div>

      <div class="section-title">3. Brief Narrative of Incident</div>
      <div class="narrative-box">
        ${(leadData.description || 'No detailed incident description provided.').replace(/\n/g, '<br>')}
      </div>

      <div class="section-title">4. Evidence Preserved by Client</div>
      <div>
        <span class="evidence-badge ${leadData.hasScreenshots ? 'evidence-yes' : 'evidence-no'}">
          ${leadData.hasScreenshots ? '✓' : '✗'} Chat / WhatsApp Screenshots
        </span>
        <span class="evidence-badge ${leadData.hasBankStatements ? 'evidence-yes' : 'evidence-no'}">
          ${leadData.hasBankStatements ? '✓' : '✗'} Bank Statement / UTR Slips
        </span>
        <span class="evidence-badge ${leadData.hasCallRecordings ? 'evidence-yes' : 'evidence-no'}">
          ${leadData.hasCallRecordings ? '✓' : '✗'} Call Recordings
        </span>
      </div>

      <div style="text-align: center; margin-top: 24px;">
        <a href="https://wa.me/${waLinkDigits}" class="cta-button">Initiate WhatsApp Consultation with Client</a>
      </div>
    </div>

    <div class="footer">
      This dossier was generated by CyberNyay Solution Private Limited Web Intake Desk.<br>
      Transmission Time: ${timestamp} | Dossier ID: ${refId}
    </div>
  </div>
</body>
</html>
    `;

    const textContent = `
CYBERNYAY SOLUTION PRIVATE LIMITED - CASE INTAKE DOSSIER
Reference ID: ${refId}
Timestamp: ${timestamp}

Complainant: ${leadData.fullName}
Calling Phone: ${safePhone}
WhatsApp: ${safeWhatsapp}
Email: ${leadData.email || 'N/A'}
Location: ${leadData.cityState || 'N/A'}

Category: ${leadData.scamType || 'Cyber Fraud'}
Amount Disputed: ₹${leadData.amountLost || '0'}
Timeline: ${leadData.incidentTimeline || 'N/A'}
Urgency: ${leadData.urgency || 'High'}
App/Entity: ${leadData.entityName || 'N/A'}

Description:
${leadData.description || 'None provided'}

Evidence Preserved:
- Screenshots: ${leadData.hasScreenshots ? 'YES' : 'NO'}
- Bank Statements: ${leadData.hasBankStatements ? 'YES' : 'NO'}
- Call Recordings: ${leadData.hasCallRecordings ? 'YES' : 'NO'}
    `;

    const mailOptions = {
      from: `"CyberNyay Web Desk" <${SMTP_USER}>`,
      to: [PRIMARY_EMAIL, SECONDARY_EMAIL],
      subject: subject,
      text: textContent,
      html: htmlContent,
      replyTo: leadData.email && leadData.email.includes('@') ? leadData.email : SMTP_USER,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Hostinger SMTP] Email sent successfully. MessageId: ${info.messageId}`);

    return res.status(200).json({
      success: true,
      messageId: info.messageId,
      referenceId: refId,
    });
  } catch (error) {
    console.error('[Hostinger SMTP] Dispatch error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to dispatch email via Hostinger SMTP',
    });
  }
}