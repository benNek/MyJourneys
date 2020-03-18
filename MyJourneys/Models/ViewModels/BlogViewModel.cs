using System;

namespace MyJourneys.Models.ViewModels
{
    public class BlogViewModel
    {
        public int Id { get; set; }
        public string AuthorName { get; set; }
        public string Title { get; set; }
        public string Text { get; set; }
        public DateTime CreateDate { get; set; }
    }
}