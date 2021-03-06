using System.Linq;
using System.Security.Claims;

namespace MyJourneys.Utils
{
    public class AuthUtils
    {
        public static string GetUserId(ClaimsPrincipal user)
        {
            return user.Claims.ToList()[0].Value;
        }
    }
}