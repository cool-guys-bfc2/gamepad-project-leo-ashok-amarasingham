def on_gesture_eight_g():
    recieveSignal("RUMBLE")
input.on_gesture(Gesture.EIGHT_G, on_gesture_eight_g)

def on_button_pressed_a():
    write_serial("a")
input.on_button_pressed(Button.A, on_button_pressed_a)

def on_gesture_free_fall():
    recieveSignal("RUMBLE")
input.on_gesture(Gesture.FREE_FALL, on_gesture_free_fall)

def write_serial(line: str):
    serial.write_line(line)
    radio.set_group(55)
    radio.send_string(line)

def on_gesture_six_g():
    recieveSignal("RUMBLE")
input.on_gesture(Gesture.SIX_G, on_gesture_six_g)

def lightstart():
    global plightcalibrateval
    plightcalibrateval = pins.analog_read_pin(AnalogPin.P0)

def on_button_pressed_ab():
    global pgameclicks
    pgameclicks += 1
    write_serial("a")
    write_serial("b")
    basic.show_number(pgameclicks)
input.on_button_pressed(Button.AB, on_button_pressed_ab)

def on_received_string(receivedString):
    recieveSignal(receivedString)
radio.on_received_string(on_received_string)

def recieveSignal(text: str):
    global pixelX, pixelY
    if text.includes("buzzer"):
        music.set_built_in_speaker_enabled(False)
    if text.includes("builtin"):
        music.set_built_in_speaker_enabled(True)
    if text.char_at(0) == "V":
        music.set_volume(parse_float(text.substr(0)))
    if "" + text.char_at(0) + text.char_at(1) + text.char_at(2) == "AUD":
        music.play(music.tone_playable(parse_float(text.substr(3)), music.beat(BeatFraction.WHOLE)),
            music.PlaybackMode.UNTIL_DONE)
    if text.includes("RUMBLE"):
        music.set_volume(255)
        music.play(music.tone_playable(262, music.beat(BeatFraction.QUARTER)),
            music.PlaybackMode.UNTIL_DONE)
        music.play(music.tone_playable(175, music.beat(BeatFraction.QUARTER)),
            music.PlaybackMode.UNTIL_DONE)
        music.play(music.tone_playable(220, music.beat(BeatFraction.QUARTER)),
            music.PlaybackMode.UNTIL_DONE)
        music.play(music.tone_playable(131, music.beat(BeatFraction.QUARTER)),
            music.PlaybackMode.UNTIL_DONE)
    if text.includes("PX"):
        pixelX = parse_float(text.char_at(2))
    if text.includes("PY"):
        pixelY = parse_float(text.char_at(2))
    if text.includes("GETP"):
        if led.point(pixelX, pixelY):
            write_serial("0")
        else:
            write_serial("1")
    if text.includes("pON"):
        led.plot(pixelX, pixelY)
    if text.includes("pOFF"):
        led.unplot(pixelX, pixelY)
    if text.includes("pTOGGLE"):
        led.toggle(pixelX, pixelY)

def on_button_pressed_b():
    write_serial("b")
input.on_button_pressed(Button.B, on_button_pressed_b)

def on_gesture_shake():
    global x, y, z
    x += input.acceleration(Dimension.X) / threshold
    y += input.acceleration(Dimension.Y) / threshold
    z += input.acceleration(Dimension.Z) / threshold
    write_serial("p:x" + str(x) + "y" + str(y) + "z" + str(z))
input.on_gesture(Gesture.SHAKE, on_gesture_shake)

def on_gesture_three_g():
    recieveSignal("RUMBLE")
input.on_gesture(Gesture.THREE_G, on_gesture_three_g)

plightphotovalue = 0
pixelY = 0
pixelX = 0
pgameclicks = 0
plightcalibrateval = 0
z = 0
y = 0
x = 0
threshold = 0
serial.redirect_to_usb()
serial.set_baud_rate(BaudRate.BAUD_RATE115200)
radio.set_transmit_serial_number(True)
input.set_accelerometer_range(AcceleratorRange.ONE_G)
lightstart()
write_serial("" + control.device_name() + "-" + str(control.device_serial_number()))
write_serial("OFF")
threshold = 1750
x = 0
y = 0
z = 0
write_serial("ON")
recieveSignal("RUMBLE")
recieveSignal("v100")
basic.show_leds("""
    . . . . .
    . . . . .
    . . . . .
    . . . . .
    . . . . .
    """)

def on_forever():
    global x, y, z
    write_serial("t" + str(input.running_time() / 1000))
    x += input.acceleration(Dimension.X) / threshold
    y += input.acceleration(Dimension.Y) / threshold
    z += input.acceleration(Dimension.Z) / threshold
    write_serial("p:x" + str(x) + "y" + str(y) + "z" + str(z))
    basic.pause(1000)
basic.forever(on_forever)

def on_forever2():
    if not (input.button_is_pressed(Button.AB)):
        if input.button_is_pressed(Button.A):
            basic.show_leds("""
                . . . . .
                . . . . .
                . . . . .
                . . . . .
                . . . . .
                """)
            led.plot(1, 2)
        else:
            led.unplot(1, 2)
        if input.button_is_pressed(Button.B):
            basic.show_leds("""
                . . . . .
                . . . . .
                . . . . .
                . . . . .
                . . . . .
                """)
            led.plot(3, 2)
        else:
            led.unplot(3, 2)
basic.forever(on_forever2)

def on_forever3():
    global plightphotovalue
    plightphotovalue = pins.analog_read_pin(AnalogPin.P0)
    if plightphotovalue < plightcalibrateval - 50:
        pins.digital_write_pin(DigitalPin.P16, 1)
    else:
        pins.digital_write_pin(DigitalPin.P16, 0)
basic.forever(on_forever3)

def on_forever4():
    write_serial("p:0=A" + str(pins.analog_read_pin(AnalogPin.P0)) + ",D" + str(pins.digital_read_pin(DigitalPin.P0)))
    write_serial("p:1=A" + str(pins.analog_read_pin(AnalogReadWritePin.P1)) + ",D" + str(pins.digital_read_pin(DigitalPin.P1)))
    write_serial("p:2=A" + str(pins.analog_read_pin(AnalogReadWritePin.P2)) + ",D" + str(pins.digital_read_pin(DigitalPin.P2)))
    write_serial("p:16=D" + str(pins.digital_read_pin(DigitalPin.P16)))
    basic.pause(1000)
basic.forever(on_forever4)
