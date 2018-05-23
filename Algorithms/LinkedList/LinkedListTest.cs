using System;
using System.Text;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Algorithms.LinkedList
{
    /*
     https://www.geeksforgeeks.org/given-a-linked-list-which-is-sorted-how-will-you-insert-in-sorted-way/
     https://www.geeksforgeeks.org/delete-a-given-node-in-linked-list-under-given-constraints/
     */

    [TestClass]
    public class LinkedListTest
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

            internal static void Delete(Node<int> head, Node<int> nodeToDelete)
            {
                if (head == null)
                {
                    return;
                }

                if (nodeToDelete == head)
                {
                    head.Value = head.Next.Value;
                    head.Next = head.Next.Next;
                    return;
                }

                if (head.Next == nodeToDelete)
                {
                    head.Next = head.Next.Next;
                    return;
                }

                Delete(head.Next, nodeToDelete);
            }
        }

        [TestMethod]
        public void Test_Insert()
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
        public void Test_Insert_Null()
        {
            // Arrange
            Node<int> head = null;

            // Asset
            var headNode = Node<int>.InsertSortedValue(head, 4);

            // Assert
            Assert.AreEqual("4,", ToString(headNode));
        }

        [TestMethod]
        public void Test_Insert_Start()
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
        public void Test_Insert_End()
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

        [TestMethod]
        public void Test_Delete()
        {
            // Arrange
            var head = Node<int>.Create(2);

            var nodeToDelete = Node<int>.Create(7);

            head
                .SetNext(Node<int>.Create(5))
                .SetNext(nodeToDelete)
                .SetNext(Node<int>.Create(10))
                .SetNext(Node<int>.Create(15));

            // Asset
            Node<int>.Delete(head, nodeToDelete);

            // Assert
            Assert.AreEqual("2,5,10,15,", ToString(head));
        }

        [TestMethod]
        public void Test_Delete_Last()
        {
            // Arrange
            var head = Node<int>.Create(2);

            var nodeToDelete = Node<int>.Create(15);

            head
                .SetNext(Node<int>.Create(5))
                .SetNext(Node<int>.Create(7))
                .SetNext(Node<int>.Create(10))
                .SetNext(nodeToDelete);

            // Asset
            Node<int>.Delete(head, nodeToDelete);

            // Assert
            Assert.AreEqual("2,5,7,10,", ToString(head));
        }

        [TestMethod]
        public void Test_Delete_Head()
        {
            // Arrange
            var head = Node<int>.Create(2);

            head
                .SetNext(Node<int>.Create(5))
                .SetNext(Node<int>.Create(7))
                .SetNext(Node<int>.Create(10))
                .SetNext(Node<int>.Create(15));

            // Asset
            Node<int>.Delete(head, head);

            // Assert
            Assert.AreEqual("5,7,10,15,", ToString(head));
        }

        [TestMethod]
        public void Test_Delete_Unknown()
        {
            // Arrange
            var head = Node<int>.Create(2);

            head
                .SetNext(Node<int>.Create(5))
                .SetNext(Node<int>.Create(7))
                .SetNext(Node<int>.Create(10))
                .SetNext(Node<int>.Create(15));

            // Asset
            Node<int>.Delete(head, Node<int>.Create(1));

            // Assert
            Assert.AreEqual("2,5,7,10,15,", ToString(head));
        }

        [TestMethod]
        public void Test_CompareChar_LastGreater()
        {
            // Arrange
            var string1 = Node<char>.Create('g');
            Append(string1, "eeksa");

            var string2 = Node<char>.Create('g');
            Append(string2, "eeksb");

            Assert.AreEqual(-1, Compare(string1, string2));
        }

        [TestMethod]
        public void Test_CompareChar_FirstGreater()
        {
            // Arrange
            var string1 = Node<char>.Create('g');
            Append(string1, "eeksb");

            var string2 = Node<char>.Create('g');
            Append(string2, "eeksa");

            Assert.AreEqual(1, Compare(string1, string2));
        }

        [TestMethod]
        public void Test_CompareChar_FirstLonger()
        {
            // Arrange
            var string1 = Node<char>.Create('g');
            Append(string1, "eeksa");

            var string2 = Node<char>.Create('g');
            Append(string2, "eeks");

            Assert.AreEqual(1, Compare(string1, string2));
        }

        [TestMethod]
        public void Test_CompareChar_LastLonger()
        {
            // Arrange
            var string1 = Node<char>.Create('g');
            Append(string1, "eeks");

            var string2 = Node<char>.Create('g');
            Append(string2, "eeksa");

            Assert.AreEqual(-1, Compare(string1, string2));
        }

        [TestMethod]
        public void Test_CompareChar_Same()
        {
            // Arrange
            var string1 = Node<char>.Create('g');
            Append(string1, "eeks");

            var string2 = Node<char>.Create('g');
            Append(string2, "eeks");

            Assert.AreEqual(0, Compare(string1, string2));
        }

        private int Compare(Node<char> string1, Node<char> string2)
        {
            if (string1 == null && string2 == null)
            {
                return 0; // both have no further characters
            }

            if (string1 == null && string2 != null)
            {
                return -1; // string 2 is longer
            }

            if (string1 != null && string2 == null)
            {
                return 1; // string 1 is longer
            }

            if (string1.Value != string2.Value)
            {
                return string1.Value > string2.Value ? 1 : -1;
            }

            return Compare(string1.Next, string2.Next);
        }

        private static void Append(Node<char> head, string str)
        {
            var previous = head;

            for (int i = 0; i < str.Length; i++)
            {
                previous = previous.SetNext(Node<char>.Create(str[i]));
            }
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

        [TestMethod]
        public void Test_Add_List1Shorter()
        {
            // Arrange
            var head = Node<int>.Create(2);
            head
                .SetNext(Node<int>.Create(5))
                .SetNext(Node<int>.Create(7))
                .SetNext(Node<int>.Create(10))
                .SetNext(Node<int>.Create(15));

            // Asset
            Node<int>.Delete(head, Node<int>.Create(1));

            // Assert
            Assert.AreEqual("2,5,7,10,15,", ToString(head));
        }
    }
}