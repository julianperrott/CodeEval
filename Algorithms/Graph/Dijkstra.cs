using System.Collections.Generic;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Algorithms
{
    [TestClass]
    public class Dijkstra
    {
        private class Link
        {
            public int From { get; }
            public int To { get; }
            public int Distance { get; }

            public Link(int from, int to, int distance)
            {
                if (from > to)
                {
                    var temp = from;
                    from = to;
                    to = temp;
                }

                From = from;
                To = to;
                Distance = distance;
            }
        }

        private List<Link> Links;

        [TestInitialize]
        public void Initialise()
        {
            Links = new List<Link>
            {
                new Link(0,1,4),
                new Link(0,7,8),

                new Link(1,7,11),
                new Link(1,2,8),

                new Link(2,3,7),
                new Link(2,5,4),
                new Link(2,8,2),

                new Link(3,4,9),
                new Link(3,5,14),

                new Link(4,5,10),

                new Link(5,6,2),

                new Link(6,7,1),
                new Link(6,8,6),

                new Link(7,8,7),
            };
        }

        private class Node
        {
            public int Id { get; }
            public int Distance { get; }

            public Node(int id, int distance)
            {
                this.Id = id;
                this.Distance = distance;
            }
        }

        private void AssertDistance(int position, Dictionary<int, int> distanceTo, int expected)
        {
            Assert.AreEqual(expected, distanceTo[position], "Distance to " + position);
        }

        [TestMethod]
        public void TestCalculateTree()
        {
            var distanceTo = GetShortestPath(0);

            AssertDistance(0, distanceTo, 0);
            AssertDistance(1, distanceTo, 4);
            AssertDistance(2, distanceTo, 12);
            AssertDistance(3, distanceTo, 19);
            AssertDistance(4, distanceTo, 21);
            AssertDistance(5, distanceTo, 11);
            AssertDistance(6, distanceTo, 9);
            AssertDistance(7, distanceTo, 8);
            AssertDistance(8, distanceTo, 14);
        }

        private Dictionary<int, int> GetShortestPath(int position)
        {
            var distanceTo = new Dictionary<int, int> { { position, 0 } };
            var possibleLinks = GetLinksAtPosition(distanceTo, position, 0);

            while (possibleLinks.Any())
            {
                var shortest = possibleLinks.OrderBy(l => l.Distance).First();
                distanceTo.Add(shortest.Id, shortest.Distance);
                possibleLinks = possibleLinks
                    .Concat(GetLinksAtPosition(distanceTo, shortest.Id, shortest.Distance))
                    .Where(l => !distanceTo.Keys.Contains(l.Id)).ToList();
            }

            return distanceTo;
        }

        private List<Node> GetLinksAtPosition(Dictionary<int, int> distanceTo, int position, int distance)
        {
            return Links
                .Where(l => l.From == position || l.To == position)
                .Select(l => new Node(l.From == position ? l.To : l.From, distance + l.Distance))
                .ToList();
        }
    }
}