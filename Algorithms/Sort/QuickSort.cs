using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Algorithms.Sort
{
    [TestClass]
    public class QuickSortTests
    {
        public class QuickSort<T> where T : IComparable
        {
            private static int Partition(T[] arr, int startIndex, int endIndex)
            {
                T pivot = arr[endIndex];

                int indexAfterSmallerValues = startIndex - 1;

                for (int i = startIndex; i < endIndex; i++)
                {
                    // If current element is smaller than or equal to pivot
                    if (arr[i].CompareTo(pivot) < 0)
                    {
                        indexAfterSmallerValues++;
                        T temp = arr[indexAfterSmallerValues];
                        arr[indexAfterSmallerValues] = arr[i];
                        arr[i] = temp;
                    }
                }

                T temp1 = arr[indexAfterSmallerValues + 1];
                arr[indexAfterSmallerValues + 1] = arr[endIndex];
                arr[endIndex] = temp1;

                return indexAfterSmallerValues + 1;
            }

            public static void Sort(T[] arr, int startIndex, int endIndex)
            {
                if (startIndex < endIndex)
                {
                    int partitioningIndex = Partition(arr, startIndex, endIndex);

                    Sort(arr, startIndex, partitioningIndex - 1); // before partitioningIndex

                    Sort(arr, partitioningIndex + 1, endIndex); // after partitioningIndex
                }
            }
        }

        [TestMethod]
        public void TestInt()
        {
            // Arrange
            int[] arr = { 10, 7, 8, 9, 1, 5 };
            int n = arr.Length;

            // Act
            QuickSort<int>.Sort(arr, 0, n - 1);

            // Assert
            Console.WriteLine("sorted array " + string.Join(",", arr));
            Assert.AreEqual("1,5,7,8,9,10", string.Join(",", arr));
        }

        [TestMethod]
        public void TestChar()
        {
            // Arrange
            char[] arr = { 'z', 'a', 'c', 'd', 'x', 'v' };
            int n = arr.Length;

            // Act
            QuickSort<char>.Sort(arr, 0, n - 1);

            // Assert
            Console.WriteLine("sorted array " + string.Join(",", arr));
            Assert.AreEqual("a,c,d,v,x,z", string.Join(",", arr));
        }
    }
}