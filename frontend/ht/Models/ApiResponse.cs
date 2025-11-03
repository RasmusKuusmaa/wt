namespace ht.Models
{
    public class ApiResponse<T>
    {
        public bool success { get; set; }
        public T data { get; set; }
        public string message { get; set; }
        public string error { get; set; }
    }
}
