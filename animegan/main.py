from hubconf import face2paint
from model import Generator
import torch
import numpy as np
from PIL import Image
import os
import PIL
# Because the docker image uses python 3.11, therefore torchvision only has
# lower version available so there's this issue - https://github.com/python-pillow/Pillow/issues/4130
# Therefore had to hard code PILLOW_VERSION
PIL.PILLOW_VERSION = '7.0.0'


torch.backends.cudnn.enabled = False
torch.backends.cudnn.benchmark = False
torch.backends.cudnn.deterministic = True


def go():
    net = Generator()
    net.load_state_dict(torch.load(
        './weights/face_paint_512_v2.pt', map_location="cpu"))
    painter = face2paint()
    for image_name in sorted(os.listdir('input')):
        # if os.path.splitext(image_name)[-1].lower() not in [".jpg", ".jpeg", ".png", ".bmp", ".tiff"]:
        #     continue
        print(f"process image {image_name}")
        img = Image.open(os.path.join('input', image_name)).convert("RGB")

        out = painter(net, img)
        out.save(os.path.join('out', image_name))

        print('done')


if __name__ == '__main__':
    go()
