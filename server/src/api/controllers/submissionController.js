import Submission from "../models/Submission.js";
import User from "../models/User.js";
import RewardHistory from "../models/RewardHistory.js";
import sharp from "sharp";
// export const getSubmissions = async (req, res) => {
//   try {
//     const submissions = await Submission.query()
//       .select("id", "isApproved", "isRewarded", "status", "submitted_by")
//       .withGraphFetched("images")
//       .modifyGraph("images", (builder) => {
//         builder.select(
//           "id",
//           "filename",
//           "mime_type",
//           "image_data",
//           "image_exif_data"
//         );
//       });

//     const user = await User.query().findById(submissions[0].submittedBy);

//     const userImage = user.userImage;

//     const mappedUser = {
//       name: user.name,
//       email: user.email,
//       mobile_number: user.mobileNumber,
//       first_name: user.firstName,
//       last_name: user.lastName,
//       role: user.role,
//       user_image: userImage,
//     };

//     const formatted = await Promise.all(
//       submissions.map(async (sub) => {
//         const user = await User.query().findById(sub.submittedBy);

//         const rewarded = await RewardHistory.query()
//           .where("submission_id", sub.id)
//           .first();
//         let formattedUser = null;
//         if (rewarded) {
//           formattedUser = {
//             id: user.id,
//             name: user.name,
//             email: user.email,
//             mobile_number: user.mobileNumber,
//             first_name: user.firstName,
//             last_name: user.lastName,
//             role: user.role,
//             reward_details: rewarded,
//             images: sub.images.map((img) => ({
//               id: img.id,
//               filename: img.filename,
//               exif: img.imageExifData ? JSON.parse(img.imageExifData) : null,
//               imageBase64: img.imageData
//                 ? `data:${img.mimeType};base64,${img.imageData}`
//                 : null,
//             })),
//           };
//         } else {
//           formattedUser = {
//             id: user.id,
//             name: user.name,
//             email: user.email,
//             mobile_number: user.mobileNumber,
//             first_name: user.firstName,
//             last_name: user.lastName,
//             role: user.role,
//             images: sub.images.map((img) => ({
//               id: img.id,
//               filename: img.filename,
//               exif: img.imageExifData ? JSON.parse(img.imageExifData) : null,
//               imageBase64: img.imageData
//                 ? `data:${img.mimeType};base64,${img.imageData}`
//                 : null,
//             })),
//           };
//         }

//         return {
//           id: sub.id,
//           submitted_by: formattedUser,
//           isApproved: sub.isApproved,
//           isRewarded: sub.isRewarded,
//           status: sub.status,
//           images: sub.images.map((img) => ({
//             id: img.id,
//             filename: img.filename,
//             exif: img.imageExifData ? JSON.parse(img.imageExifData) : null,
//             imageBase64: img.imageData
//               ? `data:${img.mimeType};base64,${img.imageData}`
//               : null,
//           })),
//         };
//       })
//     );

//     res.status(200).json({
//       message: "Submissions retrieved successfully.",
//       data: formatted,
//     });
//   } catch (err) {
//     console.error("Error fetching submissions:", err);
//     res.status(500).json({ error: "Failed to fetch submissions" });
//   }
// };

// export const getSubmissionsByUserId = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     console.log(userId);

//     // Fetch all submissions for a given user
//     const submissions = await Submission.query()
//       .where("submittedBy", userId)
//       .select("id", "isApproved", "isRewarded", "status", "submitted_by")
//       .withGraphFetched("images")
//       .modifyGraph("images", (builder) => {
//         builder.select(
//           "id",
//           "filename",
//           "mimeType",
//           "imageData",
//           "imageExifData"
//         );
//       });

//     if (!submissions || submissions.length === 0) {
//       return res.status(200).json({
//         success: true,
//         data: [],
//         message: "No submissions found",
//       });
//     }

//     // Fetch user once (not inside map)
//     const user = await User.query().findById(userId);

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Format all submissions
//     const formatted = await Promise.all(
//       submissions.map(async (sub) => {
//         const rewarded = await RewardHistory.query()
//           .where("submission_id", sub.id)
//           .first();

//         return {
//           id: sub.id,
//           status: sub.status,
//           isApproved: sub.isApproved,
//           isRewarded: sub.isRewarded,
//           reward_details: rewarded || null,
//           images: sub.images.map((img) => ({
//             id: img.id,
//             filename: img.filename,
//             exif: img.imageExifData ? JSON.parse(img.imageExifData) : null,
//             imageBase64: img.imageData
//               ? `data:${img.mimeType};base64,${img.imageData}`
//               : null,
//           })),
//         };
//       })
//     );

//     // Final response structure
//     const response = {
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         mobile_number: user.mobileNumber,
//         first_name: user.firstName,
//         last_name: user.lastName,
//         role: user.role,
//         user_image: user.userImage,
//       },
//       submissions: formatted,
//     };

//     return res.status(200).json(response);
//   } catch (err) {
//     console.error("Error fetching submissions:", err);
//     return res.status(500).json({ error: "Failed to fetch submissions" });
//   }
// };


// export const getSubmissions = async (req, res) => {
//   try {
//     const submissions = await Submission.query()
//       .select("id", "isApproved", "isRewarded", "status", "submitted_by")
//       .withGraphFetched("images")
//       .modifyGraph("images", (builder) => {
//         builder.select(
//           "id",
//           "filename",
//           "mime_type",
//           "image_data",
//           "image_exif_data"
//         );
//       });

//     // 🧠 Handle empty submissions table
//     if (!submissions || submissions.length === 0) {
//       return res.status(200).json({
//         message: "No submissions found",
//         data: [],
//       });
//     }

//     if(sub.submitted_by)
//       {

//       }

//     // 🧠 Format submissions
//     const formatted = await Promise.all(
//       submissions.map(async (sub) => {
//         // Fetch user safely
//         const user = await User.query().findById(sub.submitted_by);
//         if (!user) return null;

//         // Fetch reward info if any
//         const rewarded = await RewardHistory.query()
//           .where("submission_id", sub.id)
//           .first();

//         // Map image data
//         const images = sub.images.map((img) => ({
//           id: img.id,
//           filename: img.filename,
//           exif: img.image_exif_data ? JSON.parse(img.image_exif_data) : null,
//           imageBase64: img.image_data
//             ? `data:${img.mime_type};base64,${img.image_data}`
//             : null,
//         }));

//         // Build structured response
//         return {
//           id: sub.id,
//           submitted_by: {
//             id: user.id,
//             name: user.name,
//             email: user.email,
//             mobile_number: user.mobileNumber,
//             first_name: user.firstName,
//             last_name: user.lastName,
//             role: user.role,
//             user_image: user.userImage,
//             reward_details: rewarded || null,
//           },
//           isApproved: sub.isApproved,
//           isRewarded: sub.isRewarded,
//           status: sub.status,
//           images,
//         };
//       })
//     );

//     // Remove nulls from missing users
//     const cleanedData = formatted.filter(Boolean);

//     res.status(200).json({
//       message: "Submissions retrieved successfully.",
//       data: cleanedData,
//     });
//   } catch (err) {
//     console.error("Error fetching submissions:", err);
//     res.status(500).json({ error: "Failed to fetch submissions" });
//   }
// };

export const getSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.query()
      .select("id", "isApproved", "isRewarded", "status", "submitted_by")
      .withGraphFetched("images")
      .modifyGraph("images", (builder) => {
        builder.select(
          "id",
          "filename",
          "mime_type",
          "image_data",
          "image_exif_data"
        );
      });

    // 🧠 Handle empty submissions
    if (!submissions || submissions.length === 0) {
      return res.status(200).json({
        message: "No submissions found",
        data: [],
      });
    }

    // 🧠 Format submissions
    const formatted = await Promise.all(
      submissions.map(async (sub) => {
        // ✅ Skip if submitted_by is missing
        if (!sub.submitted_by) return null;

        // Fetch user safely
        const user = await User.query().findById(sub.submitted_by);
        if (!user) return null;

        // Fetch reward info if any
        const rewarded = await RewardHistory.query()
          .where("submission_id", sub.id)
          .first();

        // Map image data
        const images = sub.images.map((img) => ({
          id: img.id,
          filename: img.filename,
          exif: img.image_exif_data ? JSON.parse(img.image_exif_data) : null,
          imageBase64: img.image_data
            ? `data:${img.mime_type};base64,${img.image_data}`
            : null,
        }));

        // Build structured response
        return {
          id: sub.id,
          submitted_by: {
            id: user.id,
            name: user.name,
            email: user.email,
            mobile_number: user.mobileNumber,
            first_name: user.firstName,
            last_name: user.lastName,
            role: user.role,
            user_image: user.userImage,
            reward_details: rewarded || null,
          },
          isApproved: sub.isApproved,
          isRewarded: sub.isRewarded,
          status: sub.status,
          images,
        };
      })
    );

    // 🧹 Remove nulls from missing users
    const cleanedData = formatted.filter(Boolean);

    res.status(200).json({
      message: "Submissions retrieved successfully.",
      data: cleanedData,
    });
  } catch (err) {
    console.error("Error fetching submissions:", err);
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
};


export const getSubmissionsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch all submissions for the given user
    const submissions = await Submission.query()
      .where("submitted_by", userId)
      .select("id", "isApproved", "isRewarded", "status", "submitted_by")
      .withGraphFetched("images")
      .modifyGraph("images", (builder) => {
        builder.select(
          "id",
          "filename",
          "mime_type",
          "image_data",
          "image_exif_data"
        );
      });

    // 🧠 Handle no submissions
    if (!submissions || submissions.length === 0) {
      return res.status(200).json({
        message: "No submissions found for this user.",
        data: [],
      });
    }

    // Fetch the user once
    const user = await User.query().findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 🧠 Format submissions
    const formatted = await Promise.all(
      submissions.map(async (sub) => {
        const rewarded = await RewardHistory.query()
          .where("submission_id", sub.id)
          .first();

        const images = sub.images.map((img) => ({
          id: img.id,
          filename: img.filename,
          exif: img.image_exif_data ? JSON.parse(img.image_exif_data) : null,
          imageBase64: img.image_data
            ? `data:${img.mime_type};base64,${img.image_data}`
            : null,
        }));

        return {
          id: sub.id,
          status: sub.status,
          isApproved: sub.isApproved,
          isRewarded: sub.isRewarded,
          reward_details: rewarded || null,
          images,
        };
      })
    );

    // 🧠 Construct final structured response
    const response = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile_number: user.mobileNumber,
        first_name: user.firstName,
        last_name: user.lastName,
        role: user.role,
        user_image: user.userImage,
      },
      submissions: formatted,
    };

    return res.status(200).json(response);
  } catch (err) {
    console.error("Error fetching submissions:", err);
    return res.status(500).json({ error: "Failed to fetch submissions" });
  }
};


export const processSubmission = async (req, res) => {
  try {
    const { submissionId, isApproved, userId } = req.body;
    const submission = await Submission.query().findById(submissionId);
    if (!submission) {
      return res.status(404).json({ error: "Submission not found" });
    }
    submission.isApproved = isApproved;
    if (isApproved) {
      submission.status = "Approved";
      submission.approved_at = formatDateForDB();
      submission.approved_by = userId;
    } else {
      submission.status = "Denied";
    }
    await submission.$query().update();
    res.status(200).json({ message: "Submission processed successfully" });
  } catch (err) {
    console.error("Error processing submission:", err);
    res.status(500).json({ error: "Failed to process submission" });
  }
};

export const deleteSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const submission = await Submission.query().findById(submissionId);
    if (!submission) {
      return res.status(404).json({ error: "Submission not found" });
    }
    await submission.$query().delete();
    res.status(200).json({ message: "Submission deleted successfully" });
  } catch (err) {
    console.error("Error deleting submission:", err);
    res.status(500).json({ error: "Failed to delete submission" });
  }
};

export const submitRewardHistory = async (req, res) => {
  try {
    const {
      user_email,
      user_fullname,
      user_mobilenumber,
      reward_amount,
      reward_description,
      reward_reference_number,
      submitted_by,
      submission_id,
    } = req.body;

    const submission = await Submission.query()
      .findById(submission_id)
      .select("isRewarded", "isApproved");

    if (!submission) {
      return res.status(404).json({
        message: "Submission not found",
      });
    }

    if (submission.isRewarded === 1) {
      return res.status(400).json({
        message: "This submission has already been awarded",
      });
    }

    if (submission.isApproved === 0) {
      return res.status(400).json({
        message: "This submission is either Pending or Denied",
      });
    }

    const file = req.file;
    console.log(req.body);
    const compressedBuffer = await sharp(file.buffer)
      .webp({ quality: 70, effort: 6 }) // balanced: smaller size, still sharp
      .toBuffer();

    const base64String = compressedBuffer.toString("base64");
    const dataUri = `data:image/webp;base64,${base64String}`;

    await RewardHistory.query().insert({
      user_email,
      user_fullname,
      user_mobilenumber,
      reward_amount,
      reward_description,
      reward_receipt: dataUri,
      reward_reference_number,
      submitted_by,
      submission_id,
    });

    //  const images = await UploadedImage.query().select(
    //       'id',
    //       'filename',
    //       'mime_type',
    //       'image_data',
    //       'image_exif_data'
    //     ).where('user_id', userId);

    await Submission.query().findById(submission_id).patch({
      isRewarded: true,
    });

    res.status(200).json({ message: "Reward history submitted successfully" });
    console.log("Sent status:", res.statusCode);
  } catch (err) {
    console.error("Error submitting reward history:", err);
    res.status(500).json({ error: "Failed to submit reward history" });
    console.log("Sent status:", res.statusCode);
  }
};

export const getRewardHistory = async (req, res) => {
  try {
    const rewardHistory = await RewardHistory.query();
    res.status(200).json(rewardHistory);
  } catch (err) {
    console.error("Error fetching reward history:", err);
    res.status(500).json({ error: "Failed to fetch reward history" });
  }
};

export const resetSubmissionStatusToPending = async (req, res) => {
  try {
    const { submissionId } = req.params;

    // Check if submission exists
    const submission = await Submission.query().findById(submissionId);
    if (!submission) {
      return res.status(404).json({ error: "Submission not found" });
    }

    // Reset fields
    submission.isRewarded = false;
    submission.isApproved = false;
    submission.approved_at = null;
    submission.approved_by = null;
    submission.status = "Pending";

    // Delete all reward history for this submission
    await RewardHistory.query().delete().where("submissionId", submissionId);

    // Persist changes
    await submission.$query().patch({
      isRewarded: submission.isRewarded,
      isApproved: submission.isApproved,
      approved_at: submission.approved_at,
      approved_by: submission.approved_by,
      status: submission.status,
    });

    res.status(200).json({ message: "Submission status reset to Pending" });
  } catch (err) {
    console.error("Error resetting submission status:", err);
    res.status(500).json({ error: "Failed to reset submission status" });
  }
};

export const resetAllSubmissionToPending = async (req, res) => {
  try {
    const submissions = await Submission.query();
    for (const submission of submissions) {
      submission.isRewarded = false;
      submission.isApproved = false;
      submission.approved_at = null;
      submission.approved_by = null;
      submission.status = "Pending";
      const rewardHistory = await RewardHistory.query().where(
        "submissionId",
        submission.id
      );
      if (rewardHistory.length > 0) {
        await rewardHistory[0].$query().delete();
      }
      await submission.$query().update();
    }
    res.status(200).json({ message: "All submissions reset to Pending" });
  } catch (err) {
    console.error("Error resetting all submissions:", err);
    res.status(500).json({ error: "Failed to reset all submissions" });
  }
};

function formatDateForDB(date = new Date()) {
  const pad = (n) => String(n).padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
