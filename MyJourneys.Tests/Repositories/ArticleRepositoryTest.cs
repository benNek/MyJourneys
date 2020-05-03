using System.Collections.Generic;
using Moq;
using MyJourneys.Data;
using MyJourneys.Models;
using MyJourneys.Models.Enums;
using MyJourneys.Models.ViewModels;
using MyJourneys.Repositories;
using NUnit.Framework;

namespace MyJourneys.Tests.Repositories
{
    [TestFixture]
    public class ArticleRepositoryTest
    {
        private IArticleRepository _repository;
        private User author = new User {UserName = "Author", Id = "1"};

        [SetUp]
        public void SetUp()
        {
            _repository = new ArticleRepository(MockUserRepository(), MockContext());
        }

        [Test]
        public void TestGetArticle()
        {
            var article = _repository.GetArticle(1);
            Assert.NotNull(article);
            Assert.AreEqual("Article", article.Title);
        }

        [Test]
        public void TestGetArticles()
        {
            var articles = _repository.GetArticles("Travel", ArticleSortType.AllTime, "Article", 0, 10);
            Assert.IsNotEmpty(articles);
            Assert.AreEqual(1, articles.Count);
            articles = _repository.GetArticles("Travel", ArticleSortType.Weekly, "Article", 0, 10);
            Assert.IsEmpty(articles);
            articles = _repository.GetArticles("Travel", ArticleSortType.Monthly, "Article", 0, 10);
            Assert.IsEmpty(articles);
        }

        [Test]
        public void TestGetAuthorArticlesEmpty()
        {
            Assert.IsEmpty(_repository.GetAuthorArticles("unknown"));
        }

        [Test]
        public void TestGetAuthorArticlesValid()
        {
            var articles = _repository.GetAuthorArticles("author");
            Assert.IsNotEmpty(articles);
            Assert.AreEqual(1, articles.Count);
        }

        [Test]
        public void TestAddArticle()
        {
            var tags = new List<string> {"Travel"};
            var model = new ArticleFormViewModel {Title = "Title", Text = "Text", Tags = tags};
            var article = _repository.AddArticle("1", model);
            Assert.NotNull(article);
            Assert.AreEqual("Title", article.Title);
        }

        [Test]
        public void TestGetTagDoesntExist()
        {
            var tag = _repository.GetTag("unknown");
            Assert.NotNull(tag);
            Assert.AreEqual("unknown", tag.Name);
        }

        [Test]
        public void TestGetTags()
        {
            var tags = _repository.GetTags();
            Assert.IsNotEmpty(tags);
            Assert.AreEqual(1, tags.Count);
        }

        [Test]
        public void TestGetPopularTags()
        {
            var tags = _repository.GetPopularTags();
            Assert.IsNotEmpty(tags);
            Assert.AreEqual(1, tags.Count);
        }

        [Test]
        public void LikeArticleLike()
        {
            _repository.LikeArticle("1", 2);
        }

        [Test]
        public void LikeArticleCancel()
        {
            _repository.LikeArticle("1", 1);
        }

        [Test]
        public void TestHasLikedFalse()
        {
            Assert.IsFalse(_repository.HasLiked("2", 1));
        }

        [Test]
        public void TestHasLikedTrue()
        {
            Assert.IsTrue(_repository.HasLiked("1", 1));
        }

        [Test]
        public void TestApproveArticles()
        {
            _repository.ApproveArticles("1");
        }

        [Test]
        public void TestIsUserAuthorFalse()
        {
            Assert.IsFalse(_repository.IsUserAuthor(1, "2"));
        }

        [Test]
        public void TestIsUserAuthorTrue()
        {
            Assert.IsTrue(_repository.IsUserAuthor(1, "1"));
        }

        [Test]
        public void TestDeleteArticleDoesntExist()
        {
            Assert.AreEqual(-1, _repository.DeleteArticle(3));
        }

        [Test]
        public void TestDeleteArticleValid()
        {
            Assert.AreEqual(1, _repository.DeleteArticle(1));
        }

        private IUserRepository MockUserRepository()
        {
            var userRepository = new Mock<IUserRepository>();
            userRepository.Setup(x => x.GetUser("author")).Returns(author);
            return userRepository.Object;
        }

        private TravelContext MockContext()
        {
            var mockContext = new Mock<TravelContext>();

            var tag = new Tag {Id = 1, Name = "Travel"};
            var tags = new List<ArticleTags>
            {
                new ArticleTags {Tag = tag}
            };

            var likes = new List<ArticleLikes>();
            var articles = FakeDbSet<Article>.Create(new List<Article>
            {
                new Article
                {
                    Id = 1, AuthorId = "1", Author = author, Title = "Article", Text = "Text", ArticleTags = tags,
                    ArticleLikes = likes, Confirmed = true
                },
                new Article
                {
                    Id = 2, AuthorId = "2", Author = author, Title = "Article 2", Text = "Text 2", ArticleTags = tags,
                    ArticleLikes = likes, Confirmed = false
                }
            });
            mockContext.Setup(x => x.Articles).Returns(articles.Object);

            var dbTags = FakeDbSet<Tag>.Create(new List<Tag>
            {
                new Tag {Name = "Travel", ArticleTags = tags}
            });
            mockContext.Setup(x => x.Tags).Returns(dbTags.Object);

            var articleTags = FakeDbSet<ArticleTags>.Create(new List<ArticleTags>());
            mockContext.Setup(x => x.ArticleTags).Returns(articleTags.Object);

            var articleLikes = FakeDbSet<ArticleLikes>.Create(new List<ArticleLikes>
            {
                new ArticleLikes {ArticleId = 1, UserId = "1"}
            });
            mockContext.Setup(x => x.ArticleLikes).Returns(articleLikes.Object);

            return mockContext.Object;
        }
    }
}