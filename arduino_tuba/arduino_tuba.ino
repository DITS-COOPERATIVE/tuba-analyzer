// #include <SoftwareSerial.h>
#include "DFRobot_PH.h"

// SoftwareSerial bluetooth(1, 0); //RX, TX
DFRobot_PH ph;

void setup()
{
  Serial.begin(9600);
  //  bluetooth.begin(9600);
}

void loop()
{
  static unsigned long timepoint = millis();
  if (millis() - timepoint > 1000U) {

    timepoint = millis();
    float ph =  getPh();
    float tb =  getTurbidity();
    float al =  getAlcohol();
    String temp = "";
    temp += String(ph, 2);
    temp += ",";
    temp += String(tb, 2);
    temp += ",";
    temp += String(al, 2);
    Serial.println(temp);
  }

}

float getPh() {
  float voltage = analogRead(A0) / 1024.0 * 5000;
  return ph.readPH(voltage , 25);
}

float getAlcohol() {
  return analogRead(A1);
}

float getTurbidity() {
  return analogRead(A2) * (5.0 / 1024.0);
}
