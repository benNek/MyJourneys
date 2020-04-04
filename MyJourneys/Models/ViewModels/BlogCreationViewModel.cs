using System.Collections.Generic;

namespace MyJourneys.Models.ViewModels
{
    public class BlogCreationViewModel
    {
        public string Title { get; set; }
        public List<string> Tags { get; set; } 
        public string Text { get; set; }
    }
}