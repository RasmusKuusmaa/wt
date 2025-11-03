using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace ht.Services
{
    public class ApiService
    {
        private static readonly HttpClient _httpClient = new HttpClient();
        private const string BaseUrl = "http://10.0.2.2:5020";

        public static string Token { get; set; }

        static ApiService()
        {
            _httpClient.BaseAddress = new Uri(BaseUrl);
            _httpClient.DefaultRequestHeaders.Accept.Clear();
            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        }

        public static void SetAuthToken(string token)
        {
            Token = token;
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        }

        public static async Task<T> GetAsync<T>(string endpoint)
        {
            try
            {
                var fullUrl = $"{_httpClient.BaseAddress}{endpoint}";
                System.Diagnostics.Debug.WriteLine($"GET Request: {fullUrl}");
                System.Diagnostics.Debug.WriteLine($"Auth Token: {(string.IsNullOrEmpty(Token) ? "NOT SET" : "SET")}");

                var response = await _httpClient.GetAsync(endpoint);
                var content = await response.Content.ReadAsStringAsync();

                System.Diagnostics.Debug.WriteLine($"Response Status: {response.StatusCode}");
                System.Diagnostics.Debug.WriteLine($"Response Content: {content}");

                if (response.IsSuccessStatusCode)
                {
                    return JsonSerializer.Deserialize<T>(content, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });
                }

                throw new Exception($"API Error: {response.StatusCode} - {content}");
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"GET Error: {ex.Message}");
                Console.WriteLine($"GET Error: {ex.Message}");
                throw;
            }
        }

        public static async Task<T> PostAsync<T>(string endpoint, object data)
        {
            try
            {
                var fullUrl = $"{_httpClient.BaseAddress}{endpoint}";
                System.Diagnostics.Debug.WriteLine($"POST Request: {fullUrl}");
                System.Diagnostics.Debug.WriteLine($"Auth Token: {(string.IsNullOrEmpty(Token) ? "NOT SET" : "SET")}");

                var json = JsonSerializer.Serialize(data);
                System.Diagnostics.Debug.WriteLine($"Request Body: {json}");

                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await _httpClient.PostAsync(endpoint, content);
                var responseContent = await response.Content.ReadAsStringAsync();

                System.Diagnostics.Debug.WriteLine($"Response Status: {response.StatusCode}");
                System.Diagnostics.Debug.WriteLine($"Response Content: {responseContent}");

                if (response.IsSuccessStatusCode)
                {
                    return JsonSerializer.Deserialize<T>(responseContent, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });
                }

                throw new Exception($"API Error: {response.StatusCode} - {responseContent}");
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"POST Error: {ex.Message}");
                Console.WriteLine($"POST Error: {ex.Message}");
                throw;
            }
        }
    }
}
