#define BLYNK_TEMPLATE_ID           "TMPL6fUqbFoZO"
#define BLYNK_TEMPLATE_NAME         "Quickstart Template"
#define BLYNK_AUTH_TOKEN            "YOUR_BLYNK_TOKEN"

#define BLYNK_PRINT Serial

#include <ESP8266WiFi.h>
#include <BlynkSimpleEsp8266.h>

#define RELAY D0

char auth[] = BLYNK_AUTH_TOKEN;
char ssid[] = "YOUR_WIFI_SSID";
char pass[] = "YOUR_WIFI_PASSWORD";

int soil_PIN = A0;
int val;
//int RELAY = D0;

void setup()
{
  pinMode(RELAY, OUTPUT);
  pinMode(soil_PIN, INPUT);
  Serial.begin(9600);
  Blynk.begin(auth, ssid, pass);
}

void loop()
{
  Blynk.run();

  {
    if(val > 700)
    {
      digitalWrite(RELAY, HIGH);
    }
    else
    {
      digitalWrite(RELAY, LOW);
    }
  }
  val = analogRead(soil_PIN);
  Serial.print("val = ");
  Serial.println(val);
  Blynk.virtualWrite(V0,(val));
  delay(100);
}

