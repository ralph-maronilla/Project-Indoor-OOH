import OohInventory from '../models/OOHInventoryTable.js';


export async function getOoh(req, res) {
  try {
    const ooh = await OohInventory.query()
      .withGraphJoined("[address, dimensions, details.discountedRate]")
      .modifyGraph("address", (builder) => {
        builder.select("street", "city", "province", "country", "country_code", "postcode");
      })
      .modifyGraph("dimensions", (builder) => {
        builder.select("height_in_ft", "width_in_ft", "diagonal_in_ft", "radius_in_meters");
      })
      .modifyGraph("details", (builder) => {
        builder.select("traffic", "inclusions", "traffic_count");
      })
      .modifyGraph("details.discountedRate", (builder) => {
        builder.select("monthly_rental_in_php");
      });

    if (ooh.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No submissions found",
      });
    }

    return res.status(200).json({
      success: true,
      data: ooh,
      message: "Fetched all OOH inventory",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      data: null,
      message: err.message,
    });
  }
}


export async function getOohById(req, res) {
  try {
    const { id } = req.params;
    const ooh = await OohInventory.query()
      .findById(id)
      .withGraphJoined("[address, dimensions, details.discountedRate]");

    if (!ooh) {
      return res.status(404).json({
        success: false,
        data: null,
        message: `OOH Inventory with id ${id} not found`,
      });
    }

    return res.status(200).json({
      success: true,
      data: ooh,
      message: "Fetched OOH inventory by id",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      data: null,
      message: err.message,
    });
  }
}


export async function createOoh(req, res) {
  try {
    const newOoh = await OohInventory.query().insertGraph(req.body);

    return res.status(201).json({
      success: true,
      data: newOoh,
      message: "OOH Inventory created successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      data: null,
      message: err.message,
    });
  }
}

export async function updateOoh(req, res) {
  try {
    const { id } = req.params;
    const updatedOoh = await OohInventory.query().patchAndFetchById(id, req.body);

    if (!updatedOoh) {
      return res.status(404).json({
        success: false,
        data: null,
        message: `OOH Inventory with id ${id} not found`,
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedOoh,
      message: "OOH Inventory updated successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      data: null,
      message: err.message,
    });
  }
}


export async function deleteOoh(req, res) {
  try {
    const { id } = req.params;
    const rowsDeleted = await OohInventory.query().deleteById(id);

    if (rowsDeleted === 0) {
      return res.status(404).json({
        success: false,
        data: null,
        message: `OOH Inventory with id ${id} not found`,
      });
    }

    return res.status(200).json({
      success: true,
      data: null,
      message: "OOH Inventory deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      data: null,
      message: err.message,
    });
  }
}
