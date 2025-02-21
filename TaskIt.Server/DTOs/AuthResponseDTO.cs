namespace TaskIt.Server.DTOs
{
    public class AuthResponseDTO
    {
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
        public UserDTO User { get; set; } // Przekazujemy dane użytkownika, ale bez tokenów w UserDTO
    }
}
