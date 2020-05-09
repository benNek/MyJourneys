using System;
using System.Collections.Generic;
using System.IO.Abstractions.TestingHelpers;
using Microsoft.Extensions.Configuration;
using Moq;
using MyJourneys.Data;
using MyJourneys.Models;
using MyJourneys.Models.Enums;
using MyJourneys.Models.ViewModels;
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
            _repository = new JourneyRepository(MockPhotoRepository(), MockConfig(), MockContext(), MockFileSystem());
        }

        [Test]
        public void TestAddJourneyValidPhotoExists()
        {
            var model = new JourneyFormViewModel
            {
                Location = "Barcelona",
                StartDate = DateTime.Now,
                EndDate = DateTime.Now
            };

            var journey = _repository.AddJourney("1", model);
            Assert.AreEqual("Barcelona", journey.Location);
        }

        [Test]
        public void TestAddJourneyValidPhotoDoesntExist()
        {
            var model = new JourneyFormViewModel
            {
                Location = "Paris",
                StartDate = DateTime.Now,
                EndDate = DateTime.Now
            };

            var journey = _repository.AddJourney("1", model);
            Assert.AreEqual("Barcelona", journey.Location);
        }

        [Test]
        public void TestDeleteJourneyDoesntExist()
        {
            Assert.AreEqual(-1, _repository.DeleteJourney(7));
        }

        [Test]
        public void TestDeleteJourneyValid()
        {
            Assert.AreEqual(0, _repository.DeleteJourney(0));
            Assert.AreEqual(1, _repository.DeleteJourney(1));
        }

        [Test]
        public void TestGetJourneys()
        {
            var journeys = _repository.GetJourneys("1");
            Assert.IsNotEmpty(journeys);
            Assert.AreEqual(2, journeys.Count);
        }

        [Test]
        public void TestGetJourney()
        {
            var journey = _repository.GetJourney(1);
            Assert.NotNull(journey);
            Assert.AreEqual("Paris", journey.Location);
        }

        [Test]
        public void TestIsUsersJourneyFalse()
        {
            Assert.IsFalse(_repository.IsUsersJourney("1", 3));
        }

        [Test]
        public void TestIsUsersJourneyTrue()
        {
            Assert.IsTrue(_repository.IsUsersJourney("1", 1));
        }

        [Test]
        public void TestIsUsersItemFalse()
        {
            Assert.IsFalse(_repository.IsUsersItem("2", 1));
        }
        
        [Test]
        public void TestIsUsersItemTrue()
        {
            Assert.IsTrue(_repository.IsUsersItem("1", 1));
        }

        [Test]
        public void TestIsUsersPlaceFalse()
        {
            Assert.IsFalse(_repository.IsUsersPlace("1", 3));
        }

        [Test]
        public void TestIsUsersPlaceTrue()
        {
            Assert.IsTrue(_repository.IsUsersPlace("1", 1));
        }

        [Test]
        public void TestIsUsersNoteFalse()
        {
            Assert.IsFalse(_repository.IsUsersNote("1", 3));
        }

        [Test]
        public void TestIsUsersNoteTrue()
        {
            Assert.IsTrue(_repository.IsUsersNote("1", 1));
        }

        [Test]
        public void TestGetJourneyItems()
        {
            var items = _repository.GetJourneyItems(1);
            Assert.IsNotEmpty(items);
            Assert.AreEqual(4, items.Count);
        }

        [Test]
        public void TestGetPlaces()
        {
            var places = _repository.GetPlaces(1);
            Assert.IsNotEmpty(places);
            Assert.AreEqual(1, places.Count);
        }

        [Test]
        public void TestGetPlaceObjects()
        {
            var places = _repository.GetPlaceObjects(1);
            Assert.IsNotEmpty(places);
            Assert.AreEqual(1, places.Count);
        }

        [Test]
        public void TestUpdatePlaceRank()
        {
            _repository.UpdatePlaceRank(1, 1000);
        }

        [Test]
        public void TestGetNotes()
        {
            var notes = _repository.GetNotes(1);
            Assert.IsNotEmpty(notes);
            Assert.AreEqual(1, notes.Count);
        }

        [Test]
        public void TestAddItemFlight()
        {
            var model = new JourneyItemFormViewModel{ Airline = "Ryanair", Type = "Flight"};
            var item = _repository.AddItem(model);
            Assert.NotNull(item);
            Assert.AreEqual("Ryanair", model.Airline);
            Assert.AreEqual("Flight", item.Type);
        }
        
        [Test]
        public void TestAddItemHotel()
        {
            var model = new JourneyItemFormViewModel{ Name = "Hotel name", Type = "Hotel"};
            var item = _repository.AddItem(model);
            Assert.NotNull(item);
            Assert.AreEqual("Hotel name", model.Name);
            Assert.AreEqual("Hotel", item.Type);
        }
        
        [Test]
        public void TestDeleteItemDoesntExist()
        {
            Assert.AreEqual(-1, _repository.DeleteItem(5));
        }
        
        [Test]
        public void TestDeleteReservationItemValid()
        {
            Assert.AreEqual(3, _repository.DeleteItem(3));
        }

        [Test]
        public void TestAddPlaceItem()
        {
            var model = new PlaceFormViewModel {Location = "Place"};
            var item = _repository.AddPlaceItem(model);
            Assert.NotNull(item);
            Assert.AreEqual("Place", item.Location);
        }

        [Test]
        public void TestDeletePlaceItemDoesntExist()
        {
            Assert.AreEqual(-1, _repository.DeletePlaceItem(5));
        }

        [Test]
        public void TestDeletePlaceItemValid()
        {
            Assert.AreEqual(1, _repository.DeletePlaceItem(1));
        }

        [Test]
        public void TestSetStartPlaceNull()
        {
            _repository.SetStartPlace(2, 2);
        }

        [Test]
        public void TestSetStartPlaceValid()
        {
            _repository.SetStartPlace(1, 1);
        }

        [Test]
        public void TestAddNoteItem()
        {
            var model = new NoteFormViewModel() {Title = "Note"};
            var item = _repository.AddNoteItem(model);
            Assert.NotNull(item);
            Assert.AreEqual("Note", item.Title);
        }

        [Test]
        public void UpdateNoteItemDoesntExist()
        {
            var model = new NoteFormViewModel {Title = "Note"};
            Assert.IsNull(_repository.UpdateNoteItem(5, model));
        }

        [Test]
        public void TestDeleteNoteItemDoesntExist()
        {
            Assert.AreEqual(-1, _repository.DeleteNoteItem(5));
        }

        [Test]
        public void TestDeleteNoteItemValid()
        {
            Assert.AreEqual(1, _repository.DeleteNoteItem(1));
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

            var journey1 = new Journey {Id = 0, UserId = "1", Location = "Barcelona"};
            var journey2 = new Journey {Id = 1, UserId = "1", Location = "Paris"};
            var journeys = FakeDbSet<Journey>.Create(new List<Journey>
            {
                journey1, journey2
            });
            mockContext.Setup(x => x.Journeys).Returns(journeys.Object);

            var items = FakeDbSet<JourneyItem>.Create(new List<JourneyItem>
            {
                new JourneyItem
                {
                    Id = 1, JourneyId = 1, Journey = journey1,
                    Type = JourneyItemType.Flight, Date = DateTime.Now, Airline = "Ryanair", FlightNumber = "F01",
                    Origin = "KUN", Destination = "BCN"
                },
                new JourneyItem
                {
                    Id = 2, JourneyId = 1, Journey = journey1,
                    Type = JourneyItemType.Hotel, Date = DateTime.Now, Address = "H avenue 1", Name = "Hotel"
                },
                new JourneyItem
                {
                    Id = 3, JourneyId = 1, Journey = journey1,
                    Type = JourneyItemType.Reservation, Date = DateTime.Now, Address = "R avenue 1",
                    Name = "Reservation"
                },
                new JourneyItem
                {
                    Id = 4, JourneyId = 1, Journey = journey1,
                    Type = JourneyItemType.Event, Date = DateTime.Now, Address = "E avenue 1",
                    Name = "Event"
                }
            });
            mockContext.Setup(x => x.JourneyItems).Returns(items.Object);

            var places = FakeDbSet<Place>.Create(new List<Place>
            {
                new Place
                {
                    Journey = journey1, Id = 1, JourneyId = 1, Location = "La Sagrada Familia", Address = "La Sagr Fam",
                    Latitude = 0, Longitude = 0, Rank = 0, Start = true
                }
            });
            mockContext.Setup(x => x.Places).Returns(places.Object);

            var notes = FakeDbSet<Note>.Create(new List<Note>
            {
                new Note {Journey = journey1, Id = 1, JourneyId = 1, Title = "TITLE", Text = "TEXT"}
            });
            mockContext.Setup(x => x.Notes).Returns(notes.Object);

            return mockContext.Object;
        }

        private MockFileSystem MockFileSystem()
        {
            return new MockFileSystem(new Dictionary<string, MockFileData>
            {
                {@"photos/barcelona.jpg", new MockFileData(@"1234, 100")}
            });
        }
    }
}