/**
 * VIN DIESEL - Shared VIN Extraction Module
 * Used by both customer and tester sides for consistency
 */

/**
 * Extract VIN from photo using Tesseract.js OCR
 * @param {File} file - Image file containing VIN
 * @param {Function} onProgress - Callback for progress updates (optional)
 * @returns {Promise<Object>} - { vin: string, plate: string, rawText: string, confidence: number }
 */
async function extractVINFromPhoto(file, onProgress = null) {
  if (!file) {
    throw new Error('No file provided');
  }

  // Update progress
  if (onProgress) onProgress('Loading OCR engine...');

  const { createWorker } = Tesseract;
  const worker = await createWorker();

  try {
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');

    if (onProgress) onProgress('Scanning image...');

    // Perform OCR
    const { data: { text, confidence } } = await worker.recognize(file);
    await worker.terminate();

    if (onProgress) onProgress('Extracting VIN...');

    // Extract VIN (17 characters, no I, O, Q)
    // VIN pattern: 17 alphanumeric characters, excluding I, O, Q
    const vinMatches = text.match(/[A-HJ-NPR-Z0-9]{17}/gi);

    // Filter to find most likely VIN (check for valid patterns)
    let vin = null;
    if (vinMatches && vinMatches.length > 0) {
      // Take first match that looks valid
      vin = vinMatches[0].toUpperCase();
    }

    // Extract license plate (6-8 alphanumeric characters)
    // Common patterns: ABC123, 1ABC234, ABC1234
    const plateMatches = text.match(/\b[A-Z0-9]{6,8}\b/gi);
    let plate = null;
    if (plateMatches && plateMatches.length > 0) {
      // Filter out VINs from plate matches
      plate = plateMatches.find(p => p.length !== 17 && p !== vin);
      if (plate) plate = plate.toUpperCase();
    }

    return {
      vin: vin || null,
      plate: plate || null,
      rawText: text,
      confidence: Math.round(confidence)
    };

  } catch (error) {
    await worker.terminate();
    throw new Error(`OCR extraction failed: ${error.message}`);
  }
}

/**
 * Validate VIN format
 * @param {string} vin - VIN to validate
 * @returns {boolean} - True if valid format
 */
function isValidVIN(vin) {
  if (!vin || vin.length !== 17) return false;

  // Check for invalid characters (I, O, Q not allowed in VINs)
  if (/[IOQ]/i.test(vin)) return false;

  // Must be alphanumeric
  if (!/^[A-HJ-NPR-Z0-9]{17}$/i.test(vin)) return false;

  return true;
}

/**
 * Format phone number to E.164 format
 * @param {string} phone - Phone number in any format
 * @returns {string} - Formatted phone number (+1xxxxxxxxxx)
 */
function formatPhoneNumber(phone) {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.startsWith('1') ? `+${cleaned}` : `+1${cleaned}`;
}

/**
 * Display VIN in user-friendly format (groups of 4)
 * @param {string} vin - 17 character VIN
 * @returns {string} - Formatted VIN (XXXX-XXXX-XXXX-XXXXX)
 */
function formatVINDisplay(vin) {
  if (!vin || vin.length !== 17) return vin;
  return `${vin.slice(0, 4)}-${vin.slice(4, 8)}-${vin.slice(8, 12)}-${vin.slice(12)}`;
}

/**
 * Compress photo before upload (90% storage savings)
 * @param {File} file - Original photo file
 * @param {number} maxWidth - Max width in pixels (default 1200)
 * @param {number} quality - JPEG quality 0-1 (default 0.7)
 * @returns {Promise<File>} - Compressed file
 */
async function compressPhoto(file, maxWidth = 1200, quality = 0.7) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Scale down if needed
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Canvas to Blob conversion failed'));
            return;
          }
          resolve(new File([blob], file.name, { type: 'image/jpeg' }));
        }, 'image/jpeg', quality);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}
