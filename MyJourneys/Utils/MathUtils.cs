using System;

namespace MyJourneys.Utils
{
    public static class MathUtils
    {
        public static double CalculateDistance(double lat1, double lon1, double lat2, double lon2)
        {
            var baseRad = Math.PI * lat1 / 180;
            var targetRad = Math.PI * lat2 / 180;
            var theta = lon1 - lon2;
            var thetaRad = Math.PI * theta / 180;

            double dist =
                Math.Sin(baseRad) * Math.Sin(targetRad) + Math.Cos(baseRad) *
                Math.Cos(targetRad) * Math.Cos(thetaRad);
            dist = Math.Acos(dist);

            dist = dist * 180 / Math.PI;
            dist = dist * 60 * 1.1515;
            return dist * 1.609344;
        }
    }
}