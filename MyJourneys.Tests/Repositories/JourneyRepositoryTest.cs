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
            Assert.AreEqual("Paris", journey.Location);
        }

        [Test]
        public void TestDeleteJourneyDoesntExist()
        {
            Assert.AreEqual(-1, _repository.DeleteJourney(7));
        }

        [Test]
        public void TestDeleteJourneyValid()
        {
            Assert.AreEqual(1, _repository.DeleteJourney(1));
            Assert.AreEqual(2, _repository.DeleteJourney(2));
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
            var journey = _repository.GetJourney(2);
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
        public void TestAddFlightItem()
        {
            var model = new FlightItemFormViewModel {Airline = "Ryanair"};
            var item = _repository.AddFlightItem(model);
            Assert.NotNull(item);
            Assert.AreEqual("Ryanair", item.Airline);
            Assert.AreEqual(JourneyItemType.Flight.ToString(), item.Type);
        }

        [Test]
        public void TestDeleteFlightItemDoesntExist()
        {
            Assert.AreEqual(-1, _repository.DeleteFlightItem(5));
        }

        [Test]
        public void TestDeleteFlightItemValid()
        {
            Assert.AreEqual(1, _repository.DeleteFlightItem(1));
        }

        [Test]
        public void TestAddHotelItem()
        {
            var model = new CommonItemFormViewModel {Name = "Hotel"};
            var item = _repository.AddHotelItem(model);
            Assert.NotNull(item);
            Assert.AreEqual("Hotel", item.Name);
            Assert.AreEqual(JourneyItemType.Hotel.ToString(), item.Type);
        }

        [Test]
        public void TestDeleteHotelItemDoesntExist()
        {
            Assert.AreEqual(-1, _repository.DeleteHotelItem(5));
        }

        [Test]
        public void TestDeleteHotelItemValid()
        {
            Assert.AreEqual(1, _repository.DeleteHotelItem(1));
        }

        [Test]
        public void TestAddReservationItem()
        {
            var model = new CommonItemFormViewModel {Name = "Reservation"};
            var item = _repository.AddReservationItem(model);
            Assert.NotNull(item);
            Assert.AreEqual("Reservation", item.Name);
            Assert.AreEqual(JourneyItemType.Reservation.ToString(), item.Type);
        }

        [Test]
        public void TestDeleteReservationItemDoesntExist()
        {
            Assert.AreEqual(-1, _repository.DeleteReservationItem(5));
        }

        [Test]
        public void TestDeleteReservationItemValid()
        {
            Assert.AreEqual(1, _repository.DeleteReservationItem(1));
        }

        [Test]
        public void TestAddEventItem()
        {
            var model = new CommonItemFormViewModel {Name = "Event"};
            var item = _repository.AddEventItem(model);
            Assert.NotNull(item);
            Assert.AreEqual("Event", item.Name);
            Assert.AreEqual(JourneyItemType.Event.ToString(), item.Type);
        }

        [Test]
        public void TestDeleteEventItemDoesntExist()
        {
            Assert.AreEqual(-1, _repository.DeleteEventItem(5));
        }

        [Test]
        public void TestDeleteEventItemValid()
        {
            Assert.AreEqual(1, _repository.DeleteEventItem(1));
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

            var journeys = FakeDbSet<Journey>.Create(new List<Journey>
            {
                new Journey {Id = 1, UserId = "1", Location = "Barcelona"},
                new Journey {Id = 2, UserId = "1", Location = "Paris"}
            });
            mockContext.Setup(x => x.Journeys).Returns(journeys.Object);

            var flights = FakeDbSet<FlightItem>.Create(new List<FlightItem>
            {
                new FlightItem
                {
                    JourneyId = 1, Id = 1, Date = DateTime.Now, Airline = "Ryanair", FlightNumber = "F01",
                    Origin = "KUN", Destination = "BCN"
                }
            });
            mockContext.Setup(x => x.FlightItems).Returns(flights.Object);

            var hotels = FakeDbSet<HotelItem>.Create(new List<HotelItem>
            {
                new HotelItem
                {
                    JourneyId = 1, Id = 1, Date = DateTime.Now, Address = "Rue 1, Barcelona"
                }
            });
            mockContext.Setup(x => x.HotelItems).Returns(hotels.Object);

            var reservations = FakeDbSet<ReservationItem>.Create(new List<ReservationItem>
            {
                new ReservationItem
                {
                    JourneyId = 1, Id = 1, Date = DateTime.Now, Address = "Rue 1, Barcelona"
                }
            });
            mockContext.Setup(x => x.ReservationItems).Returns(reservations.Object);

            var events = FakeDbSet<EventItem>.Create(new List<EventItem>
            {
                new EventItem
                {
                    JourneyId = 1, Id = 1, Date = DateTime.Now, Address = "Rue 1, Barcelona"
                }
            });
            mockContext.Setup(x => x.EventItems).Returns(events.Object);

            var places = FakeDbSet<Place>.Create(new List<Place>
            {
                new Place
                {
                    Id = 1, JourneyId = 1, Location = "La Sagrada Familia", Address = "La Sagr Fam",
                    Latitude = 0, Longitude = 0, Rank = 0, Start = true
                }
            });
            mockContext.Setup(x => x.Places).Returns(places.Object);

            var notes = FakeDbSet<Note>.Create(new List<Note>
            {
                new Note {Id = 1, JourneyId = 1, Title = "TITLE", Text = "TEXT"}
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