using Microsoft.EntityFrameworkCore;
using TaskIt.Server.Core.Entities;
namespace TaskIt.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Users> Users { get; set; }
        public DbSet<Teams> Teams { get; set; }
        public DbSet<UsersTeams> UsersTeams { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {


            // Relacje i Unikalność

            // Tabela Users

            // Unikalność Email i Username
            modelBuilder.Entity<Users>()
            .HasIndex(u => u.Email)
            .IsUnique();
            modelBuilder.Entity<Users>()
            .HasIndex(u => u.Username)
            .IsUnique();

            // Tabela UsersTeams

            // Relacja User -> UserTeams, kaskadowe usuwanie 
            modelBuilder.Entity<UsersTeams>()
            .HasOne(ut => ut.Team)
            .WithMany(t => t.UsersTeams)
            .HasForeignKey(ut => ut.TeamId)
            .OnDelete(DeleteBehavior.Cascade);
            // Unikalność UserId i TeamId - uzytkownik nie może należeć dwa razy do tego samego zespołu
            modelBuilder.Entity<UsersTeams>()
            .HasIndex(ut => new { ut.UserId, ut.TeamId })
            .IsUnique();
            // Konwersja enuma na string
            modelBuilder.Entity<UsersTeams>()
            .Property(ut => ut.Role)
            .HasConversion<string>(); // Zapisuje enum jako string w bazie

            // Tabela Teams

            // Relacja User (owner) -> Team, usuwanie ograniczone
            modelBuilder.Entity<Teams>()
            .HasOne(t => t.Owner)
            .WithMany(u => u.OwnedTeams)
            .HasForeignKey(t => t.OwnerId)
            .OnDelete(DeleteBehavior.Cascade);

           


        }
    }

}
