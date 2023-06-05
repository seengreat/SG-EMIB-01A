// tests go here; this will not be compiled when this package is used as an extension.
// tests go here; this will not be compiled when this package is used as an extension.
servo_motor.motor(Motor.M1_A, Dir.backward, 255)
servo_motor.motor(Motor.M1_B, Dir.forward, 511)
servo_motor.motor(Motor.M2_A, Dir.backward, 1023)
servo_motor.motor(Motor.M2_B, Dir.forward, 2055)
loops.everyInterval(1000, function () {
    servo_motor.servo(Servo_Ch.S1, 270)
    servo_motor.servo(Servo_Ch.S2, 270)
    servo_motor.servo(Servo_Ch.S3, 270)
    servo_motor.servo(Servo_Ch.S4, 270)
    servo_motor.servo(Servo_Ch.S5, 270)
    servo_motor.servo(Servo_Ch.S6, 270)
    servo_motor.servo(Servo_Ch.S7, 270)
    servo_motor.servo(Servo_Ch.S8, 270)
})
loops.everyInterval(2000, function () {
    servo_motor.servo(Servo_Ch.S1, 0)
    servo_motor.servo(Servo_Ch.S2, 0)
    servo_motor.servo(Servo_Ch.S3, 0)
    servo_motor.servo(Servo_Ch.S4, 0)
    servo_motor.servo(Servo_Ch.S5, 0)
    servo_motor.servo(Servo_Ch.S6, 0)
    servo_motor.servo(Servo_Ch.S7, 0)
    servo_motor.servo(Servo_Ch.S8, 0)
})


// tests go here; this will not be compiled when this package is used as an extension.
let Mode_WHITE = [0xFFFFFF, 0xFFFFFF, 0xFFFFFF, 0xFFFFFF, 0xFFFFFF, 0xFFFFFF, 0xFFFFFF]
let Mode_Colourful = [0xFF00FF, 0x8000FF, 0x0000FF, 0x00FFFF, 0x00FF00, 0xFFFF00, 0xFF0000]
let Mode_BLUE = [0x0000FF, 0x0000FF, 0x0000FF, 0x0000FF, 0x0000FF, 0x0000FF, 0x0000FF]
let mic = [0, 0, 0, 0, 0, 0, 0]
let mic_temp = [0, 0, 0, 0, 0, 0, 0]
let m = 0
let led_index = 0
let vol_sam = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
let i = 0, j = 0
let max = 0, n = 0, mmax = 0
let mode = Music_Rhythm_Mode.COLORFUL
basic.showIcon(IconNames.Heart)
let strip = neopixel.create(DigitalPin.P16, 7, NeoPixelMode.RGB)
strip.setBrightness(50)
strip.show()
serial.redirect(
SerialPin.USB_TX,
SerialPin.USB_RX,
BaudRate.BaudRate115200
)

basic.forever(() => {
    if (i >= 10) { //the lenght of vol_sam
        vol_sam.sort(function(a,b){return a-b})
        max = vol_sam[9] //the lenght of vol_sample
        mic.push(max)
        mic.shift()
        m++
        if (m >= 7) {
            for (j = 0; j < 7; j++) {
                mic_temp[j] = mic[j]
            }
            mic_temp.sort(function (a, b) { return a - b })
            mmax = mic_temp[6] 
            n = ((mmax-511) / 3-0.9)>>0
            if (n > 7) {
                n = 7
            }
            else if (n < 0) {
                n = 0
            }
            led_index = n
            serial.writeValue("m", mmax)
            for (j = 0; j < n; j++) {
                if (mode == Music_Rhythm_Mode.COLORFUL) {
                    strip.setPixelColor(j, Mode_Colourful[j])
                }
                else if (mode == Music_Rhythm_Mode.WHITE) { 
                    strip.setPixelColor(j, Mode_WHITE[j])
                }
            }
            for (j = n; j < 7; j++) {
                strip.setPixelColor(j, neopixel.colors(NeoPixelColors.Black))
            }
            strip.show()
            m = 0
        }
        else { 
            if (led_index >= 0) {
                strip.setPixelColor(led_index, neopixel.colors(NeoPixelColors.Black)) 
                led_index--
            }
            strip.show()            
        }
        i = 0
        //serial.writeValue("n", n)
    } 
})

loops.everyInterval(3, function () {
    vol_sam[i] = Sound.getADCValue()
    i++
})