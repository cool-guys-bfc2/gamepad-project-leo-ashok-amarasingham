enum RadioMessage {
    message1 = 49434
}
input.onGesture(Gesture.EightG, function () {
    recieveSignal("RUMBLE")
})
input.onButtonPressed(Button.A, function () {
    write_serial("a")
})
input.onGesture(Gesture.FreeFall, function () {
    recieveSignal("RUMBLE")
})
function write_serial (line: string) {
    serial.writeLine(line)
    radio.setGroup(55)
    radio.sendString(line)
}
input.onGesture(Gesture.SixG, function () {
    recieveSignal("RUMBLE")
})
function lightstart () {
    plightcalibrateval = pins.analogReadPin(AnalogPin.P0)
}
function turnTo2Digit (num: number) {
    return convertToText(control.deviceSerialNumber()).substr(convertToText(control.deviceSerialNumber()).length - 2, 2)
}
input.onButtonPressed(Button.AB, function () {
    pgameclicks += 1
    write_serial("a")
    write_serial("b")
    basic.showNumber(pgameclicks)
})
radio.onReceivedString(function (receivedString) {
    recieveSignal(receivedString)
})
function recieveSignal (text: string) {
    if (text.includes("buzzer")) {
        music.setBuiltInSpeakerEnabled(false)
    }
    if (text.includes("builtin")) {
        music.setBuiltInSpeakerEnabled(true)
    }
    if (text.charAt(0) == "V") {
        music.setVolume(parseFloat(text.substr(0)))
    }
    if ("" + text.charAt(0) + text.charAt(1) + text.charAt(2) == "AUD") {
        music.play(music.tonePlayable(parseFloat(text.substr(3)), music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
    }
    if (text.includes("RUMBLE")) {
        music.setVolume(255)
        music.play(music.tonePlayable(262, music.beat(BeatFraction.Quarter)), music.PlaybackMode.UntilDone)
        music.play(music.tonePlayable(175, music.beat(BeatFraction.Quarter)), music.PlaybackMode.UntilDone)
        music.play(music.tonePlayable(220, music.beat(BeatFraction.Quarter)), music.PlaybackMode.UntilDone)
        music.play(music.tonePlayable(131, music.beat(BeatFraction.Quarter)), music.PlaybackMode.UntilDone)
    }
    if (text.includes("PX")) {
        pixelX = parseFloat(text.charAt(2))
    }
    if (text.includes("PY")) {
        pixelY = parseFloat(text.charAt(2))
    }
    if (text.includes("GETP")) {
        if (led.point(pixelX, pixelY)) {
            write_serial("0")
        } else {
            write_serial("1")
        }
    }
    if (text.includes("pON")) {
        led.plot(pixelX, pixelY)
    }
    if (text.includes("pOFF")) {
        led.unplot(pixelX, pixelY)
    }
    if (text.includes("pTOGGLE")) {
        led.toggle(pixelX, pixelY)
    }
    if (text.includes("analog0:")) {
        pins.analogWritePin(AnalogPin.P0, parseFloat(text.substr(8)))
    }
    if (text.includes("analog1:")) {
        pins.analogWritePin(AnalogPin.P1, parseFloat(text.substr(8)))
    }
    if (text.includes("analog2:")) {
        pins.analogWritePin(AnalogPin.P2, parseFloat(text.substr(8)))
    }
    if (text.includes("digital0:")) {
        pins.digitalWritePin(DigitalPin.P0, parseFloat(text.substr(9)))
    }
    if (text.includes("digital1:")) {
        pins.digitalWritePin(DigitalPin.P1, parseFloat(text.substr(9)))
    }
    if (text.includes("digital2:")) {
        pins.digitalWritePin(DigitalPin.P2, parseFloat(text.substr(9)))
    }
    if (text.includes("digital16:")) {
        pins.digitalWritePin(DigitalPin.P16, parseFloat(text.substr(10)))
    }
}
input.onButtonPressed(Button.B, function () {
    write_serial("b")
})
input.onGesture(Gesture.Shake, function () {
    x += input.acceleration(Dimension.X) / threshold
    y += input.acceleration(Dimension.Y) / threshold
    z += input.acceleration(Dimension.Z) / threshold
    write_serial("p:x" + x + "y" + y + "z" + z)
})
input.onGesture(Gesture.ThreeG, function () {
    recieveSignal("RUMBLE")
})
let pixelY = 0
let pixelX = 0
let pgameclicks = 0
let plightcalibrateval = 0
let z = 0
let y = 0
let x = 0
let threshold = 0
serial.redirectToUSB()
serial.setBaudRate(BaudRate.BaudRate115200)
radio.setTransmitSerialNumber(true)
input.setAccelerometerRange(AcceleratorRange.OneG)
lightstart()
write_serial("" + control.deviceName() + "-" + control.deviceSerialNumber())
write_serial("OFF")
threshold = 1750
x = 0
y = 0
z = 0
write_serial("ON")
recieveSignal("RUMBLE")
recieveSignal("v100")
basic.showLeds(`
    . . . . .
    . . . . .
    . . . . .
    . . . . .
    . . . . .
    `)
basic.forever(function () {
    write_serial("t" + input.runningTime() / 1000)
    x += input.acceleration(Dimension.X) / threshold
    y += input.acceleration(Dimension.Y) / threshold
    z += input.acceleration(Dimension.Z) / threshold
    write_serial("p:x" + x + "y" + y + "z" + z)
    basic.pause(1000)
})
basic.forever(function () {
    if (!(input.buttonIsPressed(Button.AB))) {
        if (input.buttonIsPressed(Button.A)) {
            basic.showLeds(`
                . . . . .
                . . . . .
                . . . . .
                . . . . .
                . . . . .
                `)
            led.plot(1, 2)
        } else {
            led.unplot(1, 2)
        }
        if (input.buttonIsPressed(Button.B)) {
            basic.showLeds(`
                . . . . .
                . . . . .
                . . . . .
                . . . . .
                . . . . .
                `)
            led.plot(3, 2)
        } else {
            led.unplot(3, 2)
        }
    }
})
basic.forever(function () {
    write_serial("p:0=A" + pins.analogReadPin(AnalogPin.P0) + ",D" + pins.digitalReadPin(DigitalPin.P0))
    write_serial("p:1=A" + pins.analogReadPin(AnalogReadWritePin.P1) + ",D" + pins.digitalReadPin(DigitalPin.P1))
    write_serial("p:2=A" + pins.analogReadPin(AnalogReadWritePin.P2) + ",D" + pins.digitalReadPin(DigitalPin.P2))
    write_serial("p:16=D" + pins.digitalReadPin(DigitalPin.P16))
    basic.pause(1000)
})
