const multerImagesProfiles = require('multer')
const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/gif': 'gif',
  'image/webp': 'webp',
}

// Function permettant de supprimer l'extension du nom du fichier
function getFileNameWithoutExtension(filename) {
  return filename.split('.').slice(0, -1).join('.')
}

// On traite l'image envoyée et lui donne un nom
const storage = multerImagesProfiles.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/images/profiles')
  },
  filename: (req, file, cb) => {
    console.log({ file })
    console.log({ cb })
    cb(
      null,
      `${getFileNameWithoutExtension(file.originalname)}-${+Date.now()}.${
        MIME_TYPE_MAP[file.mimetype]
      }`
    )
  },
})

module.exports = multerImagesProfiles({ storage: storage })
