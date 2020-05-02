using System.IO;
using System.Text;
using Microsoft.AspNetCore.Http;
using Moq;
using MyJourneys.Utils;
using NUnit.Framework;

namespace MyJourneys.Tests.Utils
{
    [TestFixture]
    public class FileUtilsTest
    {
        [Test]
        public void ConvertBytesToMegabytesOne()
        {
            Assert.AreEqual(1, FileUtils.ConvertBytesToMegaBytes(1048576), 0.0001);
        }

        [Test]
        public void ConvertBytesToMegabytesFive()
        {
            Assert.AreEqual(5, FileUtils.ConvertBytesToMegaBytes(5242880), 0.0001);
        }

        [Test]
        public void IsValidImageSignatureNull()
        {
            Assert.IsFalse(FileUtils.IsValidImageSignature(null));
        }

        [Test]
        public void IsValidImageSignatureUnknownExtension()
        {
            var file = new Mock<IFormFile>();
            file.Setup(x => x.FileName).Returns(".gif");
            Assert.IsFalse(FileUtils.IsValidImageSignature(file.Object));
        }

        [Test]
        public void IsValidImageSignatureJpg()
        {
            var file = new Mock<IFormFile>();
            file.Setup(x => x.FileName).Returns(".jpg");
            using (var stream = new MemoryStream(new byte[] {255, 216, 255, 224}))
            {
                file.Setup(x => x.OpenReadStream()).Returns(stream);
                Assert.IsTrue(FileUtils.IsValidImageSignature(file.Object));
            }
        }
        
        [Test]
        public void IsValidImageSignatureJpgSecondary()
        {
            var file = new Mock<IFormFile>();
            file.Setup(x => x.FileName).Returns(".jpg");
            using (var stream = new MemoryStream(new byte[] {255, 216, 255, 225}))
            {
                file.Setup(x => x.OpenReadStream()).Returns(stream);
                Assert.IsTrue(FileUtils.IsValidImageSignature(file.Object));
            }
        }
        
        [Test]
        public void IsValidImageSignaturePng()
        {
            var file = new Mock<IFormFile>();
            file.Setup(x => x.FileName).Returns(".png");
            using (var stream = new MemoryStream(new byte[] {137, 80, 78, 71}))
            {
                file.Setup(x => x.OpenReadStream()).Returns(stream);
                Assert.IsTrue(FileUtils.IsValidImageSignature(file.Object));
            }
        }
    }
}