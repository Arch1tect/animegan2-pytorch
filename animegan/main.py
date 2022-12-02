from hubconf import face2paint
from model import Generator
import torch
import numpy as np
from PIL import Image
import os
import PIL
import sys
import argparse
# Because the docker image uses python 3.11, therefore torchvision only has
# lower version available so there's this issue - https://github.com/python-pillow/Pillow/issues/4130
# Therefore had to hard code PILLOW_VERSION
PIL.PILLOW_VERSION = '7.0.0'


torch.backends.cudnn.enabled = False
torch.backends.cudnn.benchmark = False
torch.backends.cudnn.deterministic = True


def go(args):
    net = Generator()
    net.load_state_dict(torch.load(
        './animegan/weights/face_paint_512_v2.pt', map_location="cpu"))
    painter = face2paint()

    img = Image.open(args.input).convert("RGB")
    out = painter(net, img)
    out.save(args.output)
    print('done')


if __name__ == '__main__':
    print('in python')

    parser = argparse.ArgumentParser()
    parser.add_argument('--input')
    parser.add_argument('--output')
    args = parser.parse_args()
    print(args.input)
    print(args.output)
    go(args)
    sys.stdout.flush()
