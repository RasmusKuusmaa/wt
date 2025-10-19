using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;

namespace ht.ViewModels
{
    public class LoginViewModel : BaseViewModel
    {
		private string _email;

		public string Email
		{
			get { return _email; }
			set { _email = value;
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
		


		private async void OnLogin()
		{
			if (Email == "e" && Password == "qwerty")
			{
				await Shell.Current.GoToAsync("//MainPage");
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
}
