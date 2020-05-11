using System;
using System.Collections.Generic;
using MyJourneys.Models;
using MyJourneys.Models.ViewModels;
using MyJourneys.Repositories;
using MyJourneys.Utils;

namespace MyJourneys.Services
{
    public class JourneyService : IJourneyService
    {
        private readonly IJourneyRepository _journeyRepository;

        public JourneyService(IJourneyRepository journeyRepository)
        {
            _journeyRepository = journeyRepository;
        }

        // TSP (Approximate using Prim algorithm for MST)
        // https://www.geeksforgeeks.org/travelling-salesman-problem-set-2-approximate-using-mst/
        public List<PlaceViewModel> ReorderPlaces(int journeyId)
        {
            List<Place> places = _journeyRepository.GetPlaceObjects(journeyId);
            int start = places.FindIndex(place => place.Start);
            if (start == -1)
            {
                return _journeyRepository.GetPlaces(journeyId);
            }

            double[,] graph = ResolveGraph(places);
            int[] parent = ResolvePrimMst(start, places.Count, graph);
            UpdateRanks(start, parent, places);

            return _journeyRepository.GetPlaces(journeyId);
        }

        private void UpdateRanks(int start, IReadOnlyList<int> parent, IReadOnlyList<Place> places)
        {
            int vertex = start;
            int rank = 9999;
            Stack<int> dfs = new Stack<int>();
            bool[] visited = new bool[parent.Count];
            dfs.Push(vertex);
            while (dfs.Count > 0)
            {
                vertex = dfs.Pop();
                visited[vertex] = true;
                _journeyRepository.UpdatePlaceRank(places[vertex].Id, rank--);
                for (int i = 0; i < parent.Count; i++)
                {
                    if (parent[i] == vertex && !visited[i])
                    {
                        dfs.Push(i);
                    }
                }
            }
        }

        private static double[,] ResolveGraph(IReadOnlyList<Place> places)
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

        private static int[] ResolvePrimMst(int start, int vertices, double[,] graph)
        {
            int[] parent = new int[vertices];
            double[] key = new double[vertices];

            bool[] mstSet = new bool[vertices];

            for (int i = 0; i < vertices; i++)
            {
                key[i] = double.MaxValue;
            }

            key[start] = 0;
            parent[start] = -1;

            for (int count = 0; count < vertices - 1; count++)
            {
                int u = MinKey(key, mstSet);
                mstSet[u] = true;

                for (int v = 0; v < vertices; v++)
                {
                    if (!(Math.Abs(graph[u, v]) > 0.001) || mstSet[v] || !(graph[u, v] < key[v])) continue;
                    parent[v] = u;
                    key[v] = graph[u, v];
                }
            }

            return parent;
        }

        private static int MinKey(IReadOnlyList<double> key, IReadOnlyList<bool> mstSet)
        {
            double min = double.MaxValue;
            int minIndex = -1;
            for (int v = 0; v < mstSet.Count; v++)
            {
                if (mstSet[v] || !(key[v] < min)) continue;
                min = key[v];
                minIndex = v;
            }

            return minIndex;
        }
    }
}