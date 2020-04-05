using System.Collections.Generic;

namespace MyJourneys.Models
{
    public class Tag
    {
        public int Id { get; set; }
        public string Name { get; set; }
        
        public virtual ICollection<ArticleTags> ArticleTags { get; set; }
    }
}