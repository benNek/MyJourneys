using System;
using System.Collections.Generic;
using MyJourneys.Models;
using MyJourneys.Repositories;
using MyJourneys.Utils;

namespace MyJourneys.Services
{
    public class JourneyService : IJourneyService
    {
        private IJourneyRepository _journeyRepository;

        public JourneyService(IJourneyRepository journeyRepository)
        {
            _journeyRepository = journeyRepository;
        }

        public void ReorderPlaces(string userId, int journeyId)
        {
            List<Place> places = _journeyRepository.GetPlaceObjects(userId, journeyId);
            double[,] graph = ResolveGraph(places);
            int[] parent = ResolvePrimMstPath(places.Count, graph);
            Console.WriteLine("Edge \tWeight"); 
            for (int i = 1; i < places.Count; i++) 
                System.Diagnostics.Debug.WriteLine(parent[i] + " - " + i + "\t" + graph[i, parent[i]]);
        }

        private double[,] ResolveGraph(List<Place> places)
        {
            int vertices = places.Count;
            double[,] graph = new double[vertices, vertices];

            for (int i = 0; i < vertices; i++)
            {
                for (int j = 0; j < vertices; j++)
                {
                    graph[i, j] = MathUtils.CalculateDistance(places[i].Latitude, places[i].Longitude,
                        places[j].Latitude, places[j].Longitude);
                }
            }

            return graph;
        }

        private int[] ResolvePrimMstPath(int vertices, double[,] graph)
        {
            int[] parent = new int[vertices];
            double[] key = new double[vertices];

            bool[] mstSet = new bool[vertices];

            for (int i = 0; i < vertices; i++)
            {
                key[i] = double.MaxValue;
            }

            key[0] = 0;
            parent[0] = -1;

            for (int count = 0; count < vertices - 1; count++)
            {
                int u = MinKey(key, mstSet);
                mstSet[u] = true;

                for (int v = 0; v < vertices; v++)
                {
                    if (Math.Abs(graph[u, v]) > 0.001 && !mstSet[v] && graph[u, v] < key[v])
                    {
                        parent[v] = u;
                        key[v] = graph[u, v];
                    }
                }
            }

            return parent;
        }

        private int MinKey(double[] key, bool[] mstSet)
        {
            double min = double.MaxValue;
            int minIndex = -1;
            for (int v = 0; v < mstSet.Length; v++)
            {
                if (!mstSet[v] && key[v] < min)
                {
                    min = key[v];
                    minIndex = v;
                }
            }

            return minIndex;
        }
    }
}