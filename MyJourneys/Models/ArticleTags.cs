using System.ComponentModel.DataAnnotations.Schema;

namespace MyJourneys.Models
{
    public class ArticleTags
    {
        public int Id { get; set; }
        public int ArticleId { get; set; }
        public int TagId { get; set; }
        
        [ForeignKey("ArticleId")] public virtual Article Article { get; set; }
        [ForeignKey("TagId")] public virtual Tag Tag { get; set; }
    }
}