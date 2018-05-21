using System.Collections.Generic;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Algorithms
{
    [TestClass]
    public class DepthAndBreadthFirstSearchTests
    {
        /*
        https://en.wikipedia.org/wiki/Breadth-first_search
        Breadth-first search (BFS) is an algorithm for traversing or searching tree or graph data structures. It starts at the tree root (or some arbitrary node of a graph, sometimes referred to as a 'search key'[1]) and explores the neighbor nodes first, before moving to the next level neighbors.

        https://en.wikipedia.org/wiki/Depth-first_search
        Depth-first search (DFS) is an algorithm for traversing or searching tree or graph data structures. One starts at the root (selecting some arbitrary node as the root in the case of a graph) and explores as far as possible along each branch before backtracking.
        */

        private List<Node> graph;

        private class Node
        {
            public List<int> Edges { get; } = new List<int>();

            public void AddEdge(int edge)
            {
                if (!Edges.Contains(edge))
                {
                    Edges.Add(edge);
                }
            }
        }

        [TestMethod]
        public void BFS0()
        {
            Assert.AreEqual("0123", BreadthFirstSearch(0));
        }

        [TestMethod]
        public void BFS1()
        {
            Assert.AreEqual("1203", BreadthFirstSearch(1));
        }

        [TestMethod]
        public void BFS2()
        {
            Assert.AreEqual("2031", BreadthFirstSearch(2));
        }

        [TestMethod]
        public void BFS3()
        {
            Assert.AreEqual("3", BreadthFirstSearch(3));
        }

        [TestMethod]
        public void DFS0()
        {
            Assert.AreEqual("0123", DepthFirstSearch(0));
        }

        [TestMethod]
        public void DFS1()
        {
            Assert.AreEqual("1203", DepthFirstSearch(1));
        }

        [TestMethod]
        public void DFS2()
        {
            Assert.AreEqual("2013", DepthFirstSearch(2));
        }

        [TestMethod]
        public void DFS3()
        {
            Assert.AreEqual("3", DepthFirstSearch(3));
        }

        [TestInitialize]
        public void Initialise()
        {
            graph = new List<Node>();

            graph.Add(new Node());
            graph.Add(new Node());
            graph.Add(new Node());
            graph.Add(new Node());

            graph[0].AddEdge(1);
            graph[0].AddEdge(2);

            graph[1].AddEdge(2);
            graph[2].AddEdge(0);
            graph[2].AddEdge(3);
            graph[3].AddEdge(3);
        }

        private string BreadthFirstSearch(int startNode)
        {
            var visited = new List<int> { startNode };
            BreadthFirstSearch(graph[startNode], visited);
            return string.Join(string.Empty, visited);
        }

        private void BreadthFirstSearch(Node currentNode, List<int> visited)
        {
            var unknownEdges = currentNode.Edges.Where(e => !visited.Contains(e)).ToList();
            if (unknownEdges.Any())
            {
                unknownEdges.ForEach(i => visited.Add(i));
                unknownEdges.ForEach(i => BreadthFirstSearch(graph[i], visited));
            }
        }

        private string DepthFirstSearch(int startNode)
        {
            var visited = new List<int> { startNode };
            DepthFirstSearch(graph[startNode], visited);
            return string.Join(string.Empty, visited);
        }

        private void DepthFirstSearch(Node currentNode, List<int> visited)
        {
            var unknownEdges = currentNode.Edges.Where(e => !visited.Contains(e)).ToList();

            if (unknownEdges.Any())
            {
                visited.Add(unknownEdges.First());
                DepthFirstSearch(graph[unknownEdges.First()], visited);
                DepthFirstSearch(currentNode, visited);
            }
        }
    }
}