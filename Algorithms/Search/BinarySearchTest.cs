using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Algorithms.Search
{
    [TestClass]
    public class BinarySearchTest
    {
        [TestMethod]
        public void Test_InMiddleOfList()
        {
            var items = new List<int> { 2, 5, 8, 12, 16, 23, 38, 56, 72, 91 };
            Assert.AreEqual(4, BinarySearch<int>.Search(items, 16));
        }

        [TestMethod]
        public void Test_FirstItem()
        {
            var items = new List<int> { 2, 5, 8, 12, 16, 23, 38, 56, 72, 91 };
            Assert.AreEqual(0, BinarySearch<int>.Search(items, 2));
        }

        [TestMethod]
        public void Test_LastItem()
        {
            var items = new List<int> { 2, 5, 8, 12, 16, 23, 38, 56, 72, 91 };
            Assert.AreEqual(9, BinarySearch<int>.Search(items, 91));
        }

        [TestMethod]
        public void Test_InRangeNotFound()
        {
            var items = new List<int> { 2, 5, 8, 12, 16, 23, 38, 56, 72, 91 };
            Assert.AreEqual(-1, BinarySearch<int>.Search(items, 15));
        }

        [TestMethod]
        public void Test_BelowRangeNotFound()
        {
            var items = new List<int> { 2, 5, 8, 12, 16, 23, 38, 56, 72, 91 };
            Assert.AreEqual(-1, BinarySearch<int>.Search(items, 1));
        }

        [TestMethod]
        public void Test_AboveRangeNotFound()
        {
            var items = new List<int> { 2, 5, 8, 12, 16, 23, 38, 56, 72, 91 };
            Assert.AreEqual(-1, BinarySearch<int>.Search(items, 92));
        }

        public static class BinarySearch<T> where T : IComparable
        {
            public static int Search(List<T> items, T searchValue)
            {
                return Search(0, items.Count, items, searchValue);
            }

            private static int Search(int startIndex, int endIndex, List<T> items, T searchValue)
            {
                if (items == null || items.Count() == 0 || startIndex == items.Count || endIndex < startIndex)
                {
                    return -1;
                }

                int middleIndex = ((endIndex - startIndex) / 2) + startIndex;

                if (items[middleIndex].Equals(searchValue))
                {
                    return middleIndex;
                }

                if (items[middleIndex].CompareTo(searchValue) < 1)
                {
                    return Search(middleIndex + 1, endIndex, items, searchValue);
                }

                return Search(startIndex, middleIndex - 1, items, searchValue);
            }
        }
    }
}