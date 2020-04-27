using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

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
        public bool Confirmed { get; set; }

        [JsonIgnore]
        [ForeignKey("AuthorId")] public virtual User Author { get; set; }
        [JsonIgnore]
        public virtual ICollection<ArticleTags> ArticleTags { get; set; }
        [JsonIgnore]
        public virtual ICollection<ArticleLikes> ArticleLikes { get; set; }
    }
}