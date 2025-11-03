export const WelcomeMailer = (welcomeMail, email): string => `
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Bienvenido a [Tu Empresa]</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #f6f9fc;
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        overflow: hidden;
      }
      .header {
        background-color: #1a73e8;
        color: #ffffff;
        text-align: center;
        padding: 30px 20px;
      }
      .header h1 {
        margin: 0;
        font-size: 24px;
        font-weight: 600;
      }
      .content {
        padding: 30px 25px;
        color: #333333;
        line-height: 1.6;
      }
      .content h2 {
        font-size: 20px;
        color: #1a73e8;
      }
      .button {
        display: inline-block;
        margin-top: 20px;
        padding: 12px 24px;
        background-color: #1a73e8;
        color: #ffffff !important;
        text-decoration: none;
        border-radius: 6px;
        font-weight: bold;
      }
      .footer {
        background-color: #f0f3f8;
        color: #6b7280;
        text-align: center;
        font-size: 13px;
        padding: 15px 20px;
      }
      @media (max-width: 600px) {
        .content {
          padding: 20px;
        }
        .button {
          display: block;
          text-align: center;
        }
      }
    </style>
  </head>

  <body>
    <div class="container">
      <!-- HEADER -->
      <div class="header">
        <h1>¡Bienvenido a <strong>Prestamype</strong>!</h1>
      </div>

      <!-- CONTENT -->
      <div class="content">
        <h2>Hola, ${email} 👋</h2>
        <p>
          Gracias por registrarte en <strong>Prestamype</strong>. Nos alegra
          tenerte con nosotros.
        </p>
        <p>
          Tu cuenta ha sido creada exitosamente. Ahora puedes acceder a tu
          panel y comenzar a disfrutar de todos nuestros servicios.
        </p>

        <a href="${welcomeMail}" class="button">Ir a mi cuenta</a>

        <p style="margin-top: 30px; color: #666;">
          Si tienes alguna pregunta, no dudes en contactarnos.  
          <br />
          Nuestro equipo de soporte está aquí para ayudarte.
        </p>
      </div>

      <!-- FOOTER -->
      <div class="footer">
        <p>© 2025 Prestamype. Todos los derechos reservados.</p>
        <p>
          <a href="${welcomeMail}" style="color: #1a73e8; text-decoration: none;"
            >Contactar soporte</a
          >
        </p>
      </div>
    </div>
  </body>
</html>
`;
