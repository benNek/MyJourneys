using System;
using System.ComponentModel.DataAnnotations.Schema;
using MyJourneys.Models.Enums;

namespace MyJourneys.Models
{
    public class Article
    {
        public int Id { get; set; }
        public string AuthorId { get; set; }
        public string Title { get; set; }
        public string Text { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime ModifyDate { get; set; }
        public ArticleType ArticleType { get; set; }

        [ForeignKey("AuthorId")] public virtual User Author { get; set; }
    }
}