from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "og-card.png"
SANS = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
BOLD = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
MONO = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"

image = Image.new("RGB", (1200, 630), "#1d302d")
draw = ImageDraw.Draw(image)
font = lambda path, size: ImageFont.truetype(path, size)
paper, mint, muted, coral = "#f7f7f2", "#c6dcc8", "#b7c9bd", "#d77860"

draw.rectangle((0, 0, 1200, 9), fill=coral)
draw.rounded_rectangle((73, 55, 112, 94), radius=10, fill=paper)
draw.text((83, 61), "D", font=font(BOLD, 28), fill="#1d302d")
draw.ellipse((105, 61, 111, 67), fill=coral)
draw.text((124, 51), "parnuit.", font=font(BOLD, 40), fill=paper)
draw.text((75, 152), "BÊTA PRIVÉE  /  OUVERTURE PROCHAINE", font=font(MONO, 16), fill=coral)
draw.text((70, 211), "La taxe de séjour", font=font(BOLD, 65), fill=paper)
draw.text((70, 286), "de tout votre parc.", font=font(BOLD, 65), fill=mint)
draw.text((74, 365), "Au même endroit.", font=font(BOLD, 54), fill=paper)
draw.line((73, 470, 1125, 470), fill="#668174", width=2)
draw.text((75, 501), "TARIFS", font=font(MONO, 18), fill=mint)
draw.text((293, 501), "PORTAILS", font=font(MONO, 18), fill=mint)
draw.text((534, 501), "ÉCHÉANCES", font=font(MONO, 18), fill=mint)
draw.text((76, 550), "Une vue par établissement, avec la source derrière chaque réponse.", font=font(SANS, 24), fill=muted)
image.save(OUT, optimize=True)
print(OUT)
