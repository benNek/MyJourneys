using System.Collections.Generic;
using Moq;
using MyJourneys.Models;
using MyJourneys.Models.ViewModels;
using MyJourneys.Repositories;
using MyJourneys.Services;
using NUnit.Framework;

namespace MyJourneys.Tests.Services
{
    [TestFixture]
    public class JourneyServiceTest
    {
        private IJourneyService _service;

        [SetUp]
        public void SetUp()
        {
            _service = new JourneyService(MockRepository());
        }

        [Test]
        public void TestReorderPlacesNoStartFound()
        {
            var places = _service.ReorderPlaces(2);
            Assert.IsNotEmpty(places);
            Assert.AreEqual(4, places.Count);
        }
        
        [Test]
        public void TestReorderPlacesValid()
        {
            var places = _service.ReorderPlaces(1);
            Assert.IsNotEmpty(places);
            Assert.AreEqual(5, places.Count);
        }

        public IJourneyRepository MockRepository()
        {
            var repo = new Mock<IJourneyRepository>();

            var brooklynBridge = new Place
            {
                Location = "Brooklyn Bridge", Latitude = 40.706001, Longitude = -73.997002, Start = true
            };
            var memorial911 = new Place
            {
                Location = "9/11 Memorial & Museum", Latitude = 40.712742, Longitude = -74.013382
            };
            var timesSquare = new Place
            {
                Location = "Times Square", Latitude = 40.758896, Longitude = -73.985130
            };
            var empireState = new Place
            {
                Location = "Empire State Building", Latitude = 40.748817, Longitude = -73.985428
            };
            var centralPark = new Place
            {
                Location = "Central Park", Latitude = 40.785091, Longitude = -73.968285
            };

            var brooklynBridgeModel = new PlaceViewModel
            {
                Location = "Brooklyn Bridge", Latitude = 40.706001, Longitude = -73.997002, Start = true
            };
            var memorial911Model = new PlaceViewModel
            {
                Location = "9/11 Memorial & Museum", Latitude = 40.712742, Longitude = -74.013382
            };
            var timesSquareModel = new PlaceViewModel
            {
                Location = "Times Square", Latitude = 40.758896, Longitude = -73.985130
            };
            var empireStateModel = new PlaceViewModel
            {
                Location = "Empire State Building", Latitude = 40.748817, Longitude = -73.985428
            };
            var centralParkModel = new PlaceViewModel
            {
                Location = "Central Park", Latitude = 40.785091, Longitude = -73.968285
            };

            repo.Setup(x => x.GetPlaceObjects(1)).Returns(new List<Place>
            {
                brooklynBridge, timesSquare, centralPark, empireState, memorial911
            });
            repo.Setup(x => x.GetPlaces(1)).Returns(new List<PlaceViewModel>
            {
                brooklynBridgeModel, timesSquareModel, centralParkModel, empireStateModel, memorial911Model
            });
            
            repo.Setup(x => x.GetPlaceObjects(2)).Returns(new List<Place>
            {
                timesSquare, centralPark, empireState, memorial911
            });
            repo.Setup(x => x.GetPlaces(2)).Returns(new List<PlaceViewModel>
            {
                timesSquareModel, centralParkModel, empireStateModel, memorial911Model
            });
            return repo.Object;
        }
    }
}