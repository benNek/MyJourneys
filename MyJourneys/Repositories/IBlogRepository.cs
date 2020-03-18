using System.Collections.Generic;
using MyJourneys.Models;
using MyJourneys.Models.ViewModels;

namespace MyJourneys.Repositories
{
    public interface IBlogRepository
    {
        BlogViewModel GetBlog(int id);
        List<BlogViewModel> GetBlogs();
        void AddBlog(BlogCreationViewModel model);
    }
}