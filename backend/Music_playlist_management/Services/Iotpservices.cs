namespace Music_playlist_management.Services
{
    public interface Iotpservices
    {

        Task SendOtpEmail(string email, string otp);

    }
}
