using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Moq;

namespace MyJourneys.Tests
{
    public class FakeDbSet<T> where T : class
    {
        public static Mock<DbSet<T>> Create(List<T> data)
        {
            var query = data.AsQueryable();
            var mockSet = new Mock<DbSet<T>>();
            mockSet.As<IQueryable<T>>().Setup(m => m.Provider).Returns(query.Provider);
            mockSet.As<IQueryable<T>>().Setup(m => m.Expression).Returns(query.Expression);
            mockSet.As<IQueryable<T>>().Setup(m => m.ElementType).Returns(query.ElementType);
            mockSet.As<IQueryable<T>>().Setup(m => m.GetEnumerator()).Returns(query.GetEnumerator());
            return mockSet;
        }
    }
}