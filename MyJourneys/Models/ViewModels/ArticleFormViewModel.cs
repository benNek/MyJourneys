using System.Collections.Generic;

namespace MyJourneys.Models.ViewModels
{
    public class ArticleFormViewModel
    {
        public string Title { get; set; }
        public List<string> Tags { get; set; } 
        public string Text { get; set; }
    }
}