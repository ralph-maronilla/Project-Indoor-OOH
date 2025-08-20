import Submission from '../models/Submission.js';
import User from '../models/User.js';
import RewardHistory from '../models/RewardHistory.js';
import sharp from 'sharp';
  export const getSubmissions = async (req, res) => {
  try {
  const submissions = await Submission.query()
  .select('id', 'isApproved', 'status','submitted_by')
  .withGraphFetched('images')
  .modifyGraph('images', builder => {
    builder.select(
      'id',
      'filename',
      'mime_type',
      'image_data',
      'image_exif_data',
    );
  });

  
  const user = await User.query().findById(submissions[0].submittedBy);

  const userImage = user.userImage;

  const mappedUser = {
    name: user.name,
    email: user.email,
    mobile_number: user.mobileNumber,
    first_name: user.firstName,
    last_name: user.lastName,
    role: user.role,
    user_image: userImage
  };

    
const formatted = await Promise.all(
  submissions.map(async sub => {
    const user = await User.query()
      .findById(sub.submittedBy);
 

    const formattedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      mobile_number: user.mobileNumber,
      first_name: user.firstName,
      last_name: user.lastName,
      role: user.role,
      images: sub.images.map(img => ({
        id: img.id,
        filename: img.filename,
        exif: img.imageExifData
          ? JSON.parse(img.imageExifData)
          : null,
        imageBase64: img.imageData
          ? `data:${img.mimeType};base64,${img.imageData}`
          : null,
      })),
    };

    return {
      id: sub.id,
      submitted_by: formattedUser,
      isApproved: sub.isApproved,
      status: sub.status,
      images: sub.images.map(img => ({
        id: img.id,
        filename: img.filename,
        exif: img.imageExifData
          ? JSON.parse(img.imageExifData)
          : null,
        imageBase64: img.imageData
          ? `data:${img.mimeType};base64,${img.imageData}`
          : null,
      })),
    };
  })
);


    res.status(200).json({
      message: 'Submissions retrieved successfully.',
      data: formatted,
    });
  } catch (err) {
    console.error('Error fetching submissions:', err);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
};

export const processSubmission = async (req, res) => {
  try {
    const { submissionId, isApproved, userId } = req.body;
    const submission = await Submission.query().findById(submissionId);
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }
    submission.isApproved = isApproved;
    if(isApproved) {
       submission.status = 'Approved'; 
      submission.approved_at = formatDateForDB();
       submission.approved_by = userId
    }
    else {
      submission.status = 'Denied';
    }
    await submission.$query().update();
    res.status(200).json({ message: 'Submission processed successfully' });
  } catch (err) {
    console.error('Error processing submission:', err);
    res.status(500).json({ error: 'Failed to process submission' });
  }
};

export const deleteSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const submission = await Submission.query().findById(submissionId);
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }
    await submission.$query().delete();
    res.status(200).json({ message: 'Submission deleted successfully' });
  } catch (err) {
    console.error('Error deleting submission:', err);
    res.status(500).json({ error: 'Failed to delete submission' });
  }
}

export const submitRewardHistory = async (req, res) => {
  try {
    const { user_email, user_fullname,user_mobilenumber, reward_amount, reward_description, reward_reference_number,submitted_by } = req.body;
    const file = req.file;  
    console.log(req.body);
    const compressedBuffer = await sharp(file.buffer)
      .webp({ quality: 70, effort: 6 }) // balanced: smaller size, still sharp
      .toBuffer();
    
              const base64String = compressedBuffer.toString('base64');
              const dataUri = `data:image/webp;base64,${base64String}`;
    
   await RewardHistory.query().insert({
  user_email,
  user_fullname,
  user_mobilenumber,
  reward_amount,
  reward_description,
  reward_receipt: dataUri,
  reward_reference_number,
  submitted_by
});

    res.status(200).json({ message: 'Reward history submitted successfully' });
  } catch (err) {
    console.error('Error submitting reward history:', err);
    res.status(500).json({ error: 'Failed to submit reward history' });
  }
}

export const getRewardHistory = async (req, res) => {
  try {
    const rewardHistory = await RewardHistory.query();
    res.status(200).json(rewardHistory);
  } catch (err) {
    console.error('Error fetching reward history:', err);
    res.status(500).json({ error: 'Failed to fetch reward history' });
  }
}


function formatDateForDB(date = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}