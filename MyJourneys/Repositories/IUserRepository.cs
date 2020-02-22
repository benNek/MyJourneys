using MyJourneys.Dtos;

namespace MyJourneys.Repositories
{
    public interface IUserRepository
    {
        void AddUser(UserDTO userDto);
    }
}