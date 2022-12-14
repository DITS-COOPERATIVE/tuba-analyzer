#define PH_ANALOG A1

float ph, turbidity, alcohol = 0;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
}

void loop() {
  // put your main code here, to run repeatedly:
  ph = (float)analogRead(A0) * (5.0 / 1024 / 6);
  turbidity = analogRead(A1) * (5.0 / 1024.0);
  alcohol = analogRead(A2);

  display(ph, turbidity, alcohol);

  delay(1000);
}


void display(float ph, float turbidity, float alcohol) {
  Serial.print("PH: ");
  Serial.print(ph);
  Serial.print(", Turbidity: ");
  Serial.print(turbidity);
  Serial.print(", Acidity: ");
  Serial.println(alcohol);
}