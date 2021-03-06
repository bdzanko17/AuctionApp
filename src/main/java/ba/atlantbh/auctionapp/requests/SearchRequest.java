package ba.atlantbh.auctionapp.requests;

import ba.atlantbh.auctionapp.models.enums.Color;
import ba.atlantbh.auctionapp.models.enums.Size;
import lombok.Data;

import javax.validation.constraints.Min;

@Data
public class SearchRequest {
    private String query = "";
    private String category = "";
    private String subcategory = "";
    private String sort = "";
    private Integer minPrice = 0;
    private Integer maxPrice = 1000000;
    private Color color = null;
    private Size size = null;

    @Min(value = 0, message = "Page number can't be negative")
    private Integer page = 0;
}
