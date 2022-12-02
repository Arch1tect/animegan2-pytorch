import os
import argparse

from PIL import Image
import numpy as np

import torch
from torchvision.transforms.functional import to_tensor, to_pil_image

from model import Generator
from hubconf import face2paint

torch.backends.cudnn.enabled = False
torch.backends.cudnn.benchmark = False
torch.backends.cudnn.deterministic = True


def go():
    net = Generator()
    net.load_state_dict(torch.load(
        './weights/face_paint_512_v2.pt', map_location="cpu"))
    painter = face2paint()
    for image_name in sorted(os.listdir('input')):
        if os.path.splitext(image_name)[-1].lower() not in [".jpg", ".jpeg", ".png", ".bmp", ".tiff"]:
            continue
        print(f"process image {image_name}")
        img = Image.open(os.path.join('input', image_name)).convert("RGB")

        out = painter(net, img)
        out.save(os.path.join('out-local', image_name))

        print('done')


if __name__ == '__main__':
    go()
