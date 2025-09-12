#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid = "your_wifi";
const char* password = "your_password";
const char* serverUrl = "http://<YOUR_IP>:5000/api/irrigation";

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  while(WiFi.status() != WL_CONNECTED) delay(500);
}

void loop() {
  int moisture = analogRead(34); // soil sensor
  bool motorOn = (moisture < 300); // control logic
  digitalWrite(RELAY_PIN, motorOn ? HIGH : LOW);

  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    String json = "{\"moisture\":" + String(moisture) + ",\"motorOn\":" + (motorOn ? "true" : "false") + "}";
    http.POST(json);
    http.end();
  }

  delay(10000); // every 10 seconds
}
