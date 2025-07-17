/*
 * ============================================================================
 *                           SUPABASE FILE UPLOAD UTILITY
 * ============================================================================
 */

// Import Supabase client for cloud storage operations
import { createClient } from '@supabase/supabase-js';

/* 
 * Configuration - Supabase Connection Details
 * These credentials connect our app to the Supabase cloud storage
 */
const supabaseUrl = 'https://bitcemqbdgcxeqanktdo.supabase.co';
const anonKey = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpdGNlbXFiZGdjeGVxYW5rdGRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MzM3NzIsImV4cCI6MjA2ODMwOTc3Mn0.-Idu-2VXhY8Egx8Skhw4LWyoOnnwLGZj1Mz4qrwiBnc`;

/**
 * 📁 FILE UPLOAD FUNCTION
 * 
 * Takes a user's file and uploads it to Supabase cloud storage
 * 
 * Process Flow:
 * ✅ Validate file input
 * 🏷️  Generate unique filename  
 * ☁️  Upload to cloud storage
 * 🔗 Return public access URL
 * 
 * @param {File} file - The file to upload (from HTML input)
 * @returns {Promise<string>} - Promise resolving to the file's public URL
 */
export default function FileUploadToSupabase(file) {
    
    return new Promise((resolve, reject) => {
        
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        // STEP 1: 🔍 INPUT VALIDATION
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        if (file == null) {
            reject("No file selected");
            return;
        }
        
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        // STEP 2: 🏷️  FILE NAME PROCESSING
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        let fileName = file.name;
        
        // Extract file extension (e.g., "photo.jpg" → "jpg")
        const extension = fileName.split('.')[fileName.split('.').length - 1];

        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        // STEP 3: ☁️  CREATE SUPABASE CONNECTION
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        const supabase = createClient(supabaseUrl, anonKey);

        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        // STEP 4: 🔢 GENERATE UNIQUE FILENAME
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        const timeStamp = new Date().getTime();
        fileName = timeStamp + file.name + "." + extension;
        
        // Example: "photo.jpg" becomes "1752733772123.jpg"

        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        // STEP 5: 📤 UPLOAD TO SUPABASE STORAGE
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        supabase.storage
            .from("images")
            .upload(fileName, file, {
                cacheControl: '3600',    // Cache for 1 hour
                upsert: false           // Don't overwrite existing files
            })
            .then(() => {
                
                // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                // STEP 6: ✅ SUCCESS - GET PUBLIC URL
                // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                const publicUrl = supabase.storage
                    .from("images")
                    .getPublicUrl(fileName)
                    .data.publicUrl;
                
                resolve(publicUrl);  // ✨ Return the file URL
                
            })
            .catch((error) => {
                
                // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                // STEP 7: ❌ ERROR HANDLING
                // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                reject(error);
                
            });
    });
}

/*
 * ============================================================================
 *                         📚 COMPLETE PROCESS EXPLANATION
 *                              (Teacher's Guide)
 * ============================================================================
 * 
 * Let me walk you through exactly what happens when this function is called,
 * step by step, like we're sitting together in a classroom:
 * 
 * 
 * 🎯 THE BIG PICTURE:
 * ==================
 * Imagine you're building a photo sharing app. Users need to upload their photos
 * to the cloud so others can see them. This function is like a postal service
 * that takes their photo, gives it a unique address, stores it safely in the
 * cloud, and gives you back the address where anyone can find it.
 * 
 * 
 * 📝 STEP-BY-STEP BREAKDOWN:
 * ==========================
 * 
 * STEP 1: 🔍 INPUT VALIDATION (Lines 35-39)
 * ------------------------------------------
 * ❓ What happens: We check if the user actually selected a file
 * 🤔 Why it matters: Without this check, our function would crash when trying
 *    to work with nothing. It's like checking if someone handed you a letter
 *    before trying to mail it.
 * 📋 Real example: User clicks "Choose File" but cancels → file = null
 * ✅ Success: Function receives a valid file object
 * ❌ Failure: Function immediately rejects with "No file selected"
 * 
 * 
 * STEP 2: 🏷️ FILE NAME PROCESSING (Lines 42-46)
 * ----------------------------------------------
 * ❓ What happens: We extract the file extension from the original filename
 * 🤔 Why it matters: We need to preserve the file type (.jpg, .png, .pdf, etc.)
 *    so browsers know how to handle it later.
 * 📋 Real example: 
 *    - Original file: "my-vacation-photo.jpg"
 *    - fileName = "my-vacation-photo.jpg"
 *    - extension = "jpg" (we split by dots and take the last part)
 * 🔧 How it works: 
 *    "photo.jpg".split('.') → ["photo", "jpg"]
 *    We take index [1] (the last element) → "jpg"
 * 
 * 
 * STEP 3: ☁️ CREATE SUPABASE CONNECTION (Lines 49-51)
 * ---------------------------------------------------
 * ❓ What happens: We create a connection to our Supabase cloud storage
 * 🤔 Why it matters: Think of this like opening a phone line to the cloud.
 *    We need this connection to send commands and data.
 * 📋 Real example: Like logging into your Google Drive before uploading
 * 🔧 Technical detail: createClient() returns an object with methods to
 *    interact with Supabase services (database, storage, auth, etc.)
 * 
 * 
 * STEP 4: 🔢 GENERATE UNIQUE FILENAME (Lines 54-58)
 * -------------------------------------------------
 * ❓ What happens: We create a completely new filename using current timestamp
 * 🤔 Why it matters: Prevents conflicts when multiple users upload files with
 *    the same name. Imagine if everyone uploaded "photo.jpg" - chaos!
 * 📋 Real example:
 *    - Original: "selfie.jpg"
 *    - Timestamp: 1752733772123 (milliseconds since Jan 1, 1970)
 *    - New filename: "1752733772123.jpg"
 * ✨ Cool fact: This timestamp is unique down to the millisecond!
 * 
 * 
 * STEP 5: 📤 UPLOAD TO SUPABASE STORAGE (Lines 61-67)
 * ---------------------------------------------------
 * ❓ What happens: We send the file to Supabase's cloud storage
 * 🤔 Why it matters: This is the actual uploading! The file travels from the
 *    user's device to the cloud servers.
 * 📋 Real example: Like putting your letter in the mailbox - it's on its way!
 * 🔧 Configuration explained:
 *    - .from("images"): Store in the "images" bucket (like a folder)
 *    - cacheControl: '3600': Tell browsers to cache for 1 hour (faster loading)
 *    - upsert: false: Don't overwrite if filename somehow already exists
 * 
 * 
 * STEP 6: ✅ SUCCESS - GET PUBLIC URL (Lines 69-78)
 * ------------------------------------------------
 * ❓ What happens: If upload succeeds, we get the public web address of the file
 * 🤔 Why it matters: This URL is what you'll use in <img> tags, links, etc.
 *    It's like getting the street address where your letter was delivered.
 * 📋 Real example: 
 *    Upload "1752733772123.jpg" → get back 
 *    "https://bitcemqbdgcxeqanktdo.supabase.co/storage/v1/object/public/images/1752733772123.jpg"
 * ✨ Magic moment: resolve(publicUrl) - The function succeeds and returns this URL!
 * 
 * 
 * STEP 7: ❌ ERROR HANDLING (Lines 81-87)
 * ---------------------------------------
 * ❓ What happens: If anything goes wrong, we catch the error
 * 🤔 Why it matters: Networks fail, storage gets full, permissions deny access.
 *    We need to handle these gracefully instead of crashing.
 * 📋 Common errors:
 *    - Network timeout (slow internet)
 *    - File too large
 *    - Storage bucket doesn't exist
 *    - Invalid file type
 * 🔧 How it works: reject(error) tells the calling code "something went wrong"
 * 
 * 
 * 🚀 HOW TO USE THIS FUNCTION:
 * ============================
 * 
 * // In your React component:
 * const handleFileUpload = async (event) => {
 *     const file = event.target.files[0];  // Get the selected file
 *     
 *     try {
 *         const imageUrl = await FileUploadToSupabase(file);
 *         console.log("File uploaded! URL:", imageUrl);
 *         // Now you can display the image: <img src={imageUrl} />
 *     } catch (error) {
 *         console.error("Upload failed:", error);
 *         alert("Sorry, upload failed. Please try again.");
 *     }
 * };
 * 
 * 
 * 🎓 KEY LEARNING CONCEPTS:
 * =========================
 * 
 * 1. 🔄 PROMISES & ASYNC PROGRAMMING:
 *    - File uploads take time (not instant)
 *    - Promises let us handle "eventually" operations
 *    - resolve() = success, reject() = failure
 * 
 * 2. 🛡️ ERROR HANDLING:
 *    - Always check inputs before using them
 *    - Network operations can fail - be prepared
 *    - Give users meaningful error messages
 * 
 * 3. 🌐 CLOUD STORAGE CONCEPTS:
 *    - Files stored on remote servers (not your computer)
 *    - Public URLs let anyone access the files
 *    - Buckets organize files (like folders)
 * 
 * 4. 🔐 SECURITY NOTES:
 *    - anonKey is safe for frontend (read-only-ish access)
 *    - Real apps should validate file types and sizes
 *    - Consider authentication for private files
 * 
 * 
 * 💡 TEACHER'S TIPS:
 * ==================
 * 
 * ✨ Think of this function like a smart postal worker:
 *    1. Checks if you gave them something to mail (validation)
 *    2. Writes a new, unique address label (timestamp filename)
 *    3. Delivers it to the post office (Supabase storage)
 *    4. Gives you the tracking number (public URL)
 *    5. Tells you if something went wrong (error handling)
 * 
 * 🚀 Next steps to explore:
 *    - Add file type validation (only allow images)
 *    - Add file size limits (prevent huge uploads)
 *    - Add progress indicators for large files
 *    - Add image resizing before upload
 * 
 * Remember: This is just one way to handle file uploads. There are many 
 * approaches, but the core concepts (validation, processing, storage, 
 * error handling) remain the same across all methods!
 */