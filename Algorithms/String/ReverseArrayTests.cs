using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Algorithms.String
{
    [TestClass]
    public class ReverseArrayTests
    {
        [TestMethod]
        public void Test()
        {
            var array = "Ab,c,de!$".ToCharArray();
            Reverse(array);
            Assert.AreEqual("ed,c,bA!$", new string(array));
        }

        private void Reverse(char[] value)
        {
            if (value == null)
            {
                return;
            }

            var p0 = 0;
            var p1 = value.Length - 1;

            while (p0 < p1)
            {
                if (!char.IsLetter(value[p0]))
                {
                    p0++;
                    continue;
                }

                if (!char.IsLetter(value[p1]))
                {
                    p1--;
                    continue;
                }

                var temp = value[p0];
                value[p0] = value[p1];
                value[p1] = temp;

                p0++;
                p1--;
            }
        }
    }
}