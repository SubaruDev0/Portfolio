import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { name, email, phone, subject, message } = await request.json();

    if (!email || !subject || !message) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_HOST_USER,
        pass: process.env.EMAIL_HOST_PASSWORD,
      },
    });

    const htmlBody = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
        <div style="background: #000; padding: 30px; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -0.5px;">Portfolio Contacto</h1>
        </div>
        <div style="padding: 30px; background: #fff;">
          <h2 style="color: #333; margin-top: 0; font-size: 20px; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">Nuevo mensaje sobre: ${subject}</h2>
          
          <div style="margin: 20px 0;">
            <p style="margin: 5px 0;"><strong style="color: #1a73e8;">De:</strong> ${name || 'N/A'}</p>
            <p style="margin: 5px 0;"><strong style="color: #1a73e8;">Email:</strong> <a href="mailto:${email}" style="color: #1a73e8; text-decoration: none;">${email}</a></p>
            <p style="margin: 5px 0;"><strong style="color: #1a73e8;">Teléfono:</strong> ${phone || 'No proporcionado'}</p>
          </div>

          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; border-left: 4px solid #1a73e8; margin-top: 25px;">
            <p style="margin: 0; white-space: pre-wrap; color: #444; line-height: 1.6;">${message}</p>
          </div>
        </div>
        <div style="background: #f4f4f4; padding: 20px; text-align: center; color: #888; font-size: 12px;">
          Este mensaje fue enviado automáticamente desde el formulario de contacto de tu portfolio.
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"${name || 'Portfolio'}" <${process.env.EMAIL_HOST_USER}>`,
      to: process.env.EMAIL_HOST_USER,
      replyTo: email,
      subject: `📧 [Nuevo Contacto] ${subject}`,
      text: `Nombre: ${name || 'No proporcionado'}\nCorreo: ${email}\nTeléfono: ${phone || 'No proporcionado'}\n\nAsunto: ${subject}\n\nMensaje:\n${message}`,
      html: htmlBody,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error('send-email error', err);
    return new Response(JSON.stringify({ error: 'Failed to send' }), { status: 500 });
  }
}
