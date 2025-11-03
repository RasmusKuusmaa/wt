using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Windows.Input;
using ht.Services;

namespace ht.ViewModels
{
    public class RegisterViewModel : BaseViewModel
    {
        private string _username;

        public string Username
        {
            get { return _username; }
            set
            {
                _username = value;
                OnPropertyChanged();
            }
        }

        private string _password;

        public string Password
        {
            get { return _password; }
            set
            {
                _password = value;
                OnPropertyChanged();
            }
        }

        private string _confirmPassword;

        public string ConfirmPassword
        {
            get { return _confirmPassword; }
            set { _confirmPassword = value;
                OnPropertyChanged();
            }
        }

        private string _errorMessage;

        public string ErrorMessage
        {
            get { return _errorMessage; }
            set { _errorMessage = value;
                OnPropertyChanged();
            }
        }

        private string _successMessage;

        public string SuccessMessage
        {
            get { return _successMessage; }
            set { _successMessage = value;
                OnPropertyChanged();
            }
        }

        private async void OnRegister()
        {
            ErrorMessage = string.Empty;
            SuccessMessage = string.Empty;

            if (string.IsNullOrWhiteSpace(Username) || string.IsNullOrWhiteSpace(Password))
            {
                ErrorMessage = "Please enter username and password";
                return;
            }

            if (Password != ConfirmPassword)
            {
                ErrorMessage = "Passwords do not match";
                return;
            }

            try
            {
                var httpClient = new HttpClient();
                httpClient.BaseAddress = new Uri("http://10.0.2.2:5020/api/");

                var registerData = new { username = Username, password = Password };
                var json = JsonSerializer.Serialize(registerData);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await httpClient.PostAsync("auth/register", content);
                var responseContent = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {
                    var result = JsonSerializer.Deserialize<RegisterResponse>(responseContent, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });

                    if (result.success)
                    {
                        SuccessMessage = "Registration successful! Redirecting to login...";
                        await Task.Delay(1500);
                        await Shell.Current.GoToAsync("//LoginPage");
                    }
                    else
                    {
                        ErrorMessage = result.error ?? "Registration failed";
                    }
                }
                else
                {
                    ErrorMessage = "Registration failed. Username may already exist.";
                }
            }
            catch (Exception ex)
            {
                ErrorMessage = $"Error: {ex.Message}";
                System.Diagnostics.Debug.WriteLine($"Register error: {ex.Message}");
            }
        }

        private async void OnGoToLogin()
        {
            await Shell.Current.GoToAsync("//LoginPage");
        }

        public ICommand RegisterCommand { get; }
        public ICommand GoToLoginCommand { get; }

        public RegisterViewModel()
        {
            RegisterCommand = new Command(OnRegister);
            GoToLoginCommand = new Command(OnGoToLogin);
        }
    }

    public class RegisterResponse
    {
        public bool success { get; set; }
        public RegisterData data { get; set; }
        public string error { get; set; }
    }

    public class RegisterData
    {
        public int user_id { get; set; }
        public string username { get; set; }
    }
}
