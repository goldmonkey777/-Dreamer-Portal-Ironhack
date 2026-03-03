import { cloudinary } from '../../config/cloudinary.js';

export const uploadDreamAttachment = async (dataUri) => {
  const uploadResult = await cloudinary.uploader.upload(dataUri, {
    folder: 'dreamerportal/dreams',
    resource_type: 'auto'
  });

  return {
    url: uploadResult.secure_url,
    type: uploadResult.resource_type
  };
};
