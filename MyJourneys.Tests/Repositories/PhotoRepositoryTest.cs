using System.IO.Abstractions.TestingHelpers;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Moq;
using MyJourneys.Repositories;
using NUnit.Framework;

namespace MyJourneys.Tests.Repositories
{
    [TestFixture]
    public class PhotoRepositoryTest
    {
        private IPhotoRepository _repository;

        [SetUp]
        public void SetUp()
        {
            _repository = new PhotoRepository(MockConfig(), new MockFileSystem());
        }

        [Test]
        public void TestSaveOverviewPhoto()
        {
            var file = new Mock<IFormFile>();
            _repository.SaveOverviewPhoto(file.Object, "photos.jpg");
        }
        
        [Test]
        public void TestDeletePhoto()
        {
            _repository.DeletePhoto("test");
        }
     
        private IConfiguration MockConfig()
        {
            var conf = new Mock<IConfigurationSection>();
            conf.SetupGet(m => m[It.Is<string>(s => s == "FileStorage:LocationPath")]).Returns("photos/");
            return conf.Object;
        }
    }
}