using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Windows.Input;
using ht.Services;

namespace ht.ViewModels
{
    public class LoginViewModel : BaseViewModel
    {
		private string _username;

		public string Username
		{
			get { return _username; }
			set { _username = value;
				OnPropertyChanged();
			}
		}

		private string _password;

		public string Password
		{
			get { return _password; }
			set { _password = value;
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

		private async void OnLogin()
		{
			ErrorMessage = string.Empty;

			if (string.IsNullOrWhiteSpace(Username) || string.IsNullOrWhiteSpace(Password))
			{
				ErrorMessage = "Please enter username and password";
				return;
			}

			try
			{
				var httpClient = new HttpClient();
				httpClient.BaseAddress = new Uri("http://10.0.2.2:5020/api/");

				var loginData = new { username = Username, password = Password };
				var json = JsonSerializer.Serialize(loginData);
				var content = new StringContent(json, Encoding.UTF8, "application/json");

				var response = await httpClient.PostAsync("auth/login", content);
				var responseContent = await response.Content.ReadAsStringAsync();

				if (response.IsSuccessStatusCode)
				{
					var result = JsonSerializer.Deserialize<LoginResponse>(responseContent, new JsonSerializerOptions
					{
						PropertyNameCaseInsensitive = true
					});

					if (result.success && result.data != null)
					{
						ApiService.SetAuthToken(result.data.token);
						await Shell.Current.GoToAsync("//MainPage");
					}
					else
					{
						ErrorMessage = result.error ?? "Login failed";
					}
				}
				else
				{
					ErrorMessage = "Login failed. Please check your credentials.";
				}
			}
			catch (Exception ex)
			{
				ErrorMessage = $"Error: {ex.Message}";
				System.Diagnostics.Debug.WriteLine($"Login error: {ex.Message}");
			}
		}

		private async void OnGoToRegister()
		{
			await Shell.Current.GoToAsync("//RegisterPage");
		}

		public ICommand LoginCommand { get;  }
		public ICommand GoToRegisterCommand { get; }

		public LoginViewModel()
		{
            LoginCommand = new Command(OnLogin);
			GoToRegisterCommand = new Command(OnGoToRegister);
		}
	}

	public class LoginResponse
	{
		public bool success { get; set; }
		public LoginData data { get; set; }
		public string error { get; set; }
	}

	public class LoginData
	{
		public int user_id { get; set; }
		public string username { get; set; }
		public string token { get; set; }
	}
}
