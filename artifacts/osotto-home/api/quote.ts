type Payload = Record<string, string | string[] | undefined>;

function asText(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value.join(', ') : (value || '').trim();
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[char] as string));
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'E-posta servisi henüz yapılandırılmadı.' });
  }

  const body = (req.body || {}) as Payload & { type?: string };
  const type = body.type === 'dealer' ? 'dealer' : body.type === 'quote' ? 'quote' : '';
  if (!type) return res.status(400).json({ error: 'Geçersiz form türü.' });

  const name = asText(body.name);
  const company = asText(body.company);
  const email = asText(body.email);
  const phone = asText(body.phone);
  if (!name || !company || !email || !phone || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Lütfen zorunlu alanları doğru şekilde doldurun.' });
  }

  const subject = type === 'dealer'
    ? `OSOTTO Bayilik Başvurusu — ${company}`
    : `OSOTTO Teklif Talebi — ${company}`;

  const labels: Record<string, string> = {
    name: 'Ad Soyad', company: 'Firma', email: 'E-posta', phone: 'Telefon',
    country: 'Ülke', city: 'Şehir', website: 'Web sitesi', instagram: 'Instagram / sosyal medya',
    businessType: 'İşletme türü', channels: 'Satış kanalları', dealerProducts: 'İlgilenilen ürünler',
    monthly: 'Tahmini aylık alım', productIds: 'Ürün kodları', weights: 'Ürün ağırlıkları',
    quantity: 'Talep edilen adet', message: 'Mesaj',
  };
  const rows = Object.entries(body)
    .filter(([key, value]) => key !== 'type' && value !== undefined && value !== '')
    .map(([key, value]) => {
      const label = labels[key] || key;
      const text = asText(value as string | string[] | undefined) || 'Belirtilmedi';
      return `<tr><th align="left" style="padding:8px;border-bottom:1px solid #eee;background:#f7f5f1">${escapeHtml(label)}</th><td style="padding:8px;border-bottom:1px solid #eee">${escapeHtml(text).replace(/\n/g, '<br>')}</td></tr>`;
    }).join('');

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'OSOTTO Website <onboarding@resend.dev>',
        to: ['bilalsoyler9@gmail.com'],
        reply_to: email,
        subject,
        html: `<div style="font-family:Arial,sans-serif;color:#2b241f"><h2>${escapeHtml(subject)}</h2><table style="border-collapse:collapse;width:100%">${rows}</table><p style="font-size:12px;color:#777">OSOTTO web sitesi formundan gönderildi.</p></div>`,
      }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error('Resend error', result);
      return res.status(502).json({ error: 'E-posta gönderilemedi. Lütfen biraz sonra tekrar deneyin.' });
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Email request failed', error);
    return res.status(500).json({ error: 'E-posta gönderimi sırasında hata oluştu.' });
  }
}
