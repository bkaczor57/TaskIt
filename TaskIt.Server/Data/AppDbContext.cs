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
        public DbSet<TeamInvites> TeamInvites { get; set; }
        public DbSet<Tasks> Tasks { get; set; }
        public DbSet<Sections> Sections { get; set; }
        public DbSet<Notifications> Notifications { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {


            // Ręczne Relacje i Atrybuty dla bazy danych

            // Tabela Users
            // Unikalność Email i Username
            modelBuilder.Entity<Users>()
                .HasIndex(u => u.Email)
                .IsUnique();
            modelBuilder.Entity<Users>()
                .HasIndex(u => u.Username)
                .IsUnique();

            modelBuilder.Entity<Users>()
                .Property(u => u.Role)
                .HasConversion<string>();

            // Tabela UsersTeams
            // Relacja User -> UserTeams, kaskadowe usuwanie 
            modelBuilder.Entity<UsersTeams>()
            .HasOne(ut => ut.User)
            .WithMany(u => u.UsersTeams)
            .HasForeignKey(ut => ut.UserId)
            .OnDelete(DeleteBehavior.Cascade);
            //Relacja Team -> UserTeams, kaskadowe usuwanie
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
            // Relacje
            // Relacja User (owner) -> Team, kaskadowe usuwanie
            modelBuilder.Entity<Teams>()
                .HasOne(t => t.Owner)
                .WithMany(u => u.OwnedTeams)
                .HasForeignKey(t => t.OwnerId)
                .OnDelete(DeleteBehavior.Cascade);

            // Tabela TeamInvites
            //Relacje
            //Relacja Zaproszeń Odebranych dla Usera User -> TeamInvites, kaskadowe usuwanie
            modelBuilder.Entity<TeamInvites>()
                .HasOne(ti => ti.InvitedUser)
                .WithMany(u => u.UserInvitationsReceived)
                .HasForeignKey(ti => ti.InvitedUserId)
                .OnDelete(DeleteBehavior.Cascade);
            //Relacja Zaproszeń Wysłanych dla Usera User -> TeamInvites, kaskadowe usuwanie
            modelBuilder.Entity<TeamInvites>()
                .HasOne(ti => ti.InvitingUser)
                .WithMany(u => u.UserInvitationsSent)
                .HasForeignKey(ti => ti.InvitingUserId)
                .OnDelete(DeleteBehavior.Cascade);
            //Konwersje
            //Konwersja enuma na string
            modelBuilder.Entity<TeamInvites>()
                .Property(ti => ti.Status)
                .HasConversion<string>(); // Zapisuje enum jako string w bazie
            

            //Tabela Sections
            //Relacje
            //Relacja Team -> Sections, kaskadowe usuwanie
            modelBuilder.Entity<Sections>()
                .HasOne(s => s.Team)
                .WithMany(t => t.Sections)
                .HasForeignKey(s => s.TeamId)
                .OnDelete(DeleteBehavior.Cascade);
            //Indeksowanie po TeamId
            modelBuilder.Entity<Sections>()
                .HasIndex(s => s.TeamId);
            //Tabela Tasks 
            //Relacje 
            //Relacja User -> Tasks, ustawianie na null w razie usunięcia użytkownika
            modelBuilder.Entity<Tasks>()
                .HasOne(t => t.AssignedUser)
                .WithMany(u => u.Tasks)
                .HasForeignKey(t => t.AssignedUserId)
                .OnDelete(DeleteBehavior.SetNull);
            //Relacja Section -> Tasks, kaskadowe usuwanie
            modelBuilder.Entity<Tasks>()
                .HasOne(t => t.Section)
                .WithMany(s => s.Tasks)
                .HasForeignKey(t => t.SectionId)
                .OnDelete(DeleteBehavior.Cascade);
            //Konwersje
            modelBuilder.Entity<Tasks>()
                .Property(t => t.Priority)
                .HasConversion<string>(); // Zapisuje enum jako string w bazie
            modelBuilder.Entity<Tasks>()
                .Property(t => t.Status)
                .HasConversion<string>(); // Zapisuje enum jako string w bazie
            //Indeksy po SectionId
            modelBuilder.Entity<Tasks>()
                .HasIndex(t => t.SectionId);



            // Tabela Notifications
            // Relacja: Powiadomienie -> Użytkownik (KAŻDE powiadomienie musi mieć odbiorcę)
            modelBuilder.Entity<Notifications>()
                .HasOne(n => n.User)
                .WithMany(u => u.Notifications)
                .HasForeignKey(n => n.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            // Relacja: Powiadomienie -> Task (opcjonalne)
            modelBuilder.Entity<Notifications>()
                .HasOne(n => n.Task)
                .WithMany()
                .HasForeignKey(n => n.TaskId)
                .OnDelete(DeleteBehavior.Cascade);
            // Relacja: Powiadomienie -> Team (opcjonalne)
            modelBuilder.Entity<Notifications>()
                .HasOne(n => n.Team)
                .WithMany()
                .HasForeignKey(n => n.TeamId)
                .OnDelete(DeleteBehavior.Cascade);
            // Indeksy dla optymalizacji
            modelBuilder.Entity<Notifications>()
                .HasIndex(n => n.UserId); // Najważniejsze indeksowanie
            modelBuilder.Entity<Notifications>()
                .HasIndex(n => n.Type); // Opcjonalne indeksowanie po `enum`
            // Konwersja Enum -> String
            modelBuilder.Entity<Notifications>()
                .Property(n => n.Type)
                .HasConversion<string>();


            // CHECK CONSTRAINT dla Notifications – tylko jedno powiązanie
            modelBuilder.Entity<Notifications>()
                .ToTable(tb => tb.HasCheckConstraint
                    ("CK_Notifications_OnlyOneReference", @"
                    (""TaskId"" IS NOT NULL AND ""CommentId"" IS NULL AND ""TeamId"" IS NULL) OR
                    (""TaskId"" IS NULL AND ""CommentId"" IS NOT NULL AND ""TeamId"" IS NULL) OR
                    (""TaskId"" IS NULL AND ""CommentId"" IS NULL AND ""TeamId"" IS NOT NULL)
                    "));
            
            // CHECK CONSTRAINT dla TeamInvites – użytkownik nie może zaprosić siebie
            modelBuilder.Entity<TeamInvites>()
                .ToTable(tb => tb.HasCheckConstraint
                    ("CK_TeamInvites_InvitingNotSelf",
                    "\"InvitedUserId\" <> \"InvitingUserId\""));

            

        }
    }

}
