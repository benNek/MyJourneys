using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Castle.DynamicProxy.Generators;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Moq;
using MyJourneys.Data;
using MyJourneys.Models;
using MyJourneys.Repositories;
using NUnit.Framework;

namespace MyJourneys.Tests.Repositories
{
    [TestFixture]
    public class UserRepositoryTest
    {
        private IUserRepository _repository;

        [SetUp]
        public void SetUp()
        {
            _repository = new UserRepository(MockUserManager(), MockContext());
        }

        [Test]
        public void TestUserWithNameExistsFalse()
        {
            Assert.IsFalse(_repository.UserWithNameExists("not_existing"));
        }

        [Test]
        public void TestUserWithNameExistsTrue()
        {
            Assert.IsTrue(_repository.UserWithNameExists("username"));
        }

        [Test]
        public void TestGetUserNull()
        {
            Assert.IsNull(_repository.GetUser("not_existing"));
        }

        [Test]
        public void TestGetUserValid()
        {
            var user = _repository.GetUser("username");
            Assert.NotNull(user);
            Assert.AreEqual("username", user.UserName);
        }

        [Test]
        public void TestGetUserByIdNull()
        {
            Assert.IsNull(_repository.GetUserById("5678-1234-5678-1234"));
        }

        [Test]
        public void TestGetUserByIdValid()
        {
            var user = _repository.GetUserById("1234-5678-1234-5678");
            Assert.NotNull(user);
            Assert.AreEqual("username", user.UserName);
        }

        [Test]
        public void TestUserWithEmailExistsFalse()
        {
            Assert.IsFalse(_repository.UserWithEmailExists("not_existing@myjourneys.com"));
        }

        [Test]
        public void TestUserWithEmailExistsTrue()
        {
            Assert.IsTrue(_repository.UserWithEmailExists("test@myjourneys.com"));
        }

        [Test]
        public void TestHasDeniedWriterRoleFalse()
        {
            Assert.IsFalse(_repository.HasDeniedWriterRole("1234-5678-1234-5678"));
        }

        [Test]
        public void TestHasDeniedWriterRoleTrue()
        {
            Assert.IsTrue(_repository.HasDeniedWriterRole("4321-5678-4321-5678"));
        }

        [Test]
        public void TestHasWriterRoleFalse()
        {
            Assert.IsFalse(_repository.HasWriterRole("1234-5678-1234-5678"));
        }

        [Test]
        public void TestHasWriterRoleTrue()
        {
            Assert.IsTrue(_repository.HasWriterRole("9876-5678-9876-5678"));
        }

        [Test]
        public void TestHasAdminRoleFalse()
        {
            Assert.IsFalse(_repository.HasAdminRole("5678-1234-5678-1234"));
        }

        [Test]
        public void TestHasAdminRoleTrue()
        {
            Assert.IsTrue(_repository.HasAdminRole("1234-5678-1234-5678"));
        }

        [Test]
        public void TestGetUnapprovedAuthors()
        {
            Assert.IsNotEmpty(_repository.GetUnapprovedAuthors());
        }
        
        private UserManager<User> MockUserManager()
        {
            var user = new Mock<User>();
            user.Setup(x => x.UserName).Returns("approvedAuthor");
            
            var store = new Mock<IUserStore<User>>();
            store.Setup(x => x.FindByNameAsync("approvedAuthor", CancellationToken.None))
                .ReturnsAsync(user.Object);
            
            var manager = new UserManager<User>(store.Object, null, null, null, null, null, null, null, null); ;
            return manager;
        }

        private TravelContext MockContext()
        {
            var mockContext = new Mock<TravelContext>();
            var user = new User {UserName = "username", Id = "1234-5678-1234-5678", Email = "test@myjourneys.com"};
            var dWriter = new User {UserName = "deniedWriter", Id = "4321-5678-4321-5678", Email = "dw@myjourneys.com"};
            var writer = new User {UserName = "writer", Id = "9876-5678-9876-5678", Email = "writer@myjourneys.com"};
            var users = FakeDbSet<User>.Create(new List<User>
            {
                user,
                dWriter,
                writer
            });
            mockContext.Setup(c => c.Users).Returns(users.Object);

            var roles = FakeDbSet<IdentityRole>.Create(new List<IdentityRole>
            {
                new IdentityRole {Id = "1", NormalizedName = "Admin"},
                new IdentityRole {Id = "2", NormalizedName = "Writer"},
                new IdentityRole {Id = "3", NormalizedName = "DeniedWriter"}
            });
            mockContext.Setup(x => x.Roles).Returns(roles.Object);

            var userRoles = FakeDbSet<IdentityUserRole<string>>.Create(new List<IdentityUserRole<string>>
            {
                new IdentityUserRole<string> {UserId = "1234-5678-1234-5678", RoleId = "1"},
                new IdentityUserRole<string> {UserId = "9876-5678-9876-5678", RoleId = "2"},
                new IdentityUserRole<string> {UserId = "4321-5678-4321-5678", RoleId = "3"}
            });
            mockContext.Setup(x => x.UserRoles).Returns(userRoles.Object);

            var articles = FakeDbSet<Article>.Create(new List<Article>
            {
                new Article {Id = 1, Confirmed = false, Author = writer},
                new Article {Id = 2, Confirmed = true, Author = dWriter}
            });
            mockContext.Setup(x => x.Articles).Returns(articles.Object);

            return mockContext.Object;
        }
    }
}