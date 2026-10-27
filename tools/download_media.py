from pathlib import Path
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parent.parent

MEDIA = [
    ("assets/images/climbing/expedition-everest.jpg", "https://images.pexels.com/photos/31953965/pexels-photo-31953965.jpeg"),
    ("assets/images/climbing/expedition-k2.jpg", "https://images.pexels.com/photos/37358046/pexels-photo-37358046.jpeg"),
    ("assets/images/climbing/expedition-denali.jpg", "https://images.pexels.com/photos/37066502/pexels-photo-37066502.jpeg"),
    ("assets/images/climbing/expedition-aconcagua.jpg", "https://images.pexels.com/photos/18331843/pexels-photo-18331843.jpeg"),
    ("assets/images/climbing/expedition-kilimanjaro.jpg", "https://images.pexels.com/photos/38336100/pexels-photo-38336100.jpeg"),
    ("assets/images/climbing/expedition-mont-blanc.jpg", "https://images.pexels.com/photos/14339510/pexels-photo-14339510.jpeg"),
    ("assets/images/climbing/destination-everest.jpg", "https://images.pexels.com/photos/17356523/pexels-photo-17356523/free-photo-of-silhouette-of-man-rock-climbing.jpeg"),
    ("assets/images/climbing/destination-k2.jpg", "https://images.pexels.com/photos/19880821/pexels-photo-19880821/free-photo-of-mountaineers-climbing-with-ropes-on-rock.jpeg"),
    ("assets/images/climbing/destination-denali.jpg", "https://images.pexels.com/photos/36480638/pexels-photo-36480638/free-photo-of-ice-climber-scaling-frozen-waterfall.jpeg"),
    ("assets/images/climbing/destination-mont-blanc.jpg", "https://images.pexels.com/photos/17371890/pexels-photo-17371890/free-photo-of-woman-climbing-rock.jpeg"),
    ("assets/images/climbing/destination-kilimanjaro.jpg", "https://images.pexels.com/photos/32713633/pexels-photo-32713633/free-photo-of-daring-rock-climber-scaling-mountain-cliff-face.jpeg"),
    ("assets/images/climbing/gallery-climber-rock.jpg", "https://images.pexels.com/photos/13079720/pexels-photo-13079720.jpeg"),
    ("assets/images/climbing/gallery-climber-sunrise.jpg", "https://images.pexels.com/photos/3786287/pexels-photo-3786287.jpeg"),
    ("assets/images/climbing/gallery-solo-ascent.jpg", "https://images.pexels.com/photos/4389564/pexels-photo-4389564.jpeg"),
    ("assets/images/climbing/gallery-climber-ridge.jpg", "https://images.pexels.com/photos/37516168/pexels-photo-37516168/free-photo-of-silhouette-of-climber-on-a-rocky-wall-at-sunrise.jpeg"),
    ("assets/images/climbing/gallery-climber-harness.jpg", "https://images.pexels.com/photos/15966492/pexels-photo-15966492/free-photo-of-person-rock-climbing.jpeg"),
    ("assets/images/climbing/gallery-climber-rock-outdoors.jpg", "https://images.pexels.com/photos/8729014/pexels-photo-8729014.jpeg"),
    ("assets/images/climbing/guide-climber-rope.jpg", "https://images.pexels.com/photos/28164876/pexels-photo-28164876.jpeg"),
    ("assets/images/climbing/guide-climber-wall.jpg", "https://images.pexels.com/photos/39877504/pexels-photo-39877504.jpeg"),
    ("assets/images/climbing/guide-alpine-climber.jpg", "https://images.pexels.com/photos/16824426/pexels-photo-16824426.jpeg"),
    ("assets/images/climbing/page-about.jpg", "https://images.pexels.com/photos/18813762/pexels-photo-18813762.jpeg"),
    ("assets/images/climbing/page-contact.jpg", "https://images.pexels.com/photos/12659331/pexels-photo-12659331.jpeg"),
    ("assets/images/climbing/page-booking.jpg", "https://images.pexels.com/photos/39894572/pexels-photo-39894572.jpeg"),
    ("assets/images/climbing/page-safety.jpg", "https://images.pexels.com/photos/4385860/pexels-photo-4385860.jpeg"),
    ("assets/images/climbing/page-faq.jpg", "https://images.pexels.com/photos/28622712/pexels-photo-28622712.jpeg"),
    ("assets/images/climbing/home-climbing-poster.jpg", "https://images.pexels.com/videos/34573393/pexels-photo-34573393.jpeg"),
    ("assets/videos/mountain-climb.mp4", "https://videos.pexels.com/video-files/34573393/14649858_1920_1080_24fps.mp4"),
]

# Keep climbing images and the homepage video available as local assets.
for relative_path, url in MEDIA:
    destination = ROOT / relative_path
    destination.parent.mkdir(parents=True, exist_ok=True)
    request = Request(url, headers={"User-Agent": "AlpineAscents/1.0"})
    with urlopen(request, timeout=90) as response:
        destination.write_bytes(response.read())
    print(f"Saved {relative_path}")
