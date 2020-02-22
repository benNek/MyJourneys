namespace MyJourneys.Repositories
{
    public interface IUserRepository
    {
        bool UserWithNameExists(string username);
        bool UserWithEmailExists(string email);
    }
}