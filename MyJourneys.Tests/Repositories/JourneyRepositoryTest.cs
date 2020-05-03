using Microsoft.Extensions.Configuration;
using Moq;
using MyJourneys.Data;
using MyJourneys.Repositories;
using NUnit.Framework;

namespace MyJourneys.Tests.Repositories
{
    [TestFixture]
    public class JourneyRepositoryTest
    {
        private IJourneyRepository _repository;

        [SetUp]
        public void SetUp()
        {
            _repository = new JourneyRepository(MockPhotoRepository(), MockConfig(), MockContext());
        }

        [Test]
        public void TestAddJourney()
        {
            
        }
        
        private IConfiguration MockConfig()
        {
            var conf = new Mock<IConfigurationSection>();
            conf.SetupGet(m => m[It.Is<string>(s => s == "FileStorage:LocationPath")]).Returns("photos/");
            return conf.Object;
        }
        
        private IPhotoRepository MockPhotoRepository()
        {
            var photoRepository = new Mock<IPhotoRepository>();
            return photoRepository.Object;
        }

        private TravelContext MockContext()
        {
            var mockContext = new Mock<TravelContext>();

            return mockContext.Object;
        }
    }
}