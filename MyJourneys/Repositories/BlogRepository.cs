using System;
using System.Collections.Generic;
using System.Linq;
using MyJourneys.Data;
using MyJourneys.Models;
using MyJourneys.Models.ViewModels;

namespace MyJourneys.Repositories
{
    public class BlogRepository : IBlogRepository
    {
        private readonly TravelContext _context;

        public BlogRepository()
        {
            _context = new TravelContext();
        }

        public List<Blog> GetBlogs()
        {
            return _context.Blogs.ToList();
        }

        public void AddBlog(BlogViewModel model)
        {
            _context.Blogs.Add(new Blog
            {
                Title = model.Title,
                Text = model.Text,
                AuthorId = model.AuthorId,
                CreateDate = DateTime.UtcNow,
                ModifyDate = DateTime.UtcNow
            });
            _context.SaveChanges();
        }
    }
}