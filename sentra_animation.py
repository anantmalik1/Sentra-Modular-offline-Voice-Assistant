import pygame
import math

pygame.init()

WIDTH, HEIGHT = pygame.display.Info().current_w, pygame.display.Info().current_h

# small window bottom center
SIZE = 200

screen = pygame.display.set_mode((SIZE, SIZE), pygame.NOFRAME)
pygame.display.set_caption("Sentra")

clock = pygame.time.Clock()

state = "online"


def set_state(new_state):
    global state
    state = new_state


def draw_orb(t):

    x = SIZE // 2
    y = SIZE // 2

    base_radius = 25

    # 🔥 animation based on state
    if state == "listening":
        radius = base_radius + int(8 * math.sin(t * 4))
        color = (0, 255, 150)

    elif state == "thinking":
        radius = base_radius + int(10 * math.sin(t * 6))
        color = (255, 0, 150)

    elif state == "speaking":
        radius = base_radius + int(12 * math.sin(t * 8))
        color = (0, 150, 255)

    else:
        radius = base_radius
        color = (150, 150, 255)

    # glow layers
    for i in range(6):
        pygame.draw.circle(
            screen,
            (color[0], color[1], color[2]),
            (x, y),
            radius + i * 4,
            1
        )

    # main core
    pygame.draw.circle(screen, color, (x, y), radius)


def start_sentra_ui():

    t = 0

    while True:
        screen.fill((0, 0, 0))

        draw_orb(t)

        pygame.display.update()

        t += 0.05
        clock.tick(60)