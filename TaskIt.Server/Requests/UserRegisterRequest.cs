using System.ComponentModel.DataAnnotations;

namespace TaskIt.Server.Requests
{
    public class UserRegisterRequest
    {
        [Required(ErrorMessage ="Email jest wymagany."), EmailAddress(ErrorMessage = "Niepoprawny format email.")]
        public required string Email { get; set; }

        [Required(ErrorMessage = "Nazwa użytkownika jest wymagana.")]
        public required string Username { get; set; }

        [Required(ErrorMessage = "Hasło jest wymagane."), MinLength(8,ErrorMessage ="Haslo musi miec co najmniej 8 znaków.")]
        public required string Password { get; set; }

        [Required(ErrorMessage = "Imie jest wymagane.")]
        public required string FirstName { get; set; }

        [Required(ErrorMessage = "Nazwisko jest wymagane.")]
        public required string LastName { get; set; }

    }
}
