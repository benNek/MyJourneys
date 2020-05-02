namespace MyJourneys.Models.ViewModels
{
    public class PlaceViewModel
    {
        public int Id { get; set; }
        public string Location { get; set; }
        public string Address { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public int Rank { get; set; }
        public bool Start { get; set; }
    }
}