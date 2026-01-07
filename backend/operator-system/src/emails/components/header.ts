export function emailHeader(title = 'betasafar Platform') {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background-color: #0066cc; padding: 30px; text-align: center; }
        .header img { max-width: 150px; height: auto; }
        .content { padding: 40px 30px; color: #333333; line-height: 1.6; }
        h1, h2, h3 { color: #0066cc; }
        a.button { 
          display: inline-block; 
          background-color: #0066cc; 
          color: white; 
          padding: 12px 24px; 
          text-decoration: none; 
          border-radius: 6px; 
          margin: 20px 0; 
        }
      </style>
    </head>
    <body>
      <center class="container">
        <div class="header">
          <img src="https://your-domain.com/logo.png" alt="betasafar Platform" />
          <h2>betasafar Hajj & Umrah Marketplace</h2>
        </div>
        <div class="content">
  `;
}
