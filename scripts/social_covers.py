"""Generate branded 1200x630 JPEG Open Graph covers for all blog posts.

Automatically run by build-blog.py so every new publication gets a unique social
preview without manual uploads. Requires Pillow (see requirements.txt).
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

SIZE = (1200, 630)
INK = "#101A2B"
NAVY = "#172C49"
BLUE = "#277BEA"
PALE = "#D7E9FF"
WHITE = "#FFFFFF"

FONT_PATHS = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
]
REGULAR_PATHS = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
]

def font(size, bold=True):
    for path in (FONT_PATHS if bold else REGULAR_PATHS):
        if Path(path).is_file():
            return ImageFont.truetype(path, size)
    # Fall back for non-Linux builds; deployment uses the fonts above.
    return ImageFont.load_default(size=size)

def wrap_lines(draw, text, face, max_width):
    lines, current = [], ""
    for word in text.split():
        candidate = (current + " " + word).strip()
        if current and draw.textlength(candidate, font=face) > max_width:
            lines.append(current)
            current = word
        else:
            current = candidate
    if current:
        lines.append(current)
    return lines

def draw_cover(post, root):
    image = Image.new("RGB", SIZE, INK)
    draw = ImageDraw.Draw(image)
    # Textured but restrained brand background; no external image dependencies.
    draw.polygon([(830, 0), (1200, 0), (1200, 630), (1030, 630)], fill=NAVY)
    draw.rounded_rectangle((988, -110, 1350, 250), radius=105, outline="#365174", width=8)
    draw.rounded_rectangle((1070, 320, 1320, 570), radius=75, outline="#365174", width=8)
    draw.rectangle((0, 0, 14, 630), fill=BLUE)
    draw.rounded_rectangle((74, 66, 555, 125), radius=18, fill="#1C3453")
    category = post["category"].upper()
    category_font = font(19)
    while draw.textlength(category, font=category_font) > 438 and category_font.size > 13:
        category_font = font(category_font.size - 1)
    draw.text((96, 82), category, fill=PALE, font=category_font)

    title = post["title"]
    max_lines = 4
    for size in range(72, 35, -2):
        title_font = font(size)
        lines = wrap_lines(draw, title, title_font, 1020)
        line_height = int(size * 1.22)
        if len(lines) <= max_lines and len(lines) * line_height <= 335:
            break
    start_y = 156 + max(0, (340 - len(lines) * line_height) // 3)
    for i, line in enumerate(lines):
        draw.text((75, start_y + i * line_height), line, fill=WHITE, font=title_font)

    draw.rectangle((75, 535, 1125, 538), fill="#2B4464")
    draw.text((75, 555), "SOCIO", font=font(26), fill=WHITE)
    draw.text((178, 555), "ESTRATÉGICO", font=font(26), fill=PALE)
    draw.text((930, 564), "IDEAS PARA DECIDIR", font=font(14, False), fill=PALE)
    output = root / "blog" / "og" / (post["slug"] + ".jpg")
    output.parent.mkdir(parents=True, exist_ok=True)
    image.save(output, "JPEG", quality=90, optimize=True, progressive=True, subsampling=0)
    return output

def build_covers(posts, root):
    for post in posts:
        draw_cover(post, root)
    draw_cover({"slug": "ideas-para-decidir",
                "title": "Ideas para decidir",
                "category": "Negocios, marketing y estrategia"}, root)
    print("Built", len(posts) + 1, "Open Graph cover images")
