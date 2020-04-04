using System.Collections.Generic;

namespace MyJourneys.Models
{
    public class ArticleTag
    {
        public int Id { get; set; }
        public string Tag { get; set; }
        
        public virtual ICollection<BlogTags> BlogTags { get; set; }
    }
}