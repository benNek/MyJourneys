using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyJourneys.Models
{
    public class Blog
    {
        public int Id { get; set; }
        public string AuthorId { get; set; }
        public string Title { get; set; }
        public string Text { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime ModifyDate { get; set; }

        [ForeignKey("AuthorId")] public virtual User Author { get; set; }
    }
}