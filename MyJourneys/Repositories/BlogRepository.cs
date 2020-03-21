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
        private readonly IUserRepository _userRepository;

        public BlogRepository(IUserRepository userRepository)
        {
            _context = new TravelContext();
            _userRepository = userRepository;
        }

        public BlogViewModel GetBlog(int id)
        {
            return _context.Blogs.Where(blog => blog.Id == id).Select(blog => new BlogViewModel
            {
                Id = blog.Id,
                AuthorName = _userRepository.GetUserById(blog.AuthorId).UserName,
                Title = blog.Title,
                Text = blog.Text,
                CreateDate = blog.CreateDate
            }).FirstOrDefault();
        }

        public List<BlogViewModel> GetBlogs()
        {
            return _context.Blogs.Select(blog => new BlogViewModel
            {
                Id = blog.Id,
                AuthorName = _userRepository.GetUserById(blog.AuthorId).UserName,
                Title = blog.Title,
                Text = blog.Text,
                CreateDate = blog.CreateDate
            }).ToList();
        }

        public void AddBlog(BlogCreationViewModel model)
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