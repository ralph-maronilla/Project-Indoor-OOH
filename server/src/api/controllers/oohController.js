import OohInventory from '../models/OOHInventoryTable.js';
import OohGenericDropdown from '../models/OOHGenericDropdown.js';

export async function getOoh(req, res) {
  try {
    const ooh = await OohInventory.query()
      .withGraphJoined("[address, dimensions, details.discountedRate]")
      .modifyGraph("address", (builder) => {
        builder.select("street", "city", "province", "country", "country_code", "postcode","landmark");
      })
      .modifyGraph("dimensions", (builder) => {
        builder.select("height_in_ft", "width_in_ft", "diagonal_in_ft", "radius_in_meters","facing");
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

export async function getOohDropdowns(req, res) {
  try {
    const allData = await OohGenericDropdown.query().select("id", "category", "name");

    if (allData.length === 0) {
      return res.status(200).json({
        success: true,
        data: {},
        message: "No dropdown data found",
      });
    }

  
    const grouped = allData.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push({
        id: item.id,
        name: item.name,
      });
      return acc;
    }, {});

    return res.status(200).json({
      success: true,
      data: grouped,
      message: "Fetched dropdown data grouped by category",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      data: null,
      message: err.message,
    });
  }
}


export async function getOohDropdownsByCategory(req, res) {
  try {
    const { category } = req.params;
    const data = await OohGenericDropdown.query()
      .select("id", "name")
      .where("category", category);

    if (data.length === 0) {
      return res.status(404).json({
        success: false,
        data: [],
        message: `No dropdown data found for category ${category}`,
      });
    }

    return res.status(200).json({
      success: true,
      data,
      message: `Fetched dropdown data for category ${category}`,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      data: null,
      message: err.message,
    });
  }
}

/**
 * Get dropdown value by ID
 */
export async function getOohDropdownById(req, res) {
  try {
    const { id } = req.params;
    const data = await OohGenericDropdown.query().findById(id);

    if (!data) {
      return res.status(404).json({
        success: false,
        data: null,
        message: `Dropdown with id ${id} not found`,
      });
    }

    return res.status(200).json({
      success: true,
      data,
      message: "Fetched dropdown by id",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      data: null,
      message: err.message,
    });
  }
}

/**
 * Create new dropdown value
 */
export async function createOohDropdown(req, res) {
  try {
    const { name, category } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "name and category are required",
      });
    }

    const newData = await OohGenericDropdown.query().insert({
      name,
      category,
    });

    return res.status(201).json({
      success: true,
      data: newData,
      message: "Dropdown data created successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      data: null,
      message: err.message,
    });
  }
}

/**
 * Delete dropdown value by ID
 */
export async function deleteOohDropdown(req, res) {
  try {
    const { id } = req.params;
    const rowsDeleted = await OohGenericDropdown.query().deleteById(id);

    if (rowsDeleted === 0) {
      return res.status(404).json({
        success: false,
        data: null,
        message: `Dropdown with id ${id} not found`,
      });
    }

    return res.status(200).json({
      success: true,
      data: null,
      message: "Dropdown data deleted successfully",
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
