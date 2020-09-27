package ba.atlantbh.auctionapp.responses;

import ba.atlantbh.auctionapp.models.Photo;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
public class ProductResponse {
    private UUID id;
    private String name;
    private String description;
    private Integer startPrice;
    private LocalDateTime endDate;
    private Boolean wished;
    private List<Photo> photos;
}