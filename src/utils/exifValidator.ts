// @ts-ignore
import EXIF from 'exif-js';
import { differenceInMinutes } from 'date-fns';

export interface ExifValidationResult {
    isValid: boolean;
    photoTimestamp: Date | null;
    currentTimestamp: Date;
    minutesDifference: number | null;
    error?: string;
}

/**
 * Extracts EXIF timestamp from an image file and validates it's within acceptable range
 * @param file - Image file to extract EXIF data from
 * @param maxMinutesDifference - Maximum allowed difference in minutes (default: 5)
 * @returns Promise with validation result
 */
export const validatePhotoTimestamp = async (
    file: File,
    maxMinutesDifference: number = 5
): Promise<ExifValidationResult> => {
    const currentTimestamp = new Date();

    return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target?.result as string;

            img.onload = () => {
                EXIF.getData(img, function (this: any) {
                    try {
                        // Try to get various date fields from EXIF
                        const dateTimeOriginal = EXIF.getTag(this, 'DateTimeOriginal');
                        const dateTime = EXIF.getTag(this, 'DateTime');
                        const dateTimeDigitized = EXIF.getTag(this, 'DateTimeDigitized');

                        const exifDateStr = dateTimeOriginal || dateTime || dateTimeDigitized;

                        if (!exifDateStr) {
                            resolve({
                                isValid: false,
                                photoTimestamp: null,
                                currentTimestamp,
                                minutesDifference: null,
                                error: 'No EXIF timestamp found in photo'
                            });
                            return;
                        }

                        // Parse EXIF date format: "YYYY:MM:DD HH:MM:SS"
                        const photoTimestamp = parseExifDate(exifDateStr);

                        if (!photoTimestamp) {
                            resolve({
                                isValid: false,
                                photoTimestamp: null,
                                currentTimestamp,
                                minutesDifference: null,
                                error: 'Could not parse EXIF timestamp'
                            });
                            return;
                        }

                        const minutesDifference = Math.abs(
                            differenceInMinutes(currentTimestamp, photoTimestamp)
                        );

                        const isValid = minutesDifference <= maxMinutesDifference;

                        resolve({
                            isValid,
                            photoTimestamp,
                            currentTimestamp,
                            minutesDifference,
                        });
                    } catch (error) {
                        resolve({
                            isValid: false,
                            photoTimestamp: null,
                            currentTimestamp,
                            minutesDifference: null,
                            error: error instanceof Error ? error.message : 'Unknown error'
                        });
                    }
                });
            };
        };

        reader.readAsDataURL(file);
    });
};

/**
 * Parses EXIF date string format to JavaScript Date
 * @param exifDateStr - EXIF date string in format "YYYY:MM:DD HH:MM:SS"
 * @returns Date object or null if parsing fails
 */
function parseExifDate(exifDateStr: string): Date | null {
    try {
        // EXIF format: "YYYY:MM:DD HH:MM:SS"
        const parts = exifDateStr.split(' ');
        if (parts.length !== 2) return null;

        const datePart = parts[0].replace(/:/g, '-');
        const timePart = parts[1];

        const dateTimeStr = `${datePart}T${timePart}`;
        const date = new Date(dateTimeStr);

        return isNaN(date.getTime()) ? null : date;
    } catch {
        return null;
    }
}

/**
 * Converts image file to base64 string for storage
 * @param file - Image file to convert
 * @returns Promise with base64 string
 */
export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};
