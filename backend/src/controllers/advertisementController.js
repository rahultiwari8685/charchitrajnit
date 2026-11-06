import Advertisement from "../models/Advertisement.js";

// ===============================
// Create Advertisement
// ===============================
export const createAdvertisement = async (req, res) => {
  try {
    const {
      title,
      type,
      redirectUrl,
      htmlCode,
      position,
      priority,
      width,
      height,
      startDate,
      endDate,
      status,
    } = req.body;

    const image = req.file ? req.file.filename : "";

    const advertisement = await Advertisement.create({
      title,
      type,
      image,
      htmlCode,
      redirectUrl,
      position,
      priority,
      width,
      height,
      startDate,
      endDate,
      status: status === "true" || status === true ? true : false,
    });

    return res.status(201).json({
      success: true,
      message: "Advertisement created successfully",
      data: advertisement,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Get All Advertisements
// ===============================
export const getAllAdvertisements = async (req, res) => {
  try {
    const advertisements = await Advertisement.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      data: advertisements,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Get Single Advertisement
// ===============================
export const getAdvertisement = async (req, res) => {
  try {
    const advertisement = await Advertisement.findById(req.params.id);

    if (!advertisement) {
      return res.status(404).json({
        success: false,
        message: "Advertisement not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: advertisement,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Update Advertisement
// ===============================
export const updateAdvertisement = async (req, res) => {
  try {
    const {
      title,
      type,
      redirectUrl,
      htmlCode,
      position,
      priority,
      width,
      height,
      startDate,
      endDate,
      status,
    } = req.body;

    const updateData = {
      title,
      type,
      redirectUrl,
      htmlCode,
      position,
      priority,
      width,
      height,
      startDate,
      endDate,
      status: status === "true" || status === true ? true : false,
    };

    if (req.file) {
      updateData.image = req.file.filename;
    }

    const advertisement = await Advertisement.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
      },
    );

    if (!advertisement) {
      return res.status(404).json({
        success: false,
        message: "Advertisement not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Advertisement updated successfully",
      data: advertisement,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Delete Advertisement
// ===============================
export const deleteAdvertisement = async (req, res) => {
  try {
    const advertisement = await Advertisement.findByIdAndDelete(req.params.id);

    if (!advertisement) {
      return res.status(404).json({
        success: false,
        message: "Advertisement not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Advertisement deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Change Status
// ===============================
export const changeStatus = async (req, res) => {
  try {
    const advertisement = await Advertisement.findById(req.params.id);

    if (!advertisement) {
      return res.status(404).json({
        success: false,
        message: "Advertisement not found",
      });
    }

    advertisement.status = !advertisement.status;

    await advertisement.save();

    return res.status(200).json({
      success: true,
      message: "Status updated successfully",
      status: advertisement.status,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Get Advertisement By Position
// ===============================
export const getAdvertisementsByPosition = async (req, res) => {
  try {
    const advertisements = await Advertisement.find({
      position: req.params.position,
      status: true,
    }).sort({
      priority: 1,
    });

    return res.status(200).json({
      success: true,
      data: advertisements,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Increase View Count
// ===============================
export const increaseView = async (req, res) => {
  try {
    await Advertisement.findByIdAndUpdate(req.params.id, {
      $inc: {
        totalViews: 1,
      },
    });

    return res.json({
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Increase Click Count
// ===============================
export const increaseClick = async (req, res) => {
  try {
    await Advertisement.findByIdAndUpdate(req.params.id, {
      $inc: {
        totalClicks: 1,
      },
    });

    return res.json({
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
