import * as pkg from '@root/package.json';
/**
 * 生成注册
 * @param code
 */
export const createCodeHtml = (code: string, email: string): [string, string] => {
    const title = `${pkg.name} 账户安全代码`;

    const content = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${pkg.name} 帐户安全代码</title>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    background-color: #f5f5f5;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                }
                .email-content {
                    margin: 0 auto;
                    max-width: 500px;
                    width: 100%;
                    background-color: #fff;
                    border-radius: 10px;
                    padding: 40px;
                    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
                    color: #333;
                }
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                }
                .security-code {
                    font-size: 40px;
                    font-weight: bold;
                    margin-bottom: 20px;
                    text-align: center;
                    color: #2672ec;
                }
                .note {
                    font-size: 16px;
                    color: #777;
                    text-align: center;
                    margin-bottom: 30px;
                }
                .team {
                    font-size: 18px;
                    text-align: center;
                    color: #555;
                }
            </style>
        </head>
        <body>
            <div class="email-content">
                <div class="header">
                    <h1 style="color: #333; font-size: 24px; font-weight: bold;">${pkg.name} 帐户安全代码</h1>
                    <p>尊敬的用户，您好：</p>
                    <p>您的 ${pkg.name} 帐户 <strong>${email}</strong> 已生成以下安全代码：</p>
                </div>
                <div class="security-code">安全代码: ${code}</div>
                <p class="note">请妥善保管此安全代码，切勿告知他人以确保帐户安全。</p>
                <p class="note">如有任何疑问或需要帮助，请随时与我们联系。</p>
                <p class="team"><em>${pkg.name} 帐户团队</em></p>
            </div>
        </body>
        </html>
    `;

    return [title, content];
};
