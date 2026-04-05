using System.Collections.Generic;

namespace MtpApp.Dtos
{
    public class ChartDto
    {
        public string Label { get; set; }
        public int Value { get; set; }
    }

    public class ChartSeriesDto
    {
        public string SeriesName { get; set; }
        public List<ChartDto> Data { get; set; } = new List<ChartDto>();
    }
}
