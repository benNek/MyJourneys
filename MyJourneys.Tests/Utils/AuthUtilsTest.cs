using System.Collections.Generic;
using System.Security.Claims;
using Moq;
using MyJourneys.Utils;
using NUnit.Framework;

namespace MyJourneys.Tests.Utils
{
    [TestFixture]
    public class AuthUtilsTest
    {
        [Test]
        public void GetUserId()
        {
            var user = new Mock<ClaimsPrincipal>();
            var claim = new Claim("username", "[USERNAME]");
            user.Setup(x => x.Claims).Returns(new List<Claim> {claim});
            Assert.AreEqual("[USERNAME]", AuthUtils.GetUserId(user.Object));
        }
    }
}