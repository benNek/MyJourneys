using System;
using System.Collections.Generic;
using System.Linq;
using MyJourneys.Data;
using MyJourneys.Models;
using MyJourneys.Models.ViewModels;

namespace MyJourneys.Repositories
{
    public class ArticleRepository : IArticleRepository
    {
        private const int PopularLimit = 20;

        private readonly TravelContext _context;
        private readonly IUserRepository _userRepository;

        public ArticleRepository(IUserRepository userRepository)
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
                Tags = blog.BlogTags.Select(tag => tag.ArticleTag.Tag).ToList(),
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
                Tags = blog.BlogTags.Select(tag => tag.ArticleTag.Tag).ToList(),
                CreateDate = blog.CreateDate
            }).ToList();
        }

        public List<BlogViewModel> GetBlogsByTag(string tagName)
        {
            return _context.Blogs
                .Where(blog => blog.BlogTags.Any(blogTag => blogTag.ArticleTag.Tag.Equals(tagName)))
                .Select(blog => new BlogViewModel
                {
                    Id = blog.Id,
                    AuthorName = _userRepository.GetUserById(blog.AuthorId).UserName,
                    Title = blog.Title,
                    Text = blog.Text,
                    Tags = blog.BlogTags.Select(tag => tag.ArticleTag.Tag).ToList(),
                    CreateDate = blog.CreateDate
                }).ToList();
        }

        public void AddBlog(string userId, BlogCreationViewModel model)
        {
            var blog = new Blog
            {
                Title = model.Title,
                Text = model.Text,
                AuthorId = userId,
                CreateDate = DateTime.UtcNow,
                ModifyDate = DateTime.UtcNow
            };
            _context.Blogs.Add(blog);
            _context.SaveChanges();
            AddBlogTags(blog.Id, model.Tags);
        }

        public void AddBlogTags(int blogId, List<string> tags)
        {
            foreach (string tag in tags)
            {
                var tagId = GetTag(tag).Id;
                _context.BlogTags.Add(new BlogTags
                {
                    TagId = tagId,
                    BlogId = blogId
                });
            }

            _context.SaveChanges();
        }

        public ArticleTag GetTag(string tagName)
        {
            var articleTag = _context.ArticleTags.FirstOrDefault(tag => tag.Tag.ToLower().Equals(tagName.ToLower()));
            if (articleTag == null)
            {
                var newTag = new ArticleTag
                {
                    Tag = tagName
                };
                _context.ArticleTags.Add(newTag);
                _context.SaveChanges();
                return newTag;
            }

            return articleTag;
        }

        public List<PopularTagViewModel> GetPopularTags()
        {
            return _context.ArticleTags.Select(tag => new PopularTagViewModel
                {
                    Tag = tag.Tag,
                    Count = tag.BlogTags.Count
                })
                .OrderByDescending(tag => tag.Count)
                .Take(PopularLimit)
                .ToList();
        }
    }
}