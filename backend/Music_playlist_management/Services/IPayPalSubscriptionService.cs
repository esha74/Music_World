namespace Music_playlist_management.Services
{
    public interface IPayPalSubscriptionService
    {
        Task<bool> VerifySubscriptionAsync(string subscriptionId);
    }
}
