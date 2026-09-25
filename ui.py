import pygame
import math
import time

pygame.init()

WIDTH=800
HEIGHT=600

screen=pygame.display.set_mode((WIDTH,HEIGHT))
clock=pygame.time.Clock()

radius=80

def run_ui():

    angle=0

    while True:

        screen.fill((0,0,0))

        for i in range(60):

            x=WIDTH/2 + math.cos(angle+i)*radius
            y=HEIGHT/2 + math.sin(angle+i)*radius

            pygame.draw.circle(screen,(0,255,255),(int(x),int(y)),4)

        angle+=0.05

        pygame.display.update()

        clock.tick(60)