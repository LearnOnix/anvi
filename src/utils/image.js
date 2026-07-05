// Resizes a picked image file down to a small square before we store it as
// a base64 data URL — keeps localStorage light and the avatar loads instantly.
export function resizeImageToDataUrl(file, size = 200, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      const img = new Image()

      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext('2d')

        // center-crop to a square before scaling down, so portrait/landscape
        // photos don't come out stretched
        const side = Math.min(img.width, img.height)
        const sx = (img.width - side) / 2
        const sy = (img.height - side) / 2
        ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size)

        resolve(canvas.toDataURL('image/jpeg', quality))
      }

      img.onerror = () => reject(new Error('Could not read image'))
      img.src = reader.result
    }

    reader.onerror = () => reject(new Error('Could not read file'))
    reader.readAsDataURL(file)
  })
}