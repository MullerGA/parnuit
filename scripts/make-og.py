from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "og-card.png"
SANS = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
BOLD = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
MONO = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"

image = Image.new("RGB", (1200, 630), "#f7f7f3")
draw = ImageDraw.Draw(image)
font = lambda path, size: ImageFont.truetype(path, size)
ink, muted, accent = "#1b2929", "#536362", "#aa3f30"

draw.rectangle((0, 0, 1200, 10), fill=ink)
draw.text((72, 49), "parnuit.", font=font(BOLD, 39), fill=ink)
draw.text((72, 136), "TAXE DE SÉJOUR  /  PRÉPARATION 2027", font=font(MONO, 17), fill=accent)
draw.text((72, 199), "Quels sites doivent", font=font(BOLD, 69), fill=ink)
draw.text((72, 281), "changer de tarif ?", font=font(BOLD, 69), fill=ink)
draw.text((75, 389), "Un contrôle 2026 → 2027 sur votre parc.", font=font(SANS, 29), fill=muted)
draw.text((75, 428), "Tarifs, actions et sources, site par site.", font=font(SANS, 29), fill=muted)
draw.line((72, 513, 1128, 513), fill="#b7c5bb", width=2)
draw.text((75, 542), "CAS RÉEL  ·  CARCASSONNE 4 ★", font=font(MONO, 18), fill=ink)
draw.text((780, 537), "3,08 €  →  3,26 €", font=font(BOLD, 29), fill=accent)
image.save(OUT, optimize=True)
print(OUT)
