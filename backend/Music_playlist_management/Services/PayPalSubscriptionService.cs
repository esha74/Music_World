using Microsoft.Extensions.Configuration;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Music_playlist_management.Services
{
    public class PayPalSubscriptionService : IPayPalSubscriptionService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;

        public PayPalSubscriptionService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _configuration = configuration;
        }

        private async Task<string> GetAccessTokenAsync()
        {
            var clientId = _configuration["PayPal:ClientId"];
            var clientSecret = _configuration["PayPal:ClientSecret"];
            var auth = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{clientId}:{clientSecret}"));

            var request = new HttpRequestMessage(HttpMethod.Post, "https://api-m.sandbox.paypal.com/v1/oauth2/token");
            request.Headers.Authorization = new AuthenticationHeaderValue("Basic", auth);
            request.Content = new StringContent("grant_type=client_credentials", Encoding.UTF8, "application/x-www-form-urlencoded");

            var response = await _httpClient.SendAsync(request);
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            var tokenDoc = JsonDocument.Parse(json);
            return tokenDoc.RootElement.GetProperty("access_token").GetString()!;
        }

        public async Task<bool> VerifySubscriptionAsync(string subscriptionId)
        {
            var token = await GetAccessTokenAsync();
            Console.WriteLine("PayPal Access Token: " + token);
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await _httpClient.GetAsync($"https://api-m.sandbox.paypal.com/v1/billing/subscriptions/{subscriptionId}");

            if (!response.IsSuccessStatusCode)
                return false;

            var json = await response.Content.ReadAsStringAsync();
            var doc = JsonDocument.Parse(json);

            var status = doc.RootElement.GetProperty("status").GetString()?.ToLower();
            return status == "active";
        }
    }
}
