using Music_playlist_management.Data;
using System.Net.Mail;

namespace Music_playlist_management.Services
{
    public class otpservices:Iotpservices
    {
        private readonly AppDbContext _context;

        public otpservices(AppDbContext context)
        {
          _context = context;
        }
        public async Task SendOtpEmail(string email, string otp)
        {
            string htmlBody = $@"
<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Your OTP - Music World</title>
</head>
<body style='margin:0; padding:0; font-family:Arial, sans-serif; background:linear-gradient(135deg,#ff5f6d,#ffc371,#42a5f5,#7b42f6); background-color:#7b42f6;'>

  <div style='max-width:420px; margin:40px auto; background:rgba(0,0,0,0.65); border-radius:16px; box-shadow:0 4px 18px rgba(0,0,0,0.24); padding:32px 24px; text-align:center; backdrop-filter:blur(10px); color:#fff;'>

    <img src=""http://localhost:4200/assets/images/logo2.png"" alt='Music World Logo' style='width:80px; margin-bottom:20px; border-radius:10px; box-shadow:0 2px 8px rgba(123,66,246,0.18);'/>
    <h2 style='margin-bottom:18px; font-size:2rem; color:#ffdcfa; text-shadow:0 0 10px #53c0fd;'>Welcome to Music World!</h2>
    
    <p style='font-size:1.15rem; margin-bottom:24px; color:#f0f0f0; font-weight:bold;'>Your Email Verification OTP</p>
    <div style='font-size:2rem; padding:16px; border-radius:8px; background:linear-gradient(90deg,#53c0fd,#ff5f6d); color:#fff; letter-spacing:3px; font-weight:800; margin-bottom:14px; box-shadow:0 2px 7px rgba(83,192,253,0.3);'>
      {otp}
    </div>
    <div style='font-size:1rem; color:#ffe4fa; margin-bottom:22px;'>
      This OTP is valid for <span style='font-weight:700; color:#ffc371;'>10 minutes</span>.
    </div>

    <div style='margin-top:24px; font-size:0.97rem; color:#bbb;'>If you did not request this, please ignore this email.</div>
  </div>
</body>
</html>";


            using var client = new SmtpClient("smtp.gmail.com", 587)
            {
                Credentials = new System.Net.NetworkCredential("eshatrivedi6567@gmail.com", "wzhy iols kzyl spgn"),
                EnableSsl = true
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress("eshatrivedi6567@gmail.com", "Music World"),
                Subject = "Your Email Verification OTP",
                Body = htmlBody,
                IsBodyHtml = true
            };
            mailMessage.To.Add(email);

            await client.SendMailAsync(mailMessage);
        }

    }
}
