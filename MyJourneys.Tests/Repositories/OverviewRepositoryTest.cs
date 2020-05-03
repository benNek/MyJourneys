using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Moq;
using MyJourneys.Data;
using MyJourneys.Models;
using MyJourneys.Models.ViewModels;
using MyJourneys.Repositories;
using NUnit.Framework;

namespace MyJourneys.Tests.Repositories
{
    [TestFixture]
    public class OverviewRepositoryTest
    {
        private IOverviewRepository _repository;

        private Country spain = new Country {Id = 1, Name = "Spain", Alpha2 = "ES", Alpha3 = "ESP"};
        private Country france = new Country {Id = 2, Name = "France", Alpha2 = "FR", Alpha3 = "FRA"};

        [SetUp]
        public void SetUp()
        {
            _repository = new OverviewRepository(MockConfig(), MockPhotoRepository(), MockContext());
        }

        [Test]
        public void TestGetJourneyOverviewsEmpty()
        {
            Assert.IsEmpty(_repository.GetJourneyOverviews("1234", 0));
        }

        [Test]
        public void TestGetJourneyOverviewsValid()
        {
            var journeys = _repository.GetJourneyOverviews("1", 0);
            Assert.IsNotEmpty(journeys);
            Assert.AreEqual(2, journeys.Count);
        }

        [Test]
        public void TestGetJourneyOverviewNull()
        {
            var journey = _repository.GetJourneyOverview("1", 3);
            Assert.IsNull(journey);
        }

        [Test]
        public void TestGetJourneyOverviewValid()
        {
            var journey = _repository.GetJourneyOverview("1", 1);
            Assert.NotNull(journey);
            Assert.AreEqual("Barcelona", journey.Title);
        }

        [Test]
        public void TestGetJourneyOverviewsValidWithYearFilter()
        {
            var journeys = _repository.GetJourneyOverviews("1", 2020);
            Assert.IsNotEmpty(journeys);
            Assert.AreEqual(1, journeys.Count);
        }

        [Test]
        public void TestAddJourneyOverview()
        {
            var countries = new List<Country> {france};
            var file1 = new Mock<IFormFile>();
            file1.Setup(x => x.FileName).Returns("file1.jpg");
            file1.Setup(x => x.Length).Returns(100);

            var file2 = new Mock<IFormFile>();
            file2.Setup(x => x.FileName).Returns("file2.jpg");
            file2.Setup(x => x.Length).Returns(0);
            var model1 = new JourneyOverviewUploadViewModel(file1.Object, DateTime.Now, 0, 0);
            var model2 = new JourneyOverviewUploadViewModel(file2.Object, DateTime.Now, 0, 0);
            var models = new List<JourneyOverviewUploadViewModel> {model1, model2};
            _repository.AddJourneyOverview("1", "Paris", countries, models);
            var journeys = _repository.GetJourneyOverviews("1", 0);
            Assert.AreEqual(2, journeys.Count);
        }

        [Test]
        public void TestGetCountryNull()
        {
            Assert.Null(_repository.GetCountry("LT"));
        }

        [Test]
        public void TestGetCountryFrance()
        {
            var country = _repository.GetCountry("FR");
            Assert.AreEqual("France", country.Name);
        }

        [Test]
        public void TestGetCountrySpain()
        {
            var country = _repository.GetCountry("ES");
            Assert.AreEqual("Spain", country.Name);
        }

        [Test]
        public void TestGetVisitedCountriesValid()
        {
            var countries = _repository.GetVisitedCountries("1", 0);
            Assert.AreEqual(2, countries.Count);
        }

        [Test]
        public void TestGetVisitedCountriesValidWithYearFilter()
        {
            var countries = _repository.GetVisitedCountries("1", 2020);
            Assert.AreEqual(1, countries.Count);
        }

        [Test]
        public void TestGetTravelingYearsEmpty()
        {
            Assert.IsEmpty(_repository.GetTravelingYears("2"));
        }

        [Test]
        public void TestGetTravelingYearsValid()
        {
            Assert.AreEqual(3, _repository.GetTravelingYears("1").Count);
        }

        [Test]
        public void TestDeletePhotos()
        {
            _repository.DeletePhotos("1");
            var journeys = _repository.GetJourneyOverviews("1", 0);
            Assert.AreEqual(2, journeys.Count);
        }

        private IConfiguration MockConfig()
        {
            var conf = new Mock<IConfigurationSection>();
            conf.SetupGet(m => m[It.Is<string>(s => s == "FileStorage:OverviewPath")]).Returns("photos/");
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

            var photos = new List<LocationPhoto>
            {
                new LocationPhoto {Date = DateTime.Parse("Jan 1, 2018")},
                new LocationPhoto {Date = DateTime.Parse("Jan 1, 2010")}
            };
            var newPhotos = new List<LocationPhoto>
            {
                new LocationPhoto {Date = DateTime.Parse("Jan 1, 2020")},
                new LocationPhoto {Date = DateTime.Parse("Jan 1, 2020")}
            };

            var journey1 = new OverviewJourney
            {
                Id = 1,
                UserId = "1",
                LocationPhotos = photos,
                Title = "Barcelona",
                OverviewJourneysCountries = new List<OverviewJourneysCountries>
                    {new OverviewJourneysCountries {OverviewJourneyId = 1, CountryId = 1, Country = spain}}
            };

            var journey2 = new OverviewJourney
            {
                Id = 2,
                UserId = "1",
                LocationPhotos = newPhotos,
                Title = "Paris",
                OverviewJourneysCountries = new List<OverviewJourneysCountries>
                    {new OverviewJourneysCountries {OverviewJourneyId = 2, CountryId = 2, Country = france}}
            };
            var journeys = FakeDbSet<OverviewJourney>.Create(new List<OverviewJourney>
            {
                journey1, journey2
            });
            mockContext.Setup(x => x.OverviewJourneys).Returns(journeys.Object);

            var countries = FakeDbSet<Country>.Create(new List<Country>
            {
                spain, france
            });
            mockContext.Setup(x => x.Countries).Returns(countries.Object);

            var journeyCountries = FakeDbSet<OverviewJourneysCountries>.Create(new List<OverviewJourneysCountries>
            {
                new OverviewJourneysCountries {OverviewJourneyId = 1, CountryId = 1},
                new OverviewJourneysCountries {OverviewJourneyId = 2, CountryId = 2}
            });
            mockContext.Setup(x => x.OverviewJourneysCountries).Returns(journeyCountries.Object);

            var locationPhotos = FakeDbSet<LocationPhoto>.Create(new List<LocationPhoto>
            {
                new LocationPhoto {Date = DateTime.Parse("Jan 1, 2018"), OverviewJourney = journey1},
                new LocationPhoto {Date = DateTime.Parse("Jan 1, 2010"), OverviewJourney = journey1},
                new LocationPhoto {Date = DateTime.Parse("Jan 1, 2020"), OverviewJourney = journey2},
                new LocationPhoto {Date = DateTime.Parse("Jan 1, 2020"), OverviewJourney = journey2}
            });
            mockContext.Setup(x => x.LocationPhotos).Returns(locationPhotos.Object);
            return mockContext.Object;
        }
    }
}