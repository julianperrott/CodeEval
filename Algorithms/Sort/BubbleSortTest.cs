using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Algorithms.Sort
{
    [TestClass]
    public class BubbleSortTest
    {
        [TestMethod]
        public void Test()
        {
            var items = new int[] { 5, 1, 4, 2, 8 };
            BubbleSort<int>.Sort(items);
            Assert.AreEqual("1,2,4,5,8", string.Join(",", items));
        }

        [TestMethod]
        public void Test_Duplicates()
        {
            var items = new int[] { 5, 1, 4, 2, 8, 4 };
            BubbleSort<int>.Sort(items);
            Assert.AreEqual("1,2,4,4,5,8", string.Join(",", items));
        }

        [TestMethod]
        public void Test_EmptyList()
        {
            var items = new int[] { };
            BubbleSort<int>.Sort(items);
            Assert.AreEqual("", string.Join(",", items));
        }

        public static class BubbleSort<T> where T : IComparable
        {
            public static void Sort(T[] items)
            {
                for (var i = 0; i < items.Length - 1; i++)
                {
                    for (var j = 0; j < items.Length - 1 - i; j++)
                    {
                        if (items[j].CompareTo(items[j + 1]) > 0)
                        {
                            var temp = items[j];
                            items[j] = items[j + 1];
                            items[j + 1] = temp;
                        }
                    }
                }
            }
        }
    }
}