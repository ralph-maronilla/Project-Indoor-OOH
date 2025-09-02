import OohInventory from '../models/OOHInventoryTable.js';

export async function getOoh(req, res) {
  const ooh = await OohInventory.query()
    .withGraphJoined("[address, dimensions, details.discountedRate]") // nested fetch
    .modifyGraph("address", (builder) => {
      builder.select(
        "street",
        "city",
        "province",
        "country",
        "country_code",
        "postcode"
      );
    })
    .modifyGraph("dimensions", (builder) => {
      builder.select(
        "height_in_ft",
        "width_in_ft",
        "diagonal_in_ft",
        "radius_in_meters"
      );
    })
    .modifyGraph("details", (builder) => {
      builder.select(
        "traffic",
        "inclusions",
        "traffic_count"
      );
    })
    .modifyGraph("details.discountedRate", (builder) => {
      builder.select(
        "monthly_rental_in_php",
      );
    });

  res.json(ooh);
}
