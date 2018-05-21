using System;
using System.Text;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Algorithms.LinkedList
{
    [TestClass]
    public class LinkedListInsert
    {
        private class Node<T> where T : IComparable<T>
        {
            public Node<T> Next { get; set; }
            public T Value { get; set; }

            public static Node<T> Create(T value)
            {
                return new Node<T>() { Value = value };
            }

            public Node<T> SetNext(Node<T> next)
            {
                this.Next = next;
                return next;
            }

            public static Node<T> InsertSortedValue(Node<T> head, T value)
            {
                // new head
                if (head == null || head.Value.CompareTo(value) > 0)
                {
                    var newHead = Create(value);
                    newHead.SetNext(head);
                    return newHead;
                }

                InsertSortedValueInList(head, value);

                return head;
            }

            public static void InsertSortedValueInList(Node<T> head, T value)
            {
                if (head.Next == null)
                {
                    head.SetNext(Node<T>.Create(value));
                    return;
                }

                if (head.Next.Value.CompareTo(value) > 0)
                {
                    var newNode = Create(value);
                    newNode.SetNext(head.Next);
                    head.Next = newNode;
                    return;
                }

                InsertSortedValueInList(head.Next, value);
            }
        }

        [TestMethod]
        public void Test()
        {
            // Arrange
            var head = Node<int>.Create(2);

            head
                .SetNext(Node<int>.Create(5))
                .SetNext(Node<int>.Create(7))
                .SetNext(Node<int>.Create(10))
                .SetNext(Node<int>.Create(15));

            // Asset
            var headNode = Node<int>.InsertSortedValue(head, 4);

            // Assert
            Assert.AreEqual("2,4,5,7,10,15,", ToString(headNode));
        }

        [TestMethod]
        public void Test_Null()
        {
            // Arrange
            Node<int> head = null;

            // Asset
            var headNode = Node<int>.InsertSortedValue(head, 4);

            // Assert
            Assert.AreEqual("4,", ToString(headNode));
        }

        [TestMethod]
        public void Test_Start()
        {
            // Arrange
            var head = Node<long>.Create(2);

            head
                .SetNext(Node<long>.Create(5))
                .SetNext(Node<long>.Create(7))
                .SetNext(Node<long>.Create(10))
                .SetNext(Node<long>.Create(15));

            // Asset
            var headNode = Node<long>.InsertSortedValue(head, 1);

            // Assert
            Assert.AreEqual("1,2,5,7,10,15,", ToString(headNode));
        }

        [TestMethod]
        public void Test_End()
        {
            // Arrange
            var head = Node<int>.Create(2);

            head
                .SetNext(Node<int>.Create(5))
                .SetNext(Node<int>.Create(7))
                .SetNext(Node<int>.Create(10))
                .SetNext(Node<int>.Create(15));

            // Asset
            var headNode = Node<int>.InsertSortedValue(head, 20);

            // Assert
            Assert.AreEqual("2,5,7,10,15,20,", ToString(headNode));
        }

        private static string ToString<T>(Node<T> headNode) where T : IComparable<T>
        {
            var b = new StringBuilder();
            while (headNode != null)
            {
                b.Append(headNode.Value + ",");
                headNode = headNode.Next;
            }

            return b.ToString();
        }
    }
}