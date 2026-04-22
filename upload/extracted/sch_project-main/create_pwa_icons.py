#!/usr/bin/env python3
"""
Create PWA icons for Alsharq Academia
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_pwa_icon(size):
    # Create image with transparent background
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Calculate positions
    center = size // 2
    radius = size // 2 - 10
    
    # Create gradient background (simplified)
    # Draw background circle with gradient effect
    for i in range(radius):
        alpha = int(255 * (1 - i / radius))
        color = (102, 126, 234, alpha)  # Blue gradient
        draw.ellipse([center - radius + i, center - radius + i, 
                     center + radius - i, center + radius - i], 
                    fill=color)
    
    # Draw white border
    draw.ellipse([center - radius, center - radius, 
                 center + radius, center + radius], 
                outline='white', width=4)
    
    # Draw book icon
    book_width = int(size * 0.4)
    book_height = int(size * 0.3)
    book_x = center - book_width // 2
    book_y = center - book_height // 2
    
    # Book base with gradient
    for i in range(book_height):
        color_intensity = int(255 * (1 - i / book_height))
        color = (79, 172, 254, color_intensity)  # Blue gradient
        draw.rectangle([book_x, book_y + i, book_x + book_width, book_y + i + 1], 
                      fill=color)
    
    # Book pages (white)
    draw.rectangle([book_x + 5, book_y + 5, book_x + book_width - 5, book_y + book_height - 5], 
                  fill='white')
    
    # Book lines
    for i in range(5):
        line_y = book_y + 10 + (i * 8)
        draw.line([book_x + 10, line_y, book_x + book_width - 10, line_y], 
                 fill=(102, 126, 234), width=2)
    
    # Add text
    try:
        # Try to use a system font
        font_size = size // 20
        font = ImageFont.truetype("arial.ttf", font_size)
    except:
        # Fallback to default font
        font = ImageFont.load_default()
    
    # Arabic text
    text = "أكاديمية الشرق"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_x = center - text_width // 2
    text_y = book_y + book_height + 10
    draw.text((text_x, text_y), text, fill='white', font=font)
    
    # English text
    text2 = "Alsharq Academia"
    bbox2 = draw.textbbox((0, 0), text2, font=font)
    text_width2 = bbox2[2] - bbox2[0]
    text_x2 = center - text_width2 // 2
    text_y2 = text_y + 20
    draw.text((text_x2, text_y2), text2, fill='white', font=font)
    
    return img

def main():
    # Create icons directory if it doesn't exist
    os.makedirs('public/icons', exist_ok=True)
    
    # Create 192x192 icon
    print("Creating 192x192 icon...")
    icon_192 = create_pwa_icon(192)
    icon_192.save('public/icons/icon-192x192.png', 'PNG')
    print("✓ icon-192x192.png created")
    
    # Create 512x512 icon
    print("Creating 512x512 icon...")
    icon_512 = create_pwa_icon(512)
    icon_512.save('public/icons/icon-512x512.png', 'PNG')
    print("✓ icon-512x512.png created")
    
    print("\n🎉 PWA icons created successfully!")
    print("Files created:")
    print("- public/icons/icon-192x192.png")
    print("- public/icons/icon-512x512.png")

if __name__ == "__main__":
    main()
