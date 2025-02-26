import PyPDF2
import fitz  # PyMuPDF
import face_recognition
import numpy as np
import os
from PIL import Image
import io




def unlock_pdf(download_dir, password):
    res = 'error'
    try:
        pdf_file = (os.listdir(download_dir))[0]
        input_pdf_path = os.path.join(download_dir, pdf_file)
        output_pdf_path = os.path.join(download_dir, 'aadhaar.pdf')
        # Open the locked PDF
        with open(input_pdf_path, 'rb') as pdf_file:
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            if pdf_reader.decrypt(password):
                # Create a PdfWriter to save the unlocked PDF
                pdf_writer = PyPDF2.PdfWriter()
                for page_num in range(len(pdf_reader.pages)):
                    pdf_writer.add_page(pdf_reader.pages[page_num])
                # Save the unlocked PDF
                with open(output_pdf_path, 'wb') as output_pdf:
                    pdf_writer.write(output_pdf)
                print(f"Unlocked PDF saved as: {output_pdf_path}")
                res = 'success'
            else:
                print("Password not found in the list.")
                res = 'failed'
        # Delete the locked PDF
        os.remove(input_pdf_path)
        print(f"Original locked PDF '{input_pdf_path}' deleted.")
    except Exception as e:
        print(f"An error occurred: {e}")
    return res




def extract_images_from_pdf(pdf_path, output_folder):
    # Open the PDF file
    pdf_document = fitz.open(pdf_path)
    # Create the output folder if it doesn't exist
    # if not os.path.exists(output_folder):
    #     os.makedirs(output_folder)
    # Iterate through each page in the PDF
    for page_num in range(len(pdf_document)):
        page = pdf_document.load_page(page_num)
        image_list = page.get_images(full=True)
        # Iterate through each image on the page
        for img_index, img in enumerate(image_list):
            xref = img[0]  # Get the XREF of the image
            base_image = pdf_document.extract_image(xref)
            image_bytes = base_image["image"]
            image = Image.open(io.BytesIO(image_bytes))
            # Convert the image to RGB if it's not already
            if image.mode != "RGB":
                image = image.convert("RGB")
            # Save the image temporarily
            temp_image_path = os.path.join(output_folder, f"temp_{page_num}_{img_index}.jpg")
            image.save(temp_image_path, "JPEG")
            # Check if the image contains a human face
            if contains_human_face(temp_image_path):
                # Save the image with a human face
                final_image_path = os.path.join(output_folder, f"face_{page_num}_{img_index}.jpg")
                image.save(final_image_path, "JPEG")
                print(f"Human face found and saved at: {final_image_path}")
                # Remove the temporary image
                os.remove(temp_image_path)
                return final_image_path  # Return the path of the saved image
            # Remove the temporary image
            os.remove(temp_image_path)
    print("No image with a human face found.")
    return None

def contains_human_face(image_path):
    # Load the image using face_recognition
    image = face_recognition.load_image_file(image_path)
    
    # Detect faces in the image
    face_locations = face_recognition.face_locations(image)
    
    # Return True if at least one face is detected
    return len(face_locations) > 0

# Example usage
# pdf_path = os.path.join(os.getcwd(), "sample_test", "pdf") #"your_pdf_file.pdf"  # Replace with your PDF file path
# output_folder = os.path.join(os.getcwd(), "sample_test", "images") #"output_images"  # Folder to save extracted images

# unlock_pdf(pdf_path, "PARA2003")

pdf_path = os.path.join(os.getcwd(), "sample_test", "pdf", "aadhaar.pdf")
output_folder = os.path.join(os.getcwd(), "sample_test", "images")
extract_images_from_pdf(pdf_path, output_folder)