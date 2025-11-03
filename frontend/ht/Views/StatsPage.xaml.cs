using System;
using System.Globalization;
using ht.ViewModels;
using Microsoft.Maui.Controls;

namespace ht.Views;

public partial class StatsPage : ContentPage
{
	public StatsPage()
	{
		InitializeComponent();
		BindingContext = new StatsViewModel();
	}
}

public class ProgressionColorConverter : IValueConverter
{
	public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
	{
		if (value is double progression)
		{
			if (progression > 0)
				return Colors.Green;
			else if (progression < 0)
				return Colors.Red;
		}
		return Colors.Gray;
	}

	public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
	{
		throw new NotImplementedException();
	}
}

public class IsNotNullConverter : IValueConverter
{
	public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
	{
		return value != null;
	}

	public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
	{
		throw new NotImplementedException();
	}
}