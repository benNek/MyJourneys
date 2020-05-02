using MyJourneys.Utils;
using NUnit.Framework;

namespace MyJourneys.Tests.Utils
{
    // Distances calculated on https://gps-coordinates.org/distance-between-coordinates.php
    [TestFixture]
    public class MathUtilsTest
    {
        [Test]
        public void TestCalculateDistanceVilniusAndKaunas()
        {
            Assert.AreEqual(91.29, MathUtils.CalculateDistance(54.898521, 23.903597, 54.687157, 25.279652), 0.01);
        }

        [Test]
        public void TestCalculateDistanceNewYorkAndLondon()
        {
            Assert.AreEqual(5564.61, MathUtils.CalculateDistance(40.730610, -73.935242, 51.509865, -0.118092), 0.01);
        }
    }
}