using System.ComponentModel.DataAnnotations.Schema;

namespace MyJourneys.Models
{
    public class ArticleLikes
    {
        public int Id { get; set; }
        public int ArticleId { get; set; }
        public string UserId { get; set; }
        
        [ForeignKey("ArticleId")] public virtual Article Article { get; set; }
        [ForeignKey("UserId")] public virtual User User { get; set; }
    }
}