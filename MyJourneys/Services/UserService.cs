using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using MyJourneys.Models;
using MyJourneys.Models.ViewModels;

namespace MyJourneys.Services
{
    public class UserService : IUserService
    {
        private IConfiguration _configuration;
        private UserManager<User> _userManager;
        private SignInManager<User> _signInManager;

        public UserService(IConfiguration configuration, UserManager<User> userManager,
            SignInManager<User> signInManager)
        {
            _configuration = configuration;
            _userManager = userManager;
            _signInManager = signInManager;
        }

        public async Task<bool> Register(RegisterViewModel model)
        {
            var user = new User
            {
                UserName = model.Username,
                Email = model.Email
            };

            var result = await _userManager.CreateAsync(user, model.Password);
            return result.Succeeded;
        }

        public async Task<bool> Login(LoginViewModel model)
        {
            var result = await _signInManager.PasswordSignInAsync(model.Username, model.Password, true, false);
            return result.Succeeded;
        }

        public async Task<string> RequestToken(string username)
        {
            User user = await _userManager.FindByNameAsync(username);
            IList<string> roles = await _userManager.GetRolesAsync(user);

            List<Claim> claims = new List<Claim>
            {
                new Claim("id", user.Id),
                new Claim("username", user.UserName),
                new Claim("email", user.Email)
            };
            claims.AddRange(GetUserRolesList(roles));

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Auth:IssuerSigningKey"]));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                _configuration["Auth:Issuer"],
                _configuration["Auth:Audience"],
                claims,
                expires: DateTime.Now.AddDays(Convert.ToDouble(_configuration["Auth:ExpirationDays"])),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async void Logout()
        {
            await _signInManager.SignOutAsync();
        }

        private List<Claim> GetUserRolesList(IList<string> roles)
        {
            return roles.Select(role => new Claim("roles", role)).ToList();
        }
    }
}