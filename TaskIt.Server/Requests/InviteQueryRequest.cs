namespace TaskIt.Server.Requests
{
    public class InviteQueryRequest
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 5;
        public string Status { get; set; } = "All";
    }
}
