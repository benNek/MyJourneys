using System;

namespace MyJourneys.Utils
{
    public class MathUtils
    {
        public static double CalculateDistance(double lat1, double lon1, double lat2, double lon2)
        {
            return Math.Sqrt(Math.Pow(lat2 - lat1, 2) + Math.Pow(lon2 - lon1, 2));
        }
    }
}