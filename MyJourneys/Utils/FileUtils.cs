using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Http;

namespace MyJourneys.Utils
{
    public static class FileUtils
    {
        private static readonly Dictionary<string, List<byte[]>> FileSignatures =
            new Dictionary<string, List<byte[]>>
            {
                {
                    ".jpg", new List<byte[]>
                    {
                        new byte[] {255, 216, 255, 224},
                        new byte[] {255, 216, 255, 225}
                    }
                },
                {
                    ".png", new List<byte[]>
                    {
                        new byte[] {137, 80, 78, 71}
                    }
                }
            };

        public static double ConvertBytesToMegaBytes(long bytes)
        {
            return bytes / Math.Pow(1024, 2);
        }

        public static bool IsValidImageSignature(IFormFile file)
        {
            if (file == null)
            {
                return false;
            }

            var extension = Path.GetExtension(file.FileName);
            if (!FileSignatures.ContainsKey(extension))
            {
                return false;
            }

            using (var reader = new BinaryReader(file.OpenReadStream()))
            {
                var signatures = FileSignatures[extension];
                var headerBytes = reader.ReadBytes(signatures.Max(m => m.Length));
                return signatures.Any(signature =>
                    headerBytes.Take(signature.Length).SequenceEqual(signature));
            }
        }
    }
}