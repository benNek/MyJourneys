using System.ComponentModel.DataAnnotations.Schema;

namespace MyJourneys.Models
{
    public class BlogTags
    {
        public int Id { get; set; }
        public int BlogId { get; set; }
        public int TagId { get; set; }
        
        [ForeignKey("BlogId")] public virtual Blog Blog { get; set; }
        [ForeignKey("TagId")] public virtual ArticleTag ArticleTag { get; set; }
    }
}